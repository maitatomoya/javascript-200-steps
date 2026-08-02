// 第7章：オブジェクト
registerChapter({
  number: 7,
  title: "オブジェクト",
  description: "キーと値のペアでデータをまとめるオブジェクトの作り方から、分割代入・スプレッド構文・オプショナルチェーンまで、実務で毎日使う機能を学びます。",
  steps: [
    {
      id: 61,
      title: "オブジェクトリテラルとプロパティ",
      explanation: `<p>これまで学んだ配列は「順番」でデータを並べる入れ物でした。<strong>オブジェクト</strong>は「名前（キー）」と「値」のペアでデータをまとめる入れ物です。たとえば「ユーザー」という1つのまとまりに、名前・年齢など性質の異なるデータを持たせたいときに使います。</p>
<pre><code>const user = {
  name: "たろう",  // キーname、値"たろう"のプロパティ
  age: 25          // キーage、値25のプロパティ
};

console.log(user.name); // たろう</code></pre>
<p>波かっこ<code>{}</code>で作る書き方を<strong>オブジェクトリテラル</strong>と呼びます。キーと値のペア1つ1つを<strong>プロパティ</strong>と呼び、<code>キー: 値</code>の形でカンマ区切りで並べます。値には数値・文字列・真偽値・配列など、どんな型でも入れられます。</p>
<table>
  <tr><th></th><th>配列</th><th>オブジェクト</th></tr>
  <tr><td>データの取り出し方</td><td>番号（インデックス）</td><td>名前（キー）</td></tr>
  <tr><td>向いている用途</td><td>同じ種類のデータの並び</td><td>1つのモノの属性のまとまり</td></tr>
  <tr><td>例</td><td>[80, 72, 90]</td><td>{ name: "たろう", age: 25 }</td></tr>
</table>
<p>プロパティの値は<code>オブジェクト名.キー名</code>（ドット記法）で取り出せます。存在しないキーを指定してもエラーにはならず<code>undefined</code>が返る点は覚えておきましょう。</p>`,
      task: `ユーザーオブジェクトの<code>age</code>プロパティを取り出して、「年齢: 25」と表示されるように<code>console.log</code>を追加してください。`,
      code: `const user = {
  name: "たろう",
  age: 25,
  hobby: "読書"
};

console.log("名前:", user.name);
// TODO: ageプロパティを取り出して「年齢: 25」と表示する

console.log("趣味:", user.hobby);
`,
      solution: `const user = {
  name: "たろう",
  age: 25,
  hobby: "読書"
};

console.log("名前:", user.name);
console.log("年齢:", user.age);
console.log("趣味:", user.hobby);
`,
      hints: [
        `nameプロパティを取り出している行と同じ形で書けます。`,
        `user.age でageプロパティの値25が取り出せます。console.log("年齢:", user.age) と書きます。`
      ],
      expectedOutput: "年齢: 25"
    },
    {
      id: 62,
      title: "ドット記法とブラケット記法",
      explanation: `<p>プロパティの取り出し方には2種類あります。前ステップで使った<strong>ドット記法</strong>（<code>obj.key</code>）と、<strong>ブラケット記法</strong>（<code>obj["key"]</code>）です。</p>
<pre><code>const scores = { math: 80 };
console.log(scores.math);    // 80（ドット記法）
console.log(scores["math"]); // 80（ブラケット記法）</code></pre>
<p>ほとんどの場面では短く書けるドット記法を使いますが、ブラケット記法でないと書けないケースが2つあります。</p>
<table>
  <tr><th>ケース</th><th>例</th></tr>
  <tr><td>変数に入ったキー名で取り出す</td><td>scores[subject]</td></tr>
  <tr><td>ハイフンや空白を含むキー</td><td>scores["social-studies"]</td></tr>
</table>
<p>特に注意したいのが変数を使うケースです。<code>const subject = "math"</code>のとき、<code>scores.subject</code>と書くと「subjectという名前のキー」を探してしまい<code>undefined</code>になります。変数の中身をキーとして使いたいときは<code>scores[subject]</code>とブラケット記法で書きます。</p>
<pre><code>const subject = "math";
console.log(scores.subject);  // undefined（キーsubjectは存在しない）
console.log(scores[subject]); // 80（キーmathとして探す）</code></pre>
<p>また<code>"social-studies"</code>のようにハイフンを含むキーは<code>scores.social-studies</code>と書くと引き算と解釈されてしまうため、必ずブラケット記法とクォートで囲んだキー名を使います。</p>`,
      task: `変数<code>subject</code>を使ってenglishの点数を取り出す行と、キー<code>"social-studies"</code>の点数を取り出す行を、ブラケット記法で正しく修正してください。`,
      code: `const scores = {
  math: 80,
  english: 72,
  "social-studies": 90
};

const subject = "english";

// TODO: ドット記法ではundefinedになる。ブラケット記法に修正する
console.log("英語:", scores.subject);

// TODO: ハイフン入りのキーはドット記法では書けない。ブラケット記法に修正する
console.log("社会:", scores["math"]); // 仮でmathを表示している
`,
      solution: `const scores = {
  math: 80,
  english: 72,
  "social-studies": 90
};

const subject = "english";

console.log("英語:", scores[subject]);

console.log("社会:", scores["social-studies"]);
`,
      hints: [
        `変数の中身をキーとして使うときは、クォートを付けずに scores[変数名] と書きます。`,
        `ハイフンを含むキーは scores["social-studies"] のように文字列で指定します。`
      ],
      expectedOutput: "英語: 72"
    },
    {
      id: 63,
      title: "プロパティの追加・変更・削除",
      explanation: `<p>オブジェクトは作った後からプロパティを自由に追加・変更・削除できます。<code>const</code>で宣言したオブジェクトでも、中身の書き換えはエラーになりません。<code>const</code>が禁止するのは「変数への再代入」であって、オブジェクトの中身の変更ではないからです（配列のpushが使えたのと同じ理屈です）。</p>
<pre><code>const item = { name: "ノート", price: 200 };

item.stock = 10;      // 追加：存在しないキーへの代入は新規追加になる
item.price = 180;     // 変更：既存のキーへの代入は上書きになる
delete item.name;     // 削除：delete演算子でプロパティごと消す

console.log(item);    // { price: 180, stock: 10 }</code></pre>
<table>
  <tr><th>操作</th><th>書き方</th><th>ポイント</th></tr>
  <tr><td>追加</td><td>obj.newKey = 値</td><td>存在しないキーに代入すると追加される</td></tr>
  <tr><td>変更</td><td>obj.key = 新しい値</td><td>既存のキーに代入すると上書きされる</td></tr>
  <tr><td>削除</td><td>delete obj.key</td><td>キーごと消える（undefinedを代入するのとは別物）</td></tr>
</table>
<p>「追加」と「変更」が同じ代入の形なのがポイントです。キーが存在するかどうかで動きが変わります。タイプミスしたキー名に代入すると、エラーにならずに意図しないプロパティが追加されてしまうので注意しましょう。また<code>obj.key = undefined</code>はキー自体は残るのに対し、<code>delete</code>はキーごと取り除くという違いがあります。</p>`,
      task: `商品オブジェクトに在庫数<code>stock: 10</code>を追加し、<code>price</code>を180に変更し、不要になった<code>oldPrice</code>プロパティを削除してください。`,
      code: `const item = {
  name: "ノート",
  price: 200,
  oldPrice: 250
};

// TODO: stockプロパティを追加して10を入れる

// TODO: priceを180に変更する

// TODO: oldPriceプロパティを削除する

console.log("商品名:", item.name);
console.log("価格:", item.price);
console.log("在庫:", item.stock);
console.log("oldPriceは残っている?", "oldPrice" in item);
`,
      solution: `const item = {
  name: "ノート",
  price: 200,
  oldPrice: 250
};

item.stock = 10;

item.price = 180;

delete item.oldPrice;

console.log("商品名:", item.name);
console.log("価格:", item.price);
console.log("在庫:", item.stock);
console.log("oldPriceは残っている?", "oldPrice" in item);
`,
      hints: [
        `追加も変更も「obj.キー = 値」の代入で書けます。キーが無ければ追加、あれば上書きです。`,
        `削除は delete item.oldPrice のようにdelete演算子を使います。`
      ],
      expectedOutput: "在庫: 10"
    },
    {
      id: 64,
      title: "メソッドとthisの基本",
      explanation: `<p>オブジェクトのプロパティには関数も入れられます。オブジェクトに属する関数を<strong>メソッド</strong>と呼びます。第5〜6章で使った<code>push</code>や<code>map</code>も、実は配列オブジェクトのメソッドでした。</p>
<pre><code>const user = {
  name: "はなこ",
  greet() {  // メソッドの省略記法（greet: function() {...} と同じ意味）
    console.log("こんにちは、" + this.name + "です");
  }
};

user.greet(); // こんにちは、はなこです</code></pre>
<p>メソッドの中で自分自身のオブジェクトを指すキーワードが<strong>this</strong>です。<code>this.name</code>と書くと「このメソッドを呼び出したオブジェクトのnameプロパティ」を意味します。<code>user.greet()</code>と呼べば、<code>this</code>は<code>user</code>を指します。</p>
<p>なぜ<code>this</code>が必要なのでしょうか。メソッドの中で<code>name</code>とだけ書いても、それはただの変数名の参照であり、オブジェクトのプロパティは探してくれません。宣言していない変数を参照すれば<code>ReferenceError</code>になります。「同じオブジェクトの中にあるから」と自動でつながることはない、という点が最初のつまずきポイントです。</p>
<table>
  <tr><th>書き方</th><th>意味</th></tr>
  <tr><td>name</td><td>スコープ内の変数nameを探す（無ければReferenceError）</td></tr>
  <tr><td>this.name</td><td>呼び出し元オブジェクトのnameプロパティ</td></tr>
</table>
<p>なお<code>this</code>は呼び出し方によって中身が変わる奥深い仕組みですが、詳しくは第11章で扱います。ここでは「メソッド内で自分のプロパティを使うときはthisを付ける」と覚えれば十分です。</p>`,
      task: `このコードは実行すると<code>ReferenceError</code>になります。エラーメッセージを確認し、メソッド内で自分のプロパティを参照できるように<code>this</code>を使って修正してください。`,
      code: `const user = {
  name: "はなこ",
  age: 30,
  greet() {
    // TODO: nameだけではReferenceErrorになる。thisを使って修正する
    console.log("こんにちは、" + name + "です");
  },
  introduce() {
    // TODO: ここもthisを使って修正する
    console.log(name + "は" + age + "歳です");
  }
};

user.greet();
user.introduce();
`,
      solution: `const user = {
  name: "はなこ",
  age: 30,
  greet() {
    console.log("こんにちは、" + this.name + "です");
  },
  introduce() {
    console.log(this.name + "は" + this.age + "歳です");
  }
};

user.greet();
user.introduce();
`,
      hints: [
        `メソッドの中から自分のオブジェクトのプロパティを使うには「this.プロパティ名」と書きます。`,
        `nameをthis.nameに、ageをthis.ageに書き換えましょう。`
      ],
      expectedOutput: "こんにちは、はなこです"
    },
    {
      id: 65,
      title: "オブジェクトの分割代入",
      explanation: `<p>オブジェクトから複数のプロパティを取り出して変数にするとき、1つずつ書くと冗長です。<strong>分割代入</strong>（デストラクチャリング）を使うと、1行でまとめて取り出せます。</p>
<pre><code>const user = { name: "たろう", age: 25, city: "大阪" };

// 従来の書き方
const name1 = user.name;
const age1 = user.age;

// 分割代入：キー名と同じ変数名で一気に取り出す
const { name, age } = user;
console.log(name, age); // たろう 25</code></pre>
<p>左辺の<code>{}</code>は「オブジェクトを作る」のではなく「この形で取り出す」という意味になります。取り出したいキー名だけを書けばよく、順番は関係ありません（配列と違い、名前で対応づくためです）。</p>
<table>
  <tr><th>書き方</th><th>意味</th></tr>
  <tr><td>const { name } = user</td><td>user.nameを変数nameに入れる</td></tr>
  <tr><td>const { name: userName } = user</td><td>別名userNameで取り出す（名前の衝突回避に便利）</td></tr>
  <tr><td>const { hobby = "なし" } = user</td><td>キーが無いときのデフォルト値を指定する</td></tr>
</table>
<p>別名とデフォルト値は特に実務で頻出です。存在しないキーを取り出すと通常<code>undefined</code>になりますが、<code>= デフォルト値</code>を付けておけば安全な初期値で受け取れます。関数の引数でオブジェクトを受け取るときにもこの記法はよく使われるので、しっかり手になじませておきましょう。</p>`,
      task: `分割代入を使って<code>user</code>から<code>name</code>と<code>age</code>を取り出してください。さらに存在しない<code>hobby</code>を、デフォルト値<code>"なし"</code>付きで取り出してください。`,
      code: `const user = {
  name: "たろう",
  age: 25,
  city: "大阪"
};

// TODO: 分割代入でnameとageを1行で取り出す
const name = user.name;
const age = user.age;

// TODO: hobbyをデフォルト値"なし"付きの分割代入で取り出す
const hobby = "なし";

console.log("名前: " + name + " / 年齢: " + age + "歳");
console.log("趣味: " + hobby);
`,
      solution: `const user = {
  name: "たろう",
  age: 25,
  city: "大阪"
};

const { name, age } = user;

const { hobby = "なし" } = user;

console.log("名前: " + name + " / 年齢: " + age + "歳");
console.log("趣味: " + hobby);
`,
      hints: [
        `const { キー名1, キー名2 } = オブジェクト の形で、キーと同じ名前の変数が作れます。`,
        `デフォルト値は const { hobby = "なし" } = user のように、変数名の後ろに = で書きます。`
      ],
      expectedOutput: "名前: たろう / 年齢: 25歳"
    },
    {
      id: 66,
      title: "配列の分割代入",
      explanation: `<p>分割代入は配列でも使えます。オブジェクトはキー名で対応づけましたが、配列では<strong>位置（順番）</strong>で対応づけます。</p>
<pre><code>const medals = ["金", "銀", "銅"];

const [first, second, third] = medals;
console.log(first);  // 金
console.log(second); // 銀</code></pre>
<p>左辺を<code>[]</code>にすると、配列の先頭から順に変数へ割り当てられます。変数名は自由に付けられる点がオブジェクトの分割代入との違いです。</p>
<table>
  <tr><th>書き方</th><th>意味</th></tr>
  <tr><td>const [a, b] = arr</td><td>arr[0]をaに、arr[1]をbに入れる</td></tr>
  <tr><td>const [a, , c] = arr</td><td>カンマだけ書くとその位置を飛ばせる</td></tr>
  <tr><td>const [a, ...rest] = arr</td><td>残り全部をrest配列にまとめる（第4章の残余引数と同じ記号）</td></tr>
  <tr><td>[a, b] = [b, a]</td><td>2つの変数の値を入れ替える定番テクニック</td></tr>
</table>
<p>特に便利なのが値の入れ替えです。従来は一時変数を用意して3行かけていた処理が、<code>[a, b] = [b, a];</code>の1行で書けます。すでに宣言済みの変数へ再代入する形なので、この場合は<code>let</code>で宣言しておく必要があります。</p>
<pre><code>let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1</code></pre>`,
      task: `配列の分割代入で<code>ranking</code>から1位と2位を取り出してください。また、<code>[a, b] = [b, a]</code>の形で変数<code>champion</code>と<code>challenger</code>の中身を入れ替えてください。`,
      code: `const ranking = ["金", "銀", "銅"];

// TODO: 分割代入で1位（first）と2位（second）を取り出す
const first = "";
const second = "";

console.log("1位: " + first);
console.log("2位: " + second);

let champion = "挑戦者";
let challenger = "王者";

// TODO: 分割代入でchampionとchallengerの中身を入れ替える

console.log("チャンピオン: " + champion);
console.log("チャレンジャー: " + challenger);
`,
      solution: `const ranking = ["金", "銀", "銅"];

const [first, second] = ranking;

console.log("1位: " + first);
console.log("2位: " + second);

let champion = "挑戦者";
let challenger = "王者";

[champion, challenger] = [challenger, champion];

console.log("チャンピオン: " + champion);
console.log("チャレンジャー: " + challenger);
`,
      hints: [
        `const [first, second] = ranking と書くと、先頭から順に変数へ入ります。3つ目は書かなくても構いません。`,
        `入れ替えは [champion, challenger] = [challenger, champion]; の1行です。宣言済み変数への再代入なのでconstやletは付けません。`
      ],
      expectedOutput: "1位: 金"
    },
    {
      id: 67,
      title: "スプレッド構文でコピーとマージ",
      explanation: `<p>第5章で配列の「参照の罠」を学びました。オブジェクトも同じで、<code>=</code>で代入するとコピーではなく<strong>同じオブジェクトを2つの変数が指す</strong>状態になります。片方を変更するともう片方も変わってしまいます。</p>
<pre><code>const original = { price: 200 };
const copy = original;      // コピーではなく同じものを指す
copy.price = 150;
console.log(original.price); // 150（元まで変わってしまった）</code></pre>
<p>独立したコピーを作るには<strong>スプレッド構文</strong><code>{ ...obj }</code>を使います。プロパティを展開して新しいオブジェクトに詰め直すイメージです。</p>
<pre><code>const copy = { ...original };  // 独立したコピー
copy.price = 150;
console.log(original.price);   // 200（元は無事）</code></pre>
<p>スプレッド構文は複数オブジェクトの<strong>マージ（合成）</strong>にも使えます。同じキーがあるときは<strong>後に書いたものが勝つ</strong>ため、「デフォルト設定を上書きする」パターンで多用されます。</p>
<pre><code>const defaults = { theme: "light", fontSize: 14 };
const merged = { ...defaults, theme: "dark" };
// { theme: "dark", fontSize: 14 }</code></pre>
<p>ただし注意点があります。スプレッドは<strong>浅いコピー</strong>（1段目だけのコピー）です。プロパティの値がさらにオブジェクトや配列の場合、その中身は共有されたままです。ネストしたデータを安全に複製する方法は第17章のstructuredCloneで学びます。ここでは「1段目はコピーされるが、入れ子の中身は共有される」と覚えておきましょう。</p>`,
      task: `<code>copy</code>が<code>original</code>と同じオブジェクトを指しているため、値上げが元データにまで影響しています。スプレッド構文で独立したコピーを作るように修正してください。さらに<code>original</code>と<code>{ stock: 5 }</code>をマージした<code>merged</code>を作ってください。`,
      code: `const original = { name: "ノート", price: 200 };

// TODO: 代入ではなくスプレッド構文で独立したコピーを作る
const copy = original;
copy.price = 150;

console.log("original:", original.price); // 200のままにしたい
console.log("copy:", copy.price);         // こちらは150にしたい

// TODO: originalと{ stock: 5 }をスプレッド構文でマージしたmergedを作る
const merged = original;

console.log("在庫:", merged.stock);
`,
      solution: `const original = { name: "ノート", price: 200 };

const copy = { ...original };
copy.price = 150;

console.log("original:", original.price);
console.log("copy:", copy.price);

const merged = { ...original, stock: 5 };

console.log("在庫:", merged.stock);
`,
      hints: [
        `独立したコピーは const copy = { ...original } で作れます。ドット3つがスプレッド構文です。`,
        `マージは { ...original, stock: 5 } のように、展開の後ろに追加したいプロパティを書きます。`
      ],
      expectedOutput: "original: 200"
    },
    {
      id: 68,
      title: "オプショナルチェーン?.とnull合体??",
      explanation: `<p>ネストしたオブジェクトを扱うとき、途中のプロパティが<code>undefined</code>や<code>null</code>だと、その先へのアクセスで<code>TypeError</code>が発生します。これは実務のバグランキング常連のエラーです。</p>
<pre><code>const guest = { name: "ゲスト" }; // profileが無い
console.log(guest.profile.city);
// TypeError: Cannot read properties of undefined (reading 'city')</code></pre>
<p>これを安全に書けるのが<strong>オプショナルチェーン</strong><code>?.</code>です。<code>?.</code>の左側が<code>null</code>または<code>undefined</code>のとき、エラーにせずそこで評価を打ち切って<code>undefined</code>を返します。</p>
<pre><code>console.log(guest.profile?.city); // undefined（エラーにならない）</code></pre>
<p>そして「値が無いときの代わりの値」を用意するのが<strong>null合体演算子</strong><code>??</code>です。左側が<code>null</code>か<code>undefined</code>のときだけ右側を返します。</p>
<pre><code>console.log(guest.profile?.city ?? "未設定"); // 未設定</code></pre>
<p>第2章で学んだ<code>||</code>との違いに注意しましょう。<code>||</code>は左側がfalsy（0や空文字列も含む）なら右側を返しますが、<code>??</code>が反応するのは<code>null</code>と<code>undefined</code>だけです。</p>
<table>
  <tr><th>左側の値</th><th>左 || 右 の結果</th><th>左 ?? 右 の結果</th></tr>
  <tr><td>0</td><td>右側（0はfalsyなので）</td><td>0（有効な値として残る）</td></tr>
  <tr><td>""（空文字列）</td><td>右側</td><td>""（有効な値として残る）</td></tr>
  <tr><td>null / undefined</td><td>右側</td><td>右側</td></tr>
</table>
<p>「0や空文字列を正しい値として扱いたい」場面では<code>??</code>を選ぶのが安全です。</p>`,
      task: `<code>guest.profile.city</code>の行は<code>TypeError</code>になります。<code>?.</code>と<code>??</code>を使って、profileが無い場合は「未設定」と表示されるように2つの<code>console.log</code>を修正してください。`,
      code: `const user = {
  name: "たろう",
  profile: {
    city: "東京"
  }
};

const guest = {
  name: "ゲスト"
};

// TODO: ?.と??を使い、値が無ければ"未設定"と表示する
console.log("たろうの住まい:", user.profile.city);

// TODO: このままだとTypeErrorで止まる。同じく?.と??で修正する
console.log("ゲストの住まい:", guest.profile.city);
`,
      solution: `const user = {
  name: "たろう",
  profile: {
    city: "東京"
  }
};

const guest = {
  name: "ゲスト"
};

console.log("たろうの住まい:", user.profile?.city ?? "未設定");

console.log("ゲストの住まい:", guest.profile?.city ?? "未設定");
`,
      hints: [
        `途中でundefinedになる可能性がある部分のドットを ?. に変えると、エラーの代わりにundefinedが返ります。`,
        `guest.profile?.city ?? "未設定" のように、?.でアクセスした結果に??でデフォルト値を付けます。`
      ],
      expectedOutput: "ゲストの住まい: 未設定"
    },
    {
      id: 69,
      title: "Object.keys・values・entries",
      explanation: `<p>配列は<code>for...of</code>で直接ループできましたが、オブジェクトはそのままではループできません。代わりに、キーや値を<strong>配列として取り出す</strong>3つのメソッドが用意されています。</p>
<table>
  <tr><th>メソッド</th><th>返るもの</th><th>例（{ apple: 3, banana: 10 }の場合）</th></tr>
  <tr><td>Object.keys(obj)</td><td>キーの配列</td><td>["apple", "banana"]</td></tr>
  <tr><td>Object.values(obj)</td><td>値の配列</td><td>[3, 10]</td></tr>
  <tr><td>Object.entries(obj)</td><td>[キー, 値]ペアの配列</td><td>[["apple", 3], ["banana", 10]]</td></tr>
</table>
<p>いったん配列になってしまえば、第5〜6章で学んだ<code>for...of</code>や<code>map</code>・<code>filter</code>がすべて使えます。特に便利なのが<code>Object.entries</code>と、前ステップまでに学んだ<strong>配列の分割代入</strong>の組み合わせです。</p>
<pre><code>const stock = { apple: 3, banana: 10 };

for (const [name, count] of Object.entries(stock)) {
  console.log(name + ": " + count + "個");
}
// apple: 3個
// banana: 10個</code></pre>
<p><code>Object.entries</code>が返す各要素は<code>["apple", 3]</code>のような長さ2の配列なので、<code>const [name, count]</code>という分割代入で1つ目をname、2つ目をcountに受け取れます。この「entriesで回して分割代入で受ける」パターンは、集計結果の表示などで頻繁に登場する定番イディオムです。</p>
<p>また<code>Object.keys(obj).length</code>でプロパティの個数を数えられます。オブジェクトには配列のような<code>length</code>プロパティが無いため、この書き方が定番です。</p>`,
      task: `<code>Object.keys</code>でキー一覧を、<code>Object.values</code>で値一覧を表示してください。さらに<code>Object.entries</code>と<code>for...of</code>で「フルーツ名: 個数個」の形式で全プロパティを表示してください。`,
      code: `const stock = {
  apple: 3,
  banana: 10,
  orange: 7
};

// TODO: Object.keysでキーの配列を表示する
console.log(stock);

// TODO: Object.valuesで値の配列を表示する
console.log(stock);

// TODO: Object.entriesとfor...ofで「apple: 3個」の形式で表示する
`,
      solution: `const stock = {
  apple: 3,
  banana: 10,
  orange: 7
};

console.log(Object.keys(stock));

console.log(Object.values(stock));

for (const [name, count] of Object.entries(stock)) {
  console.log(name + ": " + count + "個");
}
`,
      hints: [
        `Object.keys(stock)、Object.values(stock)はどちらも配列を返すので、そのままconsole.logに渡せます。`,
        `for (const [name, count] of Object.entries(stock)) { ... } と書くと、キーと値を同時に受け取れます。`
      ],
      expectedOutput: "banana: 10個"
    },
    {
      id: 70,
      title: "総合演習：ユーザーオブジェクト操作",
      explanation: `<p>第7章の総まとめです。この章で学んだ道具を組み合わせて、ユーザー情報を扱う2つの関数を完成させます。実務のコードでは「元のデータを壊さずに更新版を作る」「無いかもしれない値に安全にデフォルトを与える」という2つの操作が繰り返し登場します。</p>
<h4>使う知識の整理</h4>
<table>
  <tr><th>知識</th><th>学んだステップ</th><th>今回の使いどころ</th></tr>
  <tr><td>スプレッド構文とマージ</td><td>67</td><td>元のオブジェクトを変更せず、上書き済みの新しいオブジェクトを返す</td></tr>
  <tr><td>後に書いたキーが勝つ</td><td>67</td><td>{ ...original, ...updates }でupdatesの値を優先する</td></tr>
  <tr><td>分割代入</td><td>65</td><td>関数内でプロパティを取り出して読みやすくする</td></tr>
  <tr><td>?? によるデフォルト値</td><td>68</td><td>emailがnullのとき"未登録"と表示する</td></tr>
</table>
<p>ポイントは<code>updateUser</code>が元のオブジェクトを<strong>変更しない</strong>ことです。引数のオブジェクトを直接書き換えてしまうと、その関数を呼んだ側のデータまで変わってしまい、追いにくいバグの温床になります。スプレッド構文で新しいオブジェクトを作って返す設計を<strong>イミュータブル（不変）な更新</strong>と呼び、モダンなJavaScript開発の基本姿勢です。</p>
<pre><code>// マージの動きの確認
const base = { a: 1, b: 2 };
const next = { ...base, b: 99 };
console.log(base.b); // 2（元はそのまま）
console.log(next.b); // 99（新しい方だけ変わる）</code></pre>
<p>更新後も元のuserの年齢が28歳のままであることを、出力で必ず確認しましょう。</p>`,
      task: `<code>updateUser</code>を、元のオブジェクトを変更せずに<code>updates</code>で上書きした新しいオブジェクトを返すように実装してください。<code>printProfile</code>は分割代入で取り出し、emailが<code>null</code>なら「未登録」と表示するように実装してください。`,
      code: `const user = {
  name: "さとう",
  age: 28,
  email: null
};

// TODO: originalを変更せず、updatesで上書きした新しいオブジェクトを返す
function updateUser(original, updates) {
  return original; // 仮実装
}

// TODO: 分割代入でname・age・emailを取り出し、
// 「名前: ○○ / 年齢: ○○歳 / メール: ○○」の形式で表示する
// emailがnullのときは"未登録"と表示する（??を使う）
function printProfile(user) {
}

const updated = updateUser(user, { age: 29, email: "sato@example.com" });

printProfile(user);    // 元のデータは変わっていないこと
printProfile(updated); // 更新が反映されていること
`,
      solution: `const user = {
  name: "さとう",
  age: 28,
  email: null
};

function updateUser(original, updates) {
  return { ...original, ...updates };
}

function printProfile(user) {
  const { name, age, email } = user;
  console.log("名前: " + name + " / 年齢: " + age + "歳 / メール: " + (email ?? "未登録"));
}

const updated = updateUser(user, { age: 29, email: "sato@example.com" });

printProfile(user);
printProfile(updated);
`,
      hints: [
        `updateUserは { ...original, ...updates } を返すだけで完成です。同じキーは後ろのupdatesが勝ちます。`,
        `printProfileでは const { name, age, email } = user; で取り出し、email ?? "未登録" でデフォルト値を与えます。`,
        `email ?? "未登録" を+で連結するときは (email ?? "未登録") とかっこで囲むと安全です。`
      ],
      expectedOutput: "名前: さとう / 年齢: 28歳 / メール: 未登録"
    }
  ]
});
