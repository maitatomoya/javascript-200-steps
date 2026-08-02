// 第13章：非同期処理の基礎
registerChapter({
  number: 13,
  title: "非同期処理の基礎",
  description: "setTimeoutとコールバックから始めて、Promiseによる非同期処理の書き方を段階的に学びます。",
  steps: [
    {
      id: 121,
      title: "同期と非同期",
      explanation: `<p>これまで書いてきたコードは、上の行から順番に1行ずつ実行される<strong>同期処理</strong>でした。同期処理では、前の処理が終わるまで次の処理は始まりません。</p>
<p>一方、<strong>非同期処理</strong>は「あとで実行してね」と予約だけして、先に次の行へ進む処理です。JavaScriptでは<code>setTimeout(関数, ミリ秒)</code>が非同期処理の代表例で、指定したミリ秒後に関数を実行するよう予約します。</p>
<pre><code>console.log("1番目");
setTimeout(function () {
  console.log("3番目（10ms後に実行される）");
}, 10);
console.log("2番目");</code></pre>
<p>このコードの出力は「1番目」「2番目」「3番目」の順になります。<code>setTimeout</code>の行に到達しても、そこで10ms待つのではなく「予約」だけして即座に次の行へ進むからです。</p>
<table>
<tr><th>種類</th><th>動き</th><th>例</th></tr>
<tr><td>同期処理</td><td>終わるまで次に進まない</td><td>console.log、計算、ループ</td></tr>
<tr><td>非同期処理</td><td>予約して先に進む</td><td>setTimeout、通信、ファイル読み込み</td></tr>
</table>
<p>実際の開発では、サーバーとの通信やファイルの読み込みなど「時間がかかる処理」が非同期で行われます。待っている間に画面が固まらないようにするための、JavaScriptの重要な仕組みです。まずは「コードの見た目の順序と実行順序がずれる」ことを体験しましょう。</p>`,
      task: `処理Bを<code>setTimeout</code>を使って10ms後に実行されるように書き換え、出力順が「処理A→処理C→処理B」になることを確認しましょう。`,
      code: `console.log("処理A: 同期");

// TODO: 下の処理Bを、setTimeoutを使って10ms後に実行されるように書き換える
console.log("処理B: 非同期(10ms後)");

console.log("処理C: 同期");`,
      solution: `console.log("処理A: 同期");

// setTimeoutで「10ms後に実行する」予約だけをして、すぐ次の行へ進む
setTimeout(function () {
  console.log("処理B: 非同期(10ms後)");
}, 10);

console.log("処理C: 同期");`,
      hints: [
        `setTimeoutは「第1引数の関数」を「第2引数のミリ秒後」に実行するよう予約する関数です。`,
        `setTimeout(function () { console.log(...); }, 10); の形で、処理Bのconsole.logを関数の中に入れます。`
      ],
      expectedOutput: "処理B: 非同期(10ms後)"
    },
    {
      id: 122,
      title: "コールバック関数による非同期",
      explanation: `<p>非同期処理の結果を受け取る最も古典的な方法が<strong>コールバック関数</strong>（処理が終わったときに呼び出してもらう関数）です。第7章で学んだ「関数を引数として渡す」テクニックを、非同期処理に応用します。</p>
<p>たとえばサーバーからユーザー名を取得する処理を考えます。取得には時間がかかるので、関数は結果を<code>return</code>で返せません。関数が値を返す時点では、まだ結果が届いていないからです。そこで「結果が届いたらこの関数を呼んでね」とコールバックを渡します。</p>
<pre><code>function fetchUser(callback) {
  // 本物の通信の代わりにsetTimeoutで遅延を再現する
  setTimeout(function () {
    callback("はなこ"); // 20ms後、結果を引数にしてコールバックを呼ぶ
  }, 20);
}

fetchUser(function (name) {
  console.log("こんにちは、" + name + "さん");
});</code></pre>
<p>ポイントは2つあります。</p>
<ul>
<li><code>fetchUser</code>自体はすぐに終了し、プログラムは次の行へ進む</li>
<li>20ms後に結果が「届いた」タイミングで、渡しておいたコールバックが実行される</li>
</ul>
<p>この教材ではネットワーク通信は使えないため、<code>setTimeout</code>で「時間のかかる処理」を再現します。この擬似的な遅延パターンは本章を通して使うので、書き方に慣れておきましょう。</p>`,
      task: `<code>fetchUser</code>を呼び出し、コールバック関数の中で「取得完了: 名前」の形式で表示しましょう。`,
      code: `function fetchUser(callback) {
  setTimeout(function () {
    // 20ms後にサーバーから名前が返ってきたと想定する
    callback("たろう");
  }, 20);
}

console.log("取得開始");
// TODO: fetchUserを呼び出し、コールバック関数で「取得完了: たろう」と表示する`,
      solution: `function fetchUser(callback) {
  setTimeout(function () {
    // 20ms後にサーバーから名前が返ってきたと想定する
    callback("たろう");
  }, 20);
}

console.log("取得開始");
// 結果が届いたときに呼んでほしい関数（コールバック）を渡す
fetchUser(function (name) {
  console.log("取得完了: " + name);
});`,
      hints: [
        `fetchUserの引数には「名前を受け取って表示する関数」をそのまま渡します。`,
        `fetchUser(function (name) { ... }); の形で、...の部分にconsole.logを書きます。`
      ],
      expectedOutput: "取得完了: たろう"
    },
    {
      id: 123,
      title: "コールバック地獄の体験",
      explanation: `<p>コールバック方式には大きな弱点があります。「Aが終わったらB、Bが終わったらC」のように非同期処理を<strong>順番につなげる</strong>と、コールバックの中にコールバックを書くことになり、ネスト（入れ子）がどんどん深くなるのです。</p>
<pre><code>login(function (user) {
  fetchProfile(user, function (profile) {
    fetchPosts(profile, function (posts) {
      fetchComments(posts, function (comments) {
        // 4段ネスト。これ以上増えると読めなくなる
      });
    });
  });
});</code></pre>
<p>この状態は俗に<strong>コールバック地獄</strong>（callback hell）と呼ばれます。何が問題なのか整理しましょう。</p>
<ul>
<li><strong>可読性</strong>：右へ右へとインデントが深くなり、処理の流れが追いにくい</li>
<li><strong>エラー処理</strong>：各段階で個別にエラー処理を書く必要があり、書き漏らしやすい</li>
<li><strong>変更のしにくさ</strong>：手順の追加や順序の入れ替えが大変</li>
</ul>
<p>今回はあえてこの「地獄」を自分の手で書いて体験します。手順1→手順2→手順3と順番に実行するには、前の手順のコールバックの中で次の手順を呼ぶしかありません。この不便さを実感しておくと、次のステップで学ぶ<strong>Promise</strong>のありがたみがよく分かります。歴史的にも、コールバック地獄への反省からPromiseが生まれました。</p>`,
      task: `手順2のコールバックの中で手順3を実行し、手順3の完了後に「すべて完了」と表示されるようにネストを1段深くしましょう。`,
      code: `function step(name, delay, callback) {
  setTimeout(function () {
    console.log(name + " 完了");
    callback();
  }, delay);
}

// TODO: 手順3も続けて実行し、手順3の完了後に「すべて完了」と表示する
step("手順1", 10, function () {
  step("手順2", 10, function () {
    console.log("すべて完了");
  });
});`,
      solution: `function step(name, delay, callback) {
  setTimeout(function () {
    console.log(name + " 完了");
    callback();
  }, delay);
}

// コールバックの中でさらに次の手順を呼ぶため、ネストがどんどん深くなる
step("手順1", 10, function () {
  step("手順2", 10, function () {
    step("手順3", 10, function () {
      console.log("すべて完了");
    });
  });
});`,
      hints: [
        `「手順2の完了後」に実行したい処理は、手順2に渡すコールバック関数の中に書きます。`,
        `現在「すべて完了」を表示している場所で、代わりにstep("手順3", 10, function () { ... })を呼び、その中で「すべて完了」を表示します。`
      ],
      expectedOutput: "すべて完了"
    },
    {
      id: 124,
      title: "Promiseの基本（then）",
      explanation: `<p><strong>Promise</strong>（プロミス）は「将来の結果を表すオブジェクト」です。日本語の「約束」の通り、「まだ結果は無いけれど、あとで必ず成功か失敗のどちらかをお知らせします」という約束を表します。</p>
<p>Promiseは3つの状態を持ちます。</p>
<table>
<tr><th>状態</th><th>意味</th></tr>
<tr><td>pending</td><td>待機中（まだ結果が出ていない）</td></tr>
<tr><td>fulfilled</td><td>成功（結果の値が確定した）</td></tr>
<tr><td>rejected</td><td>失敗（エラーが確定した）</td></tr>
</table>
<p>Promiseを返す関数を呼んだら、<code>.then(コールバック)</code>で「成功したらこの関数を呼んでね」と登録します。成功時の値がコールバックの引数として渡されます。</p>
<pre><code>fetchMessage().then(function (message) {
  console.log(message); // 結果が届いたら実行される
});</code></pre>
<p>コールバック方式との違いは、<strong>関数が「Promiseオブジェクト」を返す</strong>ことです。コールバックを引数に押し込むのではなく、戻り値のPromiseに対して後から処理を登録します。この「結果をオブジェクトとして持ち運べる」性質が、次のステップで学ぶチェーンや、後のPromise.allのような強力な機能につながります。</p>
<p>今回使う<code>fetchMessage</code>はPromiseを返す関数として用意してあります。Promiseを自分で作る方法はステップ127で学ぶので、まずは「受け取って使う」側に慣れましょう。</p>`,
      task: `<code>fetchMessage()</code>が返すPromiseに<code>then</code>で関数を登録し、「受け取った値: メッセージ」の形式で表示しましょう。`,
      code: `// Promiseを返す関数（作り方はステップ127で学ぶので、今は使い方に集中する）
function fetchMessage() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve("こんにちは、Promise");
    }, 20);
  });
}

// TODO: fetchMessage()の結果をthenで受け取り、「受け取った値: こんにちは、Promise」と表示する`,
      solution: `// Promiseを返す関数（作り方はステップ127で学ぶので、今は使い方に集中する）
function fetchMessage() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve("こんにちは、Promise");
    }, 20);
  });
}

// thenに渡した関数が、成功時に結果を引数として受け取る
fetchMessage().then(function (message) {
  console.log("受け取った値: " + message);
});`,
      hints: [
        `fetchMessage()の戻り値はPromiseオブジェクトなので、続けて.then(関数)を呼べます。`,
        `fetchMessage().then(function (message) { ... }); の形で、...にconsole.logを書きます。`
      ],
      expectedOutput: "受け取った値: こんにちは、Promise"
    },
    {
      id: 125,
      title: "Promiseのchain",
      explanation: `<p>Promiseの真価は<strong>チェーン</strong>（連鎖）にあります。<code>then</code>のコールバックが値を<code>return</code>すると、その値は次の<code>then</code>に引き継がれます。<code>then</code>自体が新しいPromiseを返すため、<code>.then().then().then()</code>と一直線につなげられるのです。</p>
<pre><code>fetchNumber()
  .then(function (n) {
    return n + 1;   // 次のthenへ渡す
  })
  .then(function (n) {
    return n * 3;   // さらに次のthenへ渡す
  })
  .then(function (n) {
    console.log(n); // 最終結果
  });</code></pre>
<p>ステップ123のコールバック地獄と比べてみましょう。</p>
<table>
<tr><th>方式</th><th>形</th><th>読みやすさ</th></tr>
<tr><td>コールバック</td><td>右下へ深くネストする</td><td>段数が増えるほど読みにくい</td></tr>
<tr><td>Promiseチェーン</td><td>縦に一直線に並ぶ</td><td>手順書のように上から読める</td></tr>
</table>
<p>注意点は、<strong>次のthenへ値を渡すには必ずreturnが必要</strong>なことです。<code>return</code>を書き忘れると、次の<code>then</code>が受け取る値は<code>undefined</code>になります。これは実務でも非常によくあるバグなので、「thenの中では渡したい値をreturnする」を合言葉にしてください。なお、<code>return</code>した値がPromiseだった場合は、そのPromiseの完了を待ってから次の<code>then</code>に進むという便利な性質もあります（ステップ130で活用します）。</p>`,
      task: `2つ目の<code>then</code>で<code>n + 5</code>を<code>return</code>し、3つ目の<code>then</code>を追加して「最終結果: 25」と表示しましょう。`,
      code: `function fetchNumber() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(10);
    }, 10);
  });
}

fetchNumber()
  .then(function (n) {
    console.log("1つ目: " + n);
    return n * 2;
  })
  .then(function (n) {
    console.log("2つ目: " + n);
    // TODO: n + 5 を返し、さらに3つ目のthenを追加して「最終結果: 25」と表示する
  });`,
      solution: `function fetchNumber() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(10);
    }, 10);
  });
}

fetchNumber()
  .then(function (n) {
    console.log("1つ目: " + n);
    return n * 2; // returnした値が次のthenへ渡る
  })
  .then(function (n) {
    console.log("2つ目: " + n);
    return n + 5;
  })
  .then(function (n) {
    console.log("最終結果: " + n);
  });`,
      hints: [
        `thenのコールバックでreturnした値が、そのまま次のthenのコールバックの引数になります。`,
        `2つ目のthenの最後にreturn n + 5;を書き、その後ろに.then(function (n) { console.log("最終結果: " + n); })を続けます。`
      ],
      expectedOutput: "最終結果: 25"
    },
    {
      id: 126,
      title: "catchでエラー処理",
      explanation: `<p>Promiseが失敗（rejected）になったときの処理は<code>.catch(コールバック)</code>で登録します。第12章で学んだ<code>try...catch</code>のPromise版だと考えてください。</p>
<pre><code>fetchData()
  .then(function (data) {
    console.log("成功: " + data);
  })
  .catch(function (error) {
    console.log("失敗: " + error.message);
  });</code></pre>
<p><code>catch</code>には重要な性質があります。<strong>チェーンのどこで発生したエラーでも、後ろに1つcatchを置けばまとめて捕まえられる</strong>のです。コールバック方式では各段階にエラー処理を書く必要がありましたが、Promiseなら最後に1つで済みます。これがコールバック地獄に対するPromiseの大きな優位点です。</p>
<p>逆に、<code>catch</code>を書き忘れてPromiseが失敗すると、Node.jsでは<strong>unhandled rejection</strong>（処理されない失敗）としてプログラムがエラー終了します。初期コードをそのまま実行して、実際にこのエラーを見てみましょう。エラーメッセージに「UnhandledPromiseRejection」という文字が現れるはずです。</p>
<ul>
<li>失敗の値には<code>new Error("メッセージ")</code>を使うのが慣例で、<code>error.message</code>でメッセージを取り出せます</li>
<li>成功時は<code>then</code>だけが、失敗時は<code>catch</code>だけが呼ばれます</li>
<li>後始末など「成功でも失敗でも実行したい処理」には<code>.finally()</code>も使えます</li>
</ul>`,
      task: `まず初期コードをそのまま実行してunhandled rejectionのエラーを観察し、その後<code>catch</code>を追加して「失敗: サーバーに接続できません」と表示されるように修正しましょう。`,
      code: `function fetchWithError() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("サーバーに接続できません"));
    }, 10);
  });
}

// このまま実行するとUnhandledPromiseRejectionでエラー終了する
// TODO: catchを追加して「失敗: サーバーに接続できません」と表示する
fetchWithError().then(function (data) {
  console.log("成功: " + data);
});`,
      solution: `function fetchWithError() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("サーバーに接続できません"));
    }, 10);
  });
}

// catchを付けておけば、失敗してもプログラムは正常に続行できる
fetchWithError()
  .then(function (data) {
    console.log("成功: " + data);
  })
  .catch(function (error) {
    console.log("失敗: " + error.message);
  });`,
      hints: [
        `thenの後ろに.catch(function (error) { ... })をつなげると、失敗時にその関数が呼ばれます。`,
        `エラーメッセージはerror.messageで取り出し、"失敗: " + error.message の形で表示します。`
      ],
      expectedOutput: "失敗: サーバーに接続できません"
    },
    {
      id: 127,
      title: "Promiseを作る（resolve、reject）",
      explanation: `<p>ここまで「用意されたPromise」を使ってきましたが、今回は自分でPromiseを作ります。<code>new Promise(実行関数)</code>という形で作り、実行関数は<code>resolve</code>と<code>reject</code>という2つの関数を引数として受け取ります。</p>
<pre><code>function wait(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("完了"); // 成功を確定させる
    }, ms);
  });
}</code></pre>
<table>
<tr><th>関数</th><th>呼ぶと起きること</th><th>その後</th></tr>
<tr><td>resolve(値)</td><td>成功（fulfilled）が確定し、値がthenへ渡る</td><td>thenが呼ばれる</td></tr>
<tr><td>reject(エラー)</td><td>失敗（rejected）が確定し、エラーがcatchへ渡る</td><td>catchが呼ばれる</td></tr>
</table>
<p>大事なルールが2つあります。</p>
<ul>
<li>状態は一度しか確定できません。<code>resolve</code>を呼んだ後に<code>reject</code>を呼んでも無視されます</li>
<li><code>reject</code>に渡す値は<code>new Error("メッセージ")</code>にするのが慣例です（スタックトレースが残り、原因調査がしやすくなります）</li>
</ul>
<p>典型的な設計は「条件を判定して、成功なら<code>resolve</code>、失敗なら<code>reject</code>を呼ぶ」というものです。今回は在庫チェックを題材に、<code>count</code>が1以上なら成功、0以下なら失敗とするPromiseを作ってみましょう。実務でも「APIをPromiseでラップする」場面でこのパターンを頻繁に使います。</p>`,
      task: `<code>checkStock</code>の中身を完成させましょう。<code>count</code>が1以上なら「在庫あり: N個」で<code>resolve</code>、0以下なら「在庫切れです」のエラーで<code>reject</code>します。`,
      code: `// TODO: countが1以上ならresolve("在庫あり: " + count + "個")、
// 0以下ならreject(new Error("在庫切れです"))を呼ぶ
function checkStock(count) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      // ここに在庫チェックの処理を書く
    }, 10);
  });
}

checkStock(3)
  .then(function (message) {
    console.log(message);
    return checkStock(0);
  })
  .catch(function (error) {
    console.log("エラー: " + error.message);
  });`,
      solution: `function checkStock(count) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (count >= 1) {
        resolve("在庫あり: " + count + "個"); // 成功を確定
      } else {
        reject(new Error("在庫切れです")); // 失敗を確定
      }
    }, 10);
  });
}

checkStock(3)
  .then(function (message) {
    console.log(message);
    return checkStock(0);
  })
  .catch(function (error) {
    console.log("エラー: " + error.message);
  });`,
      hints: [
        `setTimeoutのコールバックの中でif文を使い、countの値によってresolveかrejectのどちらかを呼びます。`,
        `if (count >= 1) { resolve("在庫あり: " + count + "個"); } else { reject(new Error("在庫切れです")); } のようになります。`
      ],
      expectedOutput: "エラー: 在庫切れです"
    },
    {
      id: 128,
      title: "Promise.all",
      explanation: `<p>複数の非同期処理を<strong>同時に走らせて、全部の完了を待ちたい</strong>ことはよくあります。たとえば「ユーザー情報」「通知一覧」「設定」を別々のAPIから取得して、全部そろってから画面を表示するような場面です。</p>
<p>そのための道具が<code>Promise.all(Promiseの配列)</code>です。配列内のすべてのPromiseが成功すると、<strong>結果の配列</strong>を持って成功します。</p>
<pre><code>Promise.all([promiseA, promiseB, promiseC]).then(function (results) {
  // results[0]はpromiseAの結果、results[1]はpromiseBの結果...
  console.log(results.length); // 3
});</code></pre>
<p>押さえておきたい性質は3つです。</p>
<ul>
<li><strong>結果の順序は配列の順序と同じ</strong>：完了が早い遅いに関係なく、渡した順で結果が並びます</li>
<li><strong>所要時間は「一番遅いもの」に揃う</strong>：30ms、10ms、20msの処理なら約30msで全部そろいます。順番に待つと合計60msかかるので、大幅な時間短縮になります</li>
<li><strong>1つでも失敗すると全体が失敗</strong>：即座にcatchへ進みます（全員成功が必須の場面向き）</li>
</ul>
<p>今回のコードでは、3つのPromiseは<code>delay</code>を呼んだ瞬間にそれぞれのタイマーが動き出しています。<code>Promise.all</code>は処理を開始する関数ではなく、<strong>すでに走っているPromiseたちの完了をまとめて待つ</strong>関数だという点も意識しておきましょう。</p>`,
      task: `<code>Promise.all</code>で3つのPromiseの完了を待ち、結果を<code>join("と")</code>でつないで「全件そろいました: りんごとばななとみかん」と表示しましょう。`,
      code: `function delay(ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

// 3つの非同期処理はこの時点でそれぞれ動き出している
const p1 = delay(30, "りんご");
const p2 = delay(10, "ばなな");
const p3 = delay(20, "みかん");

// TODO: Promise.allで3つ全部の完了を待ち、
// 「全件そろいました: りんごとばななとみかん」と表示する`,
      solution: `function delay(ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

// 3つの非同期処理はこの時点でそれぞれ動き出している
const p1 = delay(30, "りんご");
const p2 = delay(10, "ばなな");
const p3 = delay(20, "みかん");

// 完了の早さに関係なく、結果は渡した配列の順序で並ぶ
Promise.all([p1, p2, p3]).then(function (results) {
  console.log("全件そろいました: " + results.join("と"));
});`,
      hints: [
        `Promise.allには[p1, p2, p3]のようにPromiseの配列を渡し、戻り値に.thenをつなげます。`,
        `thenのコールバックは結果の配列を受け取るので、results.join("と")で1つの文字列にできます。`
      ],
      expectedOutput: "全件そろいました: りんごとばななとみかん"
    },
    {
      id: 129,
      title: "Promise.raceとallSettled",
      explanation: `<p><code>Promise.all</code>の仲間として、用途の違う2つのメソッドを紹介します。</p>
<table>
<tr><th>メソッド</th><th>完了する条件</th><th>結果</th></tr>
<tr><td>Promise.all</td><td>全部成功したら</td><td>結果の配列（1つでも失敗なら全体が失敗）</td></tr>
<tr><td>Promise.race</td><td>どれか1つが決着したら</td><td>最初に決着したものの結果（成功でも失敗でも）</td></tr>
<tr><td>Promise.allSettled</td><td>全部決着したら</td><td>成功も失敗も含む全結果の配列（全体は失敗しない）</td></tr>
</table>
<p><code>Promise.race</code>（レース＝競争）は、最初に決着した1つの結果だけを採用します。「複数サーバーのうち速い方を使う」「一定時間で打ち切るタイムアウト」（第14章で実装します）などに使われます。</p>
<p><code>Promise.allSettled</code>は全部の決着を待ち、1つ1つの結果を<code>{ status: "fulfilled", value: 値 }</code>または<code>{ status: "rejected", reason: エラー }</code>というオブジェクトで返します。</p>
<pre><code>Promise.allSettled([okPromise, ngPromise]).then(function (results) {
  console.log(results[0].status); // "fulfilled"
  console.log(results[1].status); // "rejected"
});</code></pre>
<p><code>Promise.all</code>は1つの失敗で全体が失敗しますが、<code>allSettled</code>は「失敗したものがあっても、成功した分は使いたい」場面に向きます。たとえば10件のデータ取得のうち9件成功なら、その9件だけ表示するといった使い方です。</p>`,
      task: `<code>Promise.race</code>で速い方の結果を「最初の応答: 高速サーバー」と表示し、<code>Promise.allSettled</code>で2つの結果の<code>status</code>をそれぞれ表示しましょう。`,
      code: `function delay(ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

function fail(ms, message) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error(message));
    }, ms);
  });
}

const fast = delay(10, "高速サーバー");
const slow = delay(40, "低速サーバー");
// TODO 1: Promise.raceで先に決着した方を「最初の応答: 高速サーバー」と表示する

const ok = delay(10, "OK");
const ng = fail(20, "NG");
// TODO 2: Promise.allSettledで「1件目: fulfilled」「2件目: rejected」と表示する`,
      solution: `function delay(ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

function fail(ms, message) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error(message));
    }, ms);
  });
}

const fast = delay(10, "高速サーバー");
const slow = delay(40, "低速サーバー");
// raceは最初に決着した1つの結果だけを採用する
Promise.race([fast, slow]).then(function (winner) {
  console.log("最初の応答: " + winner);
});

const ok = delay(10, "OK");
const ng = fail(20, "NG");
// allSettledは失敗があっても全体としては成功し、各結果をstatusで区別できる
Promise.allSettled([ok, ng]).then(function (results) {
  console.log("1件目: " + results[0].status);
  console.log("2件目: " + results[1].status);
});`,
      hints: [
        `raceもallSettledも、Promise.allと同じようにPromiseの配列を渡してthenで結果を受け取ります。`,
        `allSettledの結果は{ status: ..., value: ... }形式のオブジェクトの配列なので、results[0].statusのように取り出します。`
      ],
      expectedOutput: "2件目: rejected"
    },
    {
      id: 130,
      title: "総合演習：擬似API呼び出しの連携",
      explanation: `<p>第13章の総まとめとして、実務でよくある「APIを順番に呼び出す」流れをPromiseチェーンで組み立てます。題材は通販サイトの注文照会です。</p>
<ol>
<li><code>fetchUser(id)</code>：ユーザー情報を取得する（存在しないIDなら失敗）</li>
<li><code>fetchOrders(userId)</code>：そのユーザーの注文一覧を取得する</li>
<li>結果を整形して表示する</li>
</ol>
<p>ポイントは、ステップ125で予告した<strong>「thenの中でPromiseをreturnすると、その完了を待ってから次のthenへ進む」</strong>という性質です。</p>
<pre><code>fetchUser(1)
  .then(function (user) {
    return fetchOrders(user.id); // Promiseを返すと...
  })
  .then(function (orders) {
    // ...その結果がここに届く
  })
  .catch(function (error) {
    // どの段階の失敗もここで捕まえる
  });</code></pre>
<p>これはまさにステップ123で体験したコールバック地獄と同じ「手順の連結」ですが、ネストせずに縦一直線で書けています。さらに<code>catch</code>1つで全段階のエラーに対応できる点も確認してください。</p>
<p>本物のWebアプリでは<code>fetchUser</code>の中身がサーバーへの通信になりますが、呼び出す側のコードの形はまったく同じです。<code>setTimeout</code>による擬似APIで流れを体に染み込ませておけば、実務のコードもすぐ読めるようになります。</p>`,
      task: `Promiseチェーンを完成させましょう。ユーザー取得後に名前を表示して<code>fetchOrders(user.id)</code>を<code>return</code>し、次の<code>then</code>で「注文数: 3件」と「内容: ノート、ペン、消しゴム」を表示します。`,
      code: `function fetchUser(id) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (id === 1) {
        resolve({ id: 1, name: "さくら" });
      } else {
        reject(new Error("ユーザーが見つかりません"));
      }
    }, 20);
  });
}

function fetchOrders(userId) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(["ノート", "ペン", "消しゴム"]);
    }, 20);
  });
}

console.log("注文情報の取得を開始");
fetchUser(1)
  .then(function (user) {
    // TODO: 「ユーザー: さくら」と表示し、fetchOrders(user.id)をreturnする
  })
  .then(function (orders) {
    // TODO: 「注文数: 3件」と「内容: ノート、ペン、消しゴム」を表示する
    // （件数はorders.length、内容はorders.join("、")で作る）
  })
  .catch(function (error) {
    console.log("エラー: " + error.message);
  });`,
      solution: `function fetchUser(id) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (id === 1) {
        resolve({ id: 1, name: "さくら" });
      } else {
        reject(new Error("ユーザーが見つかりません"));
      }
    }, 20);
  });
}

function fetchOrders(userId) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(["ノート", "ペン", "消しゴム"]);
    }, 20);
  });
}

console.log("注文情報の取得を開始");
fetchUser(1)
  .then(function (user) {
    console.log("ユーザー: " + user.name);
    // Promiseをreturnすると、その完了を待ってから次のthenへ進む
    return fetchOrders(user.id);
  })
  .then(function (orders) {
    console.log("注文数: " + orders.length + "件");
    console.log("内容: " + orders.join("、"));
  })
  .catch(function (error) {
    console.log("エラー: " + error.message);
  });`,
      hints: [
        `1つ目のthenでfetchOrders(user.id)をreturnすると、注文一覧の配列が2つ目のthenに届きます。`,
        `ユーザー名はuser.name、注文数はorders.length、内容はorders.join("、")で組み立てます。`,
        `fetchUser(2)に変えて実行すると、catchが動く様子も確認できます。`
      ],
      expectedOutput: "内容: ノート、ペン、消しゴム"
    }
  ]
});
