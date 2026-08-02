// 第21章：よくあるエラー：構文と参照
registerChapter({
  number: 21,
  title: "よくあるエラー：構文と参照",
  description: "実際のエラーメッセージを読んで原因を特定し、修正する訓練の章です。ReferenceError・SyntaxError・TypeErrorの読み方と、構文・参照にまつわる典型バグの直し方を学びます。",
  steps: [
    {
      id: 201,
      title: "ReferenceError: x is not defined（変数名のtypo）",
      explanation: `<p>ここからの2章は「エラーを読む訓練」です。エラーは敵ではなく、<strong>原因の場所と種類を教えてくれる最高のヒント</strong>です。まずJavaScriptの3大エラーを整理しましょう。</p>
<table>
<tr><th>エラー種別</th><th>意味</th><th>典型的な原因</th></tr>
<tr><td><code>ReferenceError</code></td><td>存在しない名前を参照した</td><td>変数名のtypo、宣言忘れ</td></tr>
<tr><td><code>SyntaxError</code></td><td>文法として解釈できない</td><td>括弧やクォートの閉じ忘れ</td></tr>
<tr><td><code>TypeError</code></td><td>その型では許されない操作をした</td><td>undefinedのプロパティ参照、constへの再代入</td></tr>
</table>
<p>今回のコードをNode.jsで実行すると、実際に次のエラーが表示されます。</p>
<pre><code>console.log(mesage);
            ^

ReferenceError: mesage is not defined
    at Object.&lt;anonymous&gt; (main.js:3:13)</code></pre>
<p>読み方は上から順に、(1)問題のコード行と<code>^</code>（問題の位置）、(2)エラー種別とメッセージ「mesageは定義されていない」、(3)スタックトレース（エラーに至る呼び出し履歴）です。<code>main.js:3:13</code>は「main.jsの<strong>3行目・13文字目</strong>」という意味で、まずここを見に行くのが鉄則です。</p>
<p>今回は<code>message</code>と宣言した変数を<code>mesage</code>と書き間違えたのが原因です。JavaScriptは宣言していない名前を読もうとした瞬間にReferenceErrorを投げます。<strong>「is not defined」を見たら、まず変数名のスペルを宣言側と使用側で見比べる</strong>のが最短の直し方です。</p>`,
      task: `エラーメッセージが指す行を確認し、変数名のtypoを修正してあいさつが表示されるようにしましょう。`,
      code: `// あいさつを表示するプログラム
const message = "こんにちは、JavaScript!";
console.log(mesage);`,
      solution: `// あいさつを表示するプログラム
const message = "こんにちは、JavaScript!";
// 宣言した名前(message)と使う名前を一致させる
console.log(message);`,
      hints: [
        `エラーメッセージの「mesage is not defined」は「mesageという名前はどこにも宣言されていない」という意味です。`,
        `2行目で宣言した変数名と、3行目で使っている変数名を1文字ずつ見比べましょう。`
      ],
      expectedOutput: "こんにちは、JavaScript!"
    },
    {
      id: 202,
      title: "SyntaxError: missing )（括弧の閉じ忘れ）",
      explanation: `<p>次はSyntaxError（構文エラー）です。実行すると次のように表示されます。</p>
<pre><code>console.log("2 + 3 = " + add(2, 3);
                                  ^

SyntaxError: missing ) after argument list
    at internalCompileFunction (node:internal/vm:73:18)
    at wrapSafe (node:internal/modules/cjs/loader:1153:20)</code></pre>
<p>「引数リストの後の<code>)</code>が足りない」という意味です。SyntaxErrorには他のエラーと決定的に違う特徴が2つあります。</p>
<ol>
<li><strong>実行前（構文解析の段階）に発生する</strong>ため、1行目のconsole.logすら実行されません。プログラム全体が動かなくなります。</li>
<li>スタックトレースに<code>node:internal/...</code>という自分のコードではない行が並びます。これはNode.js内部の構文解析処理で、<strong>読むべきは最初の「ファイル名と問題のコード行」だけ</strong>です。</li>
</ol>
<p><code>^</code>の位置にも注意が必要です。構文解析は「ここまで読んで初めて文法が破綻した」と分かった位置を指すため、<strong>本当の原因（閉じ忘れた括弧）は<code>^</code>より手前にある</strong>ことがよくあります。括弧の対応を数えるコツは、開き括弧<code>(</code>と閉じ括弧<code>)</code>を左から順にペアにしていくことです。</p>
<pre><code>console.log("2 + 3 = " + add(2, 3);
//         1                2    ここで2つ開いて1つしか閉じていない</code></pre>
<p>エディタの括弧ハイライト機能（対応する括弧を光らせる機能）を使うのも実務での定番テクニックです。</p>`,
      task: `括弧の対応を確認してSyntaxErrorを解消し、計算結果が表示されるようにしましょう。`,
      code: `// 2つの数を足す関数
function add(a, b) {
  return a + b;
}

console.log("2 + 3 = " + add(2, 3);`,
      solution: `// 2つの数を足す関数
function add(a, b) {
  return a + b;
}

// console.log( と add( の2つを開いたので、閉じ括弧も2つ必要
console.log("2 + 3 = " + add(2, 3));`,
      hints: [
        `開き括弧の数と閉じ括弧の数を数えてみましょう。最終行には開き括弧が2つあります。`,
        `add(2, 3)を閉じたあと、console.log(...)を閉じる括弧がもう1つ必要です。`
      ],
      expectedOutput: "2 + 3 = 5"
    },
    {
      id: 203,
      title: "TypeError: Assignment to constant variable",
      explanation: `<p>constで宣言した変数に再代入すると、実行時に次のTypeErrorが発生します。</p>
<pre><code>total = total + p;
      ^

TypeError: Assignment to constant variable.
    at Object.&lt;anonymous&gt; (main.js:6:9)</code></pre>
<p>「定数（constant variable）への代入」という意味です。<code>main.js:6:9</code>から、6行目の<code>=</code>の位置で起きたと分かります。SyntaxErrorと違い<strong>実行時エラー</strong>なので、その行に到達するまでの処理（ここでは配列の準備など）は正常に動いた上で、再代入の瞬間に止まります。</p>
<p>直し方は状況によって2通りあります。</p>
<table>
<tr><th>状況</th><th>直し方</th></tr>
<tr><td>本当に値を更新したい（合計・カウンタなど）</td><td>宣言を<code>let</code>に変える</td></tr>
<tr><td>更新するつもりがなかった</td><td>再代入している行のロジックを見直す</td></tr>
</table>
<p>今回は合計金額を足し込みたいので、<code>let</code>が正解です。逆に言えば、<strong>constはこの「うっかり再代入」をエラーとして検出してくれる安全装置</strong>です。「まずconstで宣言し、再代入が必要になったときだけletに変える」という書き方をすると、意図しない上書きをエラーで早期発見できます。</p>
<pre><code>let total = 0;      // 更新される変数はlet
const prices = [];  // 再代入しない変数はconst</code></pre>`,
      task: `エラーメッセージを読み、再代入が必要な変数の宣言を修正して合計金額を表示しましょう。`,
      code: `// 商品価格の合計を計算するプログラム
const total = 0;
const prices = [120, 250, 380];

for (const p of prices) {
  total = total + p;
}

console.log("合計: " + total + "円");`,
      solution: `// 商品価格の合計を計算するプログラム
// ループの中で更新するのでletで宣言する
let total = 0;
const prices = [120, 250, 380];

for (const p of prices) {
  total = total + p;
}

console.log("合計: " + total + "円");`,
      hints: [
        `constは「再代入できない」宣言です。ループ内で値を更新したい変数はどう宣言すべきでしょうか。`,
        `totalの宣言をletに変えます。pricesは再代入していないのでconstのままで問題ありません。`
      ],
      expectedOutput: "合計: 750円"
    },
    {
      id: 204,
      title: "Cannot access before initialization（TDZの罠）",
      explanation: `<p>letやconstで宣言した変数を、宣言より前の行で使うと次のエラーになります。</p>
<pre><code>console.log("価格は" + price + "円です");
                       ^

ReferenceError: Cannot access 'price' before initialization
    at Object.&lt;anonymous&gt; (main.js:2:24)</code></pre>
<p>「初期化前の'price'にはアクセスできない」という意味です。ステップ201の「is not defined」と<strong>メッセージが違う</strong>ことに注目してください。この違いは原因の切り分けに直結します。</p>
<table>
<tr><th>メッセージ</th><th>意味</th><th>疑うべきこと</th></tr>
<tr><td>x is not defined</td><td>宣言がどこにもない</td><td>typo・宣言忘れ</td></tr>
<tr><td>Cannot access 'x' before initialization</td><td>宣言はあるが、その行より後にある</td><td>コードの順序</td></tr>
</table>
<p>letとconstの宣言は、スコープの先頭から宣言行までの区間が<strong>TDZ（Temporal Dead Zone：一時的死角）</strong>と呼ばれ、この区間で変数に触るとReferenceErrorになります。varではこの仕組みがなく、宣言前に読むと黙って<code>undefined</code>になるため、バグに気づきにくいという問題がありました。</p>
<pre><code>console.log(a); // varなら undefined（エラーにならず見逃しやすい）
var a = 1;</code></pre>
<p>つまりTDZは「宣言前に使うミス」を<strong>即座にエラーで知らせてくれる改善</strong>です。直し方は単純で、宣言を使用より前に移動します。</p>`,
      task: `変数の宣言と使用の順序を修正し、価格が表示されるようにしましょう。`,
      code: `// 商品価格を表示するプログラム
console.log("価格は" + price + "円です");
let price = 500;`,
      solution: `// 商品価格を表示するプログラム
// 宣言を使用より前に置く
let price = 500;
console.log("価格は" + price + "円です");`,
      hints: [
        `「before initialization」は「初期化（=宣言時の代入）より前」という意味です。priceの宣言は何行目にありますか。`,
        `let price = 500; の行をconsole.logより前に移動しましょう。`
      ],
      expectedOutput: "価格は500円です"
    },
    {
      id: 205,
      title: "return後の改行でundefined（ASIの罠）",
      explanation: `<p>今回のコードはエラーになりません。しかし実行すると<code>undefined</code>と表示されます。<strong>エラーが出ないのに結果がおかしい</strong>、実務で最も厄介なタイプのバグです。</p>
<p>原因はASI（Automatic Semicolon Insertion：自動セミコロン挿入）です。JavaScriptは文末のセミコロンを省略すると、一定のルールで自動的に補います。そして<strong>returnの直後で改行すると、そこにセミコロンが挿入される</strong>という仕様があります。</p>
<pre><code>function getMessage(name) {
  return          // ← ここで return; と解釈される
    "こんにちは、" + name + "さん";  // ← この行は実行されない
}</code></pre>
<p>つまりこの関数は<code>return;</code>（何も返さない＝undefinedを返す）を実行して終わります。後ろの文字列は評価すらされません。構文としては合法なので、SyntaxErrorにもなりません。</p>
<p>直し方は、<strong>返す値をreturnと同じ行から書き始める</strong>ことです。長い式を折り返したい場合は、括弧で囲めば改行しても安全です。</p>
<pre><code>return (
  "こんにちは、" + name + "さん"
);  // 括弧が開いている間はセミコロンが挿入されない</code></pre>
<p>この罠はオブジェクトを返すときにも頻発します。<code>return</code>の後に改行して<code>{</code>を書くと、オブジェクトではなくただのブロックと解釈されてしまいます。「関数の戻り値がなぜかundefined」と感じたら、まずreturnの直後の改行を疑いましょう。</p>`,
      task: `関数がundefinedを返す原因を修正し、あいさつ文が表示されるようにしましょう。`,
      code: `// あいさつ文を作る関数
function getMessage(name) {
  return
    "こんにちは、" + name + "さん";
}

console.log(getMessage("たろう"));`,
      solution: `// あいさつ文を作る関数
// 返す値はreturnと同じ行から書き始める
function getMessage(name) {
  return "こんにちは、" + name + "さん";
}

console.log(getMessage("たろう"));`,
      hints: [
        `エラーは出ていませんが、returnの直後で改行すると自動でセミコロンが入り、return;として扱われます。`,
        `返したい文字列をreturnと同じ行に書きましょう。`
      ],
      expectedOutput: "こんにちは、たろうさん"
    },
    {
      id: 206,
      title: "TypeError: x is not a function（メソッド名のtypo）",
      explanation: `<p>実行すると次のTypeErrorが発生します。</p>
<pre><code>console.log("大文字: " + word.toUppercase());
                              ^

TypeError: word.toUppercase is not a function
    at Object.&lt;anonymous&gt; (main.js:3:31)</code></pre>
<p>「word.toUppercaseは関数ではない」という意味です。仕組みを分解すると、(1)文字列に<code>toUppercase</code>というプロパティは存在しないので値は<code>undefined</code>になる、(2)その<code>undefined</code>を<code>()</code>で関数として呼び出そうとして失敗する、という2段階で起きています。</p>
<p>このエラーを見たらチェックすることは3つです。</p>
<ol>
<li><strong>スペルミスがないか</strong>（今回の原因）</li>
<li><strong>大文字・小文字が正しいか</strong>。JavaScriptは大文字・小文字を区別するため、正しくは<code>toUpperCase</code>（Caseの C が大文字）です</li>
<li><strong>その型にそのメソッドがあるか</strong>。例えば配列の<code>map</code>を文字列に対して呼ぶと同じエラーになります</li>
</ol>
<p>間違えやすいメソッド名の例をまとめます。</p>
<table>
<tr><th>正しい名前</th><th>ありがちな間違い</th></tr>
<tr><td><code>toUpperCase</code> / <code>toLowerCase</code></td><td>toUppercase / toLowercase</td></tr>
<tr><td><code>indexOf</code></td><td>indexof</td></tr>
<tr><td><code>forEach</code></td><td>foreach（すべて小文字）</td></tr>
</table>
<p>迷ったら<code>console.log(typeof word.toUpperCase)</code>で確かめられます。関数なら<code>"function"</code>、名前が間違っていれば<code>"undefined"</code>と表示されます。</p>`,
      task: `メソッド名の大文字・小文字を修正し、文字列が大文字で表示されるようにしましょう。`,
      code: `// 文字列を大文字に変換するプログラム
const word = "javascript";
console.log("大文字: " + word.toUppercase());`,
      solution: `// 文字列を大文字に変換するプログラム
// メソッド名は大文字・小文字まで正確に(toUpperCase)
const word = "javascript";
console.log("大文字: " + word.toUpperCase());`,
      hints: [
        `「is not a function」は、その名前のプロパティがundefined（存在しない）なのに関数として呼んだという意味です。`,
        `正しいメソッド名はtoUpperCaseです。Caseの C が大文字であることを確認しましょう。`
      ],
      expectedOutput: "大文字: JAVASCRIPT"
    },
    {
      id: 207,
      title: "NaNの発生源を追う",
      explanation: `<p>実行するとエラーは出ませんが、<code>合計: NaN円</code>と表示されます。<strong>NaN（Not a Number：非数）</strong>は「数値計算の結果が数値として表せない」ことを示す特別な値です。</p>
<p>NaNの厄介な性質は<strong>伝染する</strong>ことです。一度NaNが生まれると、それを使った計算はすべてNaNになります。だから画面にNaNが出たときは、<strong>表示箇所ではなく、最初にNaNが生まれた場所</strong>を探す必要があります。</p>
<p>NaNが生まれる典型パターンは次の通りです。</p>
<table>
<tr><th>パターン</th><th>例</th><th>結果</th></tr>
<tr><td>undefinedとの計算</td><td><code>undefined * 3</code></td><td>NaN</td></tr>
<tr><td>数値にできない文字列の変換</td><td><code>Number("abc")</code></td><td>NaN</td></tr>
<tr><td>数値にできない文字列との計算</td><td><code>"abc" - 1</code></td><td>NaN</td></tr>
</table>
<p>追跡のコツは、計算に使った値を1つずつconsole.logで確認して<strong>上流にさかのぼる</strong>ことです。</p>
<pre><code>console.log(item.prise);   // undefined ← 犯人発見
console.log(quantity);     // 3</code></pre>
<p><code>item.prise</code>がundefinedになるのは、オブジェクトに存在しないプロパティ名（priseはpriceのtypo）を読んだためです。存在しないプロパティの読み取りは<strong>エラーにならずundefinedを返す</strong>ので、そのまま掛け算に流れ込んでNaNになりました。「NaNを見たらundefinedの混入を疑い、プロパティ名を確認する」と覚えておきましょう。</p>`,
      task: `NaNの発生源をたどり、プロパティ名のtypoを修正して正しい合計を表示しましょう。`,
      code: `// 購入金額を計算するプログラム
const item = { name: "りんご", price: 120 };
const quantity = 3;

const total = item.prise * quantity;
console.log("合計: " + total + "円");`,
      solution: `// 購入金額を計算するプログラム
const item = { name: "りんご", price: 120 };
const quantity = 3;

// 存在しないプロパティ(prise)はundefinedになりNaNの原因になる
const total = item.price * quantity;
console.log("合計: " + total + "円");`,
      hints: [
        `NaNは計算のどこかにundefinedや変換できない値が混ざったサインです。掛け算に使った2つの値をconsole.logで確認しましょう。`,
        `item.priseはオブジェクトに存在しないプロパティです。宣言側のプロパティ名と見比べましょう。`
      ],
      expectedOutput: "合計: 360円"
    },
    {
      id: 208,
      title: "クォートの閉じ忘れ・入れ子ミス",
      explanation: `<p>実行すると次のSyntaxErrorが発生します。</p>
<pre><code>const text = 'It's a beautiful day';
                ^

SyntaxError: Unexpected identifier 's'
    at internalCompileFunction (node:internal/vm:73:18)</code></pre>
<p>「予期しない識別子 's'」という意味です。一見不思議なメッセージですが、構文解析の視点で読むと理由が分かります。JavaScriptは<code>'It'</code>の時点で「文字列はここで終わり」と判断し、直後の<code>s</code>を変数名か何か（識別子）だと解釈しようとして破綻したのです。<code>^</code>が指しているのはまさにその<code>s</code>の位置です。</p>
<p>つまり<strong>文字列の中に、その文字列を囲っているのと同じ記号が現れると、そこで文字列が途切れます</strong>。対処法は3つあります。</p>
<table>
<tr><th>方法</th><th>書き方</th></tr>
<tr><td>外側を別の記号にする</td><td><code>"It's a beautiful day"</code></td></tr>
<tr><td>バックスラッシュでエスケープする</td><td><code>'It\\'s a beautiful day'</code></td></tr>
<tr><td>逆パターン（中にダブルクォート）</td><td><code>'彼は"OK"と言った'</code></td></tr>
</table>
<p>エスケープ（<code>\'</code>）は「この記号は文字列の終わりではなく、ただの文字です」と伝える書き方です。実務では<strong>外側のクォートを変えるほうが読みやすい</strong>ため、まずそちらを検討しましょう。エディタのシンタックスハイライトで文字列の色が途中で切れていたら、クォートの対応ミスのサインです。</p>`,
      task: `クォートの対応を修正し、アポストロフィを含む文がそのまま表示されるようにしましょう。`,
      code: `// 今日の一言を表示するプログラム
const text = 'It's a beautiful day';
console.log(text);`,
      solution: `// 今日の一言を表示するプログラム
// 中身にシングルクォートがあるので、外側はダブルクォートで囲む
const text = "It's a beautiful day";
console.log(text);`,
      hints: [
        `'It'の直後で文字列が終わったと解釈されています。文中のアポストロフィと囲みの記号が同じなのが原因です。`,
        `外側の囲みをダブルクォートに変えるか、文中の ' を \\' とエスケープしましょう。`
      ],
      expectedOutput: "It's a beautiful day"
    },
    {
      id: 209,
      title: "if (a = 1)：代入と比較の取り違え",
      explanation: `<p>実行するとエラーは出ませんが、在庫が0個なのに「在庫あり: 残り10個」と表示されます。原因は、if文の条件に比較（<code>===</code>）ではなく<strong>代入（<code>=</code>）を書いてしまった</strong>ことです。</p>
<pre><code>if (stock = 10) {   // stockに10を代入してしまっている</code></pre>
<p>なぜエラーにならないのでしょうか。JavaScriptでは代入も「式」であり、<strong>代入した値そのものを返します</strong>。つまり<code>stock = 10</code>という式の値は<code>10</code>で、10はtruthy（真として扱われる値）なので、条件は常に成立します。さらに悪いことに、変数の中身まで10に書き換わってしまいます。</p>
<table>
<tr><th>書き方</th><th>意味</th><th>結果</th></tr>
<tr><td><code>stock = 10</code></td><td>代入する</td><td>常にtruthyで分岐が壊れる</td></tr>
<tr><td><code>stock === 10</code></td><td>等しいか比較する</td><td>正しく分岐する</td></tr>
</table>
<p>このバグを防ぐ実務のテクニックを2つ紹介します。</p>
<ol>
<li><strong>再代入しない変数はconstで宣言する</strong>。constなら<code>if (stock = 10)</code>の時点でTypeError（Assignment to constant variable）になり、即座に気づけます。</li>
<li><strong>ESLintなどの静的解析ツール</strong>（コードを実行せずに問題を検出するツール）を使う。if条件内の代入は代表的な警告項目です。</li>
</ol>
<p>「条件分岐の結果がいつも同じ」「変数がいつの間にか書き換わっている」と感じたら、条件式の<code>=</code>の数を数えましょう。</p>`,
      task: `if文の条件を代入から比較に修正し、在庫0のとき「在庫切れです」と表示されるようにしましょう。`,
      code: `// 在庫チェックのプログラム
let stock = 0;

if (stock = 10) {
  console.log("在庫あり: 残り" + stock + "個");
} else {
  console.log("在庫切れです");
}`,
      solution: `// 在庫チェックのプログラム
let stock = 0;

// = は代入、=== が比較。条件式では===を使う
if (stock === 10) {
  console.log("在庫あり: 残り" + stock + "個");
} else {
  console.log("在庫切れです");
}`,
      hints: [
        `stock = 10 は「代入」で、式の値は10（truthy）になるため条件が常に成立してしまいます。`,
        `「等しいかどうか」を調べるには===を使います。`
      ],
      expectedOutput: "在庫切れです"
    },
    {
      id: 210,
      title: "総合演習：エラーだらけのスクリプトを直す",
      explanation: `<p>この章の総仕上げです。今回のコードには<strong>3種類のエラーが仕込まれています</strong>。実際のデバッグと同じように、エラーメッセージを読んで1つずつ倒していきましょう。</p>
<p>重要なのは<strong>エラーが出る順番</strong>です。種類によって発見されるタイミングが違います。</p>
<table>
<tr><th>順番</th><th>種類</th><th>タイミング</th></tr>
<tr><td>1</td><td>SyntaxError</td><td>実行前の構文解析で発見（1行も実行されない）</td></tr>
<tr><td>2</td><td>実行時エラー（TypeError・ReferenceErrorなど）</td><td>その行に到達した瞬間</td></tr>
</table>
<p>つまり最初に表示されるのはSyntaxErrorです。これを直して再実行すると、次は実行時エラーが<strong>コードの上から順に</strong>現れます。「直す→実行する→次のエラーを読む」というサイクルを回すのがデバッグの基本形です。</p>
<p>この章で学んだチェックリストを再掲します。</p>
<ol>
<li><code>missing )</code>など → 括弧・クォートの対応を数える（ステップ202・208）</li>
<li><code>Assignment to constant variable</code> → 更新する変数はletに（ステップ203）</li>
<li><code>x is not defined</code> → 変数名のスペルを宣言側と見比べる（ステップ201）</li>
</ol>
<p>エラーメッセージの<code>main.js:行:列</code>を頼りに、該当行だけを集中して見るのがコツです。焦って全体を書き直すのではなく、<strong>メッセージが指す1箇所だけを最小限に直す</strong>習慣をつけましょう。</p>`,
      task: `3つのエラー（括弧の閉じ忘れ・constへの再代入・変数名のtypo）をすべて修正し、合計と平均が表示されるようにしましょう。`,
      code: `// 会員のポイント合計と平均を計算するプログラム
const members = [
  { name: "たろう", point: 120 },
  { name: "はなこ", point: 340 },
  { name: "じろう", point: 80 }
];

const sum = 0;
for (const m of members) {
  sum = sum + m.point;
}

const average = sum / menbers.length;

console.log("合計: " + sum + "ポイント";
console.log("平均: " + average + "ポイント");`,
      solution: `// 会員のポイント合計と平均を計算するプログラム
const members = [
  { name: "たろう", point: 120 },
  { name: "はなこ", point: 340 },
  { name: "じろう", point: 80 }
];

// ループ内で更新するのでlet
let sum = 0;
for (const m of members) {
  sum = sum + m.point;
}

// 変数名はmembers(typoに注意)
const average = sum / members.length;

// 閉じ括弧の数をそろえる
console.log("合計: " + sum + "ポイント");
console.log("平均: " + average + "ポイント");`,
      hints: [
        `まず表示されるのはSyntaxErrorです。console.logの行の括弧の対応を確認しましょう。`,
        `構文を直して実行すると、次はsumへの再代入でTypeErrorが出ます。宣言をletに変えましょう。`,
        `最後にReferenceErrorが出ます。menbersというスペルを宣言側と見比べましょう。`
      ],
      expectedOutput: "平均: 180ポイント"
    }
  ]
});
