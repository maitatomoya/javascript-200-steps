// 第14章：async/await
registerChapter({
  number: 14,
  title: "async/await",
  description: "Promiseを同期処理のような見た目で書けるasync/await構文と、実務で使う並列化・タイムアウト・リトライのパターンを学びます。",
  steps: [
    {
      id: 131,
      title: "async関数はPromiseを返す",
      explanation: `<p>第13章でPromiseを学びましたが、<code>then</code>のチェーンもコールバック関数の連続であることに変わりはありません。そこでES2017で導入されたのが<strong>async/await</strong>構文です。まずは<code>async</code>から見ていきます。</p>
<p>関数の前に<code>async</code>キーワードを付けると、その関数は<strong>必ずPromiseを返す関数</strong>になります。</p>
<pre><code>async function greet() {
  return "こんにちは";
}

// 戻り値は文字列ではなく「"こんにちは"で成功するPromise」
greet().then(function (message) {
  console.log(message); // こんにちは
});</code></pre>
<table>
<tr><th>async関数の中身</th><th>呼び出し側から見た戻り値</th></tr>
<tr><td>return 値</td><td>その値で成功（fulfilled）するPromise</td></tr>
<tr><td>throw エラー</td><td>そのエラーで失敗（rejected）するPromise</td></tr>
</table>
<p>つまり<code>async</code>関数は「戻り値を自動でPromiseに包んでくれる関数」です。<code>new Promise</code>を自分で書かなくても、<code>return</code>と<code>throw</code>だけでPromiseの成功・失敗を表現できます。</p>
<p>初期コードは、普通の関数の戻り値（文字列）に対して<code>.then</code>を呼んでいるため<code>TypeError</code>になります。まず実行してエラーメッセージを読み、<code>async</code>を付けて直してみましょう。「エラーを読んで原因を特定する」のは第12章で学んだ大切な習慣です。</p>`,
      task: `まず初期コードを実行して<code>TypeError</code>を確認し、<code>greet</code>を<code>async</code>関数に変えて「結果: こんにちは」と表示されるように修正しましょう。`,
      code: `// TODO: greetをasync関数にする（このままだと戻り値が文字列なのでthenが無くTypeErrorになる）
function greet() {
  return "こんにちは";
}

console.log("Promiseですか: " + (greet() instanceof Promise));

greet().then(function (message) {
  console.log("結果: " + message);
});`,
      solution: `// asyncを付けると、戻り値が自動的にPromiseに包まれる
async function greet() {
  return "こんにちは";
}

console.log("Promiseですか: " + (greet() instanceof Promise));

greet().then(function (message) {
  console.log("結果: " + message);
});`,
      hints: [
        `functionキーワードの前にasyncを付けるだけで、その関数の戻り値はPromiseになります。`,
        `async function greet() { ... } と書き換えると、greet()の戻り値に.thenが使えるようになります。`
      ],
      expectedOutput: "結果: こんにちは"
    },
    {
      id: 132,
      title: "awaitの基本",
      explanation: `<p><code>async</code>と対になるのが<code>await</code>キーワードです。<code>await Promise</code>と書くと、<strong>そのPromiseが決着するまで関数の実行を一時停止し、成功時の値を取り出して</strong>くれます。</p>
<pre><code>async function main() {
  const result = await fetchData(); // 完了を待って値を取り出す
  console.log(result);              // その後にこの行が実行される
}</code></pre>
<p>then方式と比べると違いは一目瞭然です。</p>
<table>
<tr><th>方式</th><th>書き方</th></tr>
<tr><td>then</td><td>fetchData().then(function (result) { console.log(result); });</td></tr>
<tr><td>await</td><td>const result = await fetchData(); console.log(result);</td></tr>
</table>
<p><code>await</code>を使うと、非同期処理を<strong>同期処理と同じ見た目</strong>で上から下へ書けます。コールバックも<code>then</code>のネストも不要です。ただし重要なルールがあります。</p>
<ul>
<li><code>await</code>は原則<strong>async関数の中でしか使えない</strong>（トップレベルで使える環境もありますが、この教材ではasync関数の中で使う形に統一します）</li>
<li>「停止」するのはそのasync関数の中だけで、プログラム全体が止まるわけではありません</li>
<li><code>await</code>を忘れると、変数には値ではなく<strong>Promiseそのもの</strong>が入ります（実務で頻出のバグです）</li>
</ul>
<p>今回は<code>delay</code>関数の結果を<code>await</code>で受け取ってみましょう。処理が「取得開始→（20ms待つ）→結果表示→次の処理」と、書いた順番どおりに流れる感覚をつかんでください。</p>`,
      task: `<code>main</code>関数の中で<code>delay(20, "データ取得完了")</code>の結果を<code>await</code>で受け取り、「取得開始」と「取得後の処理」の間に表示されるようにしましょう。`,
      code: `function delay(ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

async function main() {
  console.log("取得開始");
  // TODO: delay(20, "データ取得完了")の結果をawaitで受け取り、そのまま表示する
  console.log("取得後の処理");
}

main();`,
      solution: `function delay(ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

async function main() {
  console.log("取得開始");
  // awaitがPromiseの完了を待ち、成功時の値を取り出してくれる
  const message = await delay(20, "データ取得完了");
  console.log(message);
  console.log("取得後の処理");
}

main();`,
      hints: [
        `awaitをPromiseの前に置くと、完了を待ってから成功時の値がそのまま手に入ります。`,
        `const message = await delay(20, "データ取得完了"); と書いてからconsole.log(message);します。`
      ],
      expectedOutput: "取得後の処理"
    },
    {
      id: 133,
      title: "逐次実行と並列実行",
      explanation: `<p><code>await</code>は便利ですが、<strong>置き方によって実行時間が大きく変わる</strong>ことを知っておく必要があります。</p>
<pre><code>// 逐次実行：Aが終わってからBを開始する（合計約60ms）
const a = await delay(30, "A");
const b = await delay(30, "B");

// 並列実行：AとBを同時に開始して、両方の完了を待つ（合計約30ms）
const results = await Promise.all([delay(30, "A"), delay(30, "B")]);</code></pre>
<p>違いが生まれる理由を整理しましょう。</p>
<ul>
<li><strong>逐次</strong>：1つ目の<code>await</code>で30ms停止し、終わってから2つ目の<code>delay</code>を呼ぶので、待ち時間が足し算される</li>
<li><strong>並列</strong>：<code>delay</code>を2つとも先に呼んでタイマーを同時にスタートさせ、<code>Promise.all</code>でまとめて待つので、待ち時間は最長の1つ分で済む</li>
</ul>
<p>使い分けの基準はシンプルです。</p>
<table>
<tr><th>状況</th><th>選ぶ書き方</th></tr>
<tr><td>後の処理が前の結果を必要とする</td><td>逐次（awaitを1つずつ）</td></tr>
<tr><td>互いに無関係な処理</td><td>並列（Promise.all）</td></tr>
</table>
<p>「関係ないAPI呼び出しを逐次でawaitしてページ表示が遅い」というのは、コードレビューで最も指摘される非同期のアンチパターンの1つです。今回は<code>Date.now()</code>（現在時刻をミリ秒で返す関数）で両方の所要時間を計測し、並列の方が速いことを自分の目で確かめましょう。</p>`,
      task: `並列実行のパートを完成させましょう。<code>Promise.all</code>で2つの<code>delay(30, ...)</code>を同時に実行し、「並列の方が速い: true」と表示されるようにします。`,
      code: `function delay(ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

async function main() {
  // 逐次実行：1つ終わるのを待ってから次を開始する
  const t1 = Date.now();
  const a = await delay(30, "A");
  const b = await delay(30, "B");
  const sequentialTime = Date.now() - t1;
  console.log("逐次: " + a + b);

  // TODO: Promise.allでdelay(30, "A")とdelay(30, "B")を並列実行し、
  // resultsに結果の配列、parallelTimeに所要時間を入れる
  const t2 = Date.now();
  const results = ["A", "B"]; // ここを書き換える
  const parallelTime = 9999; // ここを書き換える

  console.log("並列: " + results.join(""));
  console.log("並列の方が速い: " + (parallelTime < sequentialTime));
}

main();`,
      solution: `function delay(ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

async function main() {
  // 逐次実行：1つ終わるのを待ってから次を開始する
  const t1 = Date.now();
  const a = await delay(30, "A");
  const b = await delay(30, "B");
  const sequentialTime = Date.now() - t1;
  console.log("逐次: " + a + b);

  // 並列実行：2つのタイマーを同時に動かし、まとめて完了を待つ
  const t2 = Date.now();
  const results = await Promise.all([delay(30, "A"), delay(30, "B")]);
  const parallelTime = Date.now() - t2;

  console.log("並列: " + results.join(""));
  console.log("並列の方が速い: " + (parallelTime < sequentialTime));
}

main();`,
      hints: [
        `Promise.allにPromiseの配列を渡し、その結果をawaitで受け取ると並列実行になります。`,
        `const results = await Promise.all([delay(30, "A"), delay(30, "B")]); と書き、parallelTimeはDate.now() - t2で計算します。`
      ],
      expectedOutput: "並列の方が速い: true"
    },
    {
      id: 134,
      title: "try...catchでの非同期エラー処理",
      explanation: `<p>async/awaitのもう1つの利点は、エラー処理に第12章で学んだ<strong>try...catch</strong>がそのまま使えることです。<code>await</code>したPromiseが失敗（rejected）すると、その場所で<strong>例外がthrowされたのと同じ</strong>扱いになります。</p>
<pre><code>async function main() {
  try {
    const data = await fetchData(); // 失敗するとcatchへ飛ぶ
    console.log(data);
  } catch (error) {
    console.log("エラー: " + error.message);
  } finally {
    console.log("必ず実行される");
  }
}</code></pre>
<p>then/catch方式との対応関係は次の通りです。</p>
<table>
<tr><th>Promiseチェーン</th><th>async/await</th></tr>
<tr><td>.then(function (v) { ... })</td><td>const v = await ...;</td></tr>
<tr><td>.catch(function (e) { ... })</td><td>try...catchのcatchブロック</td></tr>
<tr><td>.finally(function () { ... })</td><td>finallyブロック</td></tr>
</table>
<p>ポイントを押さえましょう。</p>
<ul>
<li><code>try</code>ブロック内でエラーが起きると、それ以降の行はスキップされて<code>catch</code>へ飛ぶ</li>
<li><code>finally</code>は成功でも失敗でも必ず実行される（接続のクローズやローディング表示の解除などに使う）</li>
<li><code>await</code>に<code>try...catch</code>を付け忘れて失敗すると、ステップ126と同じunhandled rejectionになる</li>
</ul>
<p>同期のエラーも非同期のエラーも同じ<code>try...catch</code>で書ける統一感が、async/awaitが広く使われる大きな理由です。初期コードはcatchが無いためエラー終了します。まず実行して確認し、<code>try...catch...finally</code>で囲んで修正しましょう。</p>`,
      task: `<code>main</code>の中身を<code>try...catch...finally</code>で囲み、エラー時に「エラー捕捉: 通信に失敗しました」、最後に必ず「後片付け完了」と表示されるようにしましょう。`,
      code: `function fetchData(shouldFail) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (shouldFail) {
        reject(new Error("通信に失敗しました"));
      } else {
        resolve("データ本体");
      }
    }, 10);
  });
}

async function main() {
  // TODO: try...catch...finallyで囲む。
  // catchでは「エラー捕捉: メッセージ」、finallyでは「後片付け完了」と表示する
  const data = await fetchData(false);
  console.log("成功: " + data);
  await fetchData(true);
  console.log("ここは実行されない");
}

main();`,
      solution: `function fetchData(shouldFail) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (shouldFail) {
        reject(new Error("通信に失敗しました"));
      } else {
        resolve("データ本体");
      }
    }, 10);
  });
}

async function main() {
  try {
    const data = await fetchData(false);
    console.log("成功: " + data);
    // awaitしたPromiseが失敗すると、その場で例外が投げられcatchへ飛ぶ
    await fetchData(true);
    console.log("ここは実行されない");
  } catch (error) {
    console.log("エラー捕捉: " + error.message);
  } finally {
    // 成功でも失敗でも必ず実行される
    console.log("後片付け完了");
  }
}

main();`,
      hints: [
        `awaitしたPromiseの失敗は、同期処理のthrowと同じようにtry...catchで捕まえられます。`,
        `try { 4行の処理 } catch (error) { console.log("エラー捕捉: " + error.message); } finally { console.log("後片付け完了"); } の形にします。`
      ],
      expectedOutput: "後片付け完了"
    },
    {
      id: 135,
      title: "非同期関数の連鎖",
      explanation: `<p>実務の非同期処理で最も多いのは「<strong>前の結果を使って次を取得する</strong>」パターンです。たとえばSNSアプリなら、①ユーザーIDからユーザー情報を取得し、②そのユーザーの投稿一覧を取得する、という2段階の流れになります。</p>
<p>第13章のステップ130ではこれをPromiseチェーンで書きましたが、async/awaitなら劇的にシンプルになります。</p>
<pre><code>// Promiseチェーン版（ステップ130）
fetchUser(1)
  .then(function (user) {
    return fetchPosts(user.id);
  })
  .then(function (posts) {
    console.log(posts.length);
  });

// async/await版
async function show() {
  const user = await fetchUser(1);
  const posts = await fetchPosts(user.id);
  console.log(posts.length);
}</code></pre>
<p>async/await版の読みやすさに注目してください。</p>
<ul>
<li>「ユーザーを取得→その結果で投稿を取得」という<strong>依存関係が変数の流れとして見える</strong></li>
<li><code>user</code>も<code>posts</code>も普通の変数なので、間にif文やログを自由に挟める</li>
<li>コールバックの引数名やreturnの書き忘れを気にする必要がない</li>
</ul>
<p>このように<strong>後の処理が前の結果に依存する場合は、awaitを順番に並べる逐次実行が正解</strong>です（ステップ133の使い分け基準の「逐次」側です）。<code>fetchPosts</code>は<code>user.id</code>が無いと呼べないので、並列化はそもそもできません。今回はユーザー取得→投稿取得の2段階フローを自分で書いてみましょう。</p>`,
      task: `<code>showUserPosts</code>を完成させましょう。ユーザーを取得して「名前さんの投稿を取得中」と表示し、続けて投稿一覧を取得して「投稿数: 2件」と「最新の投稿: 今日はいい天気」を表示します。`,
      code: `function fetchUser(id) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({ id: id, name: "みどり" });
    }, 20);
  });
}

function fetchPosts(userId) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(["今日はいい天気", "JavaScriptの勉強中"]);
    }, 20);
  });
}

async function showUserPosts(userId) {
  // TODO 1: fetchUser(userId)をawaitしてuserに入れ、「みどりさんの投稿を取得中」と表示する
  // TODO 2: fetchPosts(user.id)をawaitしてpostsに入れる
  // TODO 3: 「投稿数: 2件」と「最新の投稿: 今日はいい天気」を表示する
}

showUserPosts(1);`,
      solution: `function fetchUser(id) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({ id: id, name: "みどり" });
    }, 20);
  });
}

function fetchPosts(userId) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(["今日はいい天気", "JavaScriptの勉強中"]);
    }, 20);
  });
}

async function showUserPosts(userId) {
  // 前の結果（user.id）を次の取得に使うので、awaitを順番に並べる
  const user = await fetchUser(userId);
  console.log(user.name + "さんの投稿を取得中");
  const posts = await fetchPosts(user.id);
  console.log("投稿数: " + posts.length + "件");
  console.log("最新の投稿: " + posts[0]);
}

showUserPosts(1);`,
      hints: [
        `const user = await fetchUser(userId); のように、awaitの結果は普通の変数として受け取れます。`,
        `2回目の取得はconst posts = await fetchPosts(user.id);です。userを取得した後でないとuser.idは使えません。`,
        `投稿数はposts.length、最新の投稿はposts[0]で取り出します。`
      ],
      expectedOutput: "最新の投稿: 今日はいい天気"
    },
    {
      id: 136,
      title: "forループとawait",
      explanation: `<p>複数のデータを<strong>1件ずつ順番に</strong>非同期処理したいときは、<code>for...of</code>ループの中で<code>await</code>を使います。</p>
<pre><code>async function main() {
  for (const item of items) {
    const result = await process(item); // 1件終わるまで次に進まない
    console.log(result);
  }
}</code></pre>
<p>ループの各周回で<code>await</code>が完了を待つため、「1件目が終わってから2件目」という逐次処理になります。結果の順序が保証され、サーバーに同時に大量のリクエストを送らずに済むのが利点です。</p>
<p>ここで実務上とても重要な注意があります。<strong><code>forEach</code>の中でawaitは使えません</strong>。</p>
<pre><code>// 間違い例：これは期待どおりに動かない
items.forEach(async function (item) {
  await process(item); // 待ってくれない！
});
console.log("完了"); // 処理が終わる前に表示されてしまう</code></pre>
<p><code>forEach</code>はコールバックが返すPromiseを完全に無視するため、全体の完了を待つ手段がありません。各コールバックが一斉に走り出し、ループの外の処理が先に実行されてしまいます。</p>
<table>
<tr><th>書き方</th><th>動き</th><th>使いどころ</th></tr>
<tr><td>for...of + await</td><td>1件ずつ順番に待つ</td><td>順序が大事、負荷を抑えたい</td></tr>
<tr><td>forEach + await</td><td>待たない（バグの元）</td><td>使わない</td></tr>
</table>
<p>「非同期処理のループはfor...of」と覚えてください。全件を並列で処理したい場合の正しい書き方は、次のステップで学びます。</p>`,
      task: `<code>for...of</code>で<code>files</code>を1件ずつ処理しましょう。各ファイルについて<code>processFile</code>の結果を<code>await</code>で受け取って表示し、最後に「全ファイル処理完了」と表示します。`,
      code: `const files = ["設計書", "議事録", "報告書"];

function processFile(name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(name + "を処理しました");
    }, 10);
  });
}

async function main() {
  // TODO: for...ofでfilesを順番に処理し、processFileの結果をそれぞれ表示する
  console.log("全ファイル処理完了");
}

main();`,
      solution: `const files = ["設計書", "議事録", "報告書"];

function processFile(name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(name + "を処理しました");
    }, 10);
  });
}

async function main() {
  // for...ofの中のawaitは「1件終わるまで次の周回に進まない」逐次処理になる
  for (const file of files) {
    const result = await processFile(file);
    console.log(result);
  }
  console.log("全ファイル処理完了");
}

main();`,
      hints: [
        `for (const file of files) { ... } の形でループし、ループ本体でawaitを使います。`,
        `ループの中はconst result = await processFile(file); console.log(result); の2行です。`
      ],
      expectedOutput: "全ファイル処理完了"
    },
    {
      id: 137,
      title: "mapとPromise.allでの並列処理",
      explanation: `<p>前のステップの逐次ループは安全ですが、10ms×3件で約30msかかります。互いに無関係な処理なら<strong>並列化</strong>して約10msに短縮できます。その定番パターンが<strong>map + Promise.all</strong>です。</p>
<pre><code>async function main() {
  // 1. mapで「Promiseの配列」を作る（この時点で全件が動き出す）
  const promises = ids.map(function (id) {
    return fetchScore(id);
  });
  // 2. Promise.allで全件の完了をまとめて待つ
  const scores = await Promise.all(promises);
}</code></pre>
<p>仕組みを分解して理解しましょう。</p>
<ol>
<li><code>map</code>のコールバックはasync処理を<code>await</code>せず、<strong>Promiseをそのままreturn</strong>する。結果は「Promiseの配列」になる</li>
<li><code>map</code>が一周した時点で、全件の非同期処理が同時にスタートしている</li>
<li><code>await Promise.all(...)</code>が全件の完了を待ち、結果の配列を返す（順序は元の配列と同じ）</li>
</ol>
<table>
<tr><th>パターン</th><th>所要時間（10ms×3件）</th><th>向いている場面</th></tr>
<tr><td>for...of + await（逐次）</td><td>約30ms</td><td>順序や負荷制御が必要</td></tr>
<tr><td>map + Promise.all（並列）</td><td>約10ms</td><td>互いに独立した処理</td></tr>
</table>
<p>この2つはNode.jsの実務コードに毎日のように登場する二大パターンです。「依存があるなら逐次、独立なら並列」という判断基準とセットで、手が勝手に動くまで練習しておく価値があります。取得後の<code>scores</code>はただの数値配列なので、第8章で学んだ<code>reduce</code>で合計するのも今まで通りです。</p>`,
      task: `<code>ids.map</code>で<code>fetchScore</code>のPromiseの配列を作り、<code>Promise.all</code>を<code>await</code>して全スコアを取得しましょう。「スコア一覧: 10, 20, 30」と「合計: 60」が表示されれば成功です。`,
      code: `const ids = [1, 2, 3];

function fetchScore(id) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(id * 10);
    }, 10);
  });
}

async function main() {
  // TODO: ids.mapでPromiseの配列を作り、Promise.allをawaitしてscoresに入れる
  const scores = []; // ここを書き換える

  console.log("スコア一覧: " + scores.join(", "));
  const total = scores.reduce(function (sum, score) {
    return sum + score;
  }, 0);
  console.log("合計: " + total);
}

main();`,
      solution: `const ids = [1, 2, 3];

function fetchScore(id) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(id * 10);
    }, 10);
  });
}

async function main() {
  // mapでPromiseの配列を作った時点で、3件の取得が同時に動き出す
  const promises = ids.map(function (id) {
    return fetchScore(id);
  });
  const scores = await Promise.all(promises);

  console.log("スコア一覧: " + scores.join(", "));
  const total = scores.reduce(function (sum, score) {
    return sum + score;
  }, 0);
  console.log("合計: " + total);
}

main();`,
      hints: [
        `mapのコールバックではawaitせず、fetchScore(id)が返すPromiseをそのままreturnします。`,
        `const promises = ids.map(function (id) { return fetchScore(id); }); で配列を作り、const scores = await Promise.all(promises); で結果を受け取ります。`
      ],
      expectedOutput: "合計: 60"
    },
    {
      id: 138,
      title: "タイムアウト処理の実装",
      explanation: `<p>実務の通信処理では「いつまでも応答を待ち続けない」ことが重要です。応答が遅いサーバーを延々と待つと、ユーザーは固まった画面を見続けることになります。そこで<strong>一定時間で処理を打ち切るタイムアウト</strong>を、ステップ129で学んだ<code>Promise.race</code>で実装します。</p>
<p>発想はシンプルで、「本命の処理」と「時間切れでrejectするだけのPromise」を競争させます。</p>
<pre><code>function timeout(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("タイムアウト"));
    }, ms);
  });
}

const data = await Promise.race([fetchSlow(), timeout(20)]);</code></pre>
<ul>
<li>本命が20msより早く成功すれば、raceは本命の結果で成功する</li>
<li>20ms経っても本命が終わらなければ、<code>timeout</code>のrejectが先に決着し、raceは失敗する</li>
<li>失敗は<code>await</code>の位置で例外になるので、<code>try...catch</code>で受け止められる（ステップ134の知識）</li>
</ul>
<p>1つ補足すると、raceで負けた本命の処理自体はキャンセルされず、裏で最後まで動き続けます。今回のような読み取り処理では実害はありませんが、「raceは結果を無視するだけで処理を止めるわけではない」と知っておくと、いずれAbortController（本格的なキャンセル機構）を学ぶときにスムーズです。</p>
<p>これはステップ127（Promiseを作る）、129（race）、134（try...catch）の合わせ技です。部品の組み合わせで実用的な機能が作れることを体感してください。</p>`,
      task: `<code>timeout</code>関数を完成させましょう。<code>ms</code>ミリ秒後に「タイムアウト: 20ms以内に応答がありません」というエラーで<code>reject</code>するようにし、40msかかる<code>fetchSlow</code>が打ち切られることを確認します。`,
      code: `function delay(ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

function fetchSlow() {
  // 40msかかる遅いAPIを想定
  return delay(40, "やっと取得できたデータ");
}

// TODO: msミリ秒後にreject(new Error("タイムアウト: " + ms + "ms以内に応答がありません"))
// するPromiseを返すように完成させる
function timeout(ms) {
  return new Promise(function (resolve, reject) {
    // ここに処理を書く
  });
}

async function main() {
  try {
    const data = await Promise.race([fetchSlow(), timeout(20)]);
    console.log("取得成功: " + data);
  } catch (error) {
    console.log(error.message);
  }
}

main();`,
      solution: `function delay(ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

function fetchSlow() {
  // 40msかかる遅いAPIを想定
  return delay(40, "やっと取得できたデータ");
}

function timeout(ms) {
  return new Promise(function (resolve, reject) {
    // 時間切れになったら失敗を確定させるだけのPromise
    setTimeout(function () {
      reject(new Error("タイムアウト: " + ms + "ms以内に応答がありません"));
    }, ms);
  });
}

async function main() {
  try {
    // 本命(40ms)とタイムアウト(20ms)を競争させる。今回は20msの方が先に決着する
    const data = await Promise.race([fetchSlow(), timeout(20)]);
    console.log("取得成功: " + data);
  } catch (error) {
    console.log(error.message);
  }
}

main();`,
      hints: [
        `timeoutは「成功することのない、時間切れでrejectするだけのPromise」を返します。ステップ127の書き方を思い出しましょう。`,
        `setTimeout(function () { reject(new Error("タイムアウト: " + ms + "ms以内に応答がありません")); }, ms); をPromiseの中に書きます。`,
        `完成後、timeout(20)をtimeout(50)に変えると「取得成功」側になることも確認してみましょう。`
      ],
      expectedOutput: "タイムアウト: 20ms以内に応答がありません"
    },
    {
      id: 139,
      title: "リトライ処理の実装",
      explanation: `<p>ネットワーク通信は一時的な理由で失敗することがあります。瞬間的な回線の乱れやサーバーの一時的な混雑などです。こうした失敗は<strong>少し待ってやり直せば成功する</strong>ことが多いため、実務では<strong>リトライ（再試行）処理</strong>を実装します。</p>
<p>async/awaitを使うと、リトライは「forループ+try...catch」で素直に書けます。</p>
<pre><code>async function fetchWithRetry(maxRetries) {
  for (let i = 1; i &lt;= maxRetries; i++) {
    try {
      return await unstableFetch(); // 成功したら即return
    } catch (error) {
      if (i === maxRetries) {
        throw error; // 最後の試行でも失敗なら諦めてエラーを投げる
      }
      // それ以外の失敗はログを出して次の周回（リトライ）へ
    }
  }
}</code></pre>
<p>この構造のポイントを整理します。</p>
<ul>
<li><strong>成功したらreturn</strong>：関数を抜けるのでリトライは止まる</li>
<li><strong>失敗したらcatch</strong>：ループの次の周回に進む＝再試行</li>
<li><strong>上限に達したらthrow</strong>：無限にリトライしないための安全弁。async関数のthrowは呼び出し側では「失敗するPromise」になる（ステップ131）</li>
</ul>
<p>Promiseチェーンだけでリトライを書くと再帰が必要になり難読になりがちですが、async/awaitならただのループです。これもawaitの大きな恩恵です。実務ではさらに「リトライの間隔を徐々に延ばす」（指数バックオフと呼びます）改良を加えることも多いですが、まずはこの基本形を確実に書けるようにしましょう。</p>`,
      task: `<code>fetchWithRetry</code>を完成させましょう。成功したら結果を<code>return</code>、失敗したらメッセージを表示してリトライ、<code>maxRetries</code>回失敗したら<code>throw</code>します。3回目で「結果: 3回目で取得成功」と表示されれば成功です。`,
      code: `let attemptCount = 0;

// 3回目の呼び出しで初めて成功する、不安定なAPIの擬似実装
function unstableFetch() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      attemptCount = attemptCount + 1;
      if (attemptCount < 3) {
        reject(new Error("一時的なエラー"));
      } else {
        resolve("3回目で取得成功");
      }
    }, 10);
  });
}

async function fetchWithRetry(maxRetries) {
  for (let i = 1; i <= maxRetries; i++) {
    // TODO 1: tryの中でunstableFetch()をawaitし、成功したらその結果をreturnする
    // TODO 2: catchでは、最後の試行(i === maxRetries)ならエラーをthrowし、
    // そうでなければ「i回目失敗: メッセージ → リトライします」と表示する
  }
}

async function main() {
  const result = await fetchWithRetry(5);
  console.log("結果: " + result);
}

main();`,
      solution: `let attemptCount = 0;

// 3回目の呼び出しで初めて成功する、不安定なAPIの擬似実装
function unstableFetch() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      attemptCount = attemptCount + 1;
      if (attemptCount < 3) {
        reject(new Error("一時的なエラー"));
      } else {
        resolve("3回目で取得成功");
      }
    }, 10);
  });
}

async function fetchWithRetry(maxRetries) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      // 成功したらreturnでループごと抜ける
      const result = await unstableFetch();
      return result;
    } catch (error) {
      if (i === maxRetries) {
        // 上限まで失敗したら諦めてエラーを投げる（無限リトライの防止）
        throw error;
      }
      console.log(i + "回目失敗: " + error.message + " → リトライします");
    }
  }
}

async function main() {
  const result = await fetchWithRetry(5);
  console.log("結果: " + result);
}

main();`,
      hints: [
        `ループの各周回が1回の試行です。try...catchを周回の中に置くと「失敗しても次の周回へ進む」動きになります。`,
        `tryの中はconst result = await unstableFetch(); return result; の2行です。`,
        `catchの中はif (i === maxRetries) { throw error; } を先に書き、その後にリトライのログを表示します。`
      ],
      expectedOutput: "結果: 3回目で取得成功"
    },
    {
      id: 140,
      title: "総合演習：擬似データ取得パイプライン",
      explanation: `<p>第13章と第14章の総まとめとして、実務のバッチ処理やダッシュボード表示でよくある<strong>データ取得パイプライン</strong>を組み立てます。処理の流れは次の3段階です。</p>
<ol>
<li><strong>ID一覧の取得</strong>：まず対象ユーザーのID一覧を取得する（後続はこの結果に依存するので逐次）</li>
<li><strong>詳細の並列取得</strong>：各IDのスコアを取得する。互いに独立なのでmap+Promise.allで並列化</li>
<li><strong>集計と表示</strong>：全員のスコアを表示し、reduceで合計を出す</li>
</ol>
<p>使う道具はすべて学習済みです。</p>
<table>
<tr><th>段階</th><th>使う知識</th><th>学んだステップ</th></tr>
<tr><td>ID一覧の取得</td><td>await（逐次）</td><td>132</td></tr>
<tr><td>詳細の並列取得</td><td>map + Promise.all</td><td>137</td></tr>
<tr><td>結果の表示</td><td>for...of</td><td>136</td></tr>
<tr><td>集計</td><td>reduce</td><td>第8章</td></tr>
<tr><td>エラー処理</td><td>try...catch</td><td>134</td></tr>
</table>
<p>設計の考え方をおさらいしましょう。「ID一覧→詳細取得」は<strong>依存関係がある</strong>ので順番に<code>await</code>します。一方「ID1、ID2、ID3の詳細取得」は<strong>互いに独立</strong>なので並列にします。この「依存があるなら逐次、独立なら並列」という判断が、非同期処理設計の核心です。</p>
<p>全体を<code>try...catch</code>で囲んでいるので、どの段階で失敗してもエラーメッセージが表示されて安全に終了します。実際のWebアプリでは<code>fetchUserIds</code>や<code>fetchScore</code>の中身がHTTP通信になるだけで、パイプラインの骨格はこのまま使えます。</p>`,
      task: `パイプラインを完成させましょう。①ID一覧を<code>await</code>で取得、②<code>map</code>と<code>Promise.all</code>で全員のスコアを並列取得、③<code>for...of</code>で各スコアを表示し、最後に「スコア合計: 120」と表示します。`,
      code: `function fetchUserIds() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve([1, 2, 3]);
    }, 10);
  });
}

function fetchScore(id) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (id >= 1) {
        resolve({ id: id, score: id * 20 });
      } else {
        reject(new Error("不正なIDです"));
      }
    }, 10);
  });
}

async function main() {
  try {
    console.log("パイプライン開始");
    // TODO 1: fetchUserIds()をawaitしてidsに入れ、「ID一覧: 1, 2, 3」と表示する

    // TODO 2: ids.mapとPromise.allで全員分をusersに入れる（並列取得）

    // TODO 3: for...ofで各ユーザーの「ID1のスコア: 20」形式の表示を行う

    // TODO 4: reduceでスコア合計を計算し、「スコア合計: 120」と表示する
  } catch (error) {
    console.log("エラー: " + error.message);
  }
}

main();`,
      solution: `function fetchUserIds() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve([1, 2, 3]);
    }, 10);
  });
}

function fetchScore(id) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (id >= 1) {
        resolve({ id: id, score: id * 20 });
      } else {
        reject(new Error("不正なIDです"));
      }
    }, 10);
  });
}

async function main() {
  try {
    console.log("パイプライン開始");
    // 段階1: ID一覧の取得。後続が依存するので逐次でawaitする
    const ids = await fetchUserIds();
    console.log("ID一覧: " + ids.join(", "));

    // 段階2: 各IDの詳細は互いに独立なので、map + Promise.allで並列取得する
    const promises = ids.map(function (id) {
      return fetchScore(id);
    });
    const users = await Promise.all(promises);

    // 段階3: 結果の表示
    for (const user of users) {
      console.log("ID" + user.id + "のスコア: " + user.score);
    }

    // 段階4: 集計
    const total = users.reduce(function (sum, user) {
      return sum + user.score;
    }, 0);
    console.log("スコア合計: " + total);
  } catch (error) {
    console.log("エラー: " + error.message);
  }
}

main();`,
      hints: [
        `段階1はconst ids = await fetchUserIds();、表示はids.join(", ")です。`,
        `段階2はステップ137とまったく同じ形です。mapでPromiseの配列を作り、Promise.allをawaitします。`,
        `段階4のreduceは、userオブジェクトからuser.scoreを取り出して足し込みます。初期値0を忘れずに。`
      ],
      expectedOutput: "スコア合計: 120"
    }
  ]
});
