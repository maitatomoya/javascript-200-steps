// 第4章：関数
registerChapter({
  number: 4,
  title: "関数",
  description: "処理をまとめて名前を付ける「関数」を学びます。関数宣言・関数式・アロー関数の3つの書き方と、引数・戻り値の使いこなしがゴールです。",
  steps: [
    {
      id: 31,
      title: "関数宣言で処理をまとめる",
      explanation: `<p>同じ処理を何度も書くのは大変ですし、修正のときに漏れが出ます。<strong>関数</strong>は「一連の処理に名前を付けてまとめ、好きなタイミングで何度でも呼び出せる」仕組みです。</p>
<pre><code>function 関数名() {
  // まとめたい処理
}</code></pre>
<p><code>function</code>キーワードで始まるこの書き方を<strong>関数宣言</strong>と呼びます。定義しただけでは実行されず、<code>関数名()</code>と書いたときに初めて実行されます。これを「関数を<strong>呼び出す</strong>」と言います。</p>
<pre><code>function greet() {
  console.log("こんにちは！");
}

greet();  // ここで初めて実行される
greet();  // 何度でも呼び出せる</code></pre>
<p>この例では「こんにちは！」が2回表示されます。</p>
<h4>関数を使う3つのメリット</h4>
<ul>
<li><strong>再利用</strong>：同じ処理を1回書けば何度でも使える</li>
<li><strong>保守性</strong>：修正が1か所で済む</li>
<li><strong>可読性</strong>：処理に名前が付くので、コードが「何をしているか」読みやすくなる</li>
</ul>
<p>関数名は変数と同じく、内容がわかる動詞ベースの名前（greet、calculateTotalなど）を付けるのが慣習です。呼び出し時の丸かっこ<code>()</code>を忘れると実行されないので注意してください。</p>`,
      task: `関数<code>greet</code>は定義されていますが、まだ呼び出されていません。<code>greet</code>を2回呼び出して「こんにちは！」を2回表示してください。`,
      code: `function greet() {
  console.log("こんにちは！");
}

// TODO: greetを2回呼び出す
`,
      solution: `function greet() {
  console.log("こんにちは！");
}

// 関数名()で呼び出す。何度でも呼べる
greet();
greet();
`,
      hints: [
        `関数は定義しただけでは動きません。呼び出しの文が必要です。`,
        `greet();と書いた行を2行並べます。丸かっこを忘れずに。`
      ],
      expectedOutput: "こんにちは！"
    },
    {
      id: 32,
      title: "引数で値を渡す",
      explanation: `<p>前のステップの関数は毎回まったく同じ動きしかできませんでした。<strong>引数（ひきすう）</strong>を使うと、呼び出すたびに違う値を関数へ渡して、動きを変えられます。</p>
<pre><code>function greet(name) {          // nameが仮引数
  console.log("こんにちは、" + name + "さん！");
}

greet("田中");   // "田中"が実引数
greet("鈴木");</code></pre>
<p>用語を整理しましょう。</p>
<table>
<tr><th>用語</th><th>意味</th></tr>
<tr><td><strong>仮引数</strong>（パラメータ）</td><td>関数定義側の受け取り口。関数の中だけで使える変数になる</td></tr>
<tr><td><strong>実引数</strong>（アーギュメント）</td><td>呼び出し時に実際に渡す値</td></tr>
</table>
<p>引数はカンマで区切って複数受け取れます。渡した順番どおりに対応します。</p>
<pre><code>function add(a, b) {
  console.log(a + " + " + b + " = " + (a + b));
}

add(3, 5);   // aに3、bに5が入る</code></pre>
<p>引数の値は呼び出しごとにセットし直されるため、同じ関数でも呼び出すたびに違う結果を出せます。「共通の手順は関数に、変わる部分は引数に」というのが関数設計の基本の考え方です。</p>`,
      task: `関数<code>add</code>が2つの数値を受け取れるように仮引数を追加し、<code>add(3, 5)</code>で「3 + 5 = 8」と表示されるようにしてください。`,
      code: `function greet(name) {
  console.log("こんにちは、" + name + "さん！");
}
greet("田中");

// TODO: 仮引数aとbを受け取るようにして、計算結果を表示する
function add() {
  console.log("? + ? = ?");
}
add(3, 5);
`,
      solution: `function greet(name) {
  console.log("こんにちは、" + name + "さん！");
}
greet("田中");

// aとbは呼び出し時に渡された順番で値を受け取る
function add(a, b) {
  console.log(a + " + " + b + " = " + (a + b));
}
add(3, 5);
`,
      hints: [
        `仮引数は関数名の後ろの丸かっこ内にカンマ区切りで書きます：function add(a, b)`,
        `計算部分は(a + b)のように丸かっこで囲むと、文字列連結と混ざりません。`
      ],
      expectedOutput: "3 + 5 = 8"
    },
    {
      id: 33,
      title: "returnで結果を返す",
      explanation: `<p>これまでの関数は結果をconsole.logで表示するだけでした。しかし実務では「計算結果を受け取って、次の処理に使いたい」場面がほとんどです。そこで使うのが<strong>return文</strong>です。</p>
<pre><code>function add(a, b) {
  return a + b;   // 呼び出し元に値を返す
}

const result = add(3, 5);   // resultに8が入る
console.log("合計は" + result);</code></pre>
<p>returnされた値を<strong>戻り値（返り値）</strong>と呼びます。関数呼び出しの式<code>add(3, 5)</code>全体が、戻り値の<code>8</code>に置き換わるイメージです。</p>
<h4>returnの重要な性質</h4>
<ul>
<li><strong>returnした瞬間に関数は終了する</strong>。return以降の行は実行されない</li>
<li>returnがない関数の戻り値は<code>undefined</code>になる（第2章で学んだ「値がない」状態）</li>
<li>戻り値は変数に入れる以外に、そのまま別の計算や関数呼び出しにも使える</li>
</ul>
<p>booleanを返す関数もよく作られます。</p>
<pre><code>function isAdult(age) {
  return age &gt;= 18;   // 比較式の結果(true/false)をそのまま返す
}
console.log(isAdult(20));   // true</code></pre>
<p>「表示する（console.log）」と「返す（return）」は初心者が最も混同しやすいポイントです。<strong>console.logは人間に見せるだけ、returnはプログラムに値を渡す</strong>、と区別して覚えましょう。</p>`,
      task: `関数<code>add</code>が計算結果を表示する代わりに<code>return</code>で返すように書き換え、呼び出し側で「合計は8」と表示してください。`,
      code: `// TODO: console.logではなくreturnで結果を返すように書き換える
function add(a, b) {
  console.log(a + b);
}

const result = add(3, 5);
console.log("合計は" + result);  // 今は「合計はundefined」になってしまう
`,
      solution: `// returnで呼び出し元に値を返す
function add(a, b) {
  return a + b;
}

const result = add(3, 5);
console.log("合計は" + result);
`,
      hints: [
        `まず修正前のコードを実行して「合計はundefined」になることを確認しましょう。returnがない関数の戻り値はundefinedです。`,
        `関数の中身をreturn a + b;の1行にします。`
      ],
      expectedOutput: "合計は8"
    },
    {
      id: 34,
      title: "関数式：関数を変数に入れる",
      explanation: `<p>JavaScriptの大きな特徴は、<strong>関数も数値や文字列と同じ「値」として扱える</strong>ことです。つまり関数を変数に代入できます。この書き方を<strong>関数式</strong>と呼びます。</p>
<pre><code>// 関数宣言（前ステップまでの書き方）
function square(n) {
  return n * n;
}

// 関数式：名前のない関数を作って変数に代入する
const square = function (n) {
  return n * n;
};</code></pre>
<p>関数式で作られる名前のない関数を<strong>無名関数</strong>（匿名関数）と呼びます。呼び出し方はどちらも同じで<code>square(4)</code>です。</p>
<h4>関数宣言との違い</h4>
<table>
<tr><th>項目</th><th>関数宣言</th><th>関数式</th></tr>
<tr><td>書き方</td><td>functionで文を始める</td><td>変数への代入の右辺に書く</td></tr>
<tr><td>定義前の呼び出し</td><td>できる（巻き上げ）</td><td>できない（エラー）</td></tr>
<tr><td>文末のセミコロン</td><td>不要</td><td>必要（代入文なので）</td></tr>
</table>
<p>関数宣言は定義がファイルの下にあっても先に呼び出せますが（この挙動は第10章で詳しく学びます）、関数式は代入される前に呼ぶとエラーになります。constで定義すれば「うっかり別の関数で上書きされない」という利点もあり、実務では関数式ベースの書き方が広く使われています。次のステップで学ぶアロー関数は、この関数式をさらに短くしたものです。</p>`,
      task: `関数宣言で書かれた<code>square</code>を、constへの代入による関数式に書き換えてください。動作は同じ「4の2乗は16」の表示です。`,
      code: `// TODO: この関数宣言を「const square = function (n) { ... };」の関数式に書き換える
function square(n) {
  return n * n;
}

console.log("4の2乗は" + square(4));
`,
      solution: `// 無名関数を作ってconstの変数squareに代入する（関数式）
const square = function (n) {
  return n * n;
};

console.log("4の2乗は" + square(4));
`,
      hints: [
        `形は const 変数名 = function (引数) { ... }; です。`,
        `関数式は代入文なので、閉じ波かっこの後にセミコロンを付けます。`
      ],
      expectedOutput: "4の2乗は16"
    },
    {
      id: 35,
      title: "アロー関数",
      explanation: `<p>前のステップの関数式には、もっと短く書ける現代的な記法があります。<strong>アロー関数</strong>です。<code>function</code>キーワードの代わりに、矢印のような<code>=&gt;</code>（アロー）を使います。</p>
<pre><code>// 関数式
const double = function (n) {
  return n * 2;
};

// アロー関数：functionを消して、引数の後ろに =&gt; を置く
const double = (n) =&gt; {
  return n * 2;
};</code></pre>
<p>書き換えの手順は機械的です。</p>
<ol>
<li><code>function</code>キーワードを削除する</li>
<li>引数の丸かっこと波かっこの間に<code>=&gt;</code>を入れる</li>
</ol>
<p>呼び出し方は今までと変わらず<code>double(7)</code>です。</p>
<h4>アロー関数が主流になった理由</h4>
<ul>
<li>記述が短い（次ステップの省略記法でさらに短くなる）</li>
<li>後の章で学ぶ「配列メソッドに関数を渡す」場面で圧倒的に書きやすい</li>
<li><code>this</code>の扱いがシンプル（第11章で学びます）</li>
</ul>
<p>2015年のES2015（ES6）というバージョンで導入されて以来、実務の現場ではアロー関数が標準的な書き方になっています。ただしfunction宣言が消えたわけではなく、どちらも読める必要があります。まずは「<code>=&gt;</code>を見たら関数だ」と反応できるようになりましょう。</p>`,
      task: `関数式で書かれた<code>double</code>をアロー関数に書き換えてください。動作は同じ「7の2倍は14」の表示です。`,
      code: `// TODO: functionキーワードを使わないアロー関数に書き換える
const double = function (n) {
  return n * 2;
};

console.log("7の2倍は" + double(7));
`,
      solution: `// functionを消して (引数) => { ... } の形にする
const double = (n) => {
  return n * 2;
};

console.log("7の2倍は" + double(7));
`,
      hints: [
        `functionを削除し、(n)の後ろに=>を追加します。`,
        `const double = (n) => { return n * 2; }; の形になります。`
      ],
      expectedOutput: "7の2倍は14"
    },
    {
      id: 36,
      title: "アロー関数の省略記法",
      explanation: `<p>アロー関数の真価は、条件を満たすとさらに短く書けることです。省略ルールは2つあります。</p>
<h4>ルール1：本体がreturnの1行だけなら、波かっことreturnを省略できる</h4>
<pre><code>// 省略なし
const triple = (n) =&gt; {
  return n * 3;
};

// 省略あり：=&gt; の右の式が自動的にreturnされる
const triple = (n) =&gt; n * 3;</code></pre>
<p>波かっこを外した形では、<code>=&gt;</code>の右に書いた式の結果が<strong>自動的に戻り値になります</strong>。逆に波かっこを書いた場合はreturnを省略できない点に注意してください（<code>(n) =&gt; { n * 3 }</code>はundefinedを返すバグの元です）。</p>
<h4>ルール2：引数が1つだけなら、丸かっこも省略できる</h4>
<pre><code>const triple = n =&gt; n * 3;</code></pre>
<p>ただし引数が0個または2個以上のときは丸かっこが必須です。</p>
<table>
<tr><th>引数の数</th><th>書き方の例</th></tr>
<tr><td>0個</td><td><code>() =&gt; 42</code></td></tr>
<tr><td>1個</td><td><code>n =&gt; n * 3</code>（かっこ省略可）</td></tr>
<tr><td>2個以上</td><td><code>(a, b) =&gt; a + b</code></td></tr>
</table>
<p>実務のコードでは<code>(a, b) =&gt; a + b</code>のような1行アロー関数が大量に登場します。チームによっては「引数のかっこは常に付ける」というルールを採用することもあります（自動整形ツールPrettierの標準設定など）。読み書き両方に慣れておきましょう。</p>`,
      task: `2つのアロー関数を、波かっこ・returnを省略した1行の省略記法に書き換えてください。`,
      code: `// TODO: 2つとも「=> 式」の1行省略記法に書き換える
const triple = (n) => {
  return n * 3;
};

const add = (a, b) => {
  return a + b;
};

console.log("5の3倍は" + triple(5));
console.log("2 + 9 = " + add(2, 9));
`,
      solution: `// 本体がreturn1行だけなら波かっことreturnを省略できる
const triple = (n) => n * 3;

const add = (a, b) => a + b;

console.log("5の3倍は" + triple(5));
console.log("2 + 9 = " + add(2, 9));
`,
      hints: [
        `波かっこ・return・セミコロンを消して、=>の右に式だけを残します。`,
        `const triple = (n) => n * 3; のように1行で書けます。`
      ],
      expectedOutput: "5の3倍は15"
    },
    {
      id: 37,
      title: "デフォルト引数",
      explanation: `<p>引数を渡さずに関数を呼び出すと、仮引数には<code>undefined</code>が入ります。そのまま文字列連結すると「こんにちは、undefinedさん！」のような残念な表示になってしまいます。</p>
<p>この問題を防ぐのが<strong>デフォルト引数</strong>です。仮引数に<code>= 初期値</code>を添えると、<strong>引数が渡されなかったときだけ</strong>その値が使われます。</p>
<pre><code>function greet(name = "ゲスト") {
  console.log("ようこそ、" + name + "さん！");
}

greet("佐藤");   // ようこそ、佐藤さん！（渡した値が優先）
greet();         // ようこそ、ゲストさん！（デフォルト値が使われる）</code></pre>
<h4>動作のルール</h4>
<ul>
<li>引数を渡せば渡した値、省略すればデフォルト値</li>
<li>明示的に<code>undefined</code>を渡した場合もデフォルト値が使われる</li>
<li>複数の引数のうち一部だけにデフォルト値を設定できる。その場合、<strong>デフォルト値付きの引数は後ろに置く</strong>のが原則（前に置くと省略できないため）</li>
</ul>
<pre><code>function orderCoffee(size, sugar = 0) {
  console.log(size + "サイズ、砂糖" + sugar + "個");
}
orderCoffee("M");        // Mサイズ、砂糖0個
orderCoffee("L", 2);     // Lサイズ、砂糖2個</code></pre>
<p>デフォルト引数は「省略可能なオプション」を表現する定番の手段で、ライブラリの関数設計でも多用されています。</p>`,
      task: `関数<code>greet</code>の仮引数<code>name</code>にデフォルト値「ゲスト」を設定し、引数なしで呼んだときに「ようこそ、ゲストさん！」と表示されるようにしてください。`,
      code: `// TODO: nameにデフォルト値"ゲスト"を設定する
function greet(name) {
  console.log("ようこそ、" + name + "さん！");
}

greet("佐藤");
greet();  // 今は「ようこそ、undefinedさん！」になってしまう
`,
      solution: `// 引数が渡されなかったときだけ"ゲスト"が使われる
function greet(name = "ゲスト") {
  console.log("ようこそ、" + name + "さん！");
}

greet("佐藤");
greet();
`,
      hints: [
        `まず修正前のコードを実行して、undefinedが表示されるのを確認しましょう。`,
        `仮引数の部分を name = "ゲスト" と書きます。`
      ],
      expectedOutput: "ようこそ、ゲストさん！"
    },
    {
      id: 38,
      title: "残余引数（...args）",
      explanation: `<p>「引数をいくつ渡されても全部受け取りたい」関数を作るには、<strong>残余引数</strong>（rest parameters）を使います。仮引数の前にドット3つ<code>...</code>を付けるだけです。</p>
<pre><code>function sumAll(...numbers) {
  // numbersには渡された値が順番にまとまって入る
}

sumAll(1, 2, 3);          // 3個渡してもOK
sumAll(10, 20, 30, 40);   // 4個でもOK</code></pre>
<p>残余引数で受け取った<code>numbers</code>は、渡された値が順番に並んだ「リストのような入れ物」（配列と呼びます。詳しくは第5章で学びます）になります。今の時点では次の2つだけ知っていれば十分です。</p>
<ul>
<li><code>numbers.length</code>…受け取った値の個数</li>
<li><code>numbers[i]</code>…i番目の値（<strong>番号は0から始まる</strong>点に注意）</li>
</ul>
<p>この2つとfor文を組み合わせると、全部の値を順に処理できます。</p>
<pre><code>function sumAll(...numbers) {
  let total = 0;
  for (let i = 0; i &lt; numbers.length; i++) {
    total = total + numbers[i];
  }
  return total;
}

console.log(sumAll(1, 2, 3));         // 6
console.log(sumAll(10, 20, 30, 40));  // 100</code></pre>
<h4>ルール</h4>
<ul>
<li>残余引数は<strong>仮引数リストの最後に1つだけ</strong>置ける（<code>function f(first, ...rest)</code>のように通常の引数との併用は可）</li>
<li>ループ条件が<code>i &lt;= length</code>ではなく<code>i &lt; length</code>なのは、番号が0始まりだからです</li>
</ul>`,
      task: `残余引数を使って、渡された数値をすべて合計する関数<code>sumAll</code>を完成させてください。<code>sumAll(10, 20, 30, 40)</code>で「合計は100」と表示されます。`,
      code: `// TODO: ...を使った残余引数にして、forループで全部足す
function sumAll(numbers) {
  let total = 0;
  // ここにforループを書く（i = 0 から numbers.length - 1 まで）
  return total;
}

console.log("合計は" + sumAll(1, 2, 3));
console.log("合計は" + sumAll(10, 20, 30, 40));
`,
      solution: `// ...numbersで、いくつ渡されても順番にまとめて受け取れる
function sumAll(...numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total = total + numbers[i];
  }
  return total;
}

console.log("合計は" + sumAll(1, 2, 3));
console.log("合計は" + sumAll(10, 20, 30, 40));
`,
      hints: [
        `仮引数を...numbersにすると、渡された値すべてがnumbersにまとまります。`,
        `forはfor (let i = 0; i < numbers.length; i++)の形。番号は0から始まります。`,
        `ループ内でtotal = total + numbers[i];と足し込みます。`
      ],
      expectedOutput: "合計は100"
    },
    {
      id: 39,
      title: "再帰関数：階乗を計算する",
      explanation: `<p>関数は自分自身を呼び出すこともできます。これを<strong>再帰（さいき）</strong>と呼びます。「同じ形のより小さい問題に分解できる」計算と相性抜群です。</p>
<p>代表例が<strong>階乗</strong>です。5の階乗（5!と書く）は5×4×3×2×1＝120。よく見ると「5! = 5 × 4!」という構造になっています。つまり階乗は「1つ小さい数の階乗」を使って定義できるのです。</p>
<pre><code>function factorial(n) {
  if (n &lt;= 1) {
    return 1;               // ベースケース：これ以上分解しない
  }
  return n * factorial(n - 1);  // 再帰ケース：自分自身を呼ぶ
}

console.log(factorial(5));  // 120</code></pre>
<h4>再帰の2大構成要素</h4>
<table>
<tr><th>要素</th><th>役割</th><th>忘れると</th></tr>
<tr><td><strong>ベースケース</strong></td><td>再帰を止める終了条件</td><td>無限に呼び出され続けてエラー（スタックオーバーフロー）</td></tr>
<tr><td><strong>再帰ケース</strong></td><td>問題を小さくして自分を呼ぶ</td><td>そもそも再帰にならない</td></tr>
</table>
<p>factorial(3)の展開を追うと理解しやすいです。</p>
<pre><code>factorial(3)
= 3 * factorial(2)
= 3 * (2 * factorial(1))
= 3 * (2 * 1)
= 6</code></pre>
<p>呼び出しがどんどん深くなり、ベースケースに到達した瞬間から答えが順に「戻ってくる」イメージです。whileやforで書ける処理も多いですが、木構造の探索など再帰でしか素直に書けない問題が実務にも存在します。ここで感覚をつかんでおきましょう。</p>`,
      task: `階乗を計算する再帰関数<code>factorial</code>を完成させてください。ベースケース（n以下が1なら1を返す）と再帰ケース（n × factorial(n - 1)）の2つが必要です。`,
      code: `function factorial(n) {
  // TODO: ベースケース（nが1以下なら1を返す）を書く

  // TODO: 再帰ケース（n * factorial(n - 1) を返す）を書く
  return 0;
}

console.log("5の階乗は" + factorial(5));
`,
      solution: `function factorial(n) {
  // ベースケース：ここで再帰が止まる
  if (n <= 1) {
    return 1;
  }
  // 再帰ケース：1つ小さい階乗の結果を使う
  return n * factorial(n - 1);
}

console.log("5の階乗は" + factorial(5));
`,
      hints: [
        `まず「if (n <= 1) { return 1; }」で止まる条件を書きます。これがないと無限再帰になります。`,
        `その後にreturn n * factorial(n - 1);を書きます。`
      ],
      expectedOutput: "5の階乗は120"
    },
    {
      id: 40,
      title: "総合演習：温度変換関数群",
      explanation: `<p>この章の総まとめとして、摂氏（℃）と華氏（°F）を変換する小さな関数群を作ります。変換公式は次のとおりです。</p>
<table>
<tr><th>変換</th><th>公式</th></tr>
<tr><td>摂氏→華氏</td><td>F = C × 9 ÷ 5 + 32</td></tr>
<tr><td>華氏→摂氏</td><td>C = (F - 32) × 5 ÷ 9</td></tr>
</table>
<p>設計方針は「<strong>小さな関数を組み合わせて大きな仕事をさせる</strong>」です。実務でも、1つの巨大な関数より、役割が明確な小さい関数の組み合わせが好まれます。</p>
<ol>
<li><code>toFahrenheit</code>…変換計算だけを担当（アロー関数の省略記法で）</li>
<li><code>describeTemperature</code>…気温の感想を返す（if / else ifで分岐）</li>
<li><code>report</code>…上の2つを<strong>呼び出して</strong>結果を整形表示する</li>
</ol>
<pre><code>const toFahrenheit = (celsius) =&gt; celsius * 9 / 5 + 32;

function report(celsius) {
  const f = toFahrenheit(celsius);   // 関数の中から別の関数を呼ぶ
  console.log(celsius + "度C = " + f + "度F");
}</code></pre>
<p>ポイントは<strong>関数の中から別の関数を呼び出せる</strong>ことです。reportは「変換の計算方法」を知らなくても、toFahrenheitに任せれば仕事が完成します。この「役割分担」の感覚が、これから先のプログラム設計の土台になります。</p>
<p>仕上げに、華氏→摂氏の変換では第2章で学んだ<code>toFixed(1)</code>を使い、割り切れない小数を1桁に丸めて表示します。</p>`,
      task: `TODOの3か所を完成させてください：(1)<code>toFahrenheit</code>の変換式、(2)<code>describeTemperature</code>の分岐（30以上「暑い」・15以上「快適」・それ以外「寒い」）、(3)<code>toCelsius</code>の変換式。`,
      code: `// TODO(1): 摂氏→華氏の式（celsius * 9 / 5 + 32）を完成させる
const toFahrenheit = (celsius) => 0;

// TODO(3): 華氏→摂氏の式（(fahrenheit - 32) * 5 / 9）を完成させる
const toCelsius = (fahrenheit) => 0;

// TODO(2): 30以上なら"暑い"、15以上なら"快適"、それ以外は"寒い"を返す
function describeTemperature(celsius) {
  return "";
}

function report(celsius) {
  const f = toFahrenheit(celsius);
  console.log(celsius + "度C = " + f + "度F（" + describeTemperature(celsius) + "）");
}

report(35);
report(20);
report(0);
console.log("100度F = " + toCelsius(100).toFixed(1) + "度C");
`,
      solution: `// 摂氏→華氏（アロー関数の省略記法）
const toFahrenheit = (celsius) => celsius * 9 / 5 + 32;

// 華氏→摂氏
const toCelsius = (fahrenheit) => (fahrenheit - 32) * 5 / 9;

// 気温の感想を返す（厳しい条件から順に判定）
function describeTemperature(celsius) {
  if (celsius >= 30) {
    return "暑い";
  } else if (celsius >= 15) {
    return "快適";
  } else {
    return "寒い";
  }
}

// 小さな関数を組み合わせて結果を整形する
function report(celsius) {
  const f = toFahrenheit(celsius);
  console.log(celsius + "度C = " + f + "度F（" + describeTemperature(celsius) + "）");
}

report(35);
report(20);
report(0);
console.log("100度F = " + toCelsius(100).toFixed(1) + "度C");
`,
      hints: [
        `toFahrenheitは省略記法なら => celsius * 9 / 5 + 32 だけでOKです。`,
        `describeTemperatureは第3章のelse ifを使い、30以上→15以上→それ以外の順で判定します。returnで文字列を返す点に注意。`,
        `toCelsiusの式は引き算を先にするため(fahrenheit - 32)と丸かっこで囲みます。`
      ],
      expectedOutput: "20度C = 68度F（快適）"
    }
  ]
});
