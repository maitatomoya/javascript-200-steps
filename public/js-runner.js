/**
 * JavaScript教材のブラウザ内実行ランナー
 *
 * 学習者のコードをWeb Worker内で実行する（ページ本体から隔離され、
 * 無限ループもterminateで確実に停止できる）。
 * console出力はNode.jsに近い書式に整形してキャプチャし、
 * サーバー実行版と同じ形のresult（success/compiler/stdout/stderr）を返す。
 */
(function () {
  "use strict";

  var HARD_TIMEOUT_MS = 8000;

  // Worker内に注入するシムのソースコード
  var SHIM_SOURCE = [
    "(function () {",
    "  var stdout = [];",
    "  var stderr = [];",
    "  var pending = 0;",
    "  var timerIds = {};",
    "  var intervalUsed = false;",
    "  var finished = false;",
    "",
    "  // Node.jsのutil.inspectに近い整形",
    "  function inspect(v, depth, topLevel) {",
    "    if (depth > 4) return '...';",
    "    if (v === null) return 'null';",
    "    var t = typeof v;",
    "    if (t === 'undefined') return 'undefined';",
    "    if (t === 'number' || t === 'boolean' || t === 'bigint') return String(v);",
    "    if (t === 'symbol') return v.toString();",
    "    if (t === 'string') {",
    "      if (topLevel) return v;",
    "      return \"'\" + v.replace(/\\\\/g, '\\\\\\\\').replace(/'/g, \"\\\\'\") + \"'\";",
    "    }",
    "    if (t === 'function') {",
    "      var cls = /^class\\s/.test(String(v));",
    "      var name = v.name;",
    "      if (cls) return '[class ' + (name || '(anonymous)') + ']';",
    "      return name ? '[Function: ' + name + ']' : '[Function (anonymous)]';",
    "    }",
    "    if (v instanceof Error) {",
    "      return (v.stack && v.stack.split('\\n')[0]) || (v.name + ': ' + v.message);",
    "    }",
    "    if (v instanceof Date) return v.toISOString();",
    "    if (v instanceof RegExp) return String(v);",
    "    if (Array.isArray(v)) {",
    "      if (v.length === 0) return '[]';",
    "      var items = v.map(function (x) { return inspect(x, depth + 1, false); });",
    "      return '[ ' + items.join(', ') + ' ]';",
    "    }",
    "    if (v instanceof Map) {",
    "      if (v.size === 0) return 'Map(0) {}';",
    "      var mi = [];",
    "      v.forEach(function (val, key) {",
    "        mi.push(inspect(key, depth + 1, false) + ' => ' + inspect(val, depth + 1, false));",
    "      });",
    "      return 'Map(' + v.size + ') { ' + mi.join(', ') + ' }';",
    "    }",
    "    if (v instanceof Set) {",
    "      if (v.size === 0) return 'Set(0) {}';",
    "      var si = [];",
    "      v.forEach(function (val) { si.push(inspect(val, depth + 1, false)); });",
    "      return 'Set(' + v.size + ') { ' + si.join(', ') + ' }';",
    "    }",
    "    if (t === 'object') {",
    "      var keys = Object.keys(v);",
    "      var ctor = v.constructor && v.constructor.name;",
    "      var prefix = (ctor && ctor !== 'Object') ? ctor + ' ' : '';",
    "      if (keys.length === 0) return prefix + '{}';",
    "      var parts = keys.map(function (k) {",
    "        var keyStr = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : \"'\" + k + \"'\";",
    "        return keyStr + ': ' + inspect(v[k], depth + 1, false);",
    "      });",
    "      return prefix + '{ ' + parts.join(', ') + ' }';",
    "    }",
    "    return String(v);",
    "  }",
    "",
    "  function fmt(args) {",
    "    return Array.prototype.map.call(args, function (a) {",
    "      return inspect(a, 0, true);",
    "    }).join(' ');",
    "  }",
    "",
    "  function send(type, payload) { postMessage({ type: type, payload: payload }); }",
    "",
    "  var timeLabels = {};",
    "  console = {",
    "    log: function () { stdout.push(fmt(arguments)); send('out', null); },",
    "    info: function () { stdout.push(fmt(arguments)); send('out', null); },",
    "    warn: function () { stderr.push(fmt(arguments)); send('out', null); },",
    "    error: function () { stderr.push(fmt(arguments)); send('out', null); },",
    "    debug: function () { stdout.push(fmt(arguments)); send('out', null); },",
    "    table: function (d) { stdout.push(fmt([d])); send('out', null); },",
    "    time: function (label) { timeLabels[label || 'default'] = Date.now(); },",
    "    timeEnd: function (label) {",
    "      var key = label || 'default';",
    "      if (timeLabels[key] != null) {",
    "        stdout.push(key + ': ' + (Date.now() - timeLabels[key]).toFixed(3) + 'ms');",
    "        delete timeLabels[key];",
    "        send('out', null);",
    "      }",
    "    },",
    "  };",
    "",
    "  // 非同期処理の完了検知：タイマーを追跡する",
    "  var origSetTimeout = setTimeout;",
    "  var origClearTimeout = clearTimeout;",
    "  var origSetInterval = setInterval;",
    "  setTimeout = function (fn, delay) {",
    "    pending++;",
    "    var id = origSetTimeout.apply(self, [function () {",
    "      pending--;",
    "      delete timerIds[id];",
    "      try { fn.apply(self, Array.prototype.slice.call(arguments)); }",
    "      catch (e) { reportError2(e); }",
    "    }, delay].concat(Array.prototype.slice.call(arguments, 2)));",
    "    timerIds[id] = true;",
    "    return id;",
    "  };",
    "  clearTimeout = function (id) {",
    "    if (timerIds[id]) { pending--; delete timerIds[id]; }",
    "    return origClearTimeout.call(self, id);",
    "  };",
    "  setInterval = function () {",
    "    intervalUsed = true;",
    "    return origSetInterval.apply(self, arguments);",
    "  };",
    "",
    "  function snapshot() { return { stdout: stdout.join('\\n'), stderr: stderr.join('\\n') }; }",
    "",
    "  function finish(success, extraErr) {",
    "    if (finished) return;",
    "    finished = true;",
    "    var s = snapshot();",
    "    if (extraErr) s.stderr = (s.stderr ? s.stderr + '\\n' : '') + extraErr;",
    "    send('done', { success: success, stdout: s.stdout ? s.stdout + '\\n' : '', stderr: s.stderr });",
    "  }",
    "",
    "  function reportError2(e) {",
    "    var msg = (e && e.stack) ? e.stack.split('\\n').slice(0, 3).join('\\n') : String(e);",
    "    finish(false, msg);",
    "  }",
    "",
    "  self.addEventListener('unhandledrejection', function (ev) {",
    "    var r = ev.reason;",
    "    var msg = 'UnhandledPromiseRejection: ' + ((r && r.message) ? (r.name + ': ' + r.message) : String(r));",
    "    finish(false, msg);",
    "  });",
    "  self.addEventListener('error', function (ev) {",
    "    finish(false, (ev && ev.message) ? ev.message : 'エラーが発生しました');",
    "  });",
    "",
    "  // 実行完了の判定：同期実行終了後、未完了タイマーがなくなるのを待つ",
    "  function watchIdle(startedAt) {",
    "    if (finished) return;",
    "    var elapsed = Date.now() - startedAt;",
    "    if (intervalUsed && elapsed > 3000) { finish(true, null); return; }",
    "    if (pending === 0 && !intervalUsed) {",
    "      // マイクロタスク（Promiseチェーン）を流し切ってから終了する",
    "      origSetTimeout(function () {",
    "        if (pending === 0) { finish(true, null); }",
    "        else { origSetTimeout(function () { watchIdle(startedAt); }, 30); }",
    "      }, 60);",
    "      return;",
    "    }",
    "    origSetTimeout(function () { watchIdle(startedAt); }, 30);",
    "  }",
    "",
    "  self.__afterUserCode = function (err) {",
    "    if (err) { reportError2(err); return; }",
    "    watchIdle(Date.now());",
    "  };",
    "})();",
  ].join("\n");

  /**
   * コードを実行する。
   * callbacks: { onResult(result) } resultは{success, compiler, stdout, stderr}
   */
  function run(code, callbacks) {
    // 構文チェック（Nodeのnode --checkに相当）。関数ボディとして評価する
    try {
      new Function(code);
    } catch (e) {
      if (e instanceof SyntaxError) {
        callbacks.onResult({
          success: false,
          compiler: "SyntaxError: " + e.message + "\n（構文エラー：コードの形が正しいか確認しましょう）",
          stdout: "",
          stderr: "",
          backend: "browser",
        });
        return { cancel: function () {} };
      }
    }

    var source =
      SHIM_SOURCE +
      "\ntry {\n" +
      code +
      "\n;__afterUserCode(null);\n} catch (__e) { __afterUserCode(__e); }\n";

    var blob = new Blob([source], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);
    var worker = new Worker(url);
    var settled = false;

    function settle(result) {
      if (settled) return;
      settled = true;
      clearTimeout(killTimer);
      worker.terminate();
      URL.revokeObjectURL(url);
      callbacks.onResult(result);
    }

    var killTimer = setTimeout(function () {
      settle({
        success: false,
        compiler: "",
        stdout: "",
        stderr: "実行がタイムアウトしました（8秒）。無限ループがないか確認してください。",
        backend: "browser",
      });
    }, HARD_TIMEOUT_MS);

    worker.onmessage = function (e) {
      var msg = e.data || {};
      if (msg.type === "done") {
        settle({
          success: msg.payload.success,
          compiler: "",
          stdout: msg.payload.stdout,
          stderr: msg.payload.stderr,
          backend: "browser",
        });
      }
    };

    worker.onerror = function (e) {
      // Worker起動時の構文エラーや読み込みエラー
      settle({
        success: false,
        compiler: (e && e.message) ? e.message : "コードの読み込みに失敗しました。",
        stdout: "",
        stderr: "",
        backend: "browser",
      });
    };

    return { cancel: function () { settle({ success: false, compiler: "", stdout: "", stderr: "キャンセルされました", backend: "browser" }); } };
  }

  window.JsRunner = { run: run };
})();
