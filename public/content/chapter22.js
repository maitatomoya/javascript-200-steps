// 第22章：よくあるエラー：undefinedと型
registerChapter({
  number: 22,
  title: "よくあるエラー：undefinedと型",
  description: "JavaScriptで最も遭遇する「Cannot read properties of undefined」と、暗黙の型変換が引き起こすバグの見つけ方・直し方を学びます。",
  steps: [
    {
      id: 211,
      title: "Cannot read properties of undefined",
      explanation: `<p>JavaScriptで<strong>最も遭遇率が高いエラー</strong>がこれです。実行すると次のように表示されます。</p>
<pre><code>console.log(user.name + "のメール: " + user.contct.email);
                                                  ^

TypeError: Cannot read properties of undefined (reading 'email')
    at Object.&lt;anonymous&gt; (main.js:7:51)</code></pre>
<p>「undefinedのプロパティは読めない（'email'を読もうとした）」という意味です。ここで重要な読み方のコツがあります。<strong>括弧内の（reading 'email'）は「読もうとしたプロパティ名」であり、undefinedだったのはその1つ手前</strong>だということです。</p>
<pre><code>user.contct.email
     ~~~~~~ ここがundefined（存在しないプロパティ名のtypo）
            ~~~~~ undefinedに対して.emailを読んだ瞬間にエラー</code></pre>
<p>つまり「reading 'email'」と言われたら、<code>.email</code>の<strong>直前の部分</strong>（今回は<code>user.contct</code>）がundefinedになった理由を探します。オブジェクトの存在しないプロパティを読んでもエラーにはならずundefinedが返る、という仕様（ステップ207でも登場）が、次の段のプロパティ参照で爆発する構造です。</p>
<p>undefinedになる典型的な理由は次の3つです。</p>
<table>
<tr><th>理由</th><th>確認方法</th></tr>
<tr><td>プロパティ名のtypo</td><td>宣言側の名前と見比べる</td></tr>
<tr><td>データにその項目がない</td><td>console.log(user)で実物を見る</td></tr>
<tr><td>関数の戻り値がundefined</td><td>return忘れを確認する</td></tr>
</table>
<p>まず<code>console.log(user)</code>でデータの実物を出力し、想定した形と見比べるのが最速の調査方法です。</p>`,
      task: `エラーメッセージから「undefinedだった場所」を特定し、プロパティ名のtypoを修正してメールアドレスを表示しましょう。`,
      code: `// 会員情報を表示するプログラム
const user = {
  name: "たろう",
  contact: { email: "taro@example.com" }
};

console.log(user.name + "のメール: " + user.contct.email);`,
      solution: `// 会員情報を表示するプログラム
const user = {
  name: "たろう",
  contact: { email: "taro@example.com" }
};

// (reading 'email')の1つ手前、contctがtypoだった
console.log(user.name + "のメール: " + user.contact.email);`,
      hints: [
        `(reading 'email')は「.emailを読もうとした」という意味です。undefinedだったのはその直前の部分です。`,
        `user.contctとオブジェクト宣言のプロパティ名を1文字ずつ見比べましょう。`
      ],
      expectedOutput: "たろうのメール: taro@example.com"
    },
    {
      id: 212,
      title: "optional chaining（?.）で安全にする",
      explanation: `<p>今回はtypoではなく、<strong>データ側に項目がないことがある</strong>ケースです。2人目のはなこには<code>contact</code>がないため、ループの2周目で前ステップと同じTypeErrorが発生します。</p>
<pre><code>console.log(u.name + ": " + u.contact.email);
                                      ^

TypeError: Cannot read properties of undefined (reading 'email')</code></pre>
<p>実務のデータ（APIレスポンスやユーザー入力）では「あるはずの項目がない」ことは日常茶飯事です。そこで使うのが<strong>optional chaining（オプショナルチェイニング）</strong>、<code>?.</code>という演算子です。</p>
<pre><code>u.contact?.email
// contactがnullまたはundefinedなら、そこで止まってundefinedを返す
// エラーにはならない</code></pre>
<p><code>?.</code>は「左側がnullかundefinedなら、それ以上たどらずにundefinedを返す」という動きをします。エラーで停止する代わりに、undefinedという値として扱えるので、if文で分岐できます。</p>
<table>
<tr><th>書き方</th><th>contactがない場合</th></tr>
<tr><td><code>u.contact.email</code></td><td>TypeErrorで停止</td></tr>
<tr><td><code>u.contact?.email</code></td><td>undefinedが返る（続行できる）</td></tr>
</table>
<p>注意点もあります。<code>?.</code>を機械的に付けまくると、<strong>本来あるはずのデータが欠けているバグまで隠してしまいます</strong>。「無いことが正常にありえる場所」にだけ使い、「必ずあるはずの場所」ではあえて使わずエラーで気づけるようにする、という使い分けが実務のポイントです。</p>`,
      task: `<code>?.</code>を使ってcontactがない会員でもエラーにならないようにし、メール未登録の場合は「メール未登録」と表示しましょう。`,
      code: `// 会員のメール一覧を表示するプログラム
const users = [
  { name: "たろう", contact: { email: "taro@example.com" } },
  { name: "はなこ" }
];

for (const u of users) {
  console.log(u.name + ": " + u.contact.email);
}`,
      solution: `// 会員のメール一覧を表示するプログラム
const users = [
  { name: "たろう", contact: { email: "taro@example.com" } },
  { name: "はなこ" }
];

for (const u of users) {
  // contactがない会員もいるので?.で安全にたどる
  const email = u.contact?.email;
  if (email) {
    console.log(u.name + ": " + email);
  } else {
    console.log(u.name + ": メール未登録");
  }
}`,
      hints: [
        `u.contactがundefinedの会員がいるため、.emailを読む前に安全に止める仕組みが必要です。`,
        `u.contact?.emailの結果を変数に受け、if文で「値があるか」を分岐しましょう。`
      ],
      expectedOutput: "はなこ: メール未登録"
    },
    {
      id: 213,
      title: "配列の範囲外アクセスはundefined（エラーにならない罠）",
      explanation: `<p>実行するとエラーは出ませんが、最後に<code>4番目: undefined</code>という余計な行が表示されます。原因はループ条件の<code>&lt;=</code>です。</p>
<p>多くの言語では配列の範囲外を読むとエラーになりますが（PythonのIndexErrorなど）、<strong>JavaScriptは範囲外アクセスでもエラーにならず、黙ってundefinedを返します</strong>。だからプログラムは止まらず、おかしな出力だけが残ります。</p>
<pre><code>const items = ["りんご", "ばなな", "みかん"];
items.length  // 3
items[0]      // "りんご"（最初）
items[2]      // "みかん"（最後 = length - 1）
items[3]      // undefined（範囲外なのにエラーにならない）</code></pre>
<p>ここで整理すべきは<strong>lengthと添字（インデックス）のずれ</strong>です。要素数は3でも、添字は0から始まるため最後の添字は2、つまり<code>length - 1</code>です。ループ条件を<code>i &lt;= items.length</code>にすると、<code>i</code>が3のとき（存在しない4番目）まで回ってしまいます。この「1つずれる」バグは<strong>off-by-oneエラー</strong>と呼ばれ、経験者でもやりがちな定番バグです。</p>
<table>
<tr><th>条件</th><th>iの範囲</th><th>結果</th></tr>
<tr><td><code>i &lt; items.length</code></td><td>0〜2</td><td>正しい</td></tr>
<tr><td><code>i &lt;= items.length</code></td><td>0〜3</td><td>最後にundefined</td></tr>
</table>
<p>「出力にundefinedが混ざっていたら、添字の範囲かプロパティ名を疑う」。エラーが出ない分、出力をよく観察することが唯一の手がかりになります。</p>`,
      task: `ループ条件を修正し、undefinedの行が表示されないようにしましょう。`,
      code: `// くだもの一覧を番号付きで表示するプログラム
const items = ["りんご", "ばなな", "みかん"];

for (let i = 0; i <= items.length; i++) {
  console.log((i + 1) + "番目: " + items[i]);
}`,
      solution: `// くだもの一覧を番号付きで表示するプログラム
const items = ["りんご", "ばなな", "みかん"];

// 最後の添字はlength - 1なので、条件は i < length
for (let i = 0; i < items.length; i++) {
  console.log((i + 1) + "番目: " + items[i]);
}`,
      hints: [
        `要素数3の配列で有効な添字は0・1・2です。iがどこまで進むとundefinedになるか考えましょう。`,
        `ループ条件の<=を<に変えると、iはlength - 1（最後の添字）で止まります。`
      ],
      expectedOutput: "3番目: みかん"
    },
    {
      id: 214,
      title: `"1" + 1 = "11"：暗黙の型変換バグ`,
      explanation: `<p>実行するとエラーは出ませんが、<code>支払額: 500120円</code>という明らかにおかしい金額が表示されます。原因は<code>"500" + 120</code>が<strong>足し算ではなく文字列連結</strong>になったことです。</p>
<p><code>+</code>演算子は二役を持っています。<strong>どちらか一方でも文字列なら、もう一方も文字列に変換して連結します</strong>。一方、<code>-</code>や<code>*</code>には連結の意味がないため、逆に文字列を数値に変換して計算します。この非対称性が混乱の元です。</p>
<table>
<tr><th>式</th><th>結果</th><th>何が起きたか</th></tr>
<tr><td><code>"500" + 120</code></td><td>"500120"</td><td>120が文字列化されて連結</td></tr>
<tr><td><code>"500" - 120</code></td><td>380</td><td>"500"が数値化されて引き算</td></tr>
<tr><td><code>"500" * 2</code></td><td>1000</td><td>"500"が数値化されて掛け算</td></tr>
</table>
<p>この問題が実務で頻発するのは、<strong>フォームの入力値やURLのパラメータは常に文字列</strong>だからです。見た目が数字でも型はstringなので、計算の前に明示的に数値へ変換する必要があります。</p>
<pre><code>const price = Number(priceInput);  // "500" → 500
typeof priceInput  // "string"
typeof price       // "number"</code></pre>
<p>対策はシンプルで、<strong>外部から来た値は入口でNumber()により数値化してから使う</strong>ことです。「数字のはずの計算結果が異様に長い・桁がおかしい」と感じたら、まずtypeofで型を確認しましょう。</p>`,
      task: `文字列のまま足し算している箇所を修正し、正しい支払額が表示されるようにしましょう。`,
      code: `// 送料込みの支払額を計算するプログラム
const priceInput = "500";  // フォームから受け取った値は文字列
const shipping = 120;

const total = priceInput + shipping;
console.log("支払額: " + total + "円");`,
      solution: `// 送料込みの支払額を計算するプログラム
const priceInput = "500";  // フォームから受け取った値は文字列
const shipping = 120;

// 計算の前にNumber()で数値に変換する
const total = Number(priceInput) + shipping;
console.log("支払額: " + total + "円");`,
      hints: [
        `"500" + 120は足し算ではなく文字列連結になります。priceInputの型をtypeofで確認してみましょう。`,
        `Number(priceInput)で数値に変換してから足し算しましょう。`
      ],
      expectedOutput: "支払額: 620円"
    },
    {
      id: 215,
      title: "parseIntの失敗とNaNチェック",
      explanation: `<p>実行すると、変換に失敗しているのに<code>入力値: NaN</code>と表示されます。「数値に変換できません」の分岐に入らない原因は、<strong>NaNの特殊な性質</strong>にあります。</p>
<p><code>parseInt("abc", 10)</code>のように数値にできない文字列を変換するとNaNが返ります。ここまでは想定どおりですが、問題は判定方法です。<strong>NaNは自分自身と等しくない</strong>という、JavaScriptで唯一の値なのです。</p>
<pre><code>NaN === NaN   // false（!）
NaN == NaN    // これもfalse</code></pre>
<p>そのため<code>if (num === NaN)</code>は<strong>絶対にtrueにならない、常に素通りする条件</strong>になってしまいます。NaNの判定には専用の関数を使います。</p>
<table>
<tr><th>関数</th><th>動き</th><th>注意点</th></tr>
<tr><td><code>Number.isNaN(x)</code></td><td>xがNaNそのものかを判定</td><td>推奨。誤変換がない</td></tr>
<tr><td><code>isNaN(x)</code>（グローバル版）</td><td>xを数値に変換してから判定</td><td><code>isNaN("abc")</code>もtrueになる</td></tr>
</table>
<p>グローバルの<code>isNaN</code>は引数を一度数値に変換するため、「NaNではないただの文字列」までtrueと判定してしまいます。<strong>迷ったらNumber.isNaNを使う</strong>と覚えておけば安全です。</p>
<pre><code>Number.isNaN(parseInt("abc", 10))  // true（変換失敗を検出）
Number.isNaN("abc")                // false（文字列はNaNそのものではない）
isNaN("abc")                       // true（変換してから判定するため）</code></pre>
<p>「parseIntやNumberで変換したら、使う前にNumber.isNaNでチェック」。外部入力を扱うときの定型パターンです。</p>`,
      task: `NaNの判定方法を修正し、変換に失敗したとき「数値に変換できません」と表示されるようにしましょう。`,
      code: `// 入力値を整数に変換するプログラム
const input = "abc";
const num = parseInt(input, 10);

if (num === NaN) {
  console.log("数値に変換できません");
} else {
  console.log("入力値: " + num);
}`,
      solution: `// 入力値を整数に変換するプログラム
const input = "abc";
const num = parseInt(input, 10);

// NaNは自分自身と等しくないため、===では判定できない
if (Number.isNaN(num)) {
  console.log("数値に変換できません");
} else {
  console.log("入力値: " + num);
}`,
      hints: [
        `NaN === NaNはfalseです。この比較では変換失敗を検出できません。`,
        `Number.isNaN(num)を使うと「numがNaNかどうか」を正しく判定できます。`
      ],
      expectedOutput: "数値に変換できません"
    },
    {
      id: 216,
      title: "==の罠（0 == \"\"がtrueになる）",
      explanation: `<p>実行すると、何も入力していないのに<code>0が入力されました</code>と表示されます。原因は<code>==</code>（等価演算子）が比較の前に<strong>型変換を行う</strong>ことです。</p>
<p><code>input == 0</code>では、文字列<code>""</code>が数値に変換されてから比較されます。空文字列を数値化すると<code>0</code>になるため、<code>0 == 0</code>でtrueになってしまうのです。<code>==</code>が引き起こす直感に反する結果をまとめます。</p>
<table>
<tr><th>式</th><th>結果</th><th>理由</th></tr>
<tr><td><code>0 == ""</code></td><td>true</td><td>""が0に変換される</td></tr>
<tr><td><code>0 == "0"</code></td><td>true</td><td>"0"が0に変換される</td></tr>
<tr><td><code>"" == "0"</code></td><td>false</td><td>文字列同士はそのまま比較</td></tr>
<tr><td><code>null == undefined</code></td><td>true</td><td>特別ルール</td></tr>
<tr><td><code>null == 0</code></td><td>false</td><td>nullは0に変換されない</td></tr>
</table>
<p>3つ並べると、<code>0 == ""</code>と<code>0 == "0"</code>がtrueなのに<code>"" == "0"</code>はfalseという、<strong>推移律すら成り立たない</strong>結果になっています。この変換ルールを暗記するのは現実的ではありません。</p>
<p>実務の結論はシンプルです。<strong>常に===（厳密等価）を使う</strong>。<code>===</code>は型変換をせず、型が違えば即falseなので、結果が予測可能になります。「空文字列と0を区別したい」「nullとundefinedを区別したい」といった判定も、<code>===</code>なら意図どおりに書けます。多くの開発チームのESLint設定でも<code>==</code>は禁止が標準です。</p>`,
      task: `<code>===</code>を使った判定に修正し、空文字列のとき「未入力です」と表示されるようにしましょう。`,
      code: `// 入力値を判定するプログラム
const input = "";  // ユーザーが何も入力しなかった

if (input == 0) {
  console.log("0が入力されました");
} else {
  console.log("入力値: " + input);
}`,
      solution: `// 入力値を判定するプログラム
const input = "";  // ユーザーが何も入力しなかった

// ===は型変換をしないため、""と0を正しく区別できる
if (input === "") {
  console.log("未入力です");
} else if (Number(input) === 0) {
  console.log("0が入力されました");
} else {
  console.log("入力値: " + input);
}`,
      hints: [
        `==は比較の前に型変換を行うため、"" == 0がtrueになります。`,
        `まずinput === ""で未入力を判定し、次にNumber(input) === 0で数値の0を判定する順序にしましょう。`
      ],
      expectedOutput: "未入力です"
    },
    {
      id: 217,
      title: `typeof null === "object"の歴史的罠`,
      explanation: `<p>実行すると2回目の呼び出しで次のエラーが発生します。</p>
<pre><code>return "キー: " + Object.keys(value).join(", ");
                         ^

TypeError: Cannot convert undefined or null to object
    at Function.keys (&lt;anonymous&gt;)
    at describe (main.js:4:23)
    at Object.&lt;anonymous&gt; (main.js:10:13)</code></pre>
<p>スタックトレースが2段になっている点に注目してください。<strong>上の行ほどエラー発生地点に近い</strong>ので、「describe関数の4行目で発生し、その呼び出し元は10行目」と読みます。10行目は<code>describe(null)</code>の呼び出しです。</p>
<p>「typeofでobjectか確認しているのになぜnullが通るのか」。答えはJavaScript最古の仕様バグにあります。</p>
<pre><code>typeof null  // "object"（!）</code></pre>
<p>これは1995年の最初の実装で、値の内部表現の型タグを流用した名残です。修正すると既存のWebサイトが壊れるため、<strong>仕様として今も残り続けています</strong>。つまり<code>typeof value === "object"</code>はnullも通してしまう、不完全なオブジェクト判定なのです。</p>
<p>正しいオブジェクト判定の定型パターンは、nullチェックを組み合わせることです。</p>
<pre><code>if (value !== null &amp;&amp; typeof value === "object") {
  // ここに来るのは本物のオブジェクト（と配列）だけ
}</code></pre>
<p><code>&amp;&amp;</code>は左から評価されるため、nullなら右側の判定に進まず安全です。「typeofでobjectを見たら、必ずnull除外とセット」と覚えましょう。</p>`,
      task: `nullチェックを追加して、describe(null)がエラーにならず「オブジェクトではない: null」と表示されるようにしましょう。`,
      code: `// 値の種類を説明する関数
function describe(value) {
  if (typeof value === "object") {
    return "キー: " + Object.keys(value).join(", ");
  }
  return "オブジェクトではない: " + String(value);
}

console.log(describe({ name: "たろう", age: 25 }));
console.log(describe(null));`,
      solution: `// 値の種類を説明する関数
function describe(value) {
  // typeof nullは"object"になるため、null除外を必ずセットにする
  if (value !== null && typeof value === "object") {
    return "キー: " + Object.keys(value).join(", ");
  }
  return "オブジェクトではない: " + String(value);
}

console.log(describe({ name: "たろう", age: 25 }));
console.log(describe(null));`,
      hints: [
        `typeof nullは"object"を返すため、nullがif文の中に入ってObject.keys(null)で失敗しています。`,
        `if条件をvalue !== null && typeof value === "object"に変えましょう。`
      ],
      expectedOutput: "オブジェクトではない: null"
    },
    {
      id: 218,
      title: "falsyの罠：0が||で消える（??で直す）",
      explanation: `<p>実行すると、ユーザーが音量を0に設定したのに<code>音量: 50</code>と表示されます。原因は<code>||</code>（OR演算子）でデフォルト値を書いたことです。</p>
<p><code>a || b</code>は「aが<strong>falsy</strong>ならbを返す」という動きをします。falsy（偽として扱われる値）は次の6つです。</p>
<table>
<tr><th>falsyな値</th><th>デフォルト値の文脈での問題</th></tr>
<tr><td><code>false</code></td><td>「オフ」という設定が消える</td></tr>
<tr><td><code>0</code></td><td>「0」という設定が消える（今回のバグ）</td></tr>
<tr><td><code>""</code></td><td>「空文字列」という入力が消える</td></tr>
<tr><td><code>null</code> / <code>undefined</code></td><td>これは消えてほしい（未設定）</td></tr>
<tr><td><code>NaN</code></td><td>計算失敗の値</td></tr>
</table>
<p>「未設定ならデフォルト値」を意図しているのに、<code>||</code>は<strong>0やfalseや空文字列という正当な設定値まで「未設定」扱いにしてしまう</strong>のです。</p>
<p>そこで登場したのが<code>??</code>（Nullish Coalescing：ヌリッシュ合体演算子）です。<code>a ?? b</code>は「aが<strong>nullまたはundefinedのときだけ</strong>bを返す」ため、0やfalseはそのまま生き残ります。</p>
<pre><code>0 || 50   // 50（0が消える）
0 ?? 50   // 0（0は正当な値として残る）
undefined ?? 50  // 50（未設定はデフォルトになる）</code></pre>
<p>使い分けの指針：<strong>「デフォルト値」の意図なら??、「falsy全部をはじきたい」意図のときだけ||</strong>。設定値・数量・フラグを扱うコードでは、ほぼ常に??が正解です。</p>`,
      task: `<code>||</code>を<code>??</code>に修正し、音量0の設定が正しく表示されるようにしましょう。`,
      code: `// ユーザー設定を読み込むプログラム
const settings = { volume: 0 };  // ユーザーは音量を0(ミュート)に設定した

const volume = settings.volume || 50;
const theme = settings.theme || "dark";

console.log("音量: " + volume);
console.log("テーマ: " + theme);`,
      solution: `// ユーザー設定を読み込むプログラム
const settings = { volume: 0 };  // ユーザーは音量を0(ミュート)に設定した

// ??はnull/undefinedのときだけデフォルト値にする(0は残る)
const volume = settings.volume ?? 50;
const theme = settings.theme ?? "dark";

console.log("音量: " + volume);
console.log("テーマ: " + theme);`,
      hints: [
        `0はfalsyなので、0 || 50は50になってしまいます。「未設定のときだけ」デフォルト値にする演算子が必要です。`,
        `??を使うと、nullとundefinedのときだけ右側の値が使われます。`
      ],
      expectedOutput: "音量: 0"
    },
    {
      id: 219,
      title: "JSON.parseのSyntaxErrorを処理する",
      explanation: `<p>実行すると次のエラーでプログラムが停止します。</p>
<pre><code>SyntaxError: Expected property name or '}' in JSON at position 1
    at JSON.parse (&lt;anonymous&gt;)
    at Object.&lt;anonymous&gt; (main.js:3:19)</code></pre>
<p>これは今までのSyntaxErrorと違い、<strong>実行時に投げられる例外</strong>です（JSON.parseという関数の実行中に発生するため）。<code>at position 1</code>は「JSON文字列の1文字目付近（0始まり）で解釈に失敗した」という意味で、データのどこが壊れているかの手がかりになります。</p>
<p>原因は、JSONの文法がJavaScriptのオブジェクトリテラルより<strong>ずっと厳格</strong>なことです。</p>
<table>
<tr><th>ルール</th><th>JSONで有効</th><th>JSONで無効</th></tr>
<tr><td>キーはダブルクォート必須</td><td>{"name": "たろう"}</td><td>{name: "たろう"}</td></tr>
<tr><td>文字列はダブルクォートのみ</td><td>"たろう"</td><td>'たろう'</td></tr>
<tr><td>末尾カンマ禁止</td><td>[1, 2]</td><td>[1, 2,]</td></tr>
<tr><td>コメント禁止</td><td>—</td><td>// コメント</td></tr>
</table>
<p>さらに実務での重要ポイントとして、<strong>JSONは外部から来るデータ</strong>（APIレスポンス・保存データ・ユーザー入力）であることが多く、壊れている可能性を常に想定すべきです。そのため<code>JSON.parse</code>は<strong>try/catchで囲むのが定型</strong>です。</p>
<pre><code>try {
  const user = JSON.parse(data);
} catch (e) {
  console.log("JSONの解析に失敗: " + e.message);
}</code></pre>
<p>catchすれば、壊れたデータが来てもプログラム全体を道連れにせず、エラーメッセージの表示や代替処理に進めます。</p>`,
      task: `JSON文字列を正しい文法（キーと文字列をダブルクォート）に直し、さらにJSON.parseをtry/catchで囲んで安全にしましょう。`,
      code: `// 保存されていた会員データを読み込むプログラム
const data = "{name: 'たろう', age: 25}";
const user = JSON.parse(data);
console.log("名前: " + user.name);`,
      solution: `// 保存されていた会員データを読み込むプログラム
// JSONはキーも文字列もダブルクォート必須
const data = '{"name": "たろう", "age": 25}';

try {
  const user = JSON.parse(data);
  console.log("名前: " + user.name);
} catch (e) {
  console.log("JSONの解析に失敗: " + e.message);
}`,
      hints: [
        `JSONではキーと文字列の両方をダブルクォートで囲む必要があります。外側はシングルクォートの文字列にすると書きやすいです。`,
        `JSON.parseは失敗時に例外を投げるため、try/catchで囲み、catchで失敗メッセージを表示しましょう。`
      ],
      expectedOutput: "名前: たろう"
    },
    {
      id: 220,
      title: "総合演習：型のバグを直す",
      explanation: `<p>この章の総仕上げです。支払額を計算するプログラムに、<strong>この章で学んだバグが3つ</strong>仕込まれています。まず実行して最初のエラーを読むところから始めましょう。</p>
<pre><code>const discount = cart.coupon.amount;
                             ^

TypeError: Cannot read properties of undefined (reading 'amount')</code></pre>
<p>デバッグの手順を、章の知識と対応させて整理します。</p>
<table>
<tr><th>症状</th><th>原因</th><th>対処（学んだステップ）</th></tr>
<tr><td>reading 'amount'のTypeError</td><td>coupon未使用時はundefined</td><td><code>?.</code>で安全にたどる（212）</td></tr>
<tr><td>割引がundefinedになり支払額がNaN</td><td>undefinedとの引き算</td><td><code>??</code>で未設定時は0にする（218）</td></tr>
<tr><td>NaNなのに「計算エラー」が出ない</td><td>NaN === NaNはfalse</td><td><code>Number.isNaN</code>で判定（215）</td></tr>
</table>
<p>ポイントは<strong>直す順番</strong>です。1つ目のTypeErrorを<code>?.</code>で直すと、今度はdiscountがundefinedになり、<code>subtotal - discount</code>がNaNになります（207で学んだNaNの伝染）。それを<code>?? 0</code>で「クーポンなし＝割引0円」と明示すれば、計算全体が正常になります。最後の<code>Number.isNaN</code>は、将来データが壊れたときに静かに<code>NaN円</code>と表示してしまわないための保険です。</p>
<p>なお<code>cart.price</code>は文字列<code>"450"</code>ですが、<code>*</code>は文字列を数値化するため小計は正しく計算されます（214）。<strong>エラーを1つ直すたびに実行し直し、症状の変化を確認する</strong>。この繰り返しがデバッグの王道です。</p>`,
      task: `<code>?.</code>・<code>??</code>・<code>Number.isNaN</code>を使って3つのバグを修正し、「支払額: 1350円」が表示されるようにしましょう。`,
      code: `// 支払額を計算するプログラム
// 期待する動作:
//   小計: 1350円 / 割引: 0円 / 支払額: 1350円

const cart = {
  price: "450",  // フォームから来た値は文字列
  count: 3
  // クーポン未使用のためcouponプロパティはない
};

const subtotal = cart.price * cart.count;

const discount = cart.coupon.amount;

const payment = subtotal - discount;

if (payment === NaN) {
  console.log("計算エラー");
} else {
  console.log("小計: " + subtotal + "円");
  console.log("割引: " + discount + "円");
  console.log("支払額: " + payment + "円");
}`,
      solution: `// 支払額を計算するプログラム
// 期待する動作:
//   小計: 1350円 / 割引: 0円 / 支払額: 1350円

const cart = {
  price: "450",  // フォームから来た値は文字列
  count: 3
  // クーポン未使用のためcouponプロパティはない
};

const subtotal = cart.price * cart.count;

// couponがない場合は?.でundefinedにし、??で割引0円とみなす
const discount = cart.coupon?.amount ?? 0;

const payment = subtotal - discount;

// NaNの判定はNumber.isNaNを使う
if (Number.isNaN(payment)) {
  console.log("計算エラー");
} else {
  console.log("小計: " + subtotal + "円");
  console.log("割引: " + discount + "円");
  console.log("支払額: " + payment + "円");
}`,
      hints: [
        `まずcart.coupon.amountのTypeErrorを?.で解消しましょう。ただしそれだけではdiscountがundefinedになります。`,
        `undefinedのまま引き算するとNaNになります。?? 0で「クーポンなしは割引0円」としましょう。`,
        `payment === NaNは常にfalseです。Number.isNaN(payment)に直しましょう。`
      ],
      expectedOutput: "支払額: 1350円"
    }
  ]
});
