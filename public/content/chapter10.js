// 第10章：スコープとクロージャ
registerChapter({
  number: 10,
  title: "スコープとクロージャ",
  description: "変数がどこから見えるかを決める「スコープ」の仕組みと、JavaScriptの強力な武器「クロージャ」を学びます。",
  steps: [
    {
      id: 91,
      title: "ブロックスコープ",
      explanation: `<p><strong>スコープ</strong>とは「その変数をコードのどこから参照できるか」という有効範囲のことです。<code>let</code>と<code>const</code>で宣言した変数は<strong>ブロックスコープ</strong>を持ちます。ブロックとは波括弧<code>{ }</code>で囲まれた範囲のことで、<code>if</code>文や<code>for</code>文の中身がその代表です。</p>
<pre><code>if (true) {
  const secret = "ブロックの中";
  console.log(secret);  // OK：同じブロック内から参照
}
console.log(secret);  // ReferenceError：ブロックの外からは見えない</code></pre>
<p>ブロックの中で宣言した変数は、ブロックを抜けた瞬間に参照できなくなります。一見不便に思えるかもしれませんが、これは大きなメリットです。</p>
<ul><li>変数の影響範囲が狭いほど、コードを読むとき「この変数はここだけ見ればいい」と分かる</li><li>離れた場所のコードとの名前の衝突や、うっかり書き換えの事故を防げる</li></ul>
<p>逆方向のアクセスは自由です。ブロックの内側からは、外側で宣言された変数を普通に参照できます。</p>
<pre><code>const appName = "メモ帳";
if (true) {
  console.log(appName);  // OK：外側の変数は内側から見える
}</code></pre>
<p>まとめると「<strong>内から外は見える、外から内は見えない</strong>」。これがスコープの大原則で、この章全体を貫くルールです。変数はできるだけ使う場所の近く、必要最小限のスコープで宣言するのが良いコードの基本です。</p>`,
      task: `このコードは実行するとReferenceErrorになります。エラーメッセージを確認し、<code>console.log</code>をブロックの内側に移動してエラーを解消してください。`,
      code: `const weather = "晴れ";

if (weather === "晴れ") {
  const plan = "ピクニックに行く";
}

// このままだとReferenceError（planはifブロックの中でしか見えない）
// TODO: この行をifブロックの内側に移動する
console.log("今日の予定: " + plan);
`,
      solution: `const weather = "晴れ";

if (weather === "晴れ") {
  const plan = "ピクニックに行く";
  // ブロックの内側なら同じブロックで宣言されたplanが見える
  console.log("今日の予定: " + plan);
}
`,
      hints: [
        `まず実行して「plan is not defined」というエラーメッセージを確認しましょう。宣言した場所と使う場所のスコープが合っていないのが原因です。`,
        `console.logの行をifの閉じ波括弧より前に移動すれば、planと同じブロック内になり参照できます。`
      ],
      expectedOutput: "今日の予定: ピクニックに行く"
    },
    {
      id: 92,
      title: "関数スコープとネスト",
      explanation: `<p>関数もスコープを作ります。関数の中で宣言した変数は、その関数の外からは見えません。これを<strong>関数スコープ</strong>と呼びます。</p>
<p>そして関数の中に関数を定義（ネスト）すると、<strong>内側の関数は外側の関数の変数を参照できます</strong>。前ステップの「内から外は見える」の原則が、関数のネストでもそのまま成り立つのです。</p>
<pre><code>const appName = "家計簿アプリ";  // グローバルスコープ

function outer() {
  const userName = "花子";  // outerのスコープ

  function inner() {
    // innerからはuserNameもappNameも見える
    console.log(appName + "を" + userName + "さんが起動");
  }

  inner();
}

outer();</code></pre>
<p>変数を探すとき、JavaScriptは<strong>内側から外側へ順番に</strong>スコープをたどります。<code>inner</code>の中で<code>userName</code>が見つからなければ<code>outer</code>のスコープを探し、なければさらに外側（グローバル）を探す。この探索の連なりを<strong>スコープチェーン</strong>と呼びます。</p>
<table><tr><th>参照の方向</th><th>可否</th></tr><tr><td>内側の関数 → 外側の変数</td><td>できる（スコープチェーンをたどる）</td></tr><tr><td>外側 → 内側の関数の変数</td><td>できない</td></tr></table>
<p>同じ名前の変数が内外にある場合は、より内側のものが優先されます。この「内側の関数が外側の変数を覚えている」仕組みこそが、この章の後半で学ぶクロージャの土台になります。</p>`,
      task: `関数<code>inner</code>の中身を実装して、グローバル変数<code>appName</code>と<code>outer</code>の変数<code>userName</code>の両方を使ったメッセージを出力してください。`,
      code: `const appName = "家計簿アプリ";

function outer() {
  const userName = "花子";

  function inner() {
    // TODO: appNameとuserNameの両方を使って
    // 「家計簿アプリを花子さんが起動しました」と出力する
  }

  inner();
}

outer();
`,
      solution: `const appName = "家計簿アプリ";

function outer() {
  const userName = "花子";

  function inner() {
    // 内側の関数からは、外側の関数の変数もグローバル変数も見える
    console.log(appName + "を" + userName + "さんが起動しました");
  }

  inner();
}

outer();
`,
      hints: [
        `innerの中からは、スコープチェーンをたどってuserName（outerの変数）とappName（グローバル変数）の両方を参照できます。`,
        `console.log(appName + "を" + userName + "さんが起動しました")のように、普通に変数名を書くだけで参照できます。`
      ],
      expectedOutput: "家計簿アプリを花子さんが起動しました"
    },
    {
      id: 93,
      title: "varの問題点",
      explanation: `<p>第1章で「<code>var</code>は使わない」と学びましたが、その理由をスコープの観点から正確に理解しましょう。<code>var</code>には現代の基準では危険な性質が3つあります。</p>
<table><tr><th>性質</th><th>var</th><th>let/const</th></tr><tr><td>ブロックスコープ</td><td>無視する（関数スコープのみ）</td><td>従う</td></tr><tr><td>同名での再宣言</td><td>エラーにならない</td><td>エラーになる</td></tr><tr><td>宣言前の参照</td><td>undefinedになる</td><td>エラーになる</td></tr></table>
<p>最大の問題は<strong>ブロックスコープを無視する</strong>ことです。ifやforのブロック内で宣言しても、変数がブロックの外に漏れ出します。</p>
<pre><code>if (true) {
  var leaked = "漏れた！";
}
console.log(leaked);  // "漏れた！" ← エラーにならず参照できてしまう

for (var i = 0; i &lt; 3; i++) { }
console.log(i);  // 3 ← ループ変数まで外に漏れる</code></pre>
<p>変数が意図しない場所から見える・書き換えられるということは、バグの温床になるということです。また<strong>再宣言してもエラーにならない</strong>ため、長いコードで同じ変数名をうっかり2回宣言し、前の値を破壊しても気づけません。</p>
<p><code>let</code>と<code>const</code>はこれらの問題をすべて解決するために導入されました。既存の古いコードで<code>var</code>を読める必要はありますが、新しく書くコードでは常に<code>const</code>（再代入が必要なら<code>let</code>）を使いましょう。</p>`,
      task: `<code>var</code>で書かれたコードを<code>let</code>に書き換えてください。書き換えるとブロック外の<code>console.log</code>がエラーになるため、出力もブロックの内側に移動して完成させます。`,
      code: `// TODO: varをletに書き換え、console.logをブロックの内側に移動する

for (var i = 0; i < 3; i++) {
  var message = "ループ" + i + "回目";
}
console.log(message);
console.log("ループ変数の値: " + i);

if (true) {
  var note = "ブロック内だけで有効";
}
console.log(note);
`,
      solution: `// letはブロックスコープに従うので、使う場所もブロック内に移す

for (let i = 0; i < 3; i++) {
  let message = "ループ" + i + "回目";
  console.log(message);
}

if (true) {
  let note = "ブロック内だけで有効";
  console.log(note);
}
`,
      hints: [
        `varをletに変えると、ブロックの外からmessage・i・noteが見えなくなります。それがletの正しい挙動です。`,
        `console.logをそれぞれのブロックの内側（閉じ波括弧の前）に移動すれば、同じ情報をエラーなく出力できます。`
      ],
      expectedOutput: "ブロック内だけで有効"
    },
    {
      id: 94,
      title: "ホイスティング",
      explanation: `<p><strong>ホイスティング</strong>（hoisting、巻き上げ）とは、変数や関数の<strong>宣言がスコープの先頭に巻き上げられたかのように振る舞う</strong>JavaScriptの仕様です。宣言の種類によって挙動が大きく異なります。</p>
<table><tr><th>宣言</th><th>宣言前に使うと</th></tr><tr><td>function宣言</td><td>普通に呼び出せる（本体ごと巻き上げ）</td></tr><tr><td>var</td><td>undefinedになる（宣言だけ巻き上げ）</td></tr><tr><td>let/const</td><td>ReferenceErrorになる</td></tr></table>
<pre><code>console.log(greet("太郎"));  // OK！ 宣言より前でも呼べる
function greet(name) {
  return "こんにちは、" + name + "さん";
}

console.log(score);  // undefined（エラーにはならない）
var score = 100;

console.log(title);  // ReferenceError！
let title = "入門";</code></pre>
<p><code>function</code>宣言は本体ごと巻き上げられるため、ファイルのどこで定義しても呼び出せます。<code>var</code>は「宣言だけ」が巻き上げられ、代入はその行まで実行されないため、途中までは<code>undefined</code>という中途半端な状態になります。エラーにならない分、バグに気づきにくい厄介な挙動です。</p>
<p><code>let</code>と<code>const</code>も内部的には巻き上げられますが、宣言行に到達するまで参照が禁止されます。この参照禁止期間を<strong>TDZ</strong>（Temporal Dead Zone、一時的死角）と呼びます。「使う前に宣言しないとエラー」という直感通りの動きになるため、varより安全です。ホイスティングを味方につけるコツはシンプルで、<strong>変数は使う前に宣言する</strong>。これを徹底すれば巻き上げに悩まされることはありません。</p>`,
      task: `コードの最後の部分がTDZによるReferenceErrorになっています。<code>let</code>の宣言行と<code>console.log</code>の順番を入れ替えて、3種類の巻き上げ挙動をすべて観察できるようにしてください。`,
      code: `// 1. function宣言：本体ごと巻き上げられるので宣言前に呼べる
console.log(greet("太郎"));

function greet(name) {
  return "こんにちは、" + name + "さん";
}

// 2. var：宣言だけ巻き上げられ、値はまだ入っていない
console.log("scoreの値: " + score);
var score = 100;

// 3. let：宣言前に参照するとReferenceError（TDZ）
// TODO: 次の2行の順番を入れ替えてエラーを解消する
console.log("タイトル: " + title);
let title = "ホイスティング入門";
`,
      solution: `// 1. function宣言：本体ごと巻き上げられるので宣言前に呼べる
console.log(greet("太郎"));

function greet(name) {
  return "こんにちは、" + name + "さん";
}

// 2. var：宣言だけ巻き上げられ、値はまだ入っていない
console.log("scoreの値: " + score);
var score = 100;

// 3. let：宣言してから使えばエラーにならない
let title = "ホイスティング入門";
console.log("タイトル: " + title);
`,
      hints: [
        `まず実行してみましょう。greetの呼び出しは成功し、scoreはundefined、titleの行でReferenceErrorが起きるはずです。`,
        `letは「宣言行より前で参照するとエラー」です。let title = ...の行をconsole.logより上に移動します。`
      ],
      expectedOutput: "タイトル: ホイスティング入門"
    },
    {
      id: 95,
      title: "クロージャ基本",
      explanation: `<p>いよいよこの章の主役、<strong>クロージャ</strong>（closure）です。クロージャとは「<strong>関数が、自分の定義された場所のスコープの変数を覚え続ける</strong>」仕組みのことです。</p>
<p>ステップ92で「内側の関数は外側の変数を見られる」と学びました。驚くべきことに、この参照は<strong>外側の関数の実行が終わった後も生き続けます</strong>。</p>
<pre><code>function makeGreeter(greeting) {
  // 返される関数は、引数greetingを「覚えて」いる
  return function(name) {
    return greeting + "、" + name + "さん";
  };
}

const morning = makeGreeter("おはよう");
const evening = makeGreeter("こんばんは");

console.log(morning("太郎"));  // "おはよう、太郎さん"
console.log(evening("花子"));  // "こんばんは、花子さん"</code></pre>
<p><code>makeGreeter("おはよう")</code>の実行はすぐ終わりますが、返された関数は<code>greeting = "おはよう"</code>という環境を持ち歩き続けます。だから後から<code>morning("太郎")</code>を呼んでも「おはよう」を思い出せるのです。</p>
<p>ポイントは、<code>morning</code>と<code>evening</code>が<strong>それぞれ別の環境を記憶している</strong>ことです。呼び出しのたびに新しいスコープが作られるため、同じ工場から作られた関数でも中身は独立しています。</p>
<p>このように「設定を覚えた関数を作って返す関数」は<strong>ファクトリ関数</strong>（工場関数）と呼ばれる定番パターンです。クロージャは難しい概念に見えますが、実体は「関数は生まれた場所の変数を忘れない」というただ1つのルールです。</p>`,
      task: `関数<code>makeMultiplier</code>を完成させてください。<code>makeMultiplier(3)</code>は「引数を3倍にする関数」を返すようにします。クロージャで<code>factor</code>を記憶させるのがポイントです。`,
      code: `function makeMultiplier(factor) {
  // TODO: 受け取った数値をfactor倍して返す関数を作って返す
  return function(num) {
    return num;
  };
}

const triple = makeMultiplier(3);
const tenTimes = makeMultiplier(10);

console.log("5の3倍: " + triple(5));
console.log("5の10倍: " + tenTimes(5));
console.log("7の3倍: " + triple(7));
`,
      solution: `function makeMultiplier(factor) {
  // 返される関数はfactorをクロージャとして記憶する
  return function(num) {
    return num * factor;
  };
}

const triple = makeMultiplier(3);
const tenTimes = makeMultiplier(10);

console.log("5の3倍: " + triple(5));
console.log("5の10倍: " + tenTimes(5));
console.log("7の3倍: " + triple(7));
`,
      hints: [
        `内側の関数からは外側の引数factorが見えます。makeMultiplierの実行が終わった後も、返された関数はfactorを覚えています。`,
        `return num;の部分をnum * factorに変えるだけです。tripleはfactor=3を、tenTimesはfactor=10をそれぞれ独立して記憶します。`
      ],
      expectedOutput: "5の10倍: 50"
    },
    {
      id: 96,
      title: "クロージャでカウンタ",
      explanation: `<p>クロージャの真価は、値を記憶するだけでなく<strong>記憶した変数を更新し続けられる</strong>ことにあります。定番の例がカウンタです。</p>
<pre><code>function createCounter() {
  let count = 0;  // この変数が呼び出しをまたいで生き続ける
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2
console.log(counter());  // 3</code></pre>
<p>普通の関数のローカル変数は、関数が終わるたびに消えます。しかしクロージャに捕まえられた<code>count</code>は、返された関数が存在する限り消えません。呼ぶたびに<strong>同じcountが加算され続ける</strong>のです。これは「状態（state）を持つ関数」を作れるということを意味します。</p>
<p>さらに重要なのが独立性です。<code>createCounter</code>を2回呼べば、それぞれの呼び出しで<strong>別々のcount</strong>が作られます。</p>
<pre><code>const counterA = createCounter();
const counterB = createCounter();
counterA();
counterA();
console.log(counterA());  // 3
console.log(counterB());  // 1 ← Bは自分専用のcountを持つ</code></pre>
<p>グローバル変数でカウントを管理すると、どこからでも書き換えられてしまい安全ではありません。クロージャなら<code>count</code>に触れる手段は返された関数だけ。状態を安全に閉じ込める、この発想が次ステップの「プライベート変数」につながります。</p>`,
      task: `<code>createCounter</code>を完成させてください。呼び出すたびに1ずつ増える数を返す関数を作ります。カウンタAとBが独立して数えられることも確認しましょう。`,
      code: `function createCounter() {
  let count = 0;
  // TODO: 呼び出すたびにcountを1増やして、その値を返す関数を返す
  return function() {
    return 0;
  };
}

const counterA = createCounter();
const counterB = createCounter();

console.log("A: " + counterA());
console.log("A: " + counterA());
console.log("B: " + counterB());
console.log("A: " + counterA());
`,
      solution: `function createCounter() {
  let count = 0;
  // countはクロージャに閉じ込められ、呼び出しをまたいで生き続ける
  return function() {
    count++;
    return count;
  };
}

const counterA = createCounter();
const counterB = createCounter();

console.log("A: " + counterA());
console.log("A: " + counterA());
console.log("B: " + counterB());
console.log("A: " + counterA());
`,
      hints: [
        `返す関数の中でcount++してからreturn countします。countは外側の関数の変数ですが、クロージャなので更新できます。`,
        `正しく動けばAは1、2、3と進み、Bは独立して1から始まります。最後の出力は「A: 3」になるはずです。`
      ],
      expectedOutput: "A: 3"
    },
    {
      id: 97,
      title: "プライベート変数",
      explanation: `<p>第7章で学んだオブジェクトのプロパティは、外から自由に読み書きできます。便利な反面、<code>wallet.balance = -100</code>のような不正な書き換えも防げません。クロージャを使うと、<strong>決められたメソッド経由でしか触れない「プライベート変数」</strong>を実現できます。</p>
<pre><code>function createWallet(initial) {
  let balance = initial;  // 外から直接触れないプライベート変数

  return {
    deposit: function(amount) {
      balance += amount;
    },
    getBalance: function() {
      return balance;
    }
  };
}

const wallet = createWallet(1000);
wallet.deposit(500);
console.log(wallet.getBalance());  // 1500
console.log(wallet.balance);       // undefined ← 直接は見えない！</code></pre>
<p>ポイントは、返しているオブジェクトに<code>balance</code>という<strong>プロパティは存在しない</strong>ことです。<code>balance</code>はあくまで<code>createWallet</code>のローカル変数で、2つのメソッドがクロージャとして共有しています。外部から<code>balance</code>に到達する手段はメソッドだけなので、メソッドの中に「マイナスは受け付けない」といった<strong>チェック処理を仕込めば、不正な状態を完全に防げます</strong>。</p>
<p>このように「データを隠して、操作の窓口を限定する」設計をカプセル化と呼びます。オブジェクト指向プログラミングの中心的な考え方のひとつで、後の章で学ぶクラスの#プライベートフィールドにもつながる重要な概念です。まずはクロージャ版でその感覚をつかみましょう。</p>`,
      task: `<code>createWallet</code>に出金メソッド<code>withdraw</code>を実装してください。残高以下の金額なら引き出し、残高を超える場合は「残高不足です」と出力して引き出さないようにします。`,
      code: `function createWallet(initial) {
  let balance = initial;

  return {
    deposit: function(amount) {
      balance += amount;
    },
    withdraw: function(amount) {
      // TODO: amountがbalance以下なら引き出す。超えていたら「残高不足です」と出力する
    },
    getBalance: function() {
      return balance;
    }
  };
}

const wallet = createWallet(1000);
wallet.deposit(500);
wallet.withdraw(200);
wallet.withdraw(9999);
console.log("残高: " + wallet.getBalance() + "円");
console.log("直接アクセス: " + wallet.balance);
`,
      solution: `function createWallet(initial) {
  let balance = initial;

  return {
    deposit: function(amount) {
      balance += amount;
    },
    withdraw: function(amount) {
      // メソッドを窓口にすることで不正な引き出しを防げる
      if (amount <= balance) {
        balance -= amount;
      } else {
        console.log("残高不足です");
      }
    },
    getBalance: function() {
      return balance;
    }
  };
}

const wallet = createWallet(1000);
wallet.deposit(500);
wallet.withdraw(200);
wallet.withdraw(9999);
console.log("残高: " + wallet.getBalance() + "円");
console.log("直接アクセス: " + wallet.balance);
`,
      hints: [
        `withdrawの中ではbalanceを直接読み書きできます。if文でamountとbalanceを比較しましょう。`,
        `条件を満たすときはbalance -= amount、満たさないときはconsole.log("残高不足です")です。1000+500-200=1300円が正しい残高です。`,
        `最後のwallet.balanceがundefinedになるのは正常です。プライベート変数が守られている証拠です。`
      ],
      expectedOutput: "残高: 1300円"
    },
    {
      id: 98,
      title: "ループとクロージャの罠（var vs let）",
      explanation: `<p>クロージャとループの組み合わせには、JavaScript史上もっとも有名な罠があります。「ループの各回の値を覚えた関数を配列に詰める」コードを<code>var</code>で書くと、期待を裏切る結果になるのです。</p>
<pre><code>const funcs = [];
for (var i = 0; i &lt; 3; i++) {
  funcs.push(function() { return i; });
}
console.log(funcs[0]());  // 0のはずが… 3！
console.log(funcs[1]());  // 3！
console.log(funcs[2]());  // 3！</code></pre>
<p>なぜ全部3になるのでしょうか。<code>var</code>のループ変数<code>i</code>は関数スコープなので、<strong>3つの関数すべてが同じ1つのiを共有</strong>しています。関数が実際に呼ばれるのはループ終了後。そのとき<code>i</code>はすでに3になっているため、どの関数も3を返すのです。クロージャは「値のコピー」ではなく「<strong>変数そのもの</strong>」を記憶する、というのが核心です。</p>
<p>解決策は驚くほど簡単で、<code>var</code>を<code>let</code>に変えるだけです。</p>
<pre><code>for (let i = 0; i &lt; 3; i++) {
  funcs.push(function() { return i; });
}
// funcs[0]()は0、funcs[1]()は1、funcs[2]()は2</code></pre>
<p><code>let</code>のループ変数は<strong>繰り返しのたびに新しい変数が作られる</strong>という特別な仕様になっています。各関数はそれぞれ別のiを記憶するため、期待通りの値が返ります。この罠はイベント処理や遅延実行など「後から呼ばれる関数」を作るあらゆる場面で顔を出します。letを使っていれば自然に回避できる、というのがvarを避けるべき最大の実務的理由のひとつです。</p>`,
      task: `<code>var</code>で書かれたループが原因で、すべての関数が3を返してしまいます。まず実行して現象を確認し、<code>let</code>に書き換えて0、1、2が返るように修正してください。`,
      code: `const funcs = [];

// TODO: まず実行して全部3になるのを確認し、varをletに変えて修正する
for (var i = 0; i < 3; i++) {
  funcs.push(function() {
    return i;
  });
}

console.log("結果: " + funcs[0]() + ", " + funcs[1]() + ", " + funcs[2]());
`,
      solution: `const funcs = [];

// letなら繰り返しごとに新しいiが作られ、各関数が別々のiを記憶する
for (let i = 0; i < 3; i++) {
  funcs.push(function() {
    return i;
  });
}

console.log("結果: " + funcs[0]() + ", " + funcs[1]() + ", " + funcs[2]());
`,
      hints: [
        `varのまま実行すると「結果: 3, 3, 3」になります。3つの関数が同じ1つのiを共有しているためです。`,
        `for (let i = 0; ...)に変えるだけで、繰り返しごとに独立したiが作られ「結果: 0, 1, 2」になります。`
      ],
      expectedOutput: "結果: 0, 1, 2"
    },
    {
      id: 99,
      title: "IIFEとモジュールパターン",
      explanation: `<p><strong>IIFE</strong>（Immediately Invoked Function Expression、即時実行関数式）とは、<strong>定義した瞬間に実行される関数</strong>のことです。関数式を丸括弧で包み、末尾に<code>()</code>を付けて即座に呼び出します。</p>
<pre><code>(function() {
  const temp = "作業用の変数";
  console.log("すぐ実行される: " + temp);
})();
// tempは外に漏れない</code></pre>
<p>最初の丸括弧は「これは関数宣言ではなく式だ」とJavaScriptに伝えるためのものです。IIFEの目的は、<strong>一度きりの処理を実行しつつ、使った変数を外に漏らさない</strong>こと。関数スコープを「使い捨ての箱」として利用するテクニックです。</p>
<p>IIFEとクロージャを組み合わせたものが<strong>モジュールパターン</strong>です。IIFEの中にプライベート変数を置き、公開したい機能だけをオブジェクトとして返します。</p>
<pre><code>const scoreBoard = (function() {
  let total = 0;  // プライベート

  return {
    add: function(points) {
      total += points;
      return total;
    },
    show: function() {
      return "合計: " + total + "点";
    }
  };
})();

scoreBoard.add(10);
scoreBoard.add(25);
console.log(scoreBoard.show());  // "合計: 35点"</code></pre>
<p>ステップ97のファクトリ関数と似ていますが、IIFE版は<strong>アプリ全体で1つだけ</strong>のインスタンスを作るときに使います。ES6でモジュール機能が言語に導入される前は、このパターンがライブラリ設計の標準でした。現在も既存コードで頻繁に見かけるほか、「スコープを閉じて名前空間を汚さない」という発想自体が今も通用する基礎教養です。</p>`,
      task: `IIFEを使ったモジュール<code>gameScore</code>を完成させてください。TODOの2か所を実装し、プライベート変数<code>score</code>を<code>add</code>と<code>show</code>だけが操作できるようにします。`,
      code: `const gameScore = (function() {
  let score = 0;

  return {
    add: function(points) {
      // TODO: scoreにpointsを加算する
    },
    show: function() {
      // TODO: 「現在のスコア: X点」という文字列を返す
      return "";
    }
  };
})();

gameScore.add(100);
gameScore.add(250);
console.log(gameScore.show());
console.log("直接アクセス: " + gameScore.score);
`,
      solution: `const gameScore = (function() {
  let score = 0;

  return {
    add: function(points) {
      // プライベート変数scoreはメソッド経由でのみ更新できる
      score += points;
    },
    show: function() {
      return "現在のスコア: " + score + "点";
    }
  };
})();

gameScore.add(100);
gameScore.add(250);
console.log(gameScore.show());
console.log("直接アクセス: " + gameScore.score);
`,
      hints: [
        `addの中はscore += pointsの1行です。scoreはIIFEのスコープにあり、両メソッドがクロージャで共有しています。`,
        `showは"現在のスコア: " + score + "点"を返します。100+250で350点になるはずです。`
      ],
      expectedOutput: "現在のスコア: 350点"
    },
    {
      id: 100,
      title: "総合演習：設定可能なフォーマッタ工場",
      explanation: `<p>記念すべきステップ100は、第10章の集大成である<strong>フォーマッタ工場</strong>を作ります。ファクトリ関数（ステップ95）、プライベート変数（ステップ97）、そして第9章の文字列メソッドを総動員します。</p>
<p>作るのは「設定オブジェクトを渡すと、その設定を記憶した整形器を返す」関数です。</p>
<pre><code>function createFormatter(options) {
  const prefix = options.prefix ?? "";
  const suffix = options.suffix ?? "";
  const width = options.width ?? 0;
  let useCount = 0;  // 利用回数（プライベート）

  return {
    format: function(value) {
      useCount++;
      return prefix + String(value).padStart(width, " ") + suffix;
    },
    getCount: function() {
      return useCount;
    }
  };
}</code></pre>
<p>設計のポイントを整理します。</p>
<ul><li><strong>設定の記憶</strong>：prefix・suffix・widthはクロージャに閉じ込められ、formatを呼ぶたびに参照される</li><li><strong>?? の活用</strong>：第7章で学んだNull合体演算子で、設定が省略されたときの既定値を用意する</li><li><strong>プライベートな状態</strong>：useCountは外から書き換えられず、getCount経由でしか読めない</li><li><strong>独立した工場出荷品</strong>：工場を2回呼べば、設定もカウントも独立した2つのフォーマッタができる</li></ul>
<p>「設定を渡して、専用の道具を作ってもらう」というこのパターンは、実際のライブラリ（ロガー、バリデータ、日付整形など）のAPI設計で広く使われています。クロージャを理解した今のあなたなら、そうしたライブラリの内部構造も想像できるはずです。</p>`,
      task: `<code>createFormatter</code>のTODOを実装してください。<code>format</code>は値を<code>padStart(width)</code>で右揃えにして前後にprefix・suffixを付け、呼ばれるたびに<code>useCount</code>を1増やします。`,
      code: `function createFormatter(options) {
  const prefix = options.prefix ?? "";
  const suffix = options.suffix ?? "";
  const width = options.width ?? 0;
  let useCount = 0;

  return {
    format: function(value) {
      // TODO: useCountを1増やし、String(value)をpadStart(width, " ")で
      // 右揃えにして、前にprefix、後ろにsuffixを付けて返す
      return "";
    },
    getCount: function() {
      return useCount;
    }
  };
}

const yenFormatter = createFormatter({ prefix: "金額: ", suffix: "円", width: 6 });
const percentFormatter = createFormatter({ suffix: "%", width: 3 });

console.log(yenFormatter.format(1200));
console.log(yenFormatter.format(98));
console.log(percentFormatter.format(75));
console.log("円形式の利用回数: " + yenFormatter.getCount() + "回");
console.log("％形式の利用回数: " + percentFormatter.getCount() + "回");
`,
      solution: `function createFormatter(options) {
  const prefix = options.prefix ?? "";
  const suffix = options.suffix ?? "";
  const width = options.width ?? 0;
  let useCount = 0;

  return {
    format: function(value) {
      // 設定とカウンタはクロージャに記憶されている
      useCount++;
      return prefix + String(value).padStart(width, " ") + suffix;
    },
    getCount: function() {
      return useCount;
    }
  };
}

const yenFormatter = createFormatter({ prefix: "金額: ", suffix: "円", width: 6 });
const percentFormatter = createFormatter({ suffix: "%", width: 3 });

console.log(yenFormatter.format(1200));
console.log(yenFormatter.format(98));
console.log(percentFormatter.format(75));
console.log("円形式の利用回数: " + yenFormatter.getCount() + "回");
console.log("％形式の利用回数: " + percentFormatter.getCount() + "回");
`,
      hints: [
        `formatの中は3つの仕事です。(1)useCount++、(2)String(value).padStart(width, " ")で整形、(3)prefixとsuffixを連結してreturn。`,
        `数値のままではpadStartが使えないので、必ずString(value)で文字列に変換してから整形します。`,
        `yenFormatterは2回、percentFormatterは1回formatを呼んでいるので、利用回数はそれぞれ2回と1回になります。`
      ],
      expectedOutput: "円形式の利用回数: 2回"
    }
  ]
});
