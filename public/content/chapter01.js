// 第1章：はじめてのJavaScript
registerChapter({
  number: 1,
  title: "はじめてのJavaScript",
  description: "console.logによる出力から変数・定数まで、JavaScriptの第一歩を学びます。エラーを直す体験を通してエラーメッセージの読み方にも慣れます。",
  steps: [
    {
      id: 1,
      title: "Hello Worldとconsole.log",
      explanation: `<p>プログラミング学習の伝統として、最初のプログラムは画面に「Hello, World!」と表示するものです。JavaScriptで画面（正確にはコンソールと呼ばれる出力先）に文字を表示するには<code>console.log()</code>を使います。</p>
<pre><code>console.log("Hello, World!");</code></pre>
<p>この1行を分解すると次のようになります。</p>
<ul>
<li><code>console</code>：出力機能をまとめたオブジェクト（機能の集まり）</li>
<li><code>.log()</code>：値をコンソールに表示する命令（メソッドと呼びます）</li>
<li><code>"Hello, World!"</code>：表示したい文字列。文字の並びはダブルクォート<code>"</code>またはシングルクォート<code>'</code>で囲みます</li>
<li><code>;</code>：文の終わりを示すセミコロン</li>
</ul>
<p>Node.jsという実行環境では、ファイルに書いたJavaScriptを<code>node main.js</code>のようにコマンドで実行します。実行すると<code>console.log()</code>に渡した内容が1行ずつ表示されます。</p>
<pre><code>console.log("1行目");
console.log("2行目");</code></pre>
<p>上のコードを実行すると「1行目」「2行目」が順番に表示されます。プログラムは基本的に上から下へ1行ずつ実行される、というのが最初に覚えるべき大原則です。<code>console.log()</code>はこの教材全体を通して、計算結果や変数の中身を確認するための最も重要な道具になります。まずは書いて、実行して、表示されることを確かめましょう。</p>`,
      task: `まず実行して「Hello, World!」が表示されることを確認しましょう。その後、2行目に<code>console.log()</code>を追加して「JavaScriptの学習を始めます」と表示してください。`,
      code: `console.log("Hello, World!");
// TODO: この下にconsole.logを追加して「JavaScriptの学習を始めます」と表示する
`,
      solution: `console.log("Hello, World!");
console.log("JavaScriptの学習を始めます");
`,
      hints: [`1行目とまったく同じ形で、表示したい文字列だけを変えれば動きます。`, `console.log("JavaScriptの学習を始めます"); のように、文字列をダブルクォートで囲んで括弧の中に入れます。`],
      expectedOutput: "JavaScriptの学習を始めます"
    },
    {
      id: 2,
      title: "構文エラーを直してみよう",
      explanation: `<p>プログラミングでは、書き方の文法（構文）を間違えるとプログラムが実行できません。このときに出るエラーを<strong>構文エラー（SyntaxError）</strong>と呼びます。たとえば括弧の閉じ忘れは初心者が最もよくやるミスの1つです。</p>
<pre><code>console.log("こんにちは";  // 閉じ括弧 ) を忘れている</code></pre>
<p>これを実行すると、次のようなエラーメッセージが表示されます。</p>
<pre><code>SyntaxError: missing ) after argument list</code></pre>
<p>エラーメッセージは英語ですが、怖がる必要はありません。読み方のコツは次の3点です。</p>
<ol>
<li><strong>エラーの種類</strong>を見る：<code>SyntaxError</code>は「文法の間違い」という意味</li>
<li><strong>メッセージ</strong>を見る：<code>missing )</code>は「<code>)</code>が見つからない」という意味</li>
<li><strong>行番号</strong>を見る：エラーメッセージには問題が起きたファイル名と行番号が表示される</li>
</ol>
<p>代表的な構文エラーの原因を表にまとめます。</p>
<table>
<tr><th>原因</th><th>例</th></tr>
<tr><td>括弧の閉じ忘れ</td><td><code>console.log("a"</code></td></tr>
<tr><td>クォートの閉じ忘れ</td><td><code>console.log("a);</code></td></tr>
<tr><td>スペルミス</td><td><code>consle.log("a");</code></td></tr>
</table>
<p>エラーは失敗ではなく、コンピュータからの「ここが分からないよ」というメッセージです。エラーを読んで直す練習を積むことが、上達への一番の近道です。</p>`,
      task: `初期コードには括弧の閉じ忘れによる構文エラーがあります。まず実行してエラーメッセージを観察し、その後コードを修正して「こんにちは」と表示させてください。`,
      code: `// このコードには構文エラーがあります。実行してエラーメッセージを読んでみましょう
console.log("こんにちは";
`,
      solution: `// 閉じ括弧を追加して修正しました
console.log("こんにちは");
`,
      hints: [`エラーメッセージのSyntaxErrorという単語と、missing ) という部分に注目しましょう。`, `console.logの括弧は ( で始まり ) で閉じる必要があります。文字列の後ろに ) を追加してください。`],
      expectedOutput: "こんにちは"
    },
    {
      id: 3,
      title: "console.logで複数の値と計算結果を表示する",
      explanation: `<p><code>console.log()</code>には、カンマ<code>,</code>で区切って複数の値を渡せます。渡した値は半角スペースで区切られて1行に表示されます。</p>
<pre><code>console.log("合計:", 10 + 20);
// 表示結果 → 合計: 30</code></pre>
<p>ここで注目してほしいのは、<code>10 + 20</code>の部分です。JavaScriptは数値の計算（算術演算）ができ、<code>console.log()</code>に計算式を渡すと<strong>計算した結果</strong>が表示されます。基本的な演算子（計算の記号）は次のとおりです。</p>
<table>
<tr><th>演算子</th><th>意味</th><th>例</th><th>結果</th></tr>
<tr><td><code>+</code></td><td>たし算</td><td><code>10 + 20</code></td><td>30</td></tr>
<tr><td><code>-</code></td><td>ひき算</td><td><code>10 - 3</code></td><td>7</td></tr>
<tr><td><code>*</code></td><td>かけ算</td><td><code>10 * 20</code></td><td>200</td></tr>
<tr><td><code>/</code></td><td>わり算</td><td><code>10 / 4</code></td><td>2.5</td></tr>
</table>
<p>かけ算は<code>x</code>ではなく<code>*</code>（アスタリスク）、わり算は<code>÷</code>ではなく<code>/</code>（スラッシュ）を使う点に注意してください。数学と同じく、<code>*</code>と<code>/</code>は<code>+</code>と<code>-</code>より先に計算され、括弧<code>( )</code>で順序を変えられます。</p>
<pre><code>console.log(2 + 3 * 4);    // 14
console.log((2 + 3) * 4);  // 20</code></pre>
<p>「ラベルの文字列」と「計算結果」をカンマで並べて表示するのは、動作確認の定番パターンです。ここで手に馴染ませておきましょう。</p>`,
      task: `TODOの行を修正して、「かけ算:」というラベルと<code>10 * 20</code>の計算結果、「わり算:」というラベルと<code>10 / 4</code>の計算結果をそれぞれ表示してください。`,
      code: `console.log("たし算:", 10 + 20);
// TODO: 「かけ算:」というラベルと 10 * 20 の結果を表示する
console.log("かけ算:", 0);
// TODO: 「わり算:」というラベルと 10 / 4 の結果を表示する
console.log("わり算:", 0);
`,
      solution: `console.log("たし算:", 10 + 20);
console.log("かけ算:", 10 * 20);
console.log("わり算:", 10 / 4);
`,
      hints: [`1行目の「たし算」の行と同じ形で、0の部分を計算式に置き換えます。`, `かけ算はアスタリスク記号を使って 10 * 20、わり算はスラッシュ記号を使って 10 / 4 と書きます。`],
      expectedOutput: "かけ算: 200"
    },
    {
      id: 4,
      title: "コメントを書く",
      explanation: `<p><strong>コメント</strong>は、プログラムの実行に影響しないメモ書きです。コードの意図や補足を残したり、一時的にコードを無効化したりするために使います。JavaScriptのコメントには2種類あります。</p>
<table>
<tr><th>書き方</th><th>名前</th><th>範囲</th></tr>
<tr><td><code>// メモ</code></td><td>1行コメント</td><td>その行の<code>//</code>以降すべて</td></tr>
<tr><td><code>/* メモ */</code></td><td>複数行コメント</td><td><code>/*</code>から<code>*/</code>まで（複数行可）</td></tr>
</table>
<pre><code>// この行はコメントなので実行されない
console.log("実行される");  // 行の途中からコメントにもできる

/*
複数行にわたる
長い説明はこちらの形式で書く
*/</code></pre>
<p>コメントの重要な使い道が<strong>コメントアウト</strong>です。コードの行頭に<code>//</code>を付けると、その行は実行されなくなります。「この行が原因かも？」というときに削除せずに無効化して試せるので、動作確認やデバッグ（不具合の原因調査と修正）で頻繁に使います。</p>
<pre><code>console.log("表示される");
// console.log("この行はコメントアウトされたので表示されない");</code></pre>
<p>良いコメントは「何をしているか」よりも「なぜそうしているか」を書くと価値が高くなります。コードを読めば分かることを繰り返すのではなく、コードだけでは伝わらない背景や理由を残すのがプロの習慣です。まずは<code>//</code>で行を無効化する操作に慣れましょう。</p>`,
      task: `初期コードを実行すると3行表示されます。「この行は表示しないでください」の行を<strong>コメントアウト</strong>して、2行だけ表示されるようにしてください。`,
      code: `// コメントの練習です
console.log("1行目です");
console.log("この行は表示しないでください");
console.log("コメントを学びました");
`,
      solution: `// コメントの練習です
console.log("1行目です");
// console.log("この行は表示しないでください");
console.log("コメントを学びました");
`,
      hints: [`行を削除するのではなく、行の先頭に記号を付けて無効化します。`, `無効化したい行の先頭にスラッシュ2つ（//）を付けると、その行はコメントになり実行されません。`],
      expectedOutput: "コメントを学びました"
    },
    {
      id: 5,
      title: "変数let",
      explanation: `<p><strong>変数</strong>は、値に名前を付けて保存しておく箱のようなものです。JavaScriptでは<code>let</code>というキーワードで変数を宣言（作成）します。</p>
<pre><code>let score = 80;        // 変数scoreを宣言して80を代入
console.log(score);    // 80と表示される</code></pre>
<p>それぞれの部品の意味は次のとおりです。</p>
<ul>
<li><code>let</code>：「これから変数を作ります」という宣言</li>
<li><code>score</code>：変数名。中身が分かる名前を付ける</li>
<li><code>=</code>：<strong>代入演算子</strong>。数学の「等しい」ではなく「右の値を左の変数に入れる」という意味</li>
<li><code>80</code>：保存する値</li>
</ul>
<p><code>let</code>で宣言した変数は、後から別の値を<strong>再代入</strong>できます。再代入するときは<code>let</code>を付けずに変数名だけを書きます。</p>
<pre><code>let score = 80;
console.log(score);  // 80
score = 95;          // 再代入（letは不要）
console.log(score);  // 95</code></pre>
<p>変数を使うと「同じ値を何度も書かなくてよい」「値に意味のある名前を付けられる」「後から値を変化させられる」という利点があります。変数名は半角英数字を使い、<code>score</code>や<code>userName</code>のように内容が伝わる名前を付けるのが良い習慣です。数字で始まる名前（<code>1st</code>など）や、<code>let</code>のような予約語（JavaScriptが文法上使っている単語）は変数名にできない点も覚えておきましょう。</p>`,
      task: `TODOに従って、変数<code>score</code>を80で宣言して表示し、その後95を再代入してもう一度表示してください。`,
      code: `// TODO: 変数scoreを宣言して80を代入する

console.log("最初の点数:", score);

// TODO: scoreに95を再代入する

console.log("新しい点数:", score);
`,
      solution: `let score = 80;

console.log("最初の点数:", score);

score = 95;

console.log("新しい点数:", score);
`,
      hints: [`最初の宣言はletから始めます。2回目の代入にはletを付けません。`, `1つ目のTODOは let score = 80; 、2つ目のTODOは score = 95; と書きます。`],
      expectedOutput: "新しい点数: 95"
    },
    {
      id: 6,
      title: "定数const（再代入エラーを体験する）",
      explanation: `<p><code>const</code>は<strong>定数</strong>（再代入できない変数）を宣言するキーワードです。書き方は<code>let</code>と同じですが、一度値を入れたら後から変更できません。</p>
<pre><code>const taxRate = 0.1;
console.log(taxRate);  // 0.1</code></pre>
<p><code>const</code>で宣言した定数に再代入しようとすると、実行時に<strong>TypeError</strong>というエラーが発生してプログラムが止まります。</p>
<pre><code>const price = 100;
price = 120;  // TypeError: Assignment to constant variable.</code></pre>
<p>エラーメッセージの<code>Assignment to constant variable</code>は「定数への代入」という意味です。前のステップで学んだSyntaxError（文法エラー・実行前に検出）と違い、TypeErrorは<strong>実行中に発生するエラー</strong>である点も豆知識として覚えておきましょう。</p>
<p>このエラーに出会ったときの対処は2通りあります。</p>
<ol>
<li>そもそも値を変える必要がないなら、再代入している行を削除・修正する</li>
<li>値を変える必要が本当にあるなら、宣言を<code>const</code>から<code>let</code>に変える</li>
</ol>
<p>「再代入できないのは不便では？」と思うかもしれませんが、逆です。<code>const</code>を使えば「この値は途中で変わらない」と保証でき、コードを読む人が安心できます。実務のJavaScriptでは<code>const</code>が圧倒的に多く使われます。まずはエラーを自分の目で見て、修正する体験をしましょう。</p>`,
      task: `初期コードを実行するとTypeErrorが発生します。エラーメッセージを確認した後、<code>price</code>は後から値を変える必要があるので、宣言を<code>let</code>に修正して「価格: 120」と表示させてください。`,
      code: `// このコードは実行するとエラーになります。まず実行してメッセージを読みましょう
const price = 100;
price = 120;
console.log("価格:", price);
`,
      solution: `// 再代入が必要なのでconstからletに変更しました
let price = 100;
price = 120;
console.log("価格:", price);
`,
      hints: [`TypeError: Assignment to constant variable. は「定数に再代入しようとした」という意味です。`, `priceには120を再代入する必要があるため、1行目のconstをletに書き換えます。`],
      expectedOutput: "価格: 120"
    },
    {
      id: 7,
      title: "letとconstの使い分け（varを避ける理由）",
      explanation: `<p>変数を宣言するキーワードは<code>let</code>・<code>const</code>のほかに、古くからある<code>var</code>も存在します。3つの違いを整理しましょう。</p>
<table>
<tr><th>キーワード</th><th>再代入</th><th>再宣言</th><th>推奨度</th></tr>
<tr><td><code>const</code></td><td>不可</td><td>不可</td><td>第一候補</td></tr>
<tr><td><code>let</code></td><td>可</td><td>不可</td><td>再代入が必要なときだけ</td></tr>
<tr><td><code>var</code></td><td>可</td><td>可</td><td>使わない</td></tr>
</table>
<p>現代のJavaScriptでの使い分けはシンプルです。</p>
<ol>
<li>まず<code>const</code>で宣言する</li>
<li>再代入が必要だと分かったときだけ<code>let</code>に変える</li>
<li><code>var</code>は使わない</li>
</ol>
<p><code>var</code>を避ける理由は、間違いに気づきにくい挙動をするためです。たとえば<code>var</code>は同じ名前の変数を二重に宣言してもエラーになりません。</p>
<pre><code>var count = 1;
var count = 100;  // エラーにならず、黙って上書きされる
console.log(count);  // 100</code></pre>
<p>大きなプログラムでうっかり同名の変数を宣言してしまっても<code>var</code>は警告してくれないため、原因の分かりにくい不具合につながります。<code>let</code>や<code>const</code>なら同じ名前の再宣言は即エラーになるので、ミスにすぐ気づけます（このほか<code>var</code>には有効範囲が広すぎる問題もあり、後の章で詳しく学びます）。「迷ったらconst」を合言葉にしましょう。</p>`,
      task: `初期コードは<code>var</code>で書かれています。<code>taxRate</code>は再代入しないので<code>const</code>に、<code>total</code>は再代入するので<code>let</code>に書き換えてください。`,
      code: `// TODO: varをやめて、taxRateはconst、totalはletに書き換える
var taxRate = 0.1;
var total = 0;
total = total + 1000;
total = total + 500;
console.log("税率:", taxRate);
console.log("合計:", total);
console.log("税込:", total + total * taxRate);
`,
      solution: `// taxRateは再代入しないのでconst、totalは再代入するのでlet
const taxRate = 0.1;
let total = 0;
total = total + 1000;
total = total + 500;
console.log("税率:", taxRate);
console.log("合計:", total);
console.log("税込:", total + total * taxRate);
`,
      hints: [`その変数が後から再代入されているかどうかを見て判断します。`, `taxRateは宣言以降どこにも代入がないのでconst、totalはtotal = ...と2回代入されているのでletです。`],
      expectedOutput: "税込: 1650"
    },
    {
      id: 8,
      title: "文字列と数値の連結の罠（\"1\" + 1）",
      explanation: `<p><code>+</code>演算子には2つの顔があります。<strong>数値どうしなら足し算</strong>、<strong>文字列が混ざると連結（つなげる操作）</strong>になります。</p>
<pre><code>console.log(1 + 1);      // 2（数値の足し算）
console.log("あ" + "い");  // あい（文字列の連結）</code></pre>
<p>問題は、文字列と数値を<code>+</code>でつないだときです。JavaScriptは数値を自動的に文字列へ変換してから連結します。</p>
<pre><code>console.log("1" + 1);   // "11" ← 2ではない！
console.log("5" + 3);   // "53"</code></pre>
<p><code>"1"</code>はクォートで囲まれているので<strong>文字列</strong>です。見た目は数字でも、文字列の<code>"1"</code>と数値の<code>1</code>はまったく別物として扱われます。この違いを表で確認しましょう。</p>
<table>
<tr><th>式</th><th>左の型</th><th>右の型</th><th>結果</th></tr>
<tr><td><code>1 + 1</code></td><td>数値</td><td>数値</td><td><code>2</code>（足し算）</td></tr>
<tr><td><code>"1" + 1</code></td><td>文字列</td><td>数値</td><td><code>"11"</code>（連結）</td></tr>
<tr><td><code>"1" + "1"</code></td><td>文字列</td><td>文字列</td><td><code>"11"</code>（連結）</td></tr>
</table>
<p>ちなみに<code>-</code>や<code>*</code>には連結の意味がないため、<code>"5" - 3</code>は数値の<code>2</code>になります。<code>+</code>だけが特別なのです。この「文字列か数値か」を意識する感覚は、第2章のデータ型の学習につながる重要な土台です。実務でもフォーム入力値（文字列）を計算しようとして起こる定番バグなので、しっかり体験しておきましょう。</p>`,
      task: `まず実行して<code>"1" + 1</code>の結果が11になることを観察してください。その後、TODOの行のクォートを外して数値の<code>1 + 1</code>に直し、「答え: 2」と表示させてください。`,
      code: `// 文字列"1"と数値1を足すとどうなるか観察しましょう
console.log("1" + 1);

// TODO: "1"のクォートを外して数値どうしの足し算にする
console.log("答え:", "1" + 1);
`,
      solution: `// 文字列"1"と数値1を足すと連結されて"11"になる
console.log("1" + 1);

// 数値どうしなら正しく足し算される
console.log("答え:", 1 + 1);
`,
      hints: [`クォートで囲まれた"1"は文字列、囲まれていない1は数値です。`, `最後の行の "1" + 1 を 1 + 1 に書き換えると、数値の足し算になり2が表示されます。`],
      expectedOutput: "答え: 2"
    },
    {
      id: 9,
      title: "セミコロンと文の区切り",
      explanation: `<p>JavaScriptのプログラムは<strong>文（statement）</strong>の集まりです。文とは「変数を宣言する」「console.logを呼び出す」といった1つの命令の単位で、文の終わりには<strong>セミコロン<code>;</code></strong>を付けます。</p>
<pre><code>const message = "こんにちは";  // 宣言の文
console.log(message);          // 呼び出しの文</code></pre>
<p>実はJavaScriptには<strong>自動セミコロン挿入（ASI：改行位置からセミコロンを自動で補う仕組み）</strong>があり、セミコロンを省略しても動くことが多いです。しかし、次のような落とし穴があります。</p>
<pre><code>const a = 1
const b = 2
(a + b)  // 前の行と繋がって解釈され、エラーになることがある</code></pre>
<p>行の先頭が<code>(</code>や<code>[</code>で始まると、JavaScriptは前の行の続きだと誤解することがあるのです。こうした事故を防ぐため、本教材では<strong>文の終わりに必ずセミコロンを付ける</strong>スタイルで統一します。</p>
<p>セミコロンを付ける位置の基本ルールは次のとおりです。</p>
<ul>
<li>変数・定数の宣言の後：<code>let x = 1;</code></li>
<li>再代入の後：<code>x = 2;</code></li>
<li>関数呼び出しの後：<code>console.log(x);</code></li>
<li>コメントには不要（コメントは文ではないため）</li>
</ul>
<p>また、1行に複数の文を書くこともできますが（<code>let a = 1; let b = 2;</code>）、読みやすさのため<strong>1行1文</strong>が基本です。細かい話に見えますが、チーム開発ではスタイルの一貫性がコードの読みやすさを大きく左右します。</p>`,
      task: `初期コードはセミコロンが抜けています。すべての文の終わりにセミコロンを付けて、1行に2つの文が詰め込まれている行は2行に分けてください。`,
      code: `// TODO: 各文の終わりにセミコロンを付け、1行1文に整理する
const greeting = "セミコロンを付けました"
const name = "太郎"
console.log(greeting) console.log(name)
`,
      solution: `// 文の終わりにセミコロンを付け、1行1文に整理した
const greeting = "セミコロンを付けました";
const name = "太郎";
console.log(greeting);
console.log(name);
`,
      hints: [`宣言の文と関数呼び出しの文、それぞれの終わりにセミコロンが必要です。`, `3行目はconsole.logが2つ並んでいます。それぞれの後ろにセミコロンを付けて、2行に分けましょう。`],
      expectedOutput: "セミコロンを付けました"
    },
    {
      id: 10,
      title: "総合演習：自己紹介カードを整形して出力する",
      explanation: `<p>第1章の総仕上げとして、これまでに学んだ知識を組み合わせて「自己紹介カード」をコンソールに整形出力するプログラムを作ります。使う知識は次のとおりです。</p>
<ul>
<li><code>console.log()</code>による出力（ステップ1〜3）</li>
<li>コメント（ステップ4）</li>
<li><code>const</code>による定数宣言（ステップ6〜7）</li>
<li><code>+</code>による文字列連結（ステップ8）</li>
<li>セミコロンで文を区切る（ステップ9）</li>
</ul>
<p>目指す出力イメージはこちらです。</p>
<pre><code>==============================
名前: 山田太郎
年齢: 25歳
趣味: プログラミング
==============================</code></pre>
<p>ポイントは2つあります。1つ目は、名前・年齢・趣味の値を<strong>定数として1か所にまとめる</strong>ことです。こうすると値を変えたいときに宣言部分だけを直せばよく、修正漏れがなくなります。2つ目は、<strong>文字列と変数の連結</strong>です。</p>
<pre><code>const age = 25;
console.log("年齢: " + age + "歳");  // 年齢: 25歳</code></pre>
<p>数値の<code>age</code>を文字列と<code>+</code>でつなぐと、ステップ8で学んだとおり自動的に文字列になって連結されます。今回はこの性質を意図的に活用します。罫線のような繰り返し使う文字列も定数にしておくと、変更に強いコードになります。データ（定数）と出力処理を分けて書く意識は、今後ずっと役立つ設計の第一歩です。</p>`,
      task: `TODOに従って定数<code>name</code>・<code>age</code>・<code>hobby</code>を宣言し、文字列連結を使って出力例と同じ形式の自己紹介カードを表示してください（名前は山田太郎、年齢は25、趣味はプログラミング）。`,
      code: `// 自己紹介カードを作ります
// TODO: 定数name（"山田太郎"）、age（数値25）、hobby（"プログラミング"）を宣言する

const line = "==============================";

console.log(line);
// TODO: 「名前: 山田太郎」の形式で表示する
// TODO: 「年齢: 25歳」の形式で表示する（文字列連結を使う）
// TODO: 「趣味: プログラミング」の形式で表示する
console.log(line);
`,
      solution: `// 自己紹介カードを作ります
const name = "山田太郎";
const age = 25;
const hobby = "プログラミング";

const line = "==============================";

console.log(line);
console.log("名前: " + name);
console.log("年齢: " + age + "歳");
console.log("趣味: " + hobby);
console.log(line);
`,
      hints: [`まず3つの定数をconstで宣言し、その後console.logの中で "ラベル: " + 変数 の形に連結します。`, `年齢の行は "年齢: " + age + "歳" のように、変数の前後に文字列をつなげます。`],
      expectedOutput: "年齢: 25歳"
    }
  ]
});
