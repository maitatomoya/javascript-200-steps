// 第9章：文字列処理
registerChapter({
  number: 9,
  title: "文字列処理",
  description: "テンプレートリテラル、文字列メソッド、正規表現の基本を学び、テキストを自在に加工できるようになります。",
  steps: [
    {
      id: 81,
      title: "テンプレートリテラル",
      explanation: `<p>これまで文字列は<code>"..."</code>や<code>'...'</code>で書き、変数と組み合わせるときは<code>+</code>で連結してきました。<strong>テンプレートリテラル</strong>は、バッククォート（<code>\`</code>）で囲む第3の文字列の書き方です。<code>\${変数名}</code>という形で文字列の中に変数や式を直接埋め込めるため、連結よりも読みやすいコードになります。</p>
<pre><code>const name = "太郎";
const age = 20;
// 文字列連結の場合
console.log("私は" + name + "、" + age + "歳です");
// テンプレートリテラルの場合
console.log(\`私は\${name}、\${age}歳です\`);</code></pre>
<p>テンプレートリテラルにはもう1つ大きな特徴があります。<strong>改行をそのまま書ける</strong>ことです。通常の文字列で改行するには特殊な書き方が必要ですが、テンプレートリテラルなら見たままの形で複数行の文字列を作れます。</p>
<pre><code>const poem = \`1行目
2行目\`;
console.log(poem);</code></pre>
<table><tr><th>書き方</th><th>記号</th><th>変数埋め込み</th><th>改行</th></tr><tr><td>文字列リテラル</td><td>"..." '...'</td><td>+で連結</td><td>不可（エスケープが必要）</td></tr><tr><td>テンプレートリテラル</td><td>\`...\`</td><td>\${}で埋め込み</td><td>そのまま書ける</td></tr></table>
<p><code>\${}</code>の中には変数だけでなく<code>\${age + 1}</code>のような式も書けます。現代のJavaScriptでは文字列を組み立てる際の標準的な書き方なので、しっかり身につけましょう。</p>`,
      task: `文字列連結で書かれた<code>console.log</code>を、テンプレートリテラルを使った形に書き換えてください。出力結果は同じになるようにします。`,
      code: `const name = "花子";
const age = 25;

// TODO: 下の文字列連結をテンプレートリテラルで書き換える
console.log("こんにちは、" + name + "さんは" + age + "歳です");
`,
      solution: `const name = "花子";
const age = 25;

// テンプレートリテラルで変数を埋め込む
console.log(\`こんにちは、\${name}さんは\${age}歳です\`);

// 改行もそのまま書ける
const profile = \`名前: \${name}
年齢: \${age}歳\`;
console.log(profile);
`,
      hints: [
        `文字列全体をバッククォート（Shift+@キーで入力できる記号）で囲みます。シングルクォートやダブルクォートではありません。`,
        `変数を埋め込む部分は、ドル記号と波括弧で変数名を包みます。例えば変数nameなら「ドル記号、開き波括弧、name、閉じ波括弧」の順に書きます。`
      ],
      expectedOutput: "こんにちは、花子さんは25歳です"
    },
    {
      id: 82,
      title: "文字列の切り出し：slice・substring",
      explanation: `<p>文字列の一部を取り出す操作は、ファイル名から拡張子を得る、日付文字列から年だけを取るなど、実務で頻出します。代表的なメソッドが<code>slice</code>と<code>substring</code>です。</p>
<p><code>slice(開始位置, 終了位置)</code>は、開始位置から<strong>終了位置の直前まで</strong>を切り出します。位置は0から数え、終了位置の文字自体は含まれません。第2引数を省略すると末尾まで切り出します。</p>
<pre><code>const str = "JavaScript";
console.log(str.slice(0, 4));  // "Java"（0〜3文字目）
console.log(str.slice(4));     // "Script"（4文字目から末尾まで）
console.log(str.slice(-6));    // "Script"（負の数は末尾から数える）</code></pre>
<p><code>substring</code>もほぼ同じ動きをしますが、細かい違いがあります。</p>
<table><tr><th>ケース</th><th>slice</th><th>substring</th></tr><tr><td>負の引数</td><td>末尾から数える</td><td>0として扱う</td></tr><tr><td>開始 &gt; 終了のとき</td><td>空文字列を返す</td><td>引数を入れ替えて処理</td></tr></table>
<p>負の位置指定が使える<code>slice</code>のほうが柔軟なため、実務ではsliceを使うことが多いです。「末尾の3文字が欲しい」なら<code>str.slice(-3)</code>と書くだけで済みます。なお、これらのメソッドは元の文字列を変更せず、<strong>新しい文字列を返す</strong>点も重要です。文字列は一度作ると中身を変えられない（イミュータブルな）データだからです。</p>`,
      task: `<code>slice</code>を使って、変数<code>fileName</code>から「拡張子を除いた名前部分」と「末尾4文字の拡張子部分」をそれぞれ切り出して出力してください。`,
      code: `const fileName = "report2026.txt";

// TODO: sliceで「report2026」を切り出して出力する
console.log("名前: " + fileName.slice(0, 0));

// TODO: sliceの負の引数で「.txt」を切り出して出力する
console.log("拡張子: " + fileName.slice(0));
`,
      solution: `const fileName = "report2026.txt";

// 0文字目から10文字目の直前までを切り出す
console.log("名前: " + fileName.slice(0, 10));

// 負の数を渡すと末尾から数える
console.log("拡張子: " + fileName.slice(-4));
`,
      hints: [
        `「report2026」は10文字なので、0文字目から始めて何文字目の直前で終わればよいか考えましょう。`,
        `末尾からの切り出しはslice(-4)のように負の数を1つ渡します。「.txt」は4文字です。`
      ],
      expectedOutput: "拡張子: .txt"
    },
    {
      id: 83,
      title: "文字列の検索：indexOf・includes・startsWith・endsWith",
      explanation: `<p>「この文字列にキーワードが含まれているか」「このファイル名は特定の拡張子で終わるか」といった検索・判定には、専用のメソッドが用意されています。</p>
<table><tr><th>メソッド</th><th>返り値</th><th>意味</th></tr><tr><td>indexOf(検索文字列)</td><td>数値</td><td>最初に見つかった位置。なければ-1</td></tr><tr><td>includes(検索文字列)</td><td>true/false</td><td>含まれているか</td></tr><tr><td>startsWith(検索文字列)</td><td>true/false</td><td>その文字列で始まるか</td></tr><tr><td>endsWith(検索文字列)</td><td>true/false</td><td>その文字列で終わるか</td></tr></table>
<pre><code>const email = "taro@example.com";
console.log(email.indexOf("@"));              // 4
console.log(email.includes("example"));       // true
console.log(email.startsWith("taro"));        // true
console.log(email.endsWith(".com"));          // true</code></pre>
<p>第5章で学んだ配列の<code>indexOf</code>・<code>includes</code>と同じ名前・同じ考え方なので対で覚えましょう。歴史的には「含まれるか」の判定に<code>indexOf(x) !== -1</code>という書き方が使われてきましたが、今は<code>includes</code>のほうが意図が明確です。ただし<code>indexOf</code>は「どこにあるか」という位置情報が必要な場面（例：@マークの位置でメールアドレスを分割する）で今も現役です。用途で使い分けるのがポイントです。なお、これらの判定はすべて大文字と小文字を区別します。<code>"ABC".includes("abc")</code>は<code>false</code>です。</p>`,
      task: `変数<code>url</code>について、(1)<code>https://</code>で始まるか、(2)<code>.pdf</code>で終わるか、(3)<code>report</code>という文字を含むか、をそれぞれ判定して出力してください。`,
      code: `const url = "https://example.com/files/report2026.pdf";

// TODO: startsWithでhttps://で始まるか判定する
console.log("安全な接続: " + false);

// TODO: endsWithで.pdfで終わるか判定する
console.log("PDFファイル: " + false);

// TODO: includesでreportを含むか判定する
console.log("レポート関連: " + false);
`,
      solution: `const url = "https://example.com/files/report2026.pdf";

// 先頭の一致はstartsWith
console.log("安全な接続: " + url.startsWith("https://"));

// 末尾の一致はendsWith
console.log("PDFファイル: " + url.endsWith(".pdf"));

// 途中に含まれるかはincludes
console.log("レポート関連: " + url.includes("report"));
`,
      hints: [
        `3つとも「文字列.メソッド名(調べたい文字列)」の形で呼び出し、trueかfalseが返ります。`,
        `falseと書かれている部分を、url.startsWith("https://")のようなメソッド呼び出しに置き換えます。`
      ],
      expectedOutput: "PDFファイル: true"
    },
    {
      id: 84,
      title: "文字列の置換：replace・replaceAll",
      explanation: `<p>文字列の一部を別の文字列に置き換えるには<code>replace</code>と<code>replaceAll</code>を使います。両者の違いはただ1つ、<strong>replaceは最初の1か所だけ</strong>、<strong>replaceAllは該当するすべて</strong>を置換する点です。</p>
<pre><code>const text = "犬が好き。犬は可愛い。";
console.log(text.replace("犬", "猫"));
// "猫が好き。犬は可愛い。" ← 最初の1つだけ
console.log(text.replaceAll("犬", "猫"));
// "猫が好き。猫は可愛い。" ← すべて置換</code></pre>
<p>「全部置き換えたつもりが最初の1つしか置換されていなかった」というのは、初心者が非常によく踏むバグです。全置換のつもりなら必ず<code>replaceAll</code>を使いましょう（Node.js 15以降・モダンブラウザで利用可能）。</p>
<p>もう1つの重要な性質は、slice同様<strong>元の文字列は変化しない</strong>ことです。置換結果は返り値として得られるので、変数に代入し直すか、そのまま出力に使います。</p>
<pre><code>let message = "こんにちわ";
message.replace("わ", "は");   // 返り値を捨てている（messageは変わらない）
message = message.replace("わ", "は");  // 正しい：結果を代入し直す
console.log(message);  // "こんにちは"</code></pre>
<p>置換対象が見つからない場合はエラーにならず、元と同じ内容の文字列が返ります。なお正規表現と組み合わせるとさらに柔軟な置換ができますが、それはステップ87〜88で学びます。</p>`,
      task: `文章中の「JS」をすべて「JavaScript」に置換して出力してください。また、1か所しか置換されない書き方になっている行を修正してください。`,
      code: `const draft = "JSは楽しい。JSを学ぼう。JSで作ろう。";

// TODO: replaceだと最初の1つしか置換されない。全部置換されるよう修正する
const fixed = draft.replace("JS", "JavaScript");

console.log(fixed);
`,
      solution: `const draft = "JSは楽しい。JSを学ぼう。JSで作ろう。";

// replaceAllならすべての「JS」が置換される
const fixed = draft.replaceAll("JS", "JavaScript");

console.log(fixed);
`,
      hints: [
        `replaceは最初に見つかった1か所しか置き換えません。すべて置き換えるメソッドは何だったでしょうか。`,
        `replaceの部分をreplaceAllに変えるだけで、3か所すべてが置換されます。`
      ],
      expectedOutput: "JavaScriptは楽しい。JavaScriptを学ぼう。JavaScriptで作ろう。"
    },
    {
      id: 85,
      title: "整形の道具：trim・padStart・padEnd",
      explanation: `<p>ユーザーの入力データや外部から受け取ったテキストには、前後に余分な空白が紛れ込んでいることがよくあります。<code>trim</code>は文字列の<strong>前後の空白（スペース・タブ・改行）を取り除く</strong>メソッドです。前だけ・後ろだけを取り除く<code>trimStart</code>・<code>trimEnd</code>もあります。</p>
<pre><code>const input = "  taro@example.com  ";
console.log(input.trim());       // "taro@example.com"
console.log(input.trim().length); // 16（前後の空白が消えた）</code></pre>
<p>逆に、文字列を<strong>決まった長さまで埋める</strong>のが<code>padStart</code>と<code>padEnd</code>です。<code>padStart(目標の長さ, 埋める文字)</code>は先頭側を、<code>padEnd</code>は末尾側を埋めます。すでに目標の長さ以上なら何もしません。</p>
<pre><code>console.log("7".padStart(3, "0"));    // "007" ← ゼロ埋め
console.log("42".padStart(5, " "));   // "   42" ← 右揃え
console.log("りんご".padEnd(6, "・")); // "りんご・・・" ← 左揃え</code></pre>
<table><tr><th>メソッド</th><th>用途の例</th></tr><tr><td>trim</td><td>入力値の掃除（ログイン前のメールアドレス処理など）</td></tr><tr><td>padStart</td><td>注文番号のゼロ埋め、数値の右揃え表示</td></tr><tr><td>padEnd</td><td>表形式出力の列揃え</td></tr></table>
<p>この3つを組み合わせると、CLIでの表出力や帳票のような整形が簡単にできます。ステップ90の総合演習でも活躍します。</p>`,
      task: `(1)変数<code>rawInput</code>の前後の空白を取り除いて出力し、(2)注文番号<code>orderNo</code>を<code>padStart</code>で5桁のゼロ埋めにして「ORD-00042」の形式で出力してください。`,
      code: `const rawInput = "   hanako@example.com   ";
const orderNo = "42";

// TODO: trimで前後の空白を取り除く
console.log("メール: [" + rawInput + "]");

// TODO: padStartで5桁のゼロ埋めにする（結果はORD-00042）
console.log("注文番号: ORD-" + orderNo);
`,
      solution: `const rawInput = "   hanako@example.com   ";
const orderNo = "42";

// trimは前後の空白を取り除いた新しい文字列を返す
console.log("メール: [" + rawInput.trim() + "]");

// padStart(5, "0")で5桁になるまで先頭を0で埋める
console.log("注文番号: ORD-" + orderNo.padStart(5, "0"));
`,
      hints: [
        `trimは引数なしで呼び出せます。返り値が空白除去後の文字列です。`,
        `ゼロ埋めはpadStart(桁数, "0")です。「42」を5桁にすると0が3つ付いて「00042」になります。`
      ],
      expectedOutput: "注文番号: ORD-00042"
    },
    {
      id: 86,
      title: "repeatと文字列の組み立て",
      explanation: `<p><code>repeat(回数)</code>は、文字列を指定回数繰り返した新しい文字列を返すメソッドです。単純ですが、区切り線・インデント・簡易グラフなど「同じ文字の繰り返し」が必要な場面で威力を発揮します。</p>
<pre><code>console.log("=".repeat(20));   // "===================="
console.log("ab".repeat(3));   // "ababab"
console.log("x".repeat(0));    // ""（0回は空文字列）</code></pre>
<p>回数に負の数を渡すとエラー（RangeError）になる点には注意してください。変数を渡すときは0以上であることを確認しましょう。</p>
<p>実用的な例として、数値を視覚化する<strong>簡易バーチャート</strong>を作ってみます。値の大きさだけ記号を繰り返せば、コンソールでもデータの傾向がひと目で分かります。</p>
<pre><code>const scores = [8, 3, 6];
for (const score of scores) {
  console.log("■".repeat(score) + "□".repeat(10 - score));
}
// ■■■■■■■■□□
// ■■■□□□□□□□
// ■■■■■■□□□□</code></pre>
<p>「塗りつぶし記号を値の分だけ、空の記号を残りの分だけ」という発想は、進捗バーの表示などにも応用できます。前ステップのpadStart・padEndと組み合わせれば、ラベル付きのきれいなレポート出力が作れるようになります。</p>`,
      task: `<code>repeat</code>を使って、(1)幅20の区切り線（=を20個）を出力し、(2)進捗率<code>progress</code>（10段階中の値）を「■」と「□」合わせて10文字の進捗バーとして出力してください。`,
      code: `const progress = 7;

// TODO: "="を20回繰り返した区切り線を出力する
console.log("=");

// TODO: ■をprogress個、□を(10 - progress)個つなげて出力する
console.log("進捗: " + "■" + "□" + " " + progress * 10 + "%");
`,
      solution: `const progress = 7;

// 区切り線は同じ文字の繰り返しで作る
console.log("=".repeat(20));

// 塗りつぶし部分と空白部分を連結して10文字のバーにする
console.log("進捗: " + "■".repeat(progress) + "□".repeat(10 - progress) + " " + progress * 10 + "%");
`,
      hints: [
        `repeatは文字列のメソッドです。"=".repeat(20)のように呼び出します。`,
        `バーは「■をprogress回繰り返した文字列」と「□を10-progress回繰り返した文字列」を+でつなげます。`
      ],
      expectedOutput: "進捗: ■■■■■■■□□□ 70%"
    },
    {
      id: 87,
      title: "正規表現の基本：test・match",
      explanation: `<p><strong>正規表現</strong>（regular expression）は、「数字の並び」「特定の形式の文字列」といった<strong>文字のパターン</strong>を表現するための記法です。JavaScriptではスラッシュで囲んで<code>/パターン/</code>と書き、これ自体が正規表現オブジェクトになります。</p>
<p>まずは2つの基本操作を覚えましょう。</p>
<table><tr><th>書き方</th><th>返り値</th><th>意味</th></tr><tr><td>正規表現.test(文字列)</td><td>true/false</td><td>パターンに一致する部分があるか</td></tr><tr><td>文字列.match(正規表現)</td><td>配列（なければnull）</td><td>一致した部分を取り出す</td></tr></table>
<p>パターンには通常の文字のほか、特別な意味を持つ記号が使えます。今回は次の2つを使います。</p>
<ul><li><code>[0-9]</code>：0から9のどれか1文字（角括弧は「この中のどれか1文字」を表し、0-9は範囲指定）</li><li><code>+</code>：直前の要素の1回以上の繰り返し</li></ul>
<p>つまり<code>/[0-9]+/</code>は「1文字以上の数字の並び」というパターンです。</p>
<pre><code>const re = /[0-9]+/;
console.log(re.test("注文番号: 12345"));  // true（数字の並びがある）
console.log(re.test("未定"));             // false

const result = "注文番号: 12345".match(/[0-9]+/);
console.log(result[0]);  // "12345"（最初に一致した部分）</code></pre>
<p><code>match</code>の返り値は配列で、<code>[0]</code>に一致した文字列が入ります。一致がないときは<code>null</code>が返るため、<code>result[0]</code>を読む前に一致の有無を確認する習慣をつけると安全です。正規表現は奥が深い機能ですが、まずは「パターンを定義してtestで判定、matchで取り出す」という流れをつかみましょう。</p>`,
      task: `正規表現<code>/[0-9]+/</code>を使って、(1)<code>text</code>に数字の並びが含まれるかを<code>test</code>で判定し、(2)含まれる場合は<code>match</code>で数字部分を取り出して出力してください。`,
      code: `const text = "会員ID: 78901 が登録されました";
const re = /[0-9]+/;

// TODO: testで数字の並びが含まれるか判定する
const hasNumber = false;
console.log("数字あり: " + hasNumber);

// TODO: matchで数字部分を取り出してresult[0]を出力する
if (hasNumber) {
  const result = null;
  console.log("取り出した数字: " + result[0]);
}
`,
      solution: `const text = "会員ID: 78901 が登録されました";
const re = /[0-9]+/;

// testはパターンに一致する部分があればtrueを返す
const hasNumber = re.test(text);
console.log("数字あり: " + hasNumber);

// matchは一致した部分を配列で返す（先頭要素が一致文字列）
if (hasNumber) {
  const result = text.match(re);
  console.log("取り出した数字: " + result[0]);
}
`,
      hints: [
        `testは正規表現側のメソッドです。re.test(text)のように「正規表現.test(調べたい文字列)」と書きます。`,
        `matchは文字列側のメソッドです。text.match(re)と書き、返り値の配列の[0]に一致部分が入っています。`
      ],
      expectedOutput: "取り出した数字: 78901"
    },
    {
      id: 88,
      title: "正規表現のフラグとreplace（g・i）",
      explanation: `<p>正規表現は閉じスラッシュの後ろに<strong>フラグ</strong>という文字を付けて動作を変更できます。特に重要なのが次の2つです。</p>
<table><tr><th>フラグ</th><th>名前</th><th>効果</th></tr><tr><td>g</td><td>グローバル</td><td>最初の1つではなく、一致するすべてを対象にする</td></tr><tr><td>i</td><td>大文字小文字無視</td><td>大文字・小文字を区別せずに一致させる</td></tr></table>
<p>フラグは<code>/apple/gi</code>のように複数同時に指定できます。前ステップの<code>match</code>にgフラグを付けると、一致した<strong>すべての部分の配列</strong>が返るようになります。</p>
<pre><code>const text = "10個入り300円、3個入り120円";
console.log(text.match(/[0-9]+/g));
// [ "10", "300", "3", "120" ] ← 全部の数字が取れる</code></pre>
<p>さらに、<code>replace</code>の第1引数には文字列だけでなく正規表現も渡せます。gフラグ付きの正規表現を渡せば全置換になり、iフラグを足せば表記ゆれもまとめて置換できます。</p>
<pre><code>const memo = "Apple apple APPLE";
console.log(memo.replace(/apple/g, "りんご"));
// "Apple りんご APPLE"（小文字のappleだけ一致）
console.log(memo.replace(/apple/gi, "りんご"));
// "りんご りんご りんご"（大文字小文字を無視して全置換）</code></pre>
<p>「ユーザーがAppleと書いてもappleと書いても同じ扱いにしたい」という表記ゆれ対応は実務で頻出です。文字列のreplaceAllでは大文字小文字の違いまでは吸収できないため、iフラグ付き正規表現が活躍します。</p>`,
      task: `変数<code>review</code>には「good」が大文字・小文字まぜこぜで3回登場します。gフラグとiフラグを付けた正規表現で、すべてを「最高」に置換して出力してください。`,
      code: `const review = "Goodな商品。とてもgood。GOODです。";

// TODO: 正規表現にgとiのフラグを付けて、すべてのgoodを「最高」に置換する
const result = review.replace(/good/, "最高");

console.log(result);
`,
      solution: `const review = "Goodな商品。とてもgood。GOODです。";

// gフラグで全置換、iフラグで大文字小文字を無視する
const result = review.replace(/good/gi, "最高");

console.log(result);
`,
      hints: [
        `フラグは閉じスラッシュの直後に付けます。/パターン/giのように2つ並べて書けます。`,
        `gがないと最初の1つ（Good）だけ、iがないと小文字のgoodだけしか置換されません。両方必要です。`
      ],
      expectedOutput: "最高な商品。とても最高。最高です。"
    },
    {
      id: 89,
      title: "split・join・reverse実践",
      explanation: `<p>第5章で学んだ<code>split</code>（文字列を配列に分解）と<code>join</code>（配列を文字列に結合）は、文字列処理の中核となるコンビです。ここでは配列の<code>reverse</code>と組み合わせた定番テクニックを学びます。</p>
<p>JavaScriptの文字列には「逆順にする」メソッドがありません。そこで、いったん1文字ずつの配列に分解し、配列を逆順にし、また結合する、という3段構えで実現します。</p>
<pre><code>const word = "とまと";
const reversed = word.split("").reverse().join("");
console.log(reversed);  // "とまと"</code></pre>
<ul><li><code>split("")</code>：空文字列で区切ると1文字ずつの配列になる → ["と","ま","と"]</li><li><code>reverse()</code>：配列を逆順にする → ["と","ま","と"]</li><li><code>join("")</code>：区切り文字なしで結合して文字列に戻す → "とまと"</li></ul>
<p>この技の応用でよく出題されるのが<strong>回文判定</strong>です。回文とは「しんぶんし」のように前から読んでも後ろから読んでも同じ文字列のこと。元の文字列と逆順の文字列を<code>===</code>で比べるだけで判定できます。</p>
<pre><code>const str = "しんぶんし";
const isPalindrome = str === str.split("").reverse().join("");
console.log(isPalindrome);  // true</code></pre>
<p>また、<code>split(",")</code>でCSV風のデータを分解し、加工して<code>join(" / ")</code>など別の区切りで組み立て直すのも定番パターンです。「文字列→配列→（配列の道具で加工）→文字列」という往復の発想を身につけましょう。</p>`,
      task: `関数<code>isPalindrome</code>を完成させて、文字列が回文かどうかを判定できるようにしてください。回文なら「回文です」、違えば「回文ではありません」と出力されます。`,
      code: `function isPalindrome(str) {
  // TODO: strを1文字ずつの配列に分解し、逆順にして、結合し直したものと比較する
  const reversed = str;
  return str === reversed;
}

const word = "しんぶんし";
if (isPalindrome(word)) {
  console.log(word + " は回文です");
} else {
  console.log(word + " は回文ではありません");
}

console.log("たいやき は回文: " + isPalindrome("たいやき"));
`,
      solution: `function isPalindrome(str) {
  // 分解→逆順→結合の3ステップで逆順文字列を作る
  const reversed = str.split("").reverse().join("");
  return str === reversed;
}

const word = "しんぶんし";
if (isPalindrome(word)) {
  console.log(word + " は回文です");
} else {
  console.log(word + " は回文ではありません");
}

console.log("たいやき は回文: " + isPalindrome("たいやき"));
`,
      hints: [
        `split("")で1文字ずつの配列、reverse()で逆順、join("")で文字列に戻す、の3つをメソッドチェーンでつなげます。`,
        `reversedにstr.split("").reverse().join("")を代入すれば、あとの比較はそのまま動きます。`
      ],
      expectedOutput: "しんぶんし は回文です"
    },
    {
      id: 90,
      title: "総合演習：テキスト整形ツール",
      explanation: `<p>第9章の総仕上げとして、乱れたデータをきれいなレポートに整形するツールを作ります。使う道具はすべてこの章と第5章で学んだものです。</p>
<table><tr><th>工程</th><th>使うメソッド</th></tr><tr><td>前後の空白除去</td><td>trim</td></tr><tr><td>カンマ区切りの分解</td><td>split</td></tr><tr><td>列の幅揃え</td><td>padEnd・padStart</td></tr><tr><td>区切り線</td><td>repeat</td></tr></table>
<p>元データは「商品名,価格」形式の文字列の配列ですが、前後に余分な空白が混ざっています。処理の流れは次の通りです。</p>
<ol><li>各行を<code>trim</code>で掃除する</li><li><code>split(",")</code>で商品名と価格に分解する</li><li>価格は<code>Number</code>で数値に変換して合計に加算する</li><li>商品名は<code>padEnd</code>で左揃え、価格は<code>padStart</code>で右揃えにして出力する</li></ol>
<pre><code>const line = "  りんご,1200  ";
const parts = line.trim().split(",");
console.log(parts[0]);          // "りんご"
console.log(Number(parts[1]));  // 1200</code></pre>
<p>整形出力のポイントは、<strong>全行で同じ幅を使う</strong>ことです。商品名を<code>padEnd(8, " ")</code>、価格を<code>String(price).padStart(6, " ")</code>のように揃えると、行を重ねたときに列がまっすぐ並びます。数値のままではpadStartが使えないため、<code>String()</code>で文字列に変換してから整形する点に注意してください。実務でもログ整形やCLIツールの出力で全く同じテクニックを使います。</p>`,
      task: `TODOの2か所を実装して、商品データを整形したレポートを完成させてください。(1)各行をtrimしてsplitで分解、(2)商品名をpadEnd(8)、価格をpadStart(6)で揃えて出力します。`,
      code: `const lines = ["  りんご,1200  ", "バナナ,300", "  メロン,4500 "];

console.log("=".repeat(20));
console.log("売上レポート");
console.log("=".repeat(20));

let total = 0;
for (const line of lines) {
  // TODO: lineをtrimしてからsplit(",")で分解する
  const parts = line;
  const name = parts[0];
  const price = Number(parts[1]);
  total += price;
  // TODO: nameをpadEnd(8, " ")、priceをString()で文字列にしてpadStart(6, " ")で揃える
  console.log(name + price + "円");
}

console.log("=".repeat(20));
console.log("合計: " + total + "円");
`,
      solution: `const lines = ["  りんご,1200  ", "バナナ,300", "  メロン,4500 "];

console.log("=".repeat(20));
console.log("売上レポート");
console.log("=".repeat(20));

let total = 0;
for (const line of lines) {
  // 空白を掃除してからカンマで分解する
  const parts = line.trim().split(",");
  const name = parts[0];
  const price = Number(parts[1]);
  total += price;
  // 商品名は左揃え、価格は右揃えで列を整える
  console.log(name.padEnd(8, " ") + String(price).padStart(6, " ") + "円");
}

console.log("=".repeat(20));
console.log("合計: " + total + "円");
`,
      hints: [
        `1つ目のTODOはline.trim().split(",")とメソッドチェーンで書けます。trimを先にしないと価格側に空白が残ります。`,
        `価格は数値なのでそのままではpadStartできません。String(price)で文字列にしてからpadStart(6, " ")を呼びます。`,
        `期待する合計は1200+300+4500=6000円です。出力の最後の行で確認しましょう。`
      ],
      expectedOutput: "合計: 6000円"
    }
  ]
});
