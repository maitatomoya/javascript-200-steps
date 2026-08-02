// 第15章：Map・Set・JSON
registerChapter({
  number: 15,
  title: "Map・Set・JSON",
  description: "キーと値を柔軟に扱うMap、重複のない集合を扱うSet、そしてデータ交換の標準形式であるJSONを学び、構造化データを自在に操れるようになります。",
  steps: [
    {
      id: 141,
      title: "Mapの基本（set、get、has、delete）",
      explanation: `<p>Map（マップ）は「キーと値のペア」を保存するための組み込みオブジェクトです。オブジェクトのプロパティと似ていますが、Mapは専用のメソッドでデータを出し入れします。まずは基本の4つのメソッドと、要素数を返す<code>size</code>プロパティを押さえましょう。</p>
<ul>
<li><code>set(キー, 値)</code>：ペアを追加する（同じキーなら上書き）</li>
<li><code>get(キー)</code>：キーに対応する値を取り出す（無ければ<code>undefined</code>）</li>
<li><code>has(キー)</code>：キーが存在するかを<code>true</code>/<code>false</code>で返す</li>
<li><code>delete(キー)</code>：キーとその値を削除する</li>
</ul>
<pre><code>const stock = new Map();
stock.set("りんご", 3);
stock.set("バナナ", 5);

console.log(stock.get("りんご"));  // 3
console.log(stock.has("みかん")); // false
stock.delete("バナナ");
console.log(stock.size);          // 1
</code></pre>
<p><code>set</code>はMap自身を返すため、<code>stock.set("a", 1).set("b", 2)</code>のようにメソッドチェーン（メソッド呼び出しを連結する書き方）もできます。また<code>new Map()</code>に配列の配列を渡すと、最初からペアを入れた状態で作れます。</p>
<pre><code>const scores = new Map([["国語", 80], ["数学", 90]]);
console.log(scores.get("数学")); // 90
</code></pre>
<p>Mapは「あるキーに対応する値を素早く調べたい」という場面（在庫管理、単語の出現回数の集計など）で広く使われます。この章の最後の総合演習でも中心的な役割を果たすので、4つのメソッドの動きを確実に覚えましょう。</p>`,
      task: `在庫を管理するMapを完成させましょう。TODOの箇所で「バナナ」を5個追加し、「りんご」の在庫数を取得して表示してください。`,
      code: `const stock = new Map();
stock.set("りんご", 3);
// TODO: 「バナナ」を5個追加する

// TODO: getを使って「りんご」の在庫数を取得し、変数appleに入れる
const apple = 0;

console.log("りんごの在庫: " + apple);
console.log("みかんはある?: " + stock.has("みかん"));
stock.delete("りんご");
console.log("削除後のサイズ: " + stock.size);
`,
      solution: `const stock = new Map();
stock.set("りんご", 3);
// 「バナナ」を5個追加する
stock.set("バナナ", 5);

// getを使って「りんご」の在庫数を取得する
const apple = stock.get("りんご");

console.log("りんごの在庫: " + apple);
console.log("みかんはある?: " + stock.has("みかん"));
stock.delete("りんご");
console.log("削除後のサイズ: " + stock.size);
`,
      hints: [
        `追加は「stock.set(キー, 値)」、取得は「stock.get(キー)」の形で書きます。`,
        `バナナの追加はstock.set("バナナ", 5)、りんごの取得はstock.get("りんご")です。`
      ],
      expectedOutput: "りんごの在庫: 3"
    },
    {
      id: 142,
      title: "Mapとオブジェクトの使い分け",
      explanation: `<p>「キーと値のペア」はオブジェクト（<code>{}</code>）でも表現できます。ではMapは何が違うのでしょうか。最大の違いは<strong>キーの型</strong>です。オブジェクトのキーは必ず文字列（またはSymbol）に変換されますが、Mapは数値・真偽値・オブジェクトなど、どんな型でもそのままキーにできます。</p>
<pre><code>const obj = {};
obj[1] = "数値のつもり";
// オブジェクトのキーは文字列に変換される
console.log(Object.keys(obj)); // ["1"]（文字列！）

const map = new Map();
map.set(1, "数値キー");
console.log(map.has(1));   // true
console.log(map.has("1")); // false（数値の1と文字列の"1"は別物）
</code></pre>
<p>主な違いを表にまとめます。</p>
<table>
<tr><th>観点</th><th>オブジェクト</th><th>Map</th></tr>
<tr><td>キーの型</td><td>文字列とSymbolのみ</td><td>任意の型</td></tr>
<tr><td>要素数</td><td><code>Object.keys(obj).length</code></td><td><code>map.size</code></td></tr>
<tr><td>順序</td><td>一部例外あり</td><td>追加した順を保証</td></tr>
<tr><td>頻繁な追加・削除</td><td>あまり得意でない</td><td>得意（最適化されている）</td></tr>
<tr><td>JSON化</td><td>そのまま可能</td><td>変換が必要（ステップ148で学習）</td></tr>
</table>
<p>使い分けの目安は「構造が決まっているデータ（ユーザー情報など）はオブジェクト、キーが動的に増減する辞書的なデータはMap」です。実務では設定値やAPIレスポンスはオブジェクト、集計やキャッシュ（計算結果の一時保存）にはMapがよく使われます。</p>`,
      task: `オブジェクトとMapのキーの違いを確認するコードです。TODOの箇所を埋めて、Mapが数値キーと文字列キーを区別することを確認しましょう。`,
      code: `const obj = {};
obj[1] = "one";
// オブジェクトのキーは文字列に変換される
console.log("objのキーの型: " + typeof Object.keys(obj)[0]);

const map = new Map();
map.set(1, "one");
// TODO: hasを使って、数値の1がキーとして存在するか確認する
const hasNumber = false;
// TODO: hasを使って、文字列の"1"がキーとして存在するか確認する
const hasString = true;

console.log("数値キー1はある?: " + hasNumber);
console.log("文字列キー\\"1\\"はある?: " + hasString);
`,
      solution: `const obj = {};
obj[1] = "one";
// オブジェクトのキーは文字列に変換される
console.log("objのキーの型: " + typeof Object.keys(obj)[0]);

const map = new Map();
map.set(1, "one");
// 数値の1がキーとして存在するか確認する
const hasNumber = map.has(1);
// 文字列の"1"がキーとして存在するか確認する
const hasString = map.has("1");

console.log("数値キー1はある?: " + hasNumber);
console.log("文字列キー\\"1\\"はある?: " + hasString);
`,
      hints: [
        `Mapは数値の1と文字列の"1"を別のキーとして扱います。オブジェクトとの大きな違いです。`,
        `map.has(1)とmap.has("1")をそれぞれの変数に代入しましょう。結果はtrueとfalseになるはずです。`
      ],
      expectedOutput: "数値キー1はある?: true"
    },
    {
      id: 143,
      title: "Mapの走査（for...of、keys、values）",
      explanation: `<p>Mapの中身を順番に処理する（走査する）には<code>for...of</code>文を使います。Mapを直接<code>for...of</code>にかけると、各要素が<code>[キー, 値]</code>という2要素の配列として取り出されるので、分割代入（配列の要素を複数の変数にまとめて代入する構文）と組み合わせるのが定番です。</p>
<pre><code>const scores = new Map([["国語", 80], ["数学", 90], ["英語", 70]]);

for (const [subject, score] of scores) {
  console.log(subject + ": " + score);
}
// 国語: 80
// 数学: 90
// 英語: 70
</code></pre>
<p>キーだけ、値だけを取り出したいときは専用メソッドを使います。</p>
<ul>
<li><code>keys()</code>：キーだけを順番に返す</li>
<li><code>values()</code>：値だけを順番に返す</li>
<li><code>entries()</code>：<code>[キー, 値]</code>のペアを返す（<code>for...of</code>に直接かけたときと同じ）</li>
</ul>
<pre><code>for (const subject of scores.keys()) {
  console.log(subject); // 国語 数学 英語
}

let total = 0;
for (const score of scores.values()) {
  total += score;
}
console.log(total); // 240
</code></pre>
<p>Mapは<strong>追加した順序を必ず保つ</strong>ので、走査の結果も常に同じ順番になります。この性質は「登録順に処理したい」場面でとても便利です。なお、これらのメソッドが返すのは配列ではなく「イテレータ」という仕組みのオブジェクトです。詳しくは第16章で学ぶので、今は「for...ofで順に取り出せるもの」と理解しておけば十分です。</p>`,
      task: `教科と点数を保存したMapを走査します。TODOの箇所で、for...ofと分割代入を使って「教科: 点数」の形式で全教科を表示し、さらにvalues()を使って合計点を計算してください。`,
      code: `const scores = new Map([["国語", 80], ["数学", 90], ["英語", 70]]);

// TODO: for...ofと分割代入で「教科: 点数」の形式で表示する

let total = 0;
// TODO: values()を使って合計点を計算する

console.log("合計: " + total);
`,
      solution: `const scores = new Map([["国語", 80], ["数学", 90], ["英語", 70]]);

// for...ofと分割代入で「教科: 点数」の形式で表示する
for (const [subject, score] of scores) {
  console.log(subject + ": " + score);
}

let total = 0;
// values()を使って合計点を計算する
for (const score of scores.values()) {
  total += score;
}

console.log("合計: " + total);
`,
      hints: [
        `Mapをfor...ofにかけると[キー, 値]の配列が順に取り出せます。for (const [a, b] of map)の形で受け取れます。`,
        `値だけが欲しいときはscores.values()をfor...ofにかけ、ループの中でtotalに加算します。`
      ],
      expectedOutput: "合計: 240"
    },
    {
      id: 144,
      title: "Setの基本と重複排除",
      explanation: `<p>Set（セット）は「同じ値を2つ持てない」コレクションです。数学の「集合」に由来する名前で、値の重複を自動的に取り除いてくれるのが最大の特徴です。基本メソッドはMapとよく似ています。</p>
<ul>
<li><code>add(値)</code>：値を追加する（すでにあれば何も起きない）</li>
<li><code>has(値)</code>：値が存在するかを返す</li>
<li><code>delete(値)</code>：値を削除する</li>
<li><code>size</code>：要素数（プロパティ）</li>
</ul>
<pre><code>const members = new Set();
members.add("佐藤");
members.add("鈴木");
members.add("佐藤"); // 重複は無視される

console.log(members.size);        // 2
console.log(members.has("鈴木")); // true
</code></pre>
<p>実務で最もよく使うのが<strong>配列の重複排除</strong>です。<code>new Set(配列)</code>で重複が消えたSetができ、<code>Array.from(セット)</code>で配列に戻せます。</p>
<pre><code>const numbers = [1, 2, 2, 3, 3, 3];
const unique = new Set(numbers);
console.log(unique.size);              // 3
console.log(Array.from(unique));       // [1, 2, 3]
</code></pre>
<p>「重複チェック」を配列で行うと<code>includes</code>で毎回全要素を調べることになりますが、Setの<code>has</code>は要素数が増えてもほぼ一定の速さで判定できます。大量データの「もう見たかどうか」の記録にはSetが最適です。なおSetもMapと同様に追加順を保ち、<code>for...of</code>で走査できます。</p>`,
      task: `アンケートの回答者リストから重複を取り除きましょう。TODOの箇所でSetを作り、重複を除いた人数と、「田中」が回答済みかどうかを表示してください。`,
      code: `const answers = ["佐藤", "鈴木", "佐藤", "田中", "鈴木", "佐藤"];

// TODO: answersからSetを作って変数uniqueに入れる
const unique = null;

console.log("回答者数（重複あり）: " + answers.length);
console.log("回答者数（重複なし）: " + unique.size);
console.log("田中は回答済み?: " + unique.has("田中"));
console.log("メンバー: " + Array.from(unique).join(","));
`,
      solution: `const answers = ["佐藤", "鈴木", "佐藤", "田中", "鈴木", "佐藤"];

// answersからSetを作る（重複は自動的に取り除かれる）
const unique = new Set(answers);

console.log("回答者数（重複あり）: " + answers.length);
console.log("回答者数（重複なし）: " + unique.size);
console.log("田中は回答済み?: " + unique.has("田中"));
console.log("メンバー: " + Array.from(unique).join(","));
`,
      hints: [
        `new Set(配列)とするだけで、重複が取り除かれたSetが作れます。`,
        `const unique = new Set(answers); と書きます。sizeは3、has("田中")はtrueになるはずです。`
      ],
      expectedOutput: "回答者数（重複なし）: 3"
    },
    {
      id: 145,
      title: "Setの集合演算（和・積・差を自作）",
      explanation: `<p>Setは数学の集合と同じ考え方で使えます。2つの集合から新しい集合を作る代表的な演算が「和集合」「積集合」「差集合」です。</p>
<table>
<tr><th>演算</th><th>意味</th><th>例（A={1,2,3}, B={2,3,4}）</th></tr>
<tr><td>和集合（union）</td><td>AとBの少なくとも一方にある要素</td><td>{1,2,3,4}</td></tr>
<tr><td>積集合（intersection）</td><td>AとBの両方にある要素</td><td>{2,3}</td></tr>
<tr><td>差集合（difference）</td><td>Aにあり、Bにない要素</td><td>{1}</td></tr>
</table>
<p>これらは<code>for...of</code>と<code>has</code>を組み合わせれば自作できます。</p>
<pre><code>function union(a, b) {
  const result = new Set(a); // aのコピーから始める
  for (const value of b) {
    result.add(value);
  }
  return result;
}

function intersection(a, b) {
  const result = new Set();
  for (const value of a) {
    if (b.has(value)) {
      result.add(value);
    }
  }
  return result;
}
</code></pre>
<p>差集合は積集合の条件を反転させるだけです。「aの要素のうち、bに<strong>ない</strong>ものだけを集める」ので、<code>!b.has(value)</code>を条件にします。</p>
<p>実務では「先月の顧客と今月の顧客の共通部分（継続顧客）」「今月だけの顧客（新規）」のような分析にそのまま応用できます。なおNode.js 22以降ではSetに<code>union</code>や<code>intersection</code>メソッドが標準搭載されましたが、仕組みを理解するために一度は自作しておく価値があります。</p>`,
      task: `和集合と積集合の関数は完成しています。TODOの箇所で差集合（aにあってbにない要素）を返す関数differenceを完成させてください。`,
      code: `function union(a, b) {
  const result = new Set(a);
  for (const value of b) {
    result.add(value);
  }
  return result;
}

function intersection(a, b) {
  const result = new Set();
  for (const value of a) {
    if (b.has(value)) {
      result.add(value);
    }
  }
  return result;
}

function difference(a, b) {
  const result = new Set();
  // TODO: aの要素のうち、bにないものだけをresultに追加する

  return result;
}

const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);

console.log("和集合: " + Array.from(union(setA, setB)).join(","));
console.log("積集合: " + Array.from(intersection(setA, setB)).join(","));
console.log("差集合: " + Array.from(difference(setA, setB)).join(","));
`,
      solution: `function union(a, b) {
  const result = new Set(a);
  for (const value of b) {
    result.add(value);
  }
  return result;
}

function intersection(a, b) {
  const result = new Set();
  for (const value of a) {
    if (b.has(value)) {
      result.add(value);
    }
  }
  return result;
}

function difference(a, b) {
  const result = new Set();
  // aの要素のうち、bにないものだけをresultに追加する
  for (const value of a) {
    if (!b.has(value)) {
      result.add(value);
    }
  }
  return result;
}

const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);

console.log("和集合: " + Array.from(union(setA, setB)).join(","));
console.log("積集合: " + Array.from(intersection(setA, setB)).join(","));
console.log("差集合: " + Array.from(difference(setA, setB)).join(","));
`,
      hints: [
        `intersectionとほぼ同じ形で書けます。違いは条件だけです。`,
        `aをfor...ofで走査し、if (!b.has(value)) のときだけresult.add(value)します。`,
        `結果は差集合が{1}になれば正解です。`
      ],
      expectedOutput: "差集合: 1"
    },
    {
      id: 146,
      title: "JSON.stringify（インデント、replacer）",
      explanation: `<p>JSON（JavaScript Object Notation）は、オブジェクトや配列を<strong>文字列として表現するデータ形式</strong>です。プログラム間のデータ交換（APIの通信、設定ファイル、データ保存）の世界標準として使われています。JavaScriptの値をJSON文字列に変換するのが<code>JSON.stringify</code>です。</p>
<pre><code>const user = { name: "佐藤", age: 28 };
const json = JSON.stringify(user);
console.log(json); // {"name":"佐藤","age":28}
console.log(typeof json); // string（文字列になった）
</code></pre>
<p><code>JSON.stringify</code>には3つの引数があります。</p>
<ul>
<li>第1引数：変換したい値</li>
<li>第2引数：replacer（変換をカスタマイズする関数。不要なら<code>null</code>）</li>
<li>第3引数：インデント（数値を渡すと、その数の空白で整形される）</li>
</ul>
<pre><code>// インデント2で整形（人間が読みやすい形に）
console.log(JSON.stringify(user, null, 2));
// {
//   "name": "佐藤",
//   "age": 28
// }

// replacer関数でパスワードを除外
function hideSecret(key, value) {
  if (key === "password") {
    return undefined; // undefinedを返すとそのキーは出力されない
  }
  return value;
}
</code></pre>
<p>replacer関数は各キーと値のペアごとに呼ばれ、<code>undefined</code>を返したキーは結果から除外されます。ログ出力やAPIレスポンスから秘密情報を除くという、セキュリティ上とても重要なテクニックです。なお、JSONにできない値（関数、<code>undefined</code>）は自動的に省かれることも覚えておきましょう。</p>`,
      task: `ユーザー情報をJSON文字列に変換します。TODOの箇所で、replacer関数hideSecretと、インデント2を指定してJSON.stringifyを呼び出してください。`,
      code: `const user = {
  name: "佐藤",
  age: 28,
  password: "himitsu123"
};

function hideSecret(key, value) {
  if (key === "password") {
    return undefined;
  }
  return value;
}

// TODO: hideSecretとインデント2を指定してJSON文字列に変換する
const json = "";

console.log(json);
console.log("passwordを含む?: " + json.includes("password"));
`,
      solution: `const user = {
  name: "佐藤",
  age: 28,
  password: "himitsu123"
};

function hideSecret(key, value) {
  if (key === "password") {
    return undefined;
  }
  return value;
}

// replacerにhideSecret、インデントに2を指定して変換する
const json = JSON.stringify(user, hideSecret, 2);

console.log(json);
console.log("passwordを含む?: " + json.includes("password"));
`,
      hints: [
        `JSON.stringifyの引数は（値, replacer, インデント）の順です。`,
        `JSON.stringify(user, hideSecret, 2)と書きます。出力にpasswordが含まれなければ成功です。`
      ],
      expectedOutput: "passwordを含む?: false"
    },
    {
      id: 147,
      title: "JSON.parse",
      explanation: `<p><code>JSON.stringify</code>の逆、つまりJSON文字列をJavaScriptの値に戻すのが<code>JSON.parse</code>です。APIから受け取ったデータやファイルから読み込んだ設定は「ただの文字列」なので、parseして初めてオブジェクトとして扱えるようになります。</p>
<pre><code>const jsonText = '{"name":"佐藤","age":28}';
const user = JSON.parse(jsonText);

console.log(typeof user);  // object
console.log(user.name);    // 佐藤
console.log(user.age + 1); // 29（数値として計算できる）
</code></pre>
<p>配列を含むJSONも同様に復元できます。復元後は普通の配列・オブジェクトなので、<code>for...of</code>やプロパティアクセスが自由に使えます。</p>
<pre><code>const listText = '[{"title":"入門","price":1000},{"title":"実践","price":2000}]';
const books = JSON.parse(listText);
console.log(books.length);   // 2
console.log(books[0].title); // 入門
</code></pre>
<p>注意点が2つあります。1つ目は、<strong>不正なJSONを渡すと例外（SyntaxError）が発生する</strong>ことです。外部から来たデータをparseするときは、第13章までに学んだ<code>try...catch</code>で囲むのが実務の鉄則です。2つ目は、JSONの仕様は意外と厳格だということです。キーは必ず二重引用符で囲む、末尾のカンマは禁止、コメントは書けない、といったルールがあり、JavaScriptのオブジェクトリテラルより厳しいことを覚えておきましょう。</p>`,
      task: `JSON文字列として届いた書籍データをparseして、合計金額を計算しましょう。TODOの箇所でJSON.parseを使って配列に復元し、for...ofで合計を求めてください。`,
      code: `const listText = '[{"title":"入門","price":1000},{"title":"実践","price":2000},{"title":"応用","price":3000}]';

// TODO: JSON.parseで配列に復元する
const books = [];

let total = 0;
// TODO: for...ofで各書籍のpriceを合計する

console.log("書籍数: " + books.length);
console.log("合計金額: " + total + "円");
`,
      solution: `const listText = '[{"title":"入門","price":1000},{"title":"実践","price":2000},{"title":"応用","price":3000}]';

// JSON.parseで文字列を配列に復元する
const books = JSON.parse(listText);

let total = 0;
// for...ofで各書籍のpriceを合計する
for (const book of books) {
  total += book.price;
}

console.log("書籍数: " + books.length);
console.log("合計金額: " + total + "円");
`,
      hints: [
        `JSON.parse(文字列)で、JSON文字列がオブジェクトや配列に復元されます。`,
        `for (const book of books)で1冊ずつ取り出し、total += book.price;で加算します。合計は6000円になるはずです。`
      ],
      expectedOutput: "合計金額: 6000円"
    },
    {
      id: 148,
      title: "JSONとMap・Setの変換",
      explanation: `<p>JSONが表現できるのは「オブジェクト・配列・文字列・数値・真偽値・null」だけです。MapやSetをそのまま<code>JSON.stringify</code>に渡すと、中身が消えて<code>{}</code>になってしまいます。</p>
<pre><code>const stock = new Map([["りんご", 3]]);
console.log(JSON.stringify(stock)); // {} ←中身が消える！
</code></pre>
<p>そこで、<strong>JSONにできる形（配列）へ変換してから保存し、読み込み時に復元する</strong>のが定石です。Mapは「[キー, 値]ペアの配列」と相互変換できることを利用します。</p>
<pre><code>// Map → JSON
const stock = new Map([["りんご", 3], ["バナナ", 5]]);
const json = JSON.stringify(Array.from(stock));
console.log(json); // [["りんご",3],["バナナ",5]]

// JSON → Map
const restored = new Map(JSON.parse(json));
console.log(restored.get("バナナ")); // 5
</code></pre>
<p>Setも同じ考え方で、「値の配列」を経由します。</p>
<pre><code>// Set → JSON
const tags = new Set(["js", "node"]);
const tagJson = JSON.stringify(Array.from(tags));

// JSON → Set
const restoredTags = new Set(JSON.parse(tagJson));
console.log(restoredTags.has("js")); // true
</code></pre>
<p>ポイントは、<code>new Map()</code>がペアの配列を、<code>new Set()</code>が値の配列を受け取れるという、これまで学んだコンストラクタの性質をそのまま逆変換に使っていることです。「保存するときは素朴な形に落とし、使うときにリッチな形に戻す」という発想は、データベースや通信を扱うときにも通用する重要な設計パターンです。</p>`,
      task: `MapをJSON文字列にして、そこから元のMapを復元する処理を完成させましょう。TODOの2箇所を埋めてください。`,
      code: `const stock = new Map([["りんご", 3], ["バナナ", 5]]);

// TODO: Array.fromとJSON.stringifyでJSON文字列に変換する
const json = "";

console.log("JSON: " + json);

// TODO: JSON.parseとnew MapでMapに復元する
const restored = null;

console.log("復元したサイズ: " + restored.size);
console.log("復元したバナナ: " + restored.get("バナナ"));
`,
      solution: `const stock = new Map([["りんご", 3], ["バナナ", 5]]);

// MapをArray.fromでペアの配列にしてからJSON文字列に変換する
const json = JSON.stringify(Array.from(stock));

console.log("JSON: " + json);

// JSON.parseでペアの配列に戻し、new MapでMapに復元する
const restored = new Map(JSON.parse(json));

console.log("復元したサイズ: " + restored.size);
console.log("復元したバナナ: " + restored.get("バナナ"));
`,
      hints: [
        `MapはそのままJSONにできないので、Array.from(map)で[キー, 値]の配列にしてからstringifyします。`,
        `変換はJSON.stringify(Array.from(stock))、復元はnew Map(JSON.parse(json))です。`
      ],
      expectedOutput: "復元したバナナ: 5"
    },
    {
      id: 149,
      title: "構造化データの検証（parseしたデータのチェック）",
      explanation: `<p><code>JSON.parse</code>が成功しても、それは「JSONとして正しい形だった」というだけで、<strong>中身が期待どおりとは限りません</strong>。<code>name</code>が無い、<code>age</code>が文字列になっている、といったデータが平気で届くのが実務の現実です。そこでparse後に「検証（バリデーション）」を行います。</p>
<p>検証には、これまでに学んだ道具がそのまま使えます。</p>
<ul>
<li><code>typeof 値 === "string"</code>：文字列かどうか</li>
<li><code>typeof 値 === "number"</code>：数値かどうか</li>
<li><code>Array.isArray(値)</code>：配列かどうか（<code>typeof</code>では配列も"object"になるため専用の関数を使う）</li>
</ul>
<pre><code>function validateUser(data) {
  if (typeof data.name !== "string") {
    return "nameは文字列が必要です";
  }
  if (typeof data.age !== "number") {
    return "ageは数値が必要です";
  }
  if (!Array.isArray(data.tags)) {
    return "tagsは配列が必要です";
  }
  return null; // 問題なし
}
</code></pre>
<p>この関数は「エラーメッセージを返す。問題なければ<code>null</code>を返す」という設計です。呼び出し側は戻り値が<code>null</code>かどうかで成否を判定できます。検証関数を1か所にまとめておくと、チェック項目が増えても呼び出し側を変えずに済みます。</p>
<p>実務ではzodなどの検証ライブラリを使うことが多いですが、その内部でやっているのは本質的にここで書くのと同じ型チェックの積み重ねです。手書きで一度作っておくと、ライブラリのエラーメッセージも読み解けるようになります。</p>`,
      task: `validateUser関数のTODOを埋めて、ageが数値であること、tagsが配列であることのチェックを追加してください。2件のデータのうち1件目は検証OK、2件目は検証NGになるはずです。`,
      code: `function validateUser(data) {
  if (typeof data.name !== "string") {
    return "nameは文字列が必要です";
  }
  // TODO: ageが数値でなければ "ageは数値が必要です" を返す

  // TODO: tagsが配列でなければ "tagsは配列が必要です" を返す

  return null;
}

const inputs = [
  '{"name":"佐藤","age":28,"tags":["js","node"]}',
  '{"name":"鈴木","age":"ひみつ","tags":["css"]}'
];

for (const text of inputs) {
  const data = JSON.parse(text);
  const error = validateUser(data);
  if (error === null) {
    console.log("検証OK: " + data.name);
  } else {
    console.log("検証NG: " + error);
  }
}
`,
      solution: `function validateUser(data) {
  if (typeof data.name !== "string") {
    return "nameは文字列が必要です";
  }
  // ageが数値かどうかをチェックする
  if (typeof data.age !== "number") {
    return "ageは数値が必要です";
  }
  // tagsが配列かどうかをチェックする（typeofでは判定できない）
  if (!Array.isArray(data.tags)) {
    return "tagsは配列が必要です";
  }
  return null;
}

const inputs = [
  '{"name":"佐藤","age":28,"tags":["js","node"]}',
  '{"name":"鈴木","age":"ひみつ","tags":["css"]}'
];

for (const text of inputs) {
  const data = JSON.parse(text);
  const error = validateUser(data);
  if (error === null) {
    console.log("検証OK: " + data.name);
  } else {
    console.log("検証NG: " + error);
  }
}
`,
      hints: [
        `nameのチェックと同じパターンで書けます。数値の判定はtypeofで"number"と比較します。`,
        `配列の判定はtypeofではなくArray.isArray(data.tags)を使い、!で否定します。`,
        `2件目のデータはageが文字列なので「検証NG: ageは数値が必要です」と表示されれば正解です。`
      ],
      expectedOutput: "検証NG: ageは数値が必要です"
    },
    {
      id: 150,
      title: "総合演習（タグ集計システム）",
      explanation: `<p>この章の総仕上げとして、ブログ記事のタグを集計するシステムを作ります。使う道具はすべてこの章で学んだものです。</p>
<ul>
<li><strong>JSON.parse</strong>：文字列として届いた記事データを復元する</li>
<li><strong>Set</strong>：タグの種類（重複を除いた一覧）を求める</li>
<li><strong>Map</strong>：タグごとの出現回数を数える</li>
</ul>
<p>集計の中心となるのが「カウント用Map」のパターンです。キーが未登録なら0から始め、あれば1を足します。</p>
<pre><code>const counts = new Map();
for (const tag of tags) {
  if (counts.has(tag)) {
    counts.set(tag, counts.get(tag) + 1);
  } else {
    counts.set(tag, 1);
  }
}
</code></pre>
<p>このパターンは<code>counts.set(tag, (counts.get(tag) || 0) + 1)</code>と1行に短縮することもできます。<code>get</code>が<code>undefined</code>を返したときに<code>|| 0</code>で0に置き換える書き方です。</p>
<p>集計後は、Mapをペアの配列に変換して並べ替えます。<code>sort</code>に比較関数を渡すのは配列の章で学んだとおりです。</p>
<pre><code>const sorted = Array.from(counts).sort(function (a, b) {
  return b[1] - a[1]; // 出現回数の多い順
});
</code></pre>
<p><code>a</code>と<code>b</code>は<code>[タグ名, 回数]</code>の形なので、<code>[1]</code>で回数を比較しています。「JSONで受け取る → Map/Setで集計する → 整形して出力する」という流れは、データ処理プログラムの最も基本的な骨格です。この演習で一連の流れを体に馴染ませましょう。</p>`,
      task: `タグ集計システムを完成させましょう。TODOの3箇所を埋めて、(1)タグの種類数、(2)出現回数の多い順の一覧、(3)最多タグを表示してください。`,
      code: `const articlesJson = '[{"title":"JS入門","tags":["js","入門"]},{"title":"Node実践","tags":["js","node"]},{"title":"非同期処理","tags":["js","node","async"]}]';

const articles = JSON.parse(articlesJson);

// すべてのタグを1つの配列に集める
const allTags = [];
for (const article of articles) {
  for (const tag of article.tags) {
    allTags.push(tag);
  }
}

// TODO: (1) Setを使ってタグの種類数を求める
const uniqueTags = null;

// TODO: (2) Mapを使ってタグごとの出現回数を数える
const counts = new Map();

// 出現回数の多い順に並べ替える
const sorted = Array.from(counts).sort(function (a, b) {
  return b[1] - a[1];
});

console.log("タグの種類: " + uniqueTags.size);
for (const [tag, count] of sorted) {
  console.log(tag + ": " + count);
}
// TODO: (3) 最多タグ（sortedの先頭のタグ名）を表示する
console.log("最多タグ: " + "");
`,
      solution: `const articlesJson = '[{"title":"JS入門","tags":["js","入門"]},{"title":"Node実践","tags":["js","node"]},{"title":"非同期処理","tags":["js","node","async"]}]';

const articles = JSON.parse(articlesJson);

// すべてのタグを1つの配列に集める
const allTags = [];
for (const article of articles) {
  for (const tag of article.tags) {
    allTags.push(tag);
  }
}

// (1) Setで重複を除き、タグの種類数を求める
const uniqueTags = new Set(allTags);

// (2) Mapでタグごとの出現回数を数える
const counts = new Map();
for (const tag of allTags) {
  if (counts.has(tag)) {
    counts.set(tag, counts.get(tag) + 1);
  } else {
    counts.set(tag, 1);
  }
}

// 出現回数の多い順に並べ替える
const sorted = Array.from(counts).sort(function (a, b) {
  return b[1] - a[1];
});

console.log("タグの種類: " + uniqueTags.size);
for (const [tag, count] of sorted) {
  console.log(tag + ": " + count);
}
// (3) 最多タグ（sortedの先頭のタグ名）を表示する
console.log("最多タグ: " + sorted[0][0]);
`,
      hints: [
        `種類数はnew Set(allTags)で重複を除けば求められます。`,
        `出現回数はallTagsをfor...ofで回し、counts.has(tag)で分岐して1を足すか初期値1を設定します。`,
        `sortedの各要素は[タグ名, 回数]の配列なので、先頭のタグ名はsorted[0][0]です。`
      ],
      expectedOutput: "js: 3"
    }
  ]
});
