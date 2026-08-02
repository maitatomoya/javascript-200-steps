// 第24章：よくあるエラー：非同期
registerChapter({
  number: 24,
  title: "よくあるエラー：非同期",
  description: "awaitの付け忘れ、catch漏れによるプロセスの異常終了、forEachとawaitの相性問題、Promise.allの失敗など、非同期処理で実際によく起きるエラーと誤動作を修正していきます。",
  steps: [
    {
      id: 231,
      title: "awaitを忘れて[object Promise]が表示される",
      explanation: `<p>この章では、第13〜14章で学んだ非同期処理の「実際によく起きる事故」を修正していきます。まずは最頻出のこれです。</p>
<pre><code>ユーザー: [object Promise]</code></pre>
<p><code>[object Promise]</code>という表示は、<strong>Promiseオブジェクトそのものを文字列に変換した</strong>ときの見た目です。つまり「Promiseの中身を取り出す前に使ってしまった」という動かぬ証拠で、この文字列を見た瞬間に「どこかでawaitを忘れている」と断定してよいレベルの定番症状です。</p>
<p>第14章の復習ですが、Promiseは「後で届く値の引換券」です。<code>fetchUser()</code>を呼んだ時点で返ってくるのは引換券であって、中の値（"さくら"）ではありません。</p>
<table>
<tr><th>書き方</th><th>userに入るもの</th></tr>
<tr><td><code>const user = fetchUser();</code></td><td>Promise（引換券そのもの）</td></tr>
<tr><td><code>const user = await fetchUser();</code></td><td>"さくら"（完了を待って取り出した値）</td></tr>
</table>
<pre><code>async function main() {
  const user = await fetchUser(); // 完了を待って中の値を取り出す
  console.log("ユーザー: " + user);
}</code></pre>
<p>チェックの習慣として、<strong>Promiseを返す関数を呼ぶ行には必ず「awaitするか、thenを付けるか、意図的に待たないか」の判断をする</strong>こと。出力やデータに<code>[object Promise]</code>やundefinedが混ざったら、まず呼び出し行のawaitを確認しましょう。なお<code>await</code>はasync関数の中でしか使えないため、この教材ではmainというasync関数で包んでいます。</p>`,
      task: `<code>fetchUser()</code>の呼び出しに<code>await</code>を付けて、「ユーザー: さくら」と表示されるように修正しましょう。`,
      code: `// 10ミリ秒後にユーザー名を返す、擬似的なデータ取得関数
function fetchUser() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve("さくら");
    }, 10);
  });
}

async function main() {
  const user = fetchUser(); // awaitを忘れている
  console.log("ユーザー: " + user);
}

main();`,
      solution: `function fetchUser() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve("さくら");
    }, 10);
  });
}

async function main() {
  // awaitでPromiseの完了を待ち、中の値を取り出す
  const user = await fetchUser();
  console.log("ユーザー: " + user);
}

main();`,
      hints: [`[object Promise]は「Promiseそのものを文字列にした」表示です。中の値を取り出すには完了を待つ必要があります。`, `const user = await fetchUser(); のようにawaitを付けましょう。`],
      expectedOutput: "ユーザー: さくら"
    },
    {
      id: 232,
      title: "catch忘れでプロセスが異常終了する（Unhandled Rejection）",
      explanation: `<p>左のコードをNode.js 20で実行すると、何も表示されずにプログラムがクラッシュします。</p>
<pre><code>Error: idは1以上を指定してください
    at Timeout._onTimeout (main.js:7:16)
    at listOnTimeout (node:internal/timers:573:17)

Node.js v20.5.0</code></pre>
<p>最後に終了コード1で異常終了します。これは「未処理のリジェクション（unhandled rejection：rejectされたのに、誰もcatchしなかったPromise）」で、<strong>Node.jsは未処理のリジェクションを検出するとプロセスごと終了させます</strong>。Webサーバーでこれが起きればサーバー全体が落ちる、実務では重大度の高い事故です。</p>
<p>スタックトレースの<code>at Timeout._onTimeout</code>は「setTimeoutのコールバック内でエラーが発生した」ことを示します。同期処理のtry/catchでは届かない場所なので、Promiseの作法で受け止める必要があります。</p>
<pre><code>loadData(-1)
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) { // 失敗経路の受け皿
    console.log("エラー: " + err.message);
  });</code></pre>
<p>ルールは単純で、<strong>thenを書いたら、失敗時にどうするかをcatchで必ず書く</strong>。成功経路（then）と失敗経路（catch）は常にセットです。catchの中で<code>err.message</code>を使えば、rejectに渡したErrorのメッセージを取り出してユーザー向けの表示に変えられます。次のステップ以降では、async/await版の受け止め方（try/catch+await）も扱います。</p>`,
      task: `<code>catch</code>を追加して、クラッシュせずに「エラー: idは1以上を指定してください」と表示されるように修正しましょう。`,
      code: `function loadData(id) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (id > 0) {
        resolve("データ" + id + "を読み込みました");
      } else {
        reject(new Error("idは1以上を指定してください"));
      }
    }, 10);
  });
}

// 失敗した場合の処理（catch）を書いていない
loadData(-1).then(function (data) {
  console.log(data);
});`,
      solution: `function loadData(id) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (id > 0) {
        resolve("データ" + id + "を読み込みました");
      } else {
        reject(new Error("idは1以上を指定してください"));
      }
    }, 10);
  });
}

loadData(-1)
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    // 失敗時はここに来るので、プログラムは落ちない
    console.log("エラー: " + err.message);
  });`,
      hints: [`rejectされたPromiseを誰もcatchしないと、Node.jsはプロセスごと異常終了させます。`, `.then(...)の後ろに .catch(function (err) { console.log("エラー: " + err.message); }) をつなげましょう。`],
      expectedOutput: "エラー: idは1以上を指定してください"
    },
    {
      id: 233,
      title: "forEachの中ではawaitが待ってもらえない",
      explanation: `<p>在庫を全部チェックしてから「チェック完了」と言いたいのに、実行結果はこうなります。</p>
<pre><code>チェック完了
りんごの在庫: 3個
みかんの在庫: 3個</code></pre>
<p>完了報告が一番先に出てしまいました。原因は<code>forEach</code>と<code>await</code>の相性です。</p>
<p><code>forEach</code>は「コールバックを順に呼ぶだけ」のメソッドで、<strong>コールバックが返すPromiseを完全に無視します</strong>。asyncコールバックはawaitに到達した時点でいったん処理を返すため、forEachは待たずに次の要素へ進み、ループ全体も即座に終了します。その結果、後続の「チェック完了」が先に実行され、在庫の表示は10ミリ秒後に遅れて届くのです。</p>
<p>1件ずつ順番に待ちたいときの正解は<code>for...of</code>です。<code>for...of</code>は普通のループなので、本体の<code>await</code>がループの進行そのものを止めてくれます。</p>
<pre><code>for (const item of items) {
  const info = await getStock(item); // 1件終わるまで次に進まない
  console.log(info);
}
console.log("チェック完了"); // 必ず最後に出る</code></pre>
<table>
<tr><th>書き方</th><th>awaitは効くか</th><th>用途</th></tr>
<tr><td><code>forEach(async ...)</code></td><td>効かない（待たれない）</td><td>使わない</td></tr>
<tr><td><code>for...of + await</code></td><td>効く（1件ずつ順番に）</td><td>順序が大事な処理</td></tr>
</table>
<p>「全部を同時に走らせて最後にまとめて待つ」書き方は、次のステップのPromise.allで扱います。</p>`,
      task: `<code>forEach</code>を<code>for...of</code>に書き換えて、在庫が2件表示された後に「チェック完了」と表示されるように修正しましょう。`,
      code: `function getStock(name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(name + "の在庫: 3個");
    }, 10);
  });
}

async function main() {
  const items = ["りんご", "みかん"];
  // forEachは中のawaitの完了を待ってくれない
  items.forEach(async function (item) {
    const info = await getStock(item);
    console.log(info);
  });
  console.log("チェック完了");
}

main();`,
      solution: `function getStock(name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(name + "の在庫: 3個");
    }, 10);
  });
}

async function main() {
  const items = ["りんご", "みかん"];
  // for...ofならawaitで1件ずつ完了を待てる
  for (const item of items) {
    const info = await getStock(item);
    console.log(info);
  }
  console.log("チェック完了");
}

main();`,
      hints: [`forEachはコールバックが返すPromiseを無視するため、awaitしても外側の処理は先に進んでしまいます。`, `for (const item of items) { const info = await getStock(item); ... } の形に書き換えましょう。`],
      expectedOutput: "みかんの在庫: 3個"
    },
    {
      id: 234,
      title: "逐次awaitで遅い（Promise.allで並行にする）",
      explanation: `<p>今回はエラーではなく「動くけれど遅い」コードです。実行すると次のように表示されます。</p>
<pre><code>結果: ABC
60ms以上かかりました（逐次実行）</code></pre>
<p>3つのダウンロードはそれぞれ30ミリ秒ですが、<code>await</code>を1行ずつ並べると「Aが終わるのを待ってからBを開始、Bが終わってからCを開始」という<strong>逐次実行</strong>になり、合計で約90ミリ秒かかります。互いに依存関係がない処理なら、これは待ち時間の無駄です。</p>
<p>ポイントは<strong>「Promiseは作った瞬間に動き始める」</strong>ことです。先に3つとも呼び出してPromiseを作ってしまえば、3つのタイマーは同時に進みます。あとは<code>Promise.all</code>で「全部の完了」をまとめて待つだけです。</p>
<pre><code>const [a, b, c] = await Promise.all([
  download("A"),
  download("B"),
  download("C")
]); // 3つ同時に進むので約30ミリ秒で完了</code></pre>
<p><code>Promise.all</code>は、渡した配列と<strong>同じ順序</strong>で結果の配列を返します（完了した順ではない点が重要）。だから分割代入でa、b、cに安心して受け取れます。</p>
<table>
<tr><th>書き方</th><th>所要時間の目安</th><th>向いている場面</th></tr>
<tr><td>awaitを順番に並べる</td><td>30+30+30=約90ms</td><td>前の結果を次で使うとき</td></tr>
<tr><td>Promise.all</td><td>max(30,30,30)=約30ms</td><td>互いに独立な処理</td></tr>
</table>
<p>判断基準は「後の処理が前の結果を必要とするか」。必要なければPromise.all、が実務の合言葉です。</p>`,
      task: `3つの<code>download</code>を<code>Promise.all</code>で並行実行して、「60ms未満で完了しました（並行実行）」と表示されるように修正しましょう。`,
      code: `function download(name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(name);
    }, 30);
  });
}

async function main() {
  const start = Date.now();
  // 3つのダウンロードに依存関係はないのに、1つずつ順番に待っている
  const a = await download("A");
  const b = await download("B");
  const c = await download("C");
  const elapsed = Date.now() - start;
  console.log("結果: " + a + b + c);
  if (elapsed >= 60) {
    console.log("60ms以上かかりました（逐次実行）");
  } else {
    console.log("60ms未満で完了しました（並行実行）");
  }
}

main();`,
      solution: `function download(name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(name);
    }, 30);
  });
}

async function main() {
  const start = Date.now();
  // 3つを同時に開始し、Promise.allで全部の完了をまとめて待つ
  const [a, b, c] = await Promise.all([
    download("A"),
    download("B"),
    download("C")
  ]);
  const elapsed = Date.now() - start;
  console.log("結果: " + a + b + c);
  if (elapsed >= 60) {
    console.log("60ms以上かかりました（逐次実行）");
  } else {
    console.log("60ms未満で完了しました（並行実行）");
  }
}

main();`,
      hints: [`awaitを1行ずつ並べると、前のダウンロードが終わるまで次が始まりません。3つは互いに独立です。`, `const [a, b, c] = await Promise.all([download("A"), download("B"), download("C")]); で3つ同時に待てます。`],
      expectedOutput: "60ms未満で完了しました（並行実行）"
    },
    {
      id: 235,
      title: "async関数の戻り値は常にPromise",
      explanation: `<p>合計と税込金額を出したいのに、実行結果はこうなります。</p>
<pre><code>合計: [object Promise]
税込: NaN</code></pre>
<p>1行目はステップ231で見た症状ですが、今回のawait忘れは「呼び出し側」です。重要なルールを確認しましょう。<strong>async関数は、returnに何を書いても必ずPromiseを返します</strong>。<code>return 100 + 250;</code>と書いても、呼び出し側に届くのは350ではなく「350を包んだPromise」です。</p>
<p>2行目の<code>NaN</code>（Not-a-Number：数値になれなかった計算結果）にも注目してください。Promiseオブジェクトに<code>* 1.1</code>という数値演算をすると、数値変換に失敗してNaNになります。<strong>[object Promise]とNaNはセットで現れることが多い</strong>症状です。</p>
<p>取り出し方は2通りあります。</p>
<pre><code>// 方法1: async関数の中でawait（今回の修正）
const total = await getTotal(); // 350

// 方法2: thenで受け取る
getTotal().then(function (total) { ... });</code></pre>
<p>トップレベル（関数の外）では素朴にawaitが書けないため、この教材ではasyncのmain関数で包んでからawaitしています。</p>
<table>
<tr><th>async関数のreturn</th><th>呼び出し側に届くもの</th></tr>
<tr><td><code>return 350;</code></td><td>350を包んだPromise</td></tr>
<tr><td><code>return Promise.resolve(350);</code></td><td>同じく350を包んだPromise（二重には包まれない）</td></tr>
</table>
<p>「asyncと書いた関数の戻り値は、呼ぶ側で必ずawait（またはthen）する」。これを機械的な習慣にしましょう。</p>`,
      task: `async関数<code>main</code>の中で<code>await getTotal()</code>を使う形に修正して、「合計: 350」と「税込: 385」が表示されるようにしましょう。`,
      code: `async function getTotal() {
  return 100 + 250;
}

// async関数の戻り値は「値」ではなく「値を包んだPromise」
const total = getTotal();
console.log("合計: " + total);
console.log("税込: " + total * 1.1);`,
      solution: `async function getTotal() {
  return 100 + 250;
}

async function main() {
  // awaitでPromiseから中の値を取り出す
  const total = await getTotal();
  console.log("合計: " + total);
  console.log("税込: " + Math.round(total * 1.1));
}

main();`,
      hints: [`asyncと付けた関数は、return 350と書いても「350を包んだPromise」を返します。NaNはPromiseに掛け算をした結果です。`, `async function main() { const total = await getTotal(); ... } main(); の形にして、税込はMath.round(total * 1.1)で計算しましょう。`],
      expectedOutput: "税込: 385"
    },
    {
      id: 236,
      title: "try/catchが非同期エラーを捕まえない（awaitなし）",
      explanation: `<p>try/catchで守っているつもりなのに、実行するとこうなります。</p>
<pre><code>設定を読み込みました
Error: 設定ファイルが見つかりません
    at Timeout._onTimeout (main.js:4:14)

Node.js v20.5.0</code></pre>
<p>おかしな点が2つあります。（1）失敗するはずなのに「設定を読み込みました」と成功メッセージが出ている。（2）catchがあるのにプロセスが異常終了している（ステップ232と同じ未処理リジェクションです）。</p>
<p>原因は<code>readConfig()</code>に<code>await</code>がないことです。try/catchが捕まえられるのは、<strong>tryブロックを実行している最中に投げられたエラーだけ</strong>です。awaitなしの<code>readConfig()</code>は「Promiseを作って即座に次の行へ進む」ため、tryブロックは何事もなく終了します。エラー（reject）が発生するのは10ミリ秒後、tryブロックを抜けた後なので、catchには届きません。</p>
<p><code>await</code>を付けると状況が一変します。<strong>awaitは、Promiseのrejectを「その場で投げられたエラー（throw）」に変換してくれる</strong>ので、通常のtry/catchで受け止められるようになります。</p>
<pre><code>try {
  await readConfig(); // rejectがthrowに変換される
  console.log("設定を読み込みました"); // 失敗時はここに到達しない
} catch (err) {
  console.log("読み込み失敗: " + err.message);
}</code></pre>
<p>まとめると、<strong>try/catchで非同期エラーを捕まえたいなら、必ずawaitとセットにする</strong>。「tryの中にPromiseを返す呼び出しがあるのにawaitがない」コードは、レビューで真っ先に指摘されるパターンです。</p>`,
      task: `<code>await</code>を追加して、クラッシュせずに「読み込み失敗: 設定ファイルが見つかりません」と表示されるように修正しましょう。`,
      code: `function readConfig() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("設定ファイルが見つかりません"));
    }, 10);
  });
}

async function main() {
  try {
    readConfig(); // awaitがないので、失敗してもcatchに入らない
    console.log("設定を読み込みました");
  } catch (err) {
    console.log("読み込み失敗: " + err.message);
  }
}

main();`,
      solution: `function readConfig() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("設定ファイルが見つかりません"));
    }, 10);
  });
}

async function main() {
  try {
    // awaitすると、rejectがthrowと同じようにcatchへ飛ぶ
    await readConfig();
    console.log("設定を読み込みました");
  } catch (err) {
    console.log("読み込み失敗: " + err.message);
  }
}

main();`,
      hints: [`try/catchは「tryブロック実行中に投げられたエラー」しか捕まえられません。awaitのないPromiseの失敗は、tryを抜けた後に起きます。`, `readConfig()の前にawaitを付けるだけで、rejectがcatchに届くようになります。`],
      expectedOutput: "読み込み失敗: 設定ファイルが見つかりません"
    },
    {
      id: 237,
      title: "setTimeout(0)は「すぐ」ではない（実行順の誤解）",
      explanation: `<p>0ミリ秒指定なら即実行されるはず、と思って書いたコードの実行結果です。</p>
<pre><code>メッセージ: 未設定</code></pre>
<p>代入が実行される前に<code>console.log</code>が動いています。これはバグというよりJavaScriptの実行モデルそのものです。</p>
<p>JavaScriptは「今実行中のコード（同期処理）を最後まで実行し切ってから、タイマーなどのコールバックを実行する」という順番で動きます。<code>setTimeout(fn, 0)</code>は「0ミリ秒後に実行」ではなく、<strong>「同期処理がすべて終わった後、できるだけ早く実行してほしい」という予約</strong>です。コールバックはいったんキュー（実行待ちの行列）に並び、今のコードが終わるまで決して割り込みません。</p>
<table>
<tr><th>順番</th><th>実行されるもの</th></tr>
<tr><td>1</td><td>ファイルの同期コード（console.logまで全部）</td></tr>
<tr><td>2</td><td>キューに並んだsetTimeoutのコールバック</td></tr>
</table>
<p>したがって「タイマーの結果を使う処理」を、タイマーの外に同期コードとして書いても絶対に間に合いません。<strong>結果を使う処理はコールバックの中（またはPromise化してawaitした後）に置く</strong>のが正解です。</p>
<pre><code>setTimeout(function () {
  message = "設定済み";
  console.log("メッセージ: " + message); // 結果を使う処理は中に書く
}, 0);
console.log("同期処理はここで終わり"); // こちらが先に表示される</code></pre>
<p>この「同期が全部先、コールバックは後」という感覚は、ステップ233で見たforEachの症状や、次ステップ以降の実行順の理解にも直結します。</p>`,
      task: `メッセージの表示をコールバックの中に移動し、外側には「同期処理はここで終わり」と表示するようにして、最終的に「メッセージ: 設定済み」が表示されるように修正しましょう。`,
      code: `let message = "未設定";

// 0ミリ秒だから「すぐ実行される」と思い込んでいる
setTimeout(function () {
  message = "設定済み";
}, 0);

console.log("メッセージ: " + message);`,
      solution: `let message = "未設定";

setTimeout(function () {
  message = "設定済み";
  // タイマーの結果を使う処理は、コールバックの中（またはそれ以降）に書く
  console.log("メッセージ: " + message);
}, 0);

console.log("同期処理はここで終わり");`,
      hints: [`setTimeout(fn, 0)のコールバックは、今動いている同期コードがすべて終わるまで実行されません。`, `console.log("メッセージ: " + message) をコールバックの中（代入の直後）に移動しましょう。`],
      expectedOutput: "メッセージ: 設定済み"
    },
    {
      id: 238,
      title: "Promise.allは1つの失敗で全滅する（allSettledとの使い分け）",
      explanation: `<p>3件中2件は成功しているのに、実行結果はこうなります。</p>
<pre><code>Error: Bの取得に失敗
    at Timeout._onTimeout (main.js:7:16)

Node.js v20.5.0</code></pre>
<p>成功したAとCの結果まで受け取れずに、未処理リジェクションでプロセスが落ちました。これは<code>Promise.all</code>の仕様です。<code>Promise.all</code>は<strong>fail-fast（1つでも失敗したら、全体を即座に失敗として扱う）</strong>で、どれか1つがrejectされた瞬間に全体がrejectされます。</p>
<p>「全部成功しなければ意味がない」処理ならこの挙動が正解です。しかし「成功した分だけでも結果がほしい」場面では<code>Promise.allSettled</code>を使います。allSettledは<strong>絶対にrejectされず</strong>、全件の決着を待って、1件ずつ次の形の結果オブジェクトを返します。</p>
<pre><code>// 成功: { status: "fulfilled", value: 結果 }
// 失敗: { status: "rejected", reason: エラー }
for (const r of results) {
  if (r.status === "fulfilled") {
    console.log("成功: " + r.value);
  } else {
    console.log("失敗: " + r.reason.message);
  }
}</code></pre>
<table>
<tr><th>メソッド</th><th>1件失敗すると</th><th>向いている場面</th></tr>
<tr><td><code>Promise.all</code></td><td>全体が即failする</td><td>全件そろわないと進めない処理</td></tr>
<tr><td><code>Promise.allSettled</code></td><td>失敗も1件の結果として返る</td><td>成功分だけでも使いたい処理</td></tr>
</table>
<p>結果の配列は渡した順序のままなので、どの要素が失敗したかも確実に特定できます。「allで全滅してよいか？」を自問するのが、並行処理設計のチェックポイントです。</p>`,
      task: `<code>Promise.all</code>を<code>Promise.allSettled</code>に変え、結果を1件ずつ「成功: …」「失敗: …」の形式で表示するように修正しましょう。`,
      code: `function download(name, ok) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (ok) {
        resolve(name + "を取得");
      } else {
        reject(new Error(name + "の取得に失敗"));
      }
    }, 10);
  });
}

async function main() {
  // Bが1つ失敗しただけで、成功したAとCの結果も受け取れなくなる
  const results = await Promise.all([
    download("A", true),
    download("B", false),
    download("C", true)
  ]);
  console.log(results.join(" / "));
}

main();`,
      solution: `function download(name, ok) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (ok) {
        resolve(name + "を取得");
      } else {
        reject(new Error(name + "の取得に失敗"));
      }
    }, 10);
  });
}

async function main() {
  // allSettledは成功も失敗も1件ずつ結果オブジェクトにして返す
  const results = await Promise.allSettled([
    download("A", true),
    download("B", false),
    download("C", true)
  ]);
  for (const r of results) {
    if (r.status === "fulfilled") {
      console.log("成功: " + r.value);
    } else {
      console.log("失敗: " + r.reason.message);
    }
  }
}

main();`,
      hints: [`Promise.allは1つでも失敗すると全体が失敗します。成功分も欲しいときはPromise.allSettledを使います。`, `allSettledの各結果はstatusプロパティが"fulfilled"か"rejected"で、値はr.value、エラーはr.reason.messageで取り出せます。`],
      expectedOutput: "成功: Cを取得"
    },
    {
      id: 239,
      title: "ループ×setTimeoutの順序バグ（varとクロージャ再び）",
      explanation: `<p>1番目、2番目、3番目と表示したいのに、実行結果はこうなります。</p>
<pre><code>4番目の処理
4番目の処理
4番目の処理</code></pre>
<p>ステップ228で見た「varのループ変数とクロージャの罠」が、非同期と組み合わさるとさらに気づきにくくなる、という実例です。</p>
<p>時系列で追いましょう。（1）ループは同期処理なので一瞬で3周回り終わり、3つのタイマーを予約した時点で<code>i</code>は4になっています。（2）ステップ237で学んだ通り、コールバックが動くのは同期処理が終わった後です。（3）3つのコールバックは同じ変数<code>i</code>（varなので1つだけ）を参照しているため、全員が「今のiの値=4」を表示します。</p>
<table>
<tr><th>時点</th><th>起きること</th><th>iの値</th></tr>
<tr><td>ループ実行中</td><td>タイマーを3つ予約するだけ</td><td>1→2→3→4</td></tr>
<tr><td>10〜30ms後</td><td>コールバックが順に実行される</td><td>すでに4</td></tr>
</table>
<p>修正はステップ228と同じく<code>let</code>にするだけです。<code>let</code>のループ変数は1周ごとに新しく作られるため、各コールバックは「自分の周のi」を覚えたクロージャになります。</p>
<pre><code>for (let i = 1; i &lt;= 3; i++) {
  setTimeout(function () {
    console.log(i + "番目の処理"); // 1、2、3がそれぞれ表示される
  }, i * 10);
}</code></pre>
<p>「非同期コールバックがループ変数を参照するときは、宣言がletであることを確認する」。古いコードのvarを見つけたときの重要チェック項目です。</p>`,
      task: `ループ変数の宣言を修正して、「1番目の処理」「2番目の処理」「3番目の処理」と順に表示されるようにしましょう。`,
      code: `// 「1番目の処理」「2番目の処理」「3番目の処理」と表示したい
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i + "番目の処理");
  }, i * 10);
}`,
      solution: `// letならループの1周ごとに新しいiが作られ、各コールバックが自分のiを覚える
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i + "番目の処理");
  }, i * 10);
}`,
      hints: [`ループはタイマーを予約するだけで一瞬で終わり、コールバックが動く頃にはvarのiは4になっています。`, `for (var i = 1; ...) を for (let i = 1; ...) に変えれば、各コールバックが自分の周のiを覚えます。`],
      expectedOutput: "3番目の処理"
    },
    {
      id: 240,
      title: "総合演習：非同期のバグを3つ直す",
      explanation: `<p>この章の総合演習です。商品価格を取得するプログラムに、この章で学んだバグが3つ仕込まれています。実行結果はこうなります。</p>
<pre><code>取得件数: 0
すべての処理が完了しました
Error: bananaは取り扱いがありません
    at Timeout._onTimeout (main.js:6:16)

Node.js v20.5.0</code></pre>
<p>症状を1つずつ切り分けましょう。</p>
<p><strong>症状1：取得件数が0。</strong>2件取得したはずの配列が空です。<code>forEach(async ...)</code>はawaitを待ってくれないため、件数を数える行が先に実行されています（ステップ233）。<code>for...of</code>+<code>await</code>に書き換えます。</p>
<p><strong>症状2：完了メッセージの後にエラーが出てプロセスが落ちる。</strong>try/catchの中にあるのにcatchされていません。<code>fetchPrice("banana")</code>に<code>await</code>がないため、rejectはtryブロックを抜けた後に発生し、未処理リジェクションになっています（ステップ236・232）。<code>await</code>を付ければcatchに届きます。</p>
<p><strong>症状3：出力の順序がおかしい。</strong>「すべての処理が完了しました」が実際の完了より前に出ています。症状1・2を直すと、awaitが処理の進行を正しく堰き止めるため、順序も自然に直ります。</p>
<table>
<tr><th>症状</th><th>原因</th><th>復習ステップ</th></tr>
<tr><td>取得件数: 0</td><td>forEach内のawaitは待たれない</td><td>233</td></tr>
<tr><td>catchされず異常終了</td><td>awaitなしのrejectはtry/catchに届かない</td><td>236・232</td></tr>
<tr><td>完了報告が先に出る</td><td>非同期の完了を待たずに後続が実行される</td><td>231・237</td></tr>
</table>
<p>非同期デバッグの鉄則は「<strong>出力の順序が期待と違ったら、待つべき場所で待てていない</strong>」。awaitの位置を疑うことから始めましょう。</p>`,
      task: `3つのバグをすべて修正して、価格2件の表示→「取得件数: 2」→「エラー: bananaは取り扱いがありません」→「すべての処理が完了しました」の順に表示されるようにしましょう。`,
      code: `// 商品の価格を順番に取得するプログラム。3つのバグがある
function fetchPrice(item) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (item === "banana") {
        reject(new Error("bananaは取り扱いがありません"));
      } else {
        resolve(item + ": 100円");
      }
    }, 10);
  });
}

async function main() {
  const items = ["apple", "orange"];
  const prices = [];

  // バグ1: forEachの中のawaitは待ってもらえない
  items.forEach(async function (item) {
    const p = await fetchPrice(item);
    prices.push(p);
  });
  // バグ2: 取得を待っていないので、この時点で配列は空のまま
  console.log("取得件数: " + prices.length);

  try {
    // バグ3: awaitがないのでtry/catchで捕まえられず、プログラムが落ちる
    fetchPrice("banana");
  } catch (err) {
    console.log("エラー: " + err.message);
  }

  console.log("すべての処理が完了しました");
}

main();`,
      solution: `function fetchPrice(item) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (item === "banana") {
        reject(new Error("bananaは取り扱いがありません"));
      } else {
        resolve(item + ": 100円");
      }
    }, 10);
  });
}

async function main() {
  const items = ["apple", "orange"];
  const prices = [];

  // 修正1: for...ofに変えて、1件ずつawaitで待つ
  for (const item of items) {
    const p = await fetchPrice(item);
    prices.push(p);
    console.log(p);
  }
  // 修正2: 全件の取得が終わってから件数を数える
  console.log("取得件数: " + prices.length);

  try {
    // 修正3: awaitを付ければ、rejectをcatchで受け取れる
    await fetchPrice("banana");
  } catch (err) {
    console.log("エラー: " + err.message);
  }

  console.log("すべての処理が完了しました");
}

main();`,
      hints: [`「取得件数: 0」はforEach+awaitの症状です。for...ofに書き換えて1件ずつ待ちましょう（ステップ233）。`, `完了メッセージの後に出るエラーは、awaitなしのfetchPrice("banana")がtry/catchをすり抜けている症状です（ステップ236）。`, `for (const item of items) { ... } への書き換えと、try内の呼び出しへのawait追加の2箇所を直せば、出力順序も正しくなります。`],
      expectedOutput: "取得件数: 2"
    }
  ]
});
