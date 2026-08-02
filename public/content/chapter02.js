// 第2章：データ型
registerChapter({
  number: 2,
  title: "データ型",
  description: "number・string・boolean・null・undefinedといった基本のデータ型と、型変換・比較の落とし穴を学びます。",
  steps: [
    {
      id: 11,
      title: "number型と算術演算",
      explanation: `<p>JavaScriptで扱う値には<strong>データ型</strong>（値の種類）があります。この章では基本の型を1つずつ学びます。最初は数値を表す<strong>number型</strong>です。</p>
<p>JavaScriptのnumber型は、整数も小数も区別せず1つの型で扱います。<code>10</code>も<code>3.14</code>も<code>-5</code>もすべてnumberです。第1章で使った四則演算に加えて、覚えておきたい演算子が2つあります。</p>
<table>
<tr><th>演算子</th><th>意味</th><th>例</th><th>結果</th></tr>
<tr><td><code>%</code></td><td>剰余（わり算の余り）</td><td><code>7 % 3</code></td><td><code>1</code></td></tr>
<tr><td><code>**</code></td><td>べき乗</td><td><code>2 ** 10</code></td><td><code>1024</code></td></tr>
</table>
<pre><code>console.log(7 % 3);    // 1（7を3で割った余り）
console.log(10 % 2);   // 0（割り切れると余りは0）
console.log(2 ** 3);   // 8（2の3乗）</code></pre>
<p><code>%</code>は「偶数か奇数かの判定」（2で割った余りが0なら偶数）や「n個ごとに処理を変える」など、実務でも登場頻度の高い演算子です。</p>
<p>また、number型には特別な値もあります。<code>0</code>で割ると無限大を表す<code>Infinity</code>になり、数値にできない計算の結果は<code>NaN</code>（Not a Number：非数）になります。</p>
<pre><code>console.log(1 / 0);        // Infinity
console.log("あ" * 2);     // NaN</code></pre>
<p><code>NaN</code>は「計算に失敗した」ことを示すサインとして、この後の型変換の学習でも再登場します。まずは演算子を一通り動かして、number型の感覚をつかみましょう。</p>`,
      task: `TODOの行を修正して、<code>7 % 3</code>の余り、<code>10 % 2</code>の余り、<code>2 ** 10</code>の結果をそれぞれ表示してください。`,
      code: `console.log("7わる3の余り:", 0);  // TODO: %を使って7を3で割った余りにする
console.log("10わる2の余り:", 0); // TODO: %を使って10を2で割った余りにする
console.log("2の10乗:", 0);       // TODO: **を使って2の10乗にする
`,
      solution: `console.log("7わる3の余り:", 7 % 3);
console.log("10わる2の余り:", 10 % 2);
console.log("2の10乗:", 2 ** 10);
`,
      hints: [`余りはパーセント記号の演算子、べき乗はアスタリスク2つの演算子を使います。`, `1行目は 7 % 3、2行目は 10 % 2、3行目は 2 ** 10 と書きます。`],
      expectedOutput: "2の10乗: 1024"
    },
    {
      id: 12,
      title: "小数の誤差（0.1 + 0.2）とtoFixed",
      explanation: `<p>まずは次のコードの結果を予想してみてください。</p>
<pre><code>console.log(0.1 + 0.2);
// 0.30000000000000004 ← 0.3にならない！</code></pre>
<p>これはJavaScriptのバグではありません。コンピュータは数値を内部的に<strong>2進数</strong>（0と1の並び）で保存しますが、0.1や0.2は2進数では割り切れない無限小数になるため、ごくわずかな誤差を含んだ近似値として保存されます。その誤差が足し算で表面化したのがこの結果です。これはIEEE 754という浮動小数点数の国際規格に従う多くのプログラミング言語で共通に起こる現象です。</p>
<p>表示上この誤差を整えるには、number型の<strong>toFixedメソッド</strong>を使います。<code>toFixed(桁数)</code>は指定した小数点以下の桁数に四捨五入し、<strong>文字列として</strong>返します。</p>
<pre><code>const total = 0.1 + 0.2;
console.log(total.toFixed(1));  // "0.3"
console.log(total.toFixed(2));  // "0.30"（桁数分0で埋まる）</code></pre>
<p>注意点を整理します。</p>
<ul>
<li>戻り値はnumberではなく<strong>string（文字列）</strong>になる</li>
<li>誤差が消えるわけではなく、あくまで<strong>表示を整える</strong>ための道具</li>
<li>金額計算など誤差が許されない場面では「1円単位の整数で計算する」などの工夫が実務では使われる</li>
</ul>
<p>「小数の比較や表示では誤差に注意する」という意識は、電卓アプリや価格計算を作るときに必ず役立ちます。</p>`,
      task: `まず実行して<code>0.1 + 0.2</code>の誤差を観察してください。その後、TODOの行を<code>toFixed(2)</code>を使って「合計: 0.30」と表示されるように修正してください。`,
      code: `const total = 0.1 + 0.2;
console.log(total);

// TODO: toFixed(2)を使って小数点以下2桁に整形して表示する
console.log("合計:", total);
`,
      solution: `const total = 0.1 + 0.2;
console.log(total);

console.log("合計:", total.toFixed(2));
`,
      hints: [`toFixedは数値の後ろにドットでつなげて呼び出すメソッドです。`, `total.toFixed(2) と書くと、小数点以下2桁に四捨五入された文字列が得られます。`],
      expectedOutput: "合計: 0.30"
    },
    {
      id: 13,
      title: "string型とlength・大文字小文字の変換",
      explanation: `<p><strong>string型</strong>は文字列（文字の並び）を表す型です。クォートで囲んだものはすべて文字列で、日本語も英語も記号も扱えます。文字列は単なるデータの塊ではなく、便利な<strong>プロパティ</strong>（値に付属する情報）と<strong>メソッド</strong>（値に対して呼び出せる命令）を持っています。</p>
<p>まず最重要のプロパティが<code>length</code>（文字数）です。</p>
<pre><code>const word = "JavaScript";
console.log(word.length);   // 10
console.log("こんにちは".length);  // 5</code></pre>
<p>メソッドと違って<code>length</code>には括弧を付けない点に注意してください。次に、大文字・小文字を変換する2つのメソッドです。</p>
<table>
<tr><th>メソッド</th><th>働き</th><th>例</th><th>結果</th></tr>
<tr><td><code>toUpperCase()</code></td><td>すべて大文字に</td><td><code>"abc".toUpperCase()</code></td><td><code>"ABC"</code></td></tr>
<tr><td><code>toLowerCase()</code></td><td>すべて小文字に</td><td><code>"ABC".toLowerCase()</code></td><td><code>"abc"</code></td></tr>
</table>
<p>重要な性質として、これらのメソッドは<strong>元の文字列を変更せず、新しい文字列を返します</strong>。</p>
<pre><code>const word = "Hello";
const upper = word.toUpperCase();
console.log(upper);  // HELLO
console.log(word);   // Hello（元のまま）</code></pre>
<p>この「元の値を変えずに新しい値を返す」性質は文字列メソッド全般に共通で、JavaScriptの文字列は一度作ると中身を変更できない（イミュータブルな）値だからです。大文字小文字変換は「入力された文字列を比較前にそろえる」場面（例：メールアドレスの照合）で実務でもよく使われます。</p>`,
      task: `TODOに従って、定数<code>word</code>の文字数、大文字に変換した結果、小文字に変換した結果をそれぞれ表示してください。`,
      code: `const word = "JavaScript";

// TODO: lengthで文字数を表示する
console.log("文字数:", 0);
// TODO: toUpperCase()で大文字にして表示する
console.log("大文字:", word);
// TODO: toLowerCase()で小文字にして表示する
console.log("小文字:", word);
`,
      solution: `const word = "JavaScript";

console.log("文字数:", word.length);
console.log("大文字:", word.toUpperCase());
console.log("小文字:", word.toLowerCase());
`,
      hints: [`いずれも word の後ろにドットをつけて呼び出します。lengthだけは括弧が不要です。`, `word.length、word.toUpperCase()、word.toLowerCase() の3つをそれぞれの行に当てはめます。`],
      expectedOutput: "大文字: JAVASCRIPT"
    },
    {
      id: 14,
      title: "boolean型",
      explanation: `<p><strong>boolean型</strong>（ブーリアン型・真偽値）は、<code>true</code>（真）と<code>false</code>（偽）の2つの値しか持たない型です。「はい／いいえ」「オン／オフ」のような二択の状態を表します。</p>
<pre><code>const isOpen = true;
const isFinished = false;
console.log(isOpen);      // true
console.log(isFinished);  // false</code></pre>
<p>booleanが本領を発揮するのは、<strong>比較演算子</strong>と組み合わせたときです。比較演算子は2つの値を比べて、結果をtrueまたはfalseで返します。</p>
<table>
<tr><th>演算子</th><th>意味</th><th>例</th><th>結果</th></tr>
<tr><td><code>&gt;</code></td><td>より大きい</td><td><code>10 &gt; 5</code></td><td><code>true</code></td></tr>
<tr><td><code>&lt;</code></td><td>より小さい</td><td><code>10 &lt; 5</code></td><td><code>false</code></td></tr>
<tr><td><code>&gt;=</code></td><td>以上</td><td><code>20 &gt;= 20</code></td><td><code>true</code></td></tr>
<tr><td><code>&lt;=</code></td><td>以下</td><td><code>19 &lt;= 18</code></td><td><code>false</code></td></tr>
</table>
<pre><code>const age = 20;
console.log(age &gt;= 20);  // true（20は20以上）
console.log(age &lt; 18);   // false</code></pre>
<p>注意したいのは、<code>true</code>と<code>"true"</code>は別物という点です。前者はboolean、後者はただの文字列です。クォートを付けないように気をつけましょう。</p>
<p>booleanは次章で学ぶ条件分岐（もし〜なら〜する）の判定材料になる、プログラムの流れを制御する要の型です。<code>isOpen</code>や<code>hasError</code>のように、変数名をis・hasで始めると「booleanが入っている」と一目で分かる良い命名になります。</p>`,
      task: `定数<code>age</code>を使って、TODOの行に比較演算子を書き、「20歳以上か: true」「18歳未満か: false」と表示されるようにしてください。`,
      code: `const age = 20;

// TODO: ageが20以上かどうかを比較演算子で判定して表示する
console.log("20歳以上か:", false);
// TODO: ageが18未満かどうかを比較演算子で判定して表示する
console.log("18歳未満か:", true);
`,
      solution: `const age = 20;

console.log("20歳以上か:", age >= 20);
console.log("18歳未満か:", age < 18);
`,
      hints: [`「以上」は不等号とイコールを組み合わせた演算子、「未満」は不等号だけの演算子です。`, `1つ目は age >= 20、2つ目は age < 18 と書くと、比較結果のtrue/falseがそのまま表示されます。`],
      expectedOutput: "20歳以上か: true"
    },
    {
      id: 15,
      title: "nullとundefined",
      explanation: `<p>JavaScriptには「値がない」ことを表す値が2つあります。<strong>undefined</strong>と<strong>null</strong>です。似ていますが役割が違います。</p>
<table>
<tr><th></th><th>undefined</th><th>null</th></tr>
<tr><td>意味</td><td>未定義（まだ値が入っていない）</td><td>空（意図的に「なし」を入れた）</td></tr>
<tr><td>誰が入れる？</td><td>主にJavaScriptが自動で</td><td>プログラマが意図して</td></tr>
</table>
<p><code>undefined</code>は、宣言しただけで値を代入していない変数に自動的に入ります。</p>
<pre><code>let reserved;            // 値を代入していない
console.log(reserved);   // undefined</code></pre>
<p>一方<code>null</code>は、「ここには意図的に何もない状態を入れた」とプログラマが明示するための値です。</p>
<pre><code>let selected = null;     // まだ何も選択されていないことを表現
console.log(selected);   // null</code></pre>
<p>使い分けのイメージは「undefined＝置き忘れ・未設定」「null＝空であることの意思表示」です。たとえば「検索したが該当なし」を表すときに<code>null</code>を使うと、コードを読む人に意図が伝わります。</p>
<p>実務でこの2つが重要なのは、エラーの常連だからです。<code>undefined</code>の値に対してメソッドを呼ぼうとすると<code>TypeError: Cannot read properties of undefined</code>という、JavaScript開発で最も有名なエラーが発生します。このエラーを見たら「値が入っていない変数を使っていないか？」を疑う、という感覚をここで身につけておきましょう。</p>`,
      task: `TODOに従って、値を代入せずに変数<code>reserved</code>を宣言して表示し、次に<code>null</code>を代入した変数<code>selected</code>を宣言して表示してください。`,
      code: `// TODO: 変数reservedを値を代入せずに宣言する（let 変数名; の形）

console.log("未代入の変数:", reserved);

// TODO: 変数selectedをnullで初期化して宣言する

console.log("意図的に空:", selected);
`,
      solution: `let reserved;

console.log("未代入の変数:", reserved);

let selected = null;

console.log("意図的に空:", selected);
`,
      hints: [`値を代入しない宣言は、イコール以降を書かずにセミコロンで終えます。`, `1つ目は let reserved; 、2つ目は let selected = null; と書きます。`],
      expectedOutput: "意図的に空: null"
    },
    {
      id: 16,
      title: "typeof演算子で型を調べる",
      explanation: `<p>ここまでにnumber・string・boolean・undefined・nullを学びました。値の型をプログラムの中から調べるには<strong>typeof演算子</strong>を使います。<code>typeof 値</code>と書くと、型の名前が文字列で返ります。</p>
<pre><code>console.log(typeof 100);        // "number"
console.log(typeof "hello");    // "string"
console.log(typeof true);       // "boolean"
console.log(typeof undefined);  // "undefined"</code></pre>
<p>主な結果を表にまとめます。</p>
<table>
<tr><th>値</th><th>typeofの結果</th></tr>
<tr><td><code>100</code>、<code>3.14</code>、<code>NaN</code></td><td><code>"number"</code></td></tr>
<tr><td><code>"abc"</code>、<code>"100"</code></td><td><code>"string"</code></td></tr>
<tr><td><code>true</code>、<code>false</code></td><td><code>"boolean"</code></td></tr>
<tr><td><code>undefined</code></td><td><code>"undefined"</code></td></tr>
<tr><td><code>null</code></td><td><code>"object"</code>（歴史的なバグ）</td></tr>
</table>
<p>最後の行に注目してください。<code>typeof null</code>は<code>"null"</code>ではなく<strong><code>"object"</code></strong>を返します。これはJavaScript誕生時（1995年）の実装ミスに由来する有名な仕様で、互換性を守るために今も修正されずに残っています。「nullかどうかを調べたいときはtypeofではなく比較を使う」というのが定石です（比較の正しい書き方はステップ19で学びます）。</p>
<p>また、<code>NaN</code>のtypeofが<code>"number"</code>である点も面白いところです。「非数（Not a Number）なのにnumber型」というのは、「number型の中の、正常な数値ではない特別な値」だからです。typeofは「文字列のつもりが数値だった」のような型の勘違いを調査する、デバッグの基本道具になります。</p>`,
      task: `TODOの行を修正して、<code>typeof</code>を使って各値の型を表示してください。最後の行では<code>typeof null</code>の結果が「object」になることを確認しましょう。`,
      code: `// TODO: それぞれtypeofを使って型名を表示する
console.log("100の型:", "ここをtypeof 100に");
console.log("helloの型:", "ここをtypeofに");
console.log("trueの型:", "ここをtypeofに");
console.log("nullの型:", "ここをtypeofに");
`,
      solution: `console.log("100の型:", typeof 100);
console.log("helloの型:", typeof "hello");
console.log("trueの型:", typeof true);
console.log("nullの型:", typeof null);
`,
      hints: [`typeofは括弧なしで typeof 値 と書ける演算子です。`, `2行目は typeof "hello"、4行目は typeof null と書きます。nullの結果がobjectになる点に注目してください。`],
      expectedOutput: "nullの型: object"
    },
    {
      id: 17,
      title: "明示的な型変換（Number・String・parseInt）",
      explanation: `<p>「文字列の"42"を数値の42として計算したい」という場面は頻繁にあります。型を意図的に変換することを<strong>明示的型変換</strong>と呼び、代表的な道具が3つあります。</p>
<table>
<tr><th>関数</th><th>働き</th><th>例</th><th>結果</th></tr>
<tr><td><code>Number(値)</code></td><td>数値に変換</td><td><code>Number("42")</code></td><td><code>42</code></td></tr>
<tr><td><code>String(値)</code></td><td>文字列に変換</td><td><code>String(123)</code></td><td><code>"123"</code></td></tr>
<tr><td><code>parseInt(文字列, 10)</code></td><td>先頭から整数を読み取る</td><td><code>parseInt("100px", 10)</code></td><td><code>100</code></td></tr>
</table>
<p><code>Number()</code>は文字列全体を数値として解釈します。数値にできない文字列を渡すと<code>NaN</code>（ステップ11で登場した非数）になります。</p>
<pre><code>console.log(Number("42") + 8);   // 50（数値の足し算になる）
console.log(Number("abc"));      // NaN</code></pre>
<p><code>parseInt()</code>は文字列の<strong>先頭から読める部分だけ</strong>を整数として取り出します。単位付きの文字列から数値部分を抜き出すときに便利です。第2引数の<code>10</code>は「10進数として解釈する」という指定で、省略すると想定外の解釈をされる場合があるため、常に付けるのが安全な作法です。</p>
<pre><code>console.log(parseInt("100px", 10));  // 100
console.log(Number("100px"));        // NaN（全体を解釈しようとして失敗）</code></pre>
<p>この違い（Numberは全体を厳密に、parseIntは先頭から寛容に）を押さえておくと使い分けに迷いません。逆に数値を文字列にしたいときは<code>String(123)</code>です。第1章ステップ8で見た「"1" + 1が"11"になる」罠は、<code>Number()</code>で変換してから足すことで正しく解決できます。</p>`,
      task: `TODOの行を修正して、(1) <code>Number()</code>で文字列"42"を数値にして8を足し「答え: 50」を表示、(2) <code>parseInt()</code>で"100px"から数値100を取り出して表示してください。`,
      code: `const input = "42";
// TODO: Number()でinputを数値に変換してから8を足す
console.log("答え:", input + 8);

const size = "100px";
// TODO: parseInt(文字列, 10)で先頭の整数を取り出す
console.log("サイズ:", size);
`,
      solution: `const input = "42";
console.log("答え:", Number(input) + 8);

const size = "100px";
console.log("サイズ:", parseInt(size, 10));
`,
      hints: [`そのまま足すと文字列連結になって"428"になってしまいます。足す前に数値へ変換しましょう。`, `1つ目は Number(input) + 8、2つ目は parseInt(size, 10) と書きます。`],
      expectedOutput: "答え: 50"
    },
    {
      id: 18,
      title: "暗黙の型変換とtruthy・falsy",
      explanation: `<p>前ステップの明示的変換に対して、JavaScriptが<strong>勝手に</strong>型を変換することを<strong>暗黙の型変換</strong>と呼びます。第1章の<code>"1" + 1</code>が<code>"11"</code>になったのも暗黙の変換です。中でも重要なのが「あらゆる値はbooleanとして評価できる」という仕組みです。</p>
<p>booleanに変換したとき<code>false</code>になる値を<strong>falsy（フォールシー）</strong>、<code>true</code>になる値を<strong>truthy（トゥルーシー）</strong>と呼びます。falsyな値は次の表のとおり少数なので、丸暗記してしまうのが得策です。</p>
<table>
<tr><th>falsyな値</th><th>説明</th></tr>
<tr><td><code>false</code></td><td>boolean のfalse</td></tr>
<tr><td><code>0</code>、<code>-0</code></td><td>数値のゼロ</td></tr>
<tr><td><code>""</code></td><td>空文字列</td></tr>
<tr><td><code>null</code></td><td>意図的な空</td></tr>
<tr><td><code>undefined</code></td><td>未定義</td></tr>
<tr><td><code>NaN</code></td><td>非数</td></tr>
</table>
<p><strong>これ以外はすべてtruthy</strong>です。値を明示的にbooleanへ変換するには<code>Boolean()</code>を使います。</p>
<pre><code>console.log(Boolean(0));      // false
console.log(Boolean(""));     // false
console.log(Boolean("0"));    // true ← 文字列"0"は空でないのでtruthy！
console.log(Boolean(" "));    // true ← スペース1つでも空ではない</code></pre>
<p>特に間違えやすいのが<code>"0"</code>や<code>"false"</code>で、これらは<strong>文字列として中身がある</strong>のでtruthyです。falsyかどうかは「値の意味」ではなく「表のどれかに一致するか」だけで決まります。truthy/falsyの感覚は、次章の条件分岐で「if (値) と書いたときに何が起こるか」を正確に理解するための必須知識になります。</p>`,
      task: `<code>Boolean()</code>を使って、0・空文字列・文字列"0"の3つがtruthyかfalsyかを表示してください。文字列"0"の結果に注目しましょう。`,
      code: `// TODO: Boolean()でそれぞれの値を変換して表示する
console.log("0は:", 0);
console.log("空文字列は:", "");
console.log("文字列の0は:", "0");
`,
      solution: `console.log("0は:", Boolean(0));
console.log("空文字列は:", Boolean(""));
console.log("文字列の0は:", Boolean("0"));
`,
      hints: [`Number()やString()と同じ形で、Boolean(値)と囲むとtrue/falseに変換されます。`, `1行目は Boolean(0)、2行目は Boolean("")、3行目は Boolean("0") です。3行目だけtrueになる理由を考えてみましょう。`],
      expectedOutput: "空文字列は: false"
    },
    {
      id: 19,
      title: "==と===の違い",
      explanation: `<p>値が等しいかどうかを調べる演算子は2種類あります。<strong>==（等価演算子）</strong>と<strong>===（厳密等価演算子）</strong>です。違いは暗黙の型変換をするかどうかです。</p>
<table>
<tr><th>演算子</th><th>名前</th><th>型が違うとき</th></tr>
<tr><td><code>==</code></td><td>等価</td><td>型を変換してから比較する</td></tr>
<tr><td><code>===</code></td><td>厳密等価</td><td>型が違えば即false</td></tr>
</table>
<pre><code>console.log(1 == "1");    // true（"1"が数値に変換されて比較される）
console.log(1 === "1");   // false（number と string は型が違う）
console.log(0 == "");     // true（どちらも0に変換される）
console.log(0 === "");    // false</code></pre>
<p><code>==</code>の変換ルールは複雑で、直感に反する結果を生みます。<code>0 == ""</code>がtrueになることを暗記している人はほとんどいません。予測しにくい比較はバグの温床になるため、現代のJavaScript開発では<strong>常に===を使う</strong>のが標準的なルールです（等しくないことを調べる<code>!=</code>と<code>!==</code>も同様に、<code>!==</code>を使います）。</p>
<p>唯一の例外的な知識として、<code>null == undefined</code>はtrueになります。</p>
<pre><code>console.log(null == undefined);   // true
console.log(null === undefined);  // false</code></pre>
<p>この性質を「nullとundefinedをまとめてチェックする」目的で意図的に使う流儀もありますが、まずは「<strong>比較は===、理由を説明できるときだけ==</strong>」と覚えておけば間違いありません。コードレビューでも==はほぼ確実に指摘されるポイントです。</p>`,
      task: `TODOの行の<code>==</code>を<code>===</code>に書き換えて、型まで含めた厳密な比較の結果を確認してください。`,
      code: `// まず実行して、==がどう判定するか観察しましょう
console.log("1 == \\"1\\" は:", 1 == "1");
console.log("0 == \\"\\" は:", 0 == "");

// TODO: 下の2行の==を===に書き換えて、結果の違いを確認する
console.log("厳密比較 1と\\"1\\":", 1 == "1");
console.log("厳密比較 0と\\"\\":", 0 == "");
`,
      solution: `// ==は型変換してから比較するためtrueになる
console.log("1 == \\"1\\" は:", 1 == "1");
console.log("0 == \\"\\" は:", 0 == "");

// ===は型が違えば即false
console.log("厳密比較 1と\\"1\\":", 1 === "1");
console.log("厳密比較 0と\\"\\":", 0 === "");
`,
      hints: [`イコールを2つ並べると型変換あり、3つ並べると型変換なしの比較になります。`, `TODOの2行にある == をそれぞれ === に変えるだけです。trueだった結果がfalseに変わることを確認しましょう。`],
      expectedOutput: "厳密比較 1と\"1\": false"
    },
    {
      id: 20,
      title: "総合演習：BMI計算機を作る",
      explanation: `<p>第2章の総仕上げとして、BMI（体格指数）を計算して整形出力するプログラムを作ります。BMIは次の式で求められます。</p>
<pre><code>BMI = 体重(kg) ÷ (身長(m) × 身長(m))</code></pre>
<p>この演習で使う、章で学んだ知識を整理します。</p>
<ul>
<li><strong>number型の算術演算</strong>（ステップ11）：わり算とかけ算でBMIを計算する</li>
<li><strong>toFixed</strong>（ステップ12）：計算結果には長い小数が出るので、小数点以下1桁に整形する</li>
<li><strong>文字列連結</strong>（第1章ステップ8・10）：単位付きの表示を組み立てる</li>
<li><strong>boolean型と比較演算子</strong>（ステップ14）：BMIが標準範囲の上限25未満かを判定する</li>
</ul>
<p>計算式をコードにするときのポイントは括弧です。身長の2乗を先に計算する必要があるため、次のように書きます。</p>
<pre><code>const bmi = weight / (height * height);</code></pre>
<p>括弧がないと<code>weight / height * height</code>は左から順に計算され、まったく違う結果になってしまいます（わり算とかけ算は優先順位が同じため）。</p>
<p>また、体重60kg・身長1.7mの場合、BMIの計算結果は<code>20.761245674740486...</code>のような長い小数になります。人に見せる数値は<code>toFixed(1)</code>で「20.8」に整えましょう。データ型の知識（数値のまま計算し、表示の直前で文字列に整形する）が、そのまま実用プログラムの設計になっていることを感じ取ってください。</p>`,
      task: `TODOに従って、体重60kg・身長1.7mのBMIを計算し、<code>toFixed(1)</code>で整形して「BMI: 20.8」と表示してください。最後にBMIが25未満かどうかの判定結果も表示しましょう。`,
      code: `const weight = 60;
const height = 1.7;

// TODO: BMIを計算する（体重 ÷ (身長 × 身長)）
const bmi = 0;

console.log("===== BMI計算結果 =====");
console.log("体重: " + weight + "kg");
console.log("身長: " + height + "m");
// TODO: toFixed(1)で小数点以下1桁に整形して表示する
console.log("BMI: " + bmi);
// TODO: bmiが25未満かどうかを比較演算子で表示する
console.log("標準値25未満か:", false);
`,
      solution: `const weight = 60;
const height = 1.7;

const bmi = weight / (height * height);

console.log("===== BMI計算結果 =====");
console.log("体重: " + weight + "kg");
console.log("身長: " + height + "m");
console.log("BMI: " + bmi.toFixed(1));
console.log("標準値25未満か:", bmi < 25);
`,
      hints: [`計算式は weight / (height * height) です。括弧で身長の2乗を先に計算します。`, `表示は bmi.toFixed(1)、判定は bmi < 25 と書きます。toFixedを使うのは表示の行だけで、bmi自体は数値のまま保ちます。`],
      expectedOutput: "BMI: 20.8"
    }
  ]
});
