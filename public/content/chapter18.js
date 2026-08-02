// 第18章：関数型プログラミング
registerChapter({
  number: 18,
  title: "関数型プログラミング",
  description: "純粋関数・イミュータブル・関数合成・カリー化・メモ化など、関数を部品として組み合わせるプログラミングスタイルを学びます。",
  steps: [
    {
      id: 171,
      title: "純粋関数と副作用",
      explanation: `<p><strong>関数型プログラミング</strong>は、「小さな関数を部品として組み合わせてプログラムを作る」スタイルです。その土台となるのが<strong>純粋関数</strong>（pure function）という考え方です。純粋関数は次の2つの条件を満たします。</p>
<ol>
<li><strong>同じ入力には必ず同じ出力を返す</strong>（外部の状態に依存しない）</li>
<li><strong>副作用がない</strong>（関数の外にあるものを変更しない）</li>
</ol>
<p><strong>副作用</strong>（side effect）とは、戻り値を返す以外に関数が外の世界へ及ぼす影響のことです。外部変数の書き換え、引数のオブジェクトの変更、console.logによる出力などが該当します。</p>
<pre><code>// 純粋ではない：外部変数に依存し、書き換えている
let total = 0;
function addToTotal(value) {
  total = total + value; // 副作用！
  return total;          // 呼ぶたびに結果が変わる
}

// 純粋：引数だけから結果を計算し、外に触れない
function add(a, b) {
  return a + b; // add(10, 20)は何度呼んでも必ず30
}</code></pre>
<table>
<tr><th>観点</th><th>純粋関数</th><th>純粋でない関数</th></tr>
<tr><td>結果の予測</td><td>入力だけで決まる</td><td>外部の状態しだいで変わる</td></tr>
<tr><td>テスト</td><td>入力と出力を見るだけで簡単</td><td>事前に状態を整える必要がある</td></tr>
<tr><td>バグの追跡</td><td>関数の中だけ見ればよい</td><td>どこで状態が変わったか追う必要がある</td></tr>
</table>
<p>現実のプログラムから副作用を完全になくすことはできません（画面表示も保存も副作用です）。目標は「計算のロジックは純粋関数に切り出し、副作用は端に寄せる」ことです。</p>`,
      task: `外部変数<code>total</code>に依存している<code>addToTotal</code>を、引数だけで計算する純粋関数<code>add(a, b)</code>に書き換えましょう。`,
      code: `// 純粋ではない関数：外部変数totalに依存している
let total = 0;
function addToTotal(value) {
  total = total + value;
  return total;
}

// TODO: 外部変数を使わず、2つの引数の和を返す純粋関数addに書き換える

// 純粋関数は同じ入力なら必ず同じ出力になる
console.log("1回目: " + add(10, 20));
console.log("2回目: " + add(10, 20));
console.log("別の入力: " + add(5, 7));`,
      solution: `// 純粋関数：引数だけから結果を計算し、外部の状態に一切触れない
function add(a, b) {
  return a + b;
}

// 純粋関数は同じ入力なら必ず同じ出力になる
console.log("1回目: " + add(10, 20));
console.log("2回目: " + add(10, 20));
console.log("別の入力: " + add(5, 7));`,
      hints: [
        `純粋関数は「必要な材料をすべて引数で受け取り、結果はreturnで返す」だけの関数です。`,
        `function add(a, b) { return a + b; } と定義すれば、外部変数totalは不要になります。`
      ],
      expectedOutput: "2回目: 30"
    },
    {
      id: 172,
      title: "イミュータブルな配列操作",
      explanation: `<p>関数型プログラミングでは、データを<strong>イミュータブル</strong>（immutable：不変）に扱います。つまり、既存の配列やオブジェクトを書き換えるのではなく、<strong>変更を加えた新しいコピーを作る</strong>のです。</p>
<p>配列のメソッドには「元を破壊するもの」と「新しい配列を返すもの」があります。</p>
<table>
<tr><th>やりたいこと</th><th>破壊的（避けたい）</th><th>非破壊（推奨）</th></tr>
<tr><td>要素を追加</td><td><code>push(x)</code></td><td><code>[...arr, x]</code></td></tr>
<tr><td>要素を除去</td><td><code>splice(i, 1)</code></td><td><code>filter(...)</code></td></tr>
<tr><td>要素を変換</td><td>forループで上書き</td><td><code>map(...)</code></td></tr>
<tr><td>並べ替え</td><td><code>sort()</code>（元を変える）</td><td><code>[...arr].sort()</code></td></tr>
</table>
<pre><code>const scores = [70, 85, 60];

// 破壊的：元のscoresが変わってしまう
// scores.push(90);

// 非破壊：元はそのまま、新しい配列を作る
const added = [...scores, 90];
const sorted = [...scores].sort(function (a, b) { return b - a; });

console.log(scores); // [70, 85, 60] 元は無傷
console.log(added);  // [70, 85, 60, 90]</code></pre>
<p>注意したいのは<code>sort</code>です。<code>sort</code>は元の配列自体を並べ替えてしまうため、スプレッド構文でコピーしてから並べ替えるのが定番パターンです。</p>
<p>なぜここまで元データを守るのでしょうか。複数の場所から同じ配列を参照しているとき、どこかで破壊的変更が起きると「知らないうちにデータが変わっていた」というバグの温床になるからです。元データが不変なら、いつ誰が読んでも同じ結果が保証されます。</p>`,
      task: `破壊的な<code>push</code>と<code>sort</code>を、スプレッド構文を使った非破壊の書き方に直して、元の配列<code>scores</code>が変わらないようにしましょう。`,
      code: `const scores = [70, 85, 60];

// TODO: pushを使わず、スプレッド構文で90を追加した新しい配列を作る
scores.push(90);
const added = scores;

// TODO: 元の配列を変えないように、コピーしてから降順に並べ替える
const sorted = added.sort(function (a, b) { return b - a; });

console.log("追加後: " + added.join(","));
console.log("降順: " + sorted.join(","));
console.log("元の配列: " + scores.join(","));`,
      solution: `const scores = [70, 85, 60];

// スプレッド構文で「元の全要素＋新要素」の新しい配列を作る
const added = [...scores, 90];

// コピーしてからsortすれば元の配列は変わらない
const sorted = [...added].sort(function (a, b) { return b - a; });

console.log("追加後: " + added.join(","));
console.log("降順: " + sorted.join(","));
console.log("元の配列: " + scores.join(","));`,
      hints: [
        `追加は [...scores, 90]、並べ替えは [...added].sort(...) の形にします。`,
        `正しく直すと「元の配列: 70,85,60」と表示されます。破壊的なままだと元の配列も変わってしまいます。`
      ],
      expectedOutput: "元の配列: 70,85,60"
    },
    {
      id: 173,
      title: "関数合成（compose）",
      explanation: `<p>純粋関数の最大の魅力は、<strong>部品のように組み合わせられる</strong>ことです。「関数Aの結果を関数Bに渡す」という連結を1つの新しい関数にまとめる操作を<strong>関数合成</strong>（function composition）と呼びます。</p>
<pre><code>const double = function (x) { return x * 2; };
const increment = function (x) { return x + 1; };

// 手作業の合成：内側から外側へ実行される
console.log(increment(double(5))); // 5 → 10 → 11</code></pre>
<p>この「入れ子の呼び出し」を毎回書くのは読みにくいので、合成そのものを行う<code>compose</code>関数を作ります。</p>
<pre><code>function compose(f, g) {
  return function (x) {
    return f(g(x)); // 先にgを適用し、その結果にfを適用する
  };
}

const doubleThenIncrement = compose(increment, double);
console.log(doubleThenIncrement(5)); // 11</code></pre>
<p>ポイントは実行順です。<code>compose(f, g)</code>は数学の合成関数「f∘g」と同じで、<strong>右側の関数から先に</strong>適用されます。<code>compose(increment, double)</code>なら「まずdouble、次にincrement」です。</p>
<table>
<tr><th>書き方</th><th>実行順</th></tr>
<tr><td><code>f(g(x))</code></td><td>g → f（内側から）</td></tr>
<tr><td><code>compose(f, g)(x)</code></td><td>g → f（右から左）</td></tr>
</table>
<p><code>compose</code>は「関数を受け取って関数を返す」関数です。第10章のクロージャと第4章の関数式の知識がここで合流します。合成で作った新しい関数もまた純粋関数なので、さらに別の関数と合成できます。小さな部品から大きな処理を組み立てる、関数型の中核となる考え方です。</p>`,
      task: `<code>compose</code>関数のTODOを完成させて、「税抜き価格を1.1倍して切り捨てる」合成関数<code>withTax</code>が動くようにしましょう。`,
      code: `function compose(f, g) {
  return function (x) {
    // TODO: 先にgをxに適用し、その結果にfを適用して返す
    return 0;
  };
}

const applyTaxRate = function (price) { return price * 1.1; };
const floorYen = function (price) { return Math.floor(price); };

// 「まず税率を掛け、次に切り捨て」の合成関数
const withTax = compose(floorYen, applyTaxRate);

console.log("980円の税込: " + withTax(980));
console.log("1980円の税込: " + withTax(1980));`,
      solution: `function compose(f, g) {
  return function (x) {
    // composeは右側の関数gから先に適用する（数学のf∘gと同じ）
    return f(g(x));
  };
}

const applyTaxRate = function (price) { return price * 1.1; };
const floorYen = function (price) { return Math.floor(price); };

// 「まず税率を掛け、次に切り捨て」の合成関数
const withTax = compose(floorYen, applyTaxRate);

console.log("980円の税込: " + withTax(980));
console.log("1980円の税込: " + withTax(1980));`,
      hints: [
        `composeは「gの結果をfに渡す」新しい関数を返します。入れ子の呼び出しで書けます。`,
        `return f(g(x)); の1行です。gが先、fが後という順番に注意しましょう。`
      ],
      expectedOutput: "980円の税込: 1078"
    },
    {
      id: 174,
      title: "カリー化",
      explanation: `<p><strong>カリー化</strong>（currying）とは、複数の引数を取る関数を「<strong>引数を1つずつ受け取る関数の連鎖</strong>」に変換するテクニックです。名前は論理学者ハスケル・カリーに由来します。</p>
<pre><code>// 通常の2引数関数
function multiply(a, b) {
  return a * b;
}
console.log(multiply(2, 10)); // 20

// カリー化版：aを受け取ると「bを受け取る関数」を返す
function multiplyCurried(a) {
  return function (b) {
    return a * b;
  };
}
console.log(multiplyCurried(2)(10)); // 20（呼び出しが2段階になる）</code></pre>
<p><code>multiplyCurried(2)(10)</code>という見慣れない形は、「<code>multiplyCurried(2)</code>が返した関数を、すぐに<code>(10)</code>で呼んでいる」だけです。内側の関数が外側の引数<code>a</code>を覚えていられるのは、第10章で学んだクロージャのおかげです。</p>
<p>カリー化の真価は、<strong>途中まで引数を渡した状態を関数として保存できる</strong>ことにあります。</p>
<pre><code>const double = multiplyCurried(2); // 「2倍する」専用関数が完成
const triple = multiplyCurried(3); // 「3倍する」専用関数が完成

console.log(double(50)); // 100
console.log(triple(50)); // 150</code></pre>
<p>1つの汎用関数から、用途特化した関数を量産できるわけです。<code>map</code>や前ステップの<code>compose</code>に渡す1引数関数を作る場面で、カリー化は絶大な効果を発揮します。アロー関数なら<code>const multiply = (a) =&gt; (b) =&gt; a * b;</code>と、さらに簡潔に書けます。</p>`,
      task: `<code>multiply(a, b)</code>をカリー化した<code>multiplyCurried</code>を完成させ、そこから<code>double</code>（2倍）と<code>triple</code>（3倍）の専用関数を作りましょう。`,
      code: `// TODO: aを受け取ったら「bを受け取ってa * bを返す関数」を返すようにする
function multiplyCurried(a) {
  return 0;
}

// カリー化した関数から専用関数を量産できる
const double = multiplyCurried(2);
const triple = multiplyCurried(3);

console.log("2倍: " + double(50));
console.log("3倍: " + triple(50));
console.log("一気に呼ぶ: " + multiplyCurried(4)(25));`,
      solution: `// カリー化：引数を1つずつ受け取る関数の連鎖に変換する
function multiplyCurried(a) {
  return function (b) {
    // 内側の関数はクロージャによって外側のaを覚えている
    return a * b;
  };
}

// カリー化した関数から専用関数を量産できる
const double = multiplyCurried(2);
const triple = multiplyCurried(3);

console.log("2倍: " + double(50));
console.log("3倍: " + triple(50));
console.log("一気に呼ぶ: " + multiplyCurried(4)(25));`,
      hints: [
        `multiplyCurriedは数値ではなく「関数」を返します。return function (b) { ... }; の形です。`,
        `内側の関数の中で return a * b; と書けば、クロージャがaを記憶してくれます。`
      ],
      expectedOutput: "2倍: 100"
    },
    {
      id: 175,
      title: "部分適用",
      explanation: `<p>カリー化と似た概念に<strong>部分適用</strong>（partial application）があります。これは「複数引数の関数に、<strong>一部の引数だけを先に固定した</strong>新しい関数を作る」ことです。</p>
<p>カリー化との違いを整理しましょう。</p>
<table>
<tr><th>概念</th><th>何をするか</th><th>形</th></tr>
<tr><td>カリー化</td><td>関数を「1引数ずつの連鎖」に<strong>変換</strong>する</td><td>f(a)(b)(c)</td></tr>
<tr><td>部分適用</td><td>一部の引数を<strong>固定</strong>した新関数を作る</td><td>g(b, c)（aは固定済み）</td></tr>
</table>
<p>JavaScriptで部分適用を行う代表的な方法は2つあります。1つ目はラッパー関数（元の関数を包む関数）を書く方法です。</p>
<pre><code>function greet(greeting, name) {
  return greeting + "、" + name + "さん";
}

// ラッパー関数で第1引数を"こんにちは"に固定する
const sayHello = function (name) {
  return greet("こんにちは", name);
};
console.log(sayHello("たろう")); // こんにちは、たろうさん</code></pre>
<p>2つ目は関数の<code>bind</code>メソッドです。<code>bind</code>の第1引数はthisの指定（第11章）ですが、<strong>第2引数以降に渡した値は元の関数の先頭の引数として固定</strong>されます。thisを使わない関数なら第1引数は<code>null</code>で構いません。</p>
<pre><code>const sayMorning = greet.bind(null, "おはよう");
console.log(sayMorning("はなこ")); // おはよう、はなこさん</code></pre>
<p>「ログ出力関数のプレフィックスを固定する」「APIの共通設定を固定する」など、同じ引数を何度も書く重複を消したいときに部分適用が活躍します。</p>`,
      task: `<code>bind</code>を使って挨拶を「おはよう」に固定した<code>sayMorning</code>を作り、ラッパー関数版の<code>sayHello</code>と同じように動くことを確認しましょう。`,
      code: `function greet(greeting, name) {
  return greeting + "、" + name + "さん";
}

// ラッパー関数による部分適用（完成済み）
const sayHello = function (name) {
  return greet("こんにちは", name);
};

// TODO: bindを使って第1引数を"おはよう"に固定したsayMorningを作る
const sayMorning = null;

console.log(sayHello("たろう"));
console.log(sayMorning("はなこ"));
console.log(sayMorning("じろう"));`,
      solution: `function greet(greeting, name) {
  return greeting + "、" + name + "さん";
}

// ラッパー関数による部分適用（完成済み）
const sayHello = function (name) {
  return greet("こんにちは", name);
};

// bindの第2引数以降は、元の関数の先頭の引数として固定される
const sayMorning = greet.bind(null, "おはよう");

console.log(sayHello("たろう"));
console.log(sayMorning("はなこ"));
console.log(sayMorning("じろう"));`,
      hints: [
        `bindの第1引数はthisの指定です。thisを使わない関数ではnullを渡します。`,
        `greet.bind(null, "おはよう") で、greetingが"おはよう"に固定された新しい関数が返ります。`
      ],
      expectedOutput: "おはよう、はなこさん"
    },
    {
      id: 176,
      title: "pipeで左から右へ流す",
      explanation: `<p>ステップ173の<code>compose</code>は右から左へ適用されるため、処理の流れと読む方向が逆になりがちでした。そこで実務では、<strong>左から右へ</strong>関数を適用する<code>pipe</code>（パイプ）がよく使われます。データが配管を流れるイメージです。</p>
<pre><code>function pipe(...fns) {
  return function (x) {
    return fns.reduce(function (acc, fn) {
      return fn(acc); // 前の結果accを次の関数fnに渡す
    }, x);
  };
}</code></pre>
<p>仕組みを分解しましょう。</p>
<ul>
<li><code>...fns</code>は残余引数（第4章）。渡された関数たちが配列<code>fns</code>にまとまる</li>
<li><code>reduce</code>（第6章）が「初期値x → 関数1の結果 → 関数2の結果…」と<strong>結果をバトンのように受け渡す</strong></li>
<li>最後の関数の結果が全体の戻り値になる</li>
</ul>
<pre><code>const trim = function (s) { return s.trim(); };
const toUpper = function (s) { return s.toUpperCase(); };
const exclaim = function (s) { return s + "!"; };

const shout = pipe(trim, toUpper, exclaim);
console.log(shout("  hello  ")); // "HELLO!"</code></pre>
<table>
<tr><th>関数</th><th>適用順</th><th>読み方</th></tr>
<tr><td><code>compose(f, g, h)</code></td><td>h → g → f（右から左）</td><td>数学寄り</td></tr>
<tr><td><code>pipe(f, g, h)</code></td><td>f → g → h（左から右）</td><td>処理の流れどおり</td></tr>
</table>
<p><code>pipe(trim, toUpper, exclaim)</code>は「トリムして、大文字にして、!を付ける」と、書いた順に読み下せます。3個以上の処理をつなぐときの読みやすさはcomposeより圧倒的で、データ加工パイプラインの定番部品です。</p>`,
      task: `<code>pipe</code>関数のTODO（reduceによる受け渡し）を完成させて、文字列が「trim→大文字化→!付加」の順に加工されるようにしましょう。`,
      code: `function pipe(...fns) {
  return function (x) {
    // TODO: reduceを使い、初期値xから順に各関数fnを適用していく
    return x;
  };
}

const trim = function (s) { return s.trim(); };
const toUpper = function (s) { return s.toUpperCase(); };
const exclaim = function (s) { return s + "!"; };

const shout = pipe(trim, toUpper, exclaim);

console.log("結果: " + shout("  hello  "));
console.log("結果2: " + shout(" functional js "));`,
      solution: `function pipe(...fns) {
  return function (x) {
    // accが「ここまでの加工結果」。左の関数から順に適用される
    return fns.reduce(function (acc, fn) {
      return fn(acc);
    }, x);
  };
}

const trim = function (s) { return s.trim(); };
const toUpper = function (s) { return s.toUpperCase(); };
const exclaim = function (s) { return s + "!"; };

const shout = pipe(trim, toUpper, exclaim);

console.log("結果: " + shout("  hello  "));
console.log("結果2: " + shout(" functional js "));`,
      hints: [
        `reduceの初期値をxにし、コールバックで「前の結果を次の関数に渡した戻り値」を返します。`,
        `fns.reduce(function (acc, fn) { return fn(acc); }, x) と書きます。`
      ],
      expectedOutput: "結果: HELLO!"
    },
    {
      id: 177,
      title: "メモ化で計算結果を再利用",
      explanation: `<p>純粋関数には「同じ入力なら必ず同じ出力」という保証があります。この性質を利用すると、<strong>一度計算した結果を保存しておき、同じ入力が来たら計算せずに保存済みの答えを返す</strong>最適化ができます。これを<strong>メモ化</strong>（memoization）と呼びます。</p>
<pre><code>function memoize(fn) {
  const cache = {}; // 入力→結果の対応表（クロージャで保持）
  return function (n) {
    if (n in cache) {
      return cache[n]; // 保存済みなら即返す
    }
    const result = fn(n); // 初めての入力だけ実際に計算する
    cache[n] = result;
    return result;
  };
}</code></pre>
<p>ポイントを整理します。</p>
<ul>
<li><code>cache</code>はクロージャの中に隠れており、外から壊される心配がない</li>
<li><code>in</code>演算子で「そのキーが保存済みか」を確認している</li>
<li><code>memoize</code>は「関数を受け取り、キャッシュ機能付きの関数を返す」<strong>高階関数</strong></li>
</ul>
<p>効果は劇的です。重い計算をメモ化すると、2回目以降は計算コストがほぼゼロになります。</p>
<pre><code>let callCount = 0;
function slowSquare(n) {
  callCount = callCount + 1; // 実際に計算した回数を記録
  return n * n;
}
const fastSquare = memoize(slowSquare);
fastSquare(9); // 計算する（1回目）
fastSquare(9); // キャッシュから返す（計算しない）
console.log(callCount); // 1</code></pre>
<p>注意点は2つ。メモ化できるのは<strong>純粋関数だけ</strong>です（結果が入力以外に依存すると、間違った答えをキャッシュしてしまいます）。また、キャッシュはメモリを消費するため、入力の種類が無限に多い関数では使いどころを見極める必要があります。</p>`,
      task: `<code>memoize</code>関数のTODO（キャッシュの確認と保存）を完成させて、同じ入力での2回目の呼び出しが計算をスキップすることを確認しましょう。`,
      code: `function memoize(fn) {
  const cache = {};
  return function (n) {
    // TODO: cacheにnの結果が保存済みならそれを返す

    // TODO: 未保存ならfn(n)を計算し、cacheに保存してから返す
    return fn(n);
  };
}

let callCount = 0;
function slowSquare(n) {
  callCount = callCount + 1;
  return n * n;
}

const fastSquare = memoize(slowSquare);

console.log("9の2乗: " + fastSquare(9));
console.log("9の2乗(再): " + fastSquare(9));
console.log("5の2乗: " + fastSquare(5));
console.log("実際の計算回数: " + callCount);`,
      solution: `function memoize(fn) {
  const cache = {};
  return function (n) {
    // 保存済みの入力なら、計算せずキャッシュを返す
    if (n in cache) {
      return cache[n];
    }
    // 初めての入力だけ実際に計算し、結果を保存する
    const result = fn(n);
    cache[n] = result;
    return result;
  };
}

let callCount = 0;
function slowSquare(n) {
  callCount = callCount + 1;
  return n * n;
}

const fastSquare = memoize(slowSquare);

console.log("9の2乗: " + fastSquare(9));
console.log("9の2乗(再): " + fastSquare(9));
console.log("5の2乗: " + fastSquare(5));
console.log("実際の計算回数: " + callCount);`,
      hints: [
        `保存済みかどうかは if (n in cache) で確認できます。`,
        `未保存のときは const result = fn(n); cache[n] = result; return result; の3手順です。`,
        `正しく動けば、fastSquareを3回呼んでも計算回数は2回になります。`
      ],
      expectedOutput: "実際の計算回数: 2"
    },
    {
      id: 178,
      title: "再帰とスタックの限界",
      explanation: `<p>第4章で学んだ再帰は、関数型プログラミングで多用される技法ですが、<strong>深さに限界がある</strong>ことを知っておく必要があります。</p>
<p>関数を呼び出すたびに、JavaScriptエンジンは「呼び出し元に戻るための情報」を<strong>コールスタック</strong>（call stack）という領域に積みます。再帰は自分自身を呼ぶたびにスタックが1段ずつ積み上がるため、深すぎる再帰はスタックの容量を使い果たし、<strong>RangeError: Maximum call stack size exceeded</strong>というエラーで停止します。</p>
<pre><code>function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1); // nの回数だけスタックが積まれる
}
console.log(sumTo(1000));   // 500500（これは動く）
// console.log(sumTo(100000)); // RangeError！ 10万段は積めない</code></pre>
<p>この限界を超える最も確実な方法は、再帰を<strong>ループに書き換える</strong>ことです。ループはスタックを消費しないため、回数がいくら多くても問題ありません。</p>
<pre><code>function sumToLoop(n) {
  let total = 0;
  for (let i = 1; i &lt;= n; i++) {
    total = total + i;
  }
  return total; // 10万回でも100万回でも安全
}</code></pre>
<table>
<tr><th>方式</th><th>スタック消費</th><th>向いている場面</th></tr>
<tr><td>再帰</td><td>深さの分だけ積む</td><td>木構造の探索など、深さが浅い問題</td></tr>
<tr><td>ループ</td><td>消費しない</td><td>回数が多い単純な繰り返し</td></tr>
</table>
<p>再帰は「問題の構造をそのままコードにできる」美しい書き方ですが、データ量が大きくなり得る処理では、ループ版への書き換えを常に選択肢として持っておきましょう。</p>`,
      task: `再帰版<code>sumTo</code>は100000を渡すとRangeErrorになります。同じ計算をするループ版<code>sumToLoop</code>のTODOを完成させて、100000までの合計を安全に求めましょう。`,
      code: `// 再帰版：nが大きいとRangeErrorになる（コメントを外すと確認できる）
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
// console.log(sumTo(100000)); // RangeError: Maximum call stack size exceeded

// TODO: forループで1からnまでの合計を求めるように完成させる
function sumToLoop(n) {
  let total = 0;

  return total;
}

console.log("1000まで(再帰): " + sumTo(1000));
console.log("100000まで(ループ): " + sumToLoop(100000));`,
      solution: `// 再帰版：nが大きいとRangeErrorになる（コメントを外すと確認できる）
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
// console.log(sumTo(100000)); // RangeError: Maximum call stack size exceeded

// ループ版はスタックを消費しないため、回数が多くても安全
function sumToLoop(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total = total + i;
  }
  return total;
}

console.log("1000まで(再帰): " + sumTo(1000));
console.log("100000まで(ループ): " + sumToLoop(100000));`,
      hints: [
        `iを1からnまで動かすforループの中で、totalにiを足し込みます。`,
        `for (let i = 1; i <= n; i++) { total = total + i; } と書きます。`,
        `1から100000までの合計は5000050000です。`
      ],
      expectedOutput: "100000まで(ループ): 5000050000"
    },
    {
      id: 179,
      title: "宣言的スタイルと命令的スタイル",
      explanation: `<p>ここまで学んだ道具が揃うと、同じ処理を2つのスタイルで書き比べられるようになります。</p>
<ul>
<li><strong>命令的</strong>（imperative）：「<strong>どうやって</strong>やるか」を手順として書く。ループ・添字・一時変数を自分で管理する</li>
<li><strong>宣言的</strong>（declarative）：「<strong>何を</strong>したいか」を書く。手順の管理はmapやfilterに任せる</li>
</ul>
<p>「合格者(80点以上)の点数を2倍にして合計する」処理で比較してみましょう。</p>
<pre><code>// 命令的：ループと一時変数で手順を全部自分で書く
let sum = 0;
for (let i = 0; i &lt; scores.length; i++) {
  if (scores[i] &gt;= 80) {
    sum = sum + scores[i] * 2;
  }
}

// 宣言的：やりたいことをメソッドチェーンで並べる
const sum2 = scores
  .filter(function (s) { return s &gt;= 80; }) // 80以上を選び
  .map(function (s) { return s * 2; })      // 2倍にして
  .reduce(function (a, b) { return a + b; }, 0); // 合計する</code></pre>
<table>
<tr><th>観点</th><th>命令的</th><th>宣言的</th></tr>
<tr><td>読み方</td><td>手順を追って意図を推測する</td><td>意図がそのまま並んでいる</td></tr>
<tr><td>一時変数</td><td>必要（sum、iなど）</td><td>ほぼ不要</td></tr>
<tr><td>バグの入りやすさ</td><td>添字ミス・条件漏れが起きやすい</td><td>各段が独立していて安全</td></tr>
<tr><td>性能</td><td>細かく制御できる</td><td>中間配列が作られる分やや不利</td></tr>
</table>
<p>宣言的スタイルの各段（filter・map・reduce）に渡しているのは、すべてこの章で学んだ<strong>純粋関数</strong>です。だからこそ各段を独立にテストでき、組み替えも自由なのです。ただし性能が最優先の場面や複雑な途中終了があるロジックでは命令的な書き方が適することもあります。まず宣言的に書き、必要な箇所だけ命令的にするのが現代的なバランスです。</p>`,
      task: `命令的なforループで書かれた処理を、<code>filter</code>・<code>map</code>・<code>reduce</code>のメソッドチェーンによる宣言的スタイルに書き換えましょう。`,
      code: `const scores = [55, 90, 82, 47, 100, 68, 85];

// 命令的スタイル（完成済み・参考）
let imperativeSum = 0;
for (let i = 0; i < scores.length; i++) {
  if (scores[i] >= 80) {
    imperativeSum = imperativeSum + scores[i] * 2;
  }
}
console.log("命令的: " + imperativeSum);

// TODO: filter(80以上)→map(2倍)→reduce(合計)のチェーンで同じ結果を求める
const declarativeSum = 0;

console.log("宣言的: " + declarativeSum);`,
      solution: `const scores = [55, 90, 82, 47, 100, 68, 85];

// 命令的スタイル（完成済み・参考）
let imperativeSum = 0;
for (let i = 0; i < scores.length; i++) {
  if (scores[i] >= 80) {
    imperativeSum = imperativeSum + scores[i] * 2;
  }
}
console.log("命令的: " + imperativeSum);

// 宣言的スタイル：「選ぶ→変換する→集計する」の意図がそのまま並ぶ
const declarativeSum = scores
  .filter(function (s) { return s >= 80; })
  .map(function (s) { return s * 2; })
  .reduce(function (a, b) { return a + b; }, 0);

console.log("宣言的: " + declarativeSum);`,
      hints: [
        `処理を「80以上を選ぶ」「2倍にする」「合計する」の3段に分解して、それぞれをメソッドにします。`,
        `scores.filter(...).map(...).reduce(..., 0) の形でつなぎます。reduceの初期値0を忘れずに。`,
        `対象は90、82、100、85の4つ。2倍して合計すると714になります。`
      ],
      expectedOutput: "宣言的: 714"
    },
    {
      id: 180,
      title: "総合演習：関数合成パイプライン",
      explanation: `<p>この章の総仕上げとして、注文データを加工する<strong>関数合成パイプライン</strong>を作ります。使う道具はすべて学習済みです。</p>
<table>
<tr><th>部品</th><th>役割</th><th>学んだステップ</th></tr>
<tr><td>純粋関数</td><td>各加工ステップを独立した部品にする</td><td>171</td></tr>
<tr><td>イミュータブル操作</td><td>元データを壊さずに加工する</td><td>172</td></tr>
<tr><td>pipe</td><td>部品を左から右へつなぐ</td><td>176</td></tr>
<tr><td>宣言的スタイル</td><td>filter・map・reduceで意図を表現</td><td>179</td></tr>
</table>
<p>設計方針はこうです。「在庫のある注文だけ選ぶ」「10%割引を適用する」「合計金額を出す」という3つの<strong>純粋関数</strong>を作り、<code>pipe</code>で1本のパイプラインに合成します。</p>
<pre><code>const processOrders = pipe(
  filterInStock,   // 配列 → 配列（在庫ありだけ残す）
  applyDiscount,   // 配列 → 配列（価格を90%にする）
  calcTotal        // 配列 → 数値（合計する）
);
console.log(processOrders(orders));</code></pre>
<p>各関数の「入力の型 → 出力の型」がつながっていることに注目してください。前の関数の出力が、次の関数の入力として意味を成すからこそ合成できます（配列→配列→配列→数値）。</p>
<p>そして重要なのが、パイプラインを通しても<strong>元のordersが一切変わらない</strong>ことです。filterとmapは新しい配列を返す非破壊メソッドなので、パイプラインは何度流しても同じ結果になります。これが「純粋関数＋イミュータブル＋合成」という関数型の三点セットの威力です。部品は個別にテストでき、組み替えは1行の順序変更で済み、元データはいつでも無傷。実務のデータ加工処理そのものの構造です。</p>`,
      task: `3つの純粋関数（<code>filterInStock</code>・<code>applyDiscount</code>・<code>calcTotal</code>）のTODOを完成させて、pipeで合成したパイプラインで合計金額を求めましょう。`,
      code: `function pipe(...fns) {
  return function (x) {
    return fns.reduce(function (acc, fn) { return fn(acc); }, x);
  };
}

const orders = [
  { item: "キーボード", price: 8000, inStock: true },
  { item: "モニター", price: 30000, inStock: false },
  { item: "ヘッドセット", price: 12000, inStock: true },
  { item: "Webカメラ", price: 6000, inStock: true }
];

// TODO: 在庫あり（inStockがtrue）の注文だけをfilterで残す純粋関数
const filterInStock = function (list) {
  return list;
};

// TODO: 各注文のpriceを10%引き（0.9倍してMath.floor）にした新しい配列をmapで作る純粋関数
const applyDiscount = function (list) {
  return list;
};

// TODO: priceをreduceで合計して数値を返す純粋関数
const calcTotal = function (list) {
  return 0;
};

const processOrders = pipe(filterInStock, applyDiscount, calcTotal);

console.log("割引後合計: " + processOrders(orders) + "円");
console.log("元データの件数: " + orders.length + "件（無傷）");
console.log("元の価格例: " + orders[0].price + "円（無傷）");`,
      solution: `function pipe(...fns) {
  return function (x) {
    return fns.reduce(function (acc, fn) { return fn(acc); }, x);
  };
}

const orders = [
  { item: "キーボード", price: 8000, inStock: true },
  { item: "モニター", price: 30000, inStock: false },
  { item: "ヘッドセット", price: 12000, inStock: true },
  { item: "Webカメラ", price: 6000, inStock: true }
];

// 在庫ありの注文だけを残す（filterは非破壊なので元データは無傷）
const filterInStock = function (list) {
  return list.filter(function (order) { return order.inStock; });
};

// スプレッドで各注文をコピーしつつ、価格だけ10%引きに差し替える
const applyDiscount = function (list) {
  return list.map(function (order) {
    return { ...order, price: Math.floor(order.price * 0.9) };
  });
};

// 価格を合計して数値を返す
const calcTotal = function (list) {
  return list.reduce(function (sum, order) { return sum + order.price; }, 0);
};

const processOrders = pipe(filterInStock, applyDiscount, calcTotal);

console.log("割引後合計: " + processOrders(orders) + "円");
console.log("元データの件数: " + orders.length + "件（無傷）");
console.log("元の価格例: " + orders[0].price + "円（無傷）");`,
      hints: [
        `filterInStockは list.filter(function (order) { return order.inStock; }) です。`,
        `applyDiscountでは { ...order, price: Math.floor(order.price * 0.9) } のように、コピーしてpriceだけ上書きします。`,
        `在庫ありは8000・12000・6000円の3件。それぞれ10%引きして合計すると23400円になります。`
      ],
      expectedOutput: "割引後合計: 23400円"
    }
  ]
});
