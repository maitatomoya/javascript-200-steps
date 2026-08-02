// 第8章：オブジェクトの配列
registerChapter({
  number: 8,
  title: "オブジェクトの配列",
  description: "実務データの定番である「オブジェクトの配列」を、filter・map・find・sort・reduceで検索・変形・集計する実践的なテクニックを学びます。",
  steps: [
    {
      id: 71,
      title: "オブジェクトの配列を作る",
      explanation: `<p>第5〜6章の配列と第7章のオブジェクトを組み合わせると、実務データの最頻出形式である<strong>オブジェクトの配列</strong>になります。データベースから取得したユーザー一覧、APIが返す商品リスト、CSVを読み込んだ結果など、現場で扱うデータの大半はこの形をしています。</p>
<pre><code>const books = [
  { title: "JS入門", price: 2500 },
  { title: "配列の教科書", price: 1800 }
];</code></pre>
<p>「同じ形のオブジェクト」を配列に並べるのがポイントです。1冊の本はtitleとpriceを持つオブジェクトで表し、本の集まりを配列で表します。アクセスは2段階で考えます。</p>
<table>
  <tr><th>書き方</th><th>意味</th><th>結果の例</th></tr>
  <tr><td>books[0]</td><td>0番目の要素（オブジェクト）</td><td>{ title: "JS入門", price: 2500 }</td></tr>
  <tr><td>books[0].title</td><td>0番目の要素のtitleプロパティ</td><td>"JS入門"</td></tr>
  <tr><td>books.length</td><td>要素数（冊数）</td><td>2</td></tr>
</table>
<p>全要素を処理するには第5章で学んだ<code>for...of</code>が使えます。ループ変数には各要素、つまりオブジェクトが順に入ってくるので、その中でドット記法を使います。</p>
<pre><code>for (const book of books) {
  console.log(book.title + " - " + book.price + "円");
}</code></pre>
<p>「配列の要素を取り出す→オブジェクトのプロパティにアクセスする」という2段構えの感覚をつかめば、この章の残りのステップはすべてこの応用です。</p>`,
      task: `<code>books[1].title</code>で2冊目のタイトルを表示してください。さらに<code>for...of</code>で全ての本を「タイトル - 価格円」の形式で表示してください。`,
      code: `const books = [
  { title: "JS入門", price: 2500 },
  { title: "配列の教科書", price: 1800 },
  { title: "オブジェクト大全", price: 3200 }
];

console.log("1冊目:", books[0].title);
// TODO: 2冊目のタイトルを表示する

console.log("--- 蔵書一覧 ---");
// TODO: for...ofで全ての本を「タイトル - 価格円」の形式で表示する
`,
      solution: `const books = [
  { title: "JS入門", price: 2500 },
  { title: "配列の教科書", price: 1800 },
  { title: "オブジェクト大全", price: 3200 }
];

console.log("1冊目:", books[0].title);
console.log("2冊目:", books[1].title);

console.log("--- 蔵書一覧 ---");
for (const book of books) {
  console.log(book.title + " - " + book.price + "円");
}
`,
      hints: [
        `まずbooks[1]でオブジェクトを取り出し、続けて.titleでプロパティにアクセスします。`,
        `for (const book of books) { ... } の中では、bookが1冊分のオブジェクトになります。book.titleとbook.priceが使えます。`
      ],
      expectedOutput: "JS入門 - 2500円"
    },
    {
      id: 72,
      title: "filterで条件に合うオブジェクトを絞り込む",
      explanation: `<p>第6章で学んだ<code>filter</code>は、オブジェクトの配列でこそ真価を発揮します。「在庫のある商品だけ」「20歳以上のユーザーだけ」といった絞り込みは、実務で最も頻繁に書く処理の1つです。</p>
<pre><code>const products = [
  { name: "りんご", price: 150, category: "果物" },
  { name: "牛乳", price: 250, category: "飲料" },
  { name: "バナナ", price: 100, category: "果物" }
];

const fruits = products.filter((p) =&gt; p.category === "果物");
console.log(fruits.length); // 2</code></pre>
<p>コールバック関数の引数<code>p</code>には各要素、つまり商品オブジェクトが順に渡されます。数値の配列との違いは、条件式でプロパティにアクセスする点だけです。</p>
<table>
  <tr><th>対象</th><th>条件式の例</th></tr>
  <tr><td>数値の配列（第6章）</td><td>(n) =&gt; n &gt;= 80</td></tr>
  <tr><td>オブジェクトの配列</td><td>(p) =&gt; p.price &gt;= 80</td></tr>
</table>
<p>覚えておきたい特徴が2つあります。1つ目は、<code>filter</code>が返すのは<strong>新しい配列</strong>で、元の配列は変化しないことです（イミュータブルな操作）。2つ目は、結果の配列に入るのは条件を満たした<strong>オブジェクトそのもの</strong>なので、絞り込んだ後も<code>for...of</code>やドット記法がそのまま使えることです。</p>
<pre><code>for (const f of fruits) {
  console.log(f.name); // りんご、バナナ
}</code></pre>
<p>1つも合致しない場合は空配列<code>[]</code>が返り、エラーにはなりません。</p>`,
      task: `<code>filter</code>を使って、カテゴリが<code>"果物"</code>の商品だけの配列<code>fruits</code>と、価格が200円以下の商品だけの配列<code>cheap</code>を作ってください。`,
      code: `const products = [
  { name: "りんご", price: 150, category: "果物" },
  { name: "牛乳", price: 250, category: "飲料" },
  { name: "バナナ", price: 100, category: "果物" },
  { name: "パン", price: 220, category: "食品" }
];

// TODO: カテゴリが"果物"の商品だけに絞り込む
const fruits = products;

// TODO: 価格が200円以下の商品だけに絞り込む
const cheap = products;

console.log("果物は" + fruits.length + "種類");
for (const f of fruits) {
  console.log("果物: " + f.name);
}

console.log("200円以下は" + cheap.length + "種類");
for (const c of cheap) {
  console.log("お手頃: " + c.name + "（" + c.price + "円）");
}
`,
      solution: `const products = [
  { name: "りんご", price: 150, category: "果物" },
  { name: "牛乳", price: 250, category: "飲料" },
  { name: "バナナ", price: 100, category: "果物" },
  { name: "パン", price: 220, category: "食品" }
];

const fruits = products.filter((p) => p.category === "果物");

const cheap = products.filter((p) => p.price <= 200);

console.log("果物は" + fruits.length + "種類");
for (const f of fruits) {
  console.log("果物: " + f.name);
}

console.log("200円以下は" + cheap.length + "種類");
for (const c of cheap) {
  console.log("お手頃: " + c.name + "（" + c.price + "円）");
}
`,
      hints: [
        `filterのコールバックには商品オブジェクトが1つずつ渡されます。p.categoryやp.priceで条件を書きます。`,
        `文字列の一致は === で比較します。products.filter((p) => p.category === "果物") の形です。`
      ],
      expectedOutput: "果物は2種類"
    },
    {
      id: 73,
      title: "mapでプロパティを取り出す",
      explanation: `<p>「ユーザー一覧から名前だけの配列が欲しい」という場面では、第6章で学んだ<code>map</code>を使います。オブジェクトの配列から特定のプロパティだけを<strong>抽出</strong>する、実務で毎日書くパターンです。</p>
<pre><code>const users = [
  { name: "たろう", age: 25 },
  { name: "はなこ", age: 30 }
];

const names = users.map((u) =&gt; u.name);
console.log(names); // ["たろう", "はなこ"]</code></pre>
<p><code>map</code>はコールバックの戻り値を集めた新しい配列を返すので、<code>u.name</code>を返せば文字列の配列に、<code>u.age</code>を返せば数値の配列になります。「オブジェクトの配列」から「単純な値の配列」への変換と考えると分かりやすいでしょう。</p>
<p>複数のプロパティを組み合わせた文字列を作ることもできます。</p>
<pre><code>const labels = users.map((u) =&gt; u.name + "（" + u.age + "歳）");
console.log(labels.join(" / "));
// たろう（25歳） / はなこ（30歳）</code></pre>
<p>取り出した後の配列には、第5〜6章で学んだメソッドがすべて使えます。よく使う組み合わせを整理しておきます。</p>
<table>
  <tr><th>組み合わせ</th><th>用途</th></tr>
  <tr><td>map + join</td><td>一覧を区切り文字でつないで1行の文字列にする</td></tr>
  <tr><td>map + includes</td><td>特定の名前が含まれるか調べる</td></tr>
  <tr><td>filter + map</td><td>絞り込んでから必要なプロパティだけ取り出す（次ステップ以降で多用）</td></tr>
</table>`,
      task: `<code>map</code>で全ユーザーの名前だけの配列<code>names</code>を作ってください。さらに「名前（年齢歳）」形式の文字列の配列<code>labels</code>を作り、<code>join(" / ")</code>でつないで表示してください。`,
      code: `const users = [
  { name: "たろう", age: 25 },
  { name: "はなこ", age: 30 },
  { name: "けん", age: 22 }
];

// TODO: mapで名前だけの配列を作る
const names = users;

console.log(names);

// TODO: mapで「名前（年齢歳）」形式の文字列の配列を作る
const labels = users;

console.log(labels.join(" / "));
`,
      solution: `const users = [
  { name: "たろう", age: 25 },
  { name: "はなこ", age: 30 },
  { name: "けん", age: 22 }
];

const names = users.map((u) => u.name);

console.log(names);

const labels = users.map((u) => u.name + "（" + u.age + "歳）");

console.log(labels.join(" / "));
`,
      hints: [
        `mapのコールバックが返した値が新しい配列の要素になります。名前だけ欲しければ u.name を返します。`,
        `labelsは users.map((u) => u.name + "（" + u.age + "歳）") のように、+で連結した文字列を返します。`
      ],
      expectedOutput: "たろう（25歳） / はなこ（30歳） / けん（22歳）"
    },
    {
      id: 74,
      title: "findで1件だけ探す",
      explanation: `<p>「IDが2のユーザーを取得する」のように<strong>特定の1件</strong>を探すときは、第6章で学んだ<code>find</code>を使います。<code>filter</code>との違いを意識するのがポイントです。</p>
<table>
  <tr><th></th><th>find</th><th>filter</th></tr>
  <tr><td>返るもの</td><td>最初に条件を満たした<strong>要素そのもの</strong></td><td>条件を満たす要素の<strong>配列</strong></td></tr>
  <tr><td>見つからないとき</td><td>undefined</td><td>空配列 []</td></tr>
  <tr><td>向いている場面</td><td>IDで1件取得</td><td>条件で複数絞り込み</td></tr>
</table>
<pre><code>const users = [
  { id: 1, name: "たろう" },
  { id: 2, name: "はなこ" }
];

const user = users.find((u) =&gt; u.id === 2);
console.log(user.name); // はなこ</code></pre>
<p>注意すべきは<strong>見つからなかった場合</strong>です。<code>find</code>は<code>undefined</code>を返すため、そのまま<code>.name</code>にアクセスすると<code>TypeError</code>で実行が止まります。ここで第7章で学んだ<code>?.</code>と<code>??</code>の出番です。</p>
<pre><code>const missing = users.find((u) =&gt; u.id === 99);
console.log(missing.name);                    // TypeError！
console.log(missing?.name ?? "見つかりません"); // 安全</code></pre>
<p>「findの結果には?.を付けてアクセスする」を習慣にすると、存在しないIDが渡ってきても壊れない堅牢なコードになります。実務ではユーザー入力や外部データを扱うため、「見つからないケース」は必ず起こると考えて書くのがプロの姿勢です。</p>`,
      task: `<code>find</code>でIDが3のメンバーを探して名前を表示してください。IDが99の検索結果は<code>undefined</code>になるので、<code>?.</code>と<code>??</code>を使って「見つかりません」と表示されるように修正してください。`,
      code: `const members = [
  { id: 1, name: "さとう" },
  { id: 2, name: "すずき" },
  { id: 3, name: "たなか" }
];

// TODO: findでidが3のメンバーを探す
const member = members[0];

console.log("ID3:", member.name);

const missing = members.find((m) => m.id === 99);

// TODO: このままだとTypeError。?.と??で「見つかりません」と表示する
console.log("ID99:", missing.name);
`,
      solution: `const members = [
  { id: 1, name: "さとう" },
  { id: 2, name: "すずき" },
  { id: 3, name: "たなか" }
];

const member = members.find((m) => m.id === 3);

console.log("ID3:", member.name);

const missing = members.find((m) => m.id === 99);

console.log("ID99:", missing?.name ?? "見つかりません");
`,
      hints: [
        `members.find((m) => m.id === 3) で、条件を満たす最初の要素（オブジェクトそのもの）が返ります。`,
        `undefinedかもしれない値には missing?.name と?.でアクセスし、?? "見つかりません" でデフォルト値を与えます。`
      ],
      expectedOutput: "ID99: 見つかりません"
    },
    {
      id: 75,
      title: "sortでプロパティ順に並べ替える",
      explanation: `<p>第6章で学んだ<code>sort</code>の比較関数は、オブジェクトの配列でも同じ考え方で使えます。比較関数の中でプロパティにアクセスするだけです。</p>
<pre><code>const members = [
  { name: "さとう", score: 72 },
  { name: "すずき", score: 90 }
];

// スコアの昇順（小さい順）
members.sort((a, b) =&gt; a.score - b.score);
// スコアの降順（大きい順）
members.sort((a, b) =&gt; b.score - a.score);</code></pre>
<table>
  <tr><th>並べ方</th><th>比較関数</th></tr>
  <tr><td>数値プロパティの昇順</td><td>(a, b) =&gt; a.score - b.score</td></tr>
  <tr><td>数値プロパティの降順</td><td>(a, b) =&gt; b.score - a.score</td></tr>
  <tr><td>文字列プロパティの順</td><td>(a, b) =&gt; a.name.localeCompare(b.name)</td></tr>
</table>
<p>文字列のプロパティは引き算できないため、<code>localeCompare</code>（文字列同士を比較して-1・0・1相当の数値を返すメソッド）を使うのが定番です。</p>
<p>そして第6章の復習ですが、<code>sort</code>は<strong>元の配列自体を並べ替えてしまう</strong>（破壊的メソッド）という重大な注意点があります。元の順序を残したいときは、第5章で学んだスプレッド構文でコピーしてから並べ替えます。</p>
<pre><code>const ranked = [...members].sort((a, b) =&gt; b.score - a.score);
// membersの順序はそのまま、rankedだけ並べ替わる</code></pre>
<p>この<code>[...配列].sort(...)</code>は「元データを守りながら並べ替える」定番イディオムとして、そのまま覚えてしまいましょう。</p>`,
      task: `元の配列<code>members</code>を変更しないように、スプレッド構文でコピーしてからスコアの高い順に並べ替えた<code>ranked</code>を作り、順位付きで表示してください。`,
      code: `const members = [
  { name: "さとう", score: 72 },
  { name: "すずき", score: 90 },
  { name: "たなか", score: 85 }
];

// TODO: コピーしてからスコアの降順（高い順）に並べ替える
const ranked = members;

let rank = 1;
for (const m of ranked) {
  console.log(rank + "位: " + m.name + "（" + m.score + "点）");
  rank = rank + 1;
}

// 元の配列の先頭が変わっていないことを確認
console.log("元データの先頭: " + members[0].name);
`,
      solution: `const members = [
  { name: "さとう", score: 72 },
  { name: "すずき", score: 90 },
  { name: "たなか", score: 85 }
];

const ranked = [...members].sort((a, b) => b.score - a.score);

let rank = 1;
for (const m of ranked) {
  console.log(rank + "位: " + m.name + "（" + m.score + "点）");
  rank = rank + 1;
}

console.log("元データの先頭: " + members[0].name);
`,
      hints: [
        `[...members]でコピーを作り、そのコピーに対して.sort()を呼ぶと元の配列は変わりません。`,
        `降順の比較関数は (a, b) => b.score - a.score です。aとbの順序に注意しましょう。`
      ],
      expectedOutput: "1位: すずき（90点）"
    },
    {
      id: 76,
      title: "reduceでカテゴリ別に集計する",
      explanation: `<p>第6章の<code>reduce</code>では合計や最大値を求めましたが、実務で最も価値があるのは<strong>オブジェクトを累積値にした集計</strong>です。「カテゴリごとの売上合計」「部署ごとの人数」のようなグループ集計が、reduce1つで書けます。</p>
<pre><code>const sales = [
  { item: "りんご", category: "果物", amount: 300 },
  { item: "牛乳", category: "飲料", amount: 250 },
  { item: "バナナ", category: "果物", amount: 200 }
];

const totals = sales.reduce((acc, s) =&gt; {
  acc[s.category] = (acc[s.category] ?? 0) + s.amount;
  return acc;
}, {});
// { 果物: 500, 飲料: 250 }</code></pre>
<p>仕組みを分解して理解しましょう。</p>
<ol>
  <li>初期値に空オブジェクト<code>{}</code>を渡す（第2引数）</li>
  <li>各要素について、カテゴリ名をキーにした集計値を更新する。ここで第7章のブラケット記法<code>acc[s.category]</code>が活躍します（キー名が変数だからです）</li>
  <li>まだそのカテゴリのキーが無い初回は<code>undefined</code>なので、<code>?? 0</code>で0からスタートさせる</li>
  <li>必ず<code>return acc</code>で累積オブジェクトを次に引き継ぐ（忘れると次回のaccがundefinedになりエラー）</li>
</ol>
<p>集計結果はオブジェクトなので、表示には第7章で学んだ<code>Object.entries</code>と<code>for...of</code>の組み合わせを使います。</p>
<pre><code>for (const [category, total] of Object.entries(totals)) {
  console.log(category + ": " + total + "円");
}</code></pre>
<p>「reduceで集計してentriesで表示」は、レポート作成処理の黄金パターンです。</p>`,
      task: `<code>reduce</code>を使って、カテゴリごとの売上合計をまとめたオブジェクト<code>totals</code>を完成させてください。初回の<code>undefined</code>対策には<code>?? 0</code>を使います。`,
      code: `const sales = [
  { item: "りんご", category: "果物", amount: 300 },
  { item: "牛乳", category: "飲料", amount: 250 },
  { item: "バナナ", category: "果物", amount: 200 },
  { item: "コーヒー", category: "飲料", amount: 400 },
  { item: "みかん", category: "果物", amount: 150 }
];

const totals = sales.reduce((acc, s) => {
  // TODO: s.categoryをキーにしてs.amountを加算する
  // まだキーが無いときは?? 0で0から始める

  return acc;
}, {});

console.log("--- カテゴリ別売上 ---");
for (const [category, total] of Object.entries(totals)) {
  console.log(category + ": " + total + "円");
}
`,
      solution: `const sales = [
  { item: "りんご", category: "果物", amount: 300 },
  { item: "牛乳", category: "飲料", amount: 250 },
  { item: "バナナ", category: "果物", amount: 200 },
  { item: "コーヒー", category: "飲料", amount: 400 },
  { item: "みかん", category: "果物", amount: 150 }
];

const totals = sales.reduce((acc, s) => {
  acc[s.category] = (acc[s.category] ?? 0) + s.amount;
  return acc;
}, {});

console.log("--- カテゴリ別売上 ---");
for (const [category, total] of Object.entries(totals)) {
  console.log(category + ": " + total + "円");
}
`,
      hints: [
        `キー名が変数s.categoryに入っているので、ブラケット記法acc[s.category]でアクセスします。`,
        `acc[s.category] = (acc[s.category] ?? 0) + s.amount; の1行で「無ければ0から、あれば続きから」加算できます。`
      ],
      expectedOutput: "果物: 650円"
    },
    {
      id: 77,
      title: "ネストしたデータへのアクセス",
      explanation: `<p>実際のデータは「オブジェクトの中に配列、その中にまたオブジェクト」と何段にも入れ子（ネスト）になっています。APIのレスポンスはほぼ確実にこの形です。慌てずに<strong>外側から1段ずつ</strong>たどるのがコツです。</p>
<pre><code>const user = {
  name: "たろう",
  address: { city: "東京", zip: "100-0001" },
  tags: ["初心者", "JavaScript"]
};

console.log(user.address.city); // 東京（オブジェクトの中のオブジェクト）
console.log(user.tags[0]);      // 初心者（オブジェクトの中の配列）</code></pre>
<p>読み解くときは左から順に「userの→addressの→city」と声に出して追いかけます。型を意識するのが重要で、<code>user.address</code>まででオブジェクト、<code>user.tags</code>までで配列です。途中の型が分かれば、次に使える記法（ドットかブラケットか）も自然に決まります。</p>
<table>
  <tr><th>式</th><th>その時点の型</th><th>次に使う記法</th></tr>
  <tr><td>user</td><td>オブジェクト</td><td>.address や .tags</td></tr>
  <tr><td>user.tags</td><td>配列</td><td>[0] や .length</td></tr>
  <tr><td>user.tags[0]</td><td>文字列</td><td>.length など文字列の機能</td></tr>
</table>
<p>配列の中のオブジェクトも同じ要領です。<code>team.members[1].name</code>は「teamの→members配列の→1番目の→name」です。</p>
<p>深いネストほど途中が<code>undefined</code>である危険も増えます。第7章で学んだ<code>?.</code>は、まさにこのネストアクセスの安全装置として使われます。<code>user.address?.zip ?? "未登録"</code>のように、無いかもしれない階層に<code>?.</code>を挟みましょう。</p>`,
      task: `ネストしたデータから、リーダーの街（<code>members</code>の0番目の<code>address.city</code>）と、2人目のタグの1つ目を表示してください。<code>address</code>が無い2人目の街は<code>?.</code>と<code>??</code>で「未登録」と表示してください。`,
      code: `const team = {
  name: "開発チーム",
  members: [
    {
      name: "さとう",
      address: { city: "東京" },
      tags: ["リーダー", "バックエンド"]
    },
    {
      name: "すずき",
      tags: ["フロントエンド", "デザイン"]
    }
  ]
};

console.log("チーム名: " + team.name);

// TODO: 1人目（0番目）のaddress.cityを表示する
console.log("リーダーの街: ");

// TODO: 2人目（1番目）のtagsの1つ目（0番目）を表示する
console.log("すずきのタグ: ");

// TODO: 2人目にはaddressが無い。?.と??で「未登録」と表示する
console.log("すずきの街: " + team.members[1].address.city);
`,
      solution: `const team = {
  name: "開発チーム",
  members: [
    {
      name: "さとう",
      address: { city: "東京" },
      tags: ["リーダー", "バックエンド"]
    },
    {
      name: "すずき",
      tags: ["フロントエンド", "デザイン"]
    }
  ]
};

console.log("チーム名: " + team.name);

console.log("リーダーの街: " + team.members[0].address.city);

console.log("すずきのタグ: " + team.members[1].tags[0]);

console.log("すずきの街: " + (team.members[1].address?.city ?? "未登録"));
`,
      hints: [
        `外側から1段ずつたどります。team.members で配列、[0] で1人目のオブジェクト、.address.city で街です。`,
        `無いかもしれないaddressには team.members[1].address?.city のように?.を付け、?? "未登録" を続けます。`,
        `??の結果を+で連結するときは (…?.city ?? "未登録") とかっこで囲みます。`
      ],
      expectedOutput: "リーダーの街: 東京"
    },
    {
      id: 78,
      title: "mapでオブジェクトの形を変える",
      explanation: `<p>ステップ73では<code>map</code>でプロパティを「取り出し」ましたが、<strong>新しい形のオブジェクトを作って返す</strong>こともできます。「APIのデータを画面表示用の形に変換する」など、実務のデータ加工の中心となるテクニックです。</p>
<pre><code>const items = [
  { name: "ノート", price: 200 },
  { name: "ペン", price: 800 }
];

// 元のプロパティを保ちつつ、判定結果のプロパティを追加する
const withFlag = items.map((item) =&gt; ({ ...item, onSale: item.price &lt; 500 }));
// [{ name: "ノート", price: 200, onSale: true }, ...]</code></pre>
<p>ここには2つの重要ポイントがあります。</p>
<ol>
  <li><strong>オブジェクトを返すアロー関数はかっこで囲む</strong>：<code>(item) =&gt; { ... }</code>と書くと波かっこが「関数の本体」と解釈されてしまいます。オブジェクトリテラルを直接返すときは<code>(item) =&gt; ({ ... })</code>と丸かっこで包みます。忘れるとundefinedの配列ができる有名なハマりどころです。</li>
  <li><strong>スプレッド構文で元のプロパティを引き継ぐ</strong>：<code>{ ...item, onSale: ... }</code>とすれば、既存プロパティをコピーした上で新しいプロパティを追加できます。元のオブジェクトは変更されません（イミュータブルな変形）。</li>
</ol>
<p>プロパティを絞った「軽い」形に変換するのもよくあるパターンです。</p>
<pre><code>const summaries = items.map((item) =&gt; ({ label: item.name + "（" + item.price + "円）" }));</code></pre>
<table>
  <tr><th>変換パターン</th><th>書き方の例</th></tr>
  <tr><td>プロパティ追加</td><td>({ ...item, 新キー: 値 })</td></tr>
  <tr><td>プロパティ名の変更・絞り込み</td><td>({ label: item.name })</td></tr>
</table>`,
      task: `<code>map</code>とスプレッド構文で、各商品に<code>cheap</code>プロパティ（価格が500円未満ならtrue）を追加した配列<code>withFlag</code>を作ってください。オブジェクトを返すアロー関数のかっこに注意してください。`,
      code: `const items = [
  { name: "ノート", price: 200 },
  { name: "万年筆", price: 3000 },
  { name: "ペン", price: 150 }
];

// TODO: 各商品に cheap: 価格が500円未満かどうか を追加した新しい配列を作る
// ヒント: オブジェクトを返すアロー関数は (item) => ({ ... }) の形
const withFlag = items;

for (const item of withFlag) {
  if (item.cheap) {
    console.log(item.name + "はお手頃（" + item.price + "円）");
  } else {
    console.log(item.name + "は高級品（" + item.price + "円）");
  }
}

// 元のデータにcheapが追加されていないことを確認
console.log("元データにcheapはある?", "cheap" in items[0]);
`,
      solution: `const items = [
  { name: "ノート", price: 200 },
  { name: "万年筆", price: 3000 },
  { name: "ペン", price: 150 }
];

const withFlag = items.map((item) => ({ ...item, cheap: item.price < 500 }));

for (const item of withFlag) {
  if (item.cheap) {
    console.log(item.name + "はお手頃（" + item.price + "円）");
  } else {
    console.log(item.name + "は高級品（" + item.price + "円）");
  }
}

console.log("元データにcheapはある?", "cheap" in items[0]);
`,
      hints: [
        `items.map((item) => ({ ...item, cheap: 条件式 })) の形です。丸かっこでオブジェクトリテラルを包むのを忘れずに。`,
        `cheapの値は item.price < 500 という比較式の結果（true/false）をそのまま入れられます。`
      ],
      expectedOutput: "ノートはお手頃（200円）"
    },
    {
      id: 79,
      title: "複数条件での検索",
      explanation: `<p>実務の検索機能は「カテゴリが果物<strong>かつ</strong>200円以下」「東京<strong>または</strong>大阪在住」のように、条件が複数組み合わさります。第3章で学んだ論理演算子<code>&amp;&amp;</code>（かつ）と<code>||</code>（または）を、<code>filter</code>や<code>find</code>のコールバック内で使うだけです。</p>
<pre><code>// カテゴリが果物 かつ 200円以下
const result = products.filter(
  (p) =&gt; p.category === "果物" &amp;&amp; p.price &lt;= 200
);

// 飲料 または 食品
const result2 = products.filter(
  (p) =&gt; p.category === "飲料" || p.category === "食品"
);</code></pre>
<p>さらに一歩進めて、検索条件を引数で受け取る<strong>検索関数</strong>にすると再利用できて便利です。第4章の関数と組み合わせてみましょう。</p>
<pre><code>function searchProducts(products, category, maxPrice) {
  return products.filter(
    (p) =&gt; p.category === category &amp;&amp; p.price &lt;= maxPrice
  );
}

const found = searchProducts(products, "果物", 200);</code></pre>
<p>条件を組み立てるときの注意点をまとめます。</p>
<ul>
  <li>「AかつB」は<code>&amp;&amp;</code>、「AまたはB」は<code>||</code>。混在するときは丸かっこで優先順位を明示する</li>
  <li>文字列の比較は<code>===</code>を使う（<code>==</code>は型変換の罠があるため）</li>
  <li>該当が複数ほしいなら<code>filter</code>、最初の1件でよければ<code>find</code>を選ぶ</li>
</ul>`,
      task: `関数<code>searchProducts</code>を、カテゴリが一致し<strong>かつ</strong>価格が<code>maxPrice</code>以下の商品を返すように実装してください。呼び出し部分はそのまま使えます。`,
      code: `const products = [
  { name: "りんご", price: 150, category: "果物" },
  { name: "メロン", price: 1200, category: "果物" },
  { name: "牛乳", price: 250, category: "飲料" },
  { name: "バナナ", price: 100, category: "果物" },
  { name: "水", price: 100, category: "飲料" }
];

// TODO: categoryが一致し、かつpriceがmaxPrice以下の商品の配列を返す
function searchProducts(products, category, maxPrice) {
  return products;
}

const cheapFruits = searchProducts(products, "果物", 200);
console.log("200円以下の果物は" + cheapFruits.length + "件");
for (const p of cheapFruits) {
  console.log("- " + p.name + "（" + p.price + "円）");
}

const cheapDrinks = searchProducts(products, "飲料", 100);
console.log("100円以下の飲料は" + cheapDrinks.length + "件");
for (const p of cheapDrinks) {
  console.log("- " + p.name + "（" + p.price + "円）");
}
`,
      solution: `const products = [
  { name: "りんご", price: 150, category: "果物" },
  { name: "メロン", price: 1200, category: "果物" },
  { name: "牛乳", price: 250, category: "飲料" },
  { name: "バナナ", price: 100, category: "果物" },
  { name: "水", price: 100, category: "飲料" }
];

function searchProducts(products, category, maxPrice) {
  return products.filter(
    (p) => p.category === category && p.price <= maxPrice
  );
}

const cheapFruits = searchProducts(products, "果物", 200);
console.log("200円以下の果物は" + cheapFruits.length + "件");
for (const p of cheapFruits) {
  console.log("- " + p.name + "（" + p.price + "円）");
}

const cheapDrinks = searchProducts(products, "飲料", 100);
console.log("100円以下の飲料は" + cheapDrinks.length + "件");
for (const p of cheapDrinks) {
  console.log("- " + p.name + "（" + p.price + "円）");
}
`,
      hints: [
        `filterのコールバックの中で、2つの条件を&&でつなぎます。「かつ」なので両方を満たす必要があります。`,
        `p.category === category && p.price <= maxPrice が条件式です。引数の変数と各商品のプロパティを比較します。`
      ],
      expectedOutput: "200円以下の果物は2件"
    },
    {
      id: 80,
      title: "総合演習：社員名簿の集計レポート",
      explanation: `<p>第8章の総まとめとして、社員名簿から集計レポートを出力するプログラムを完成させます。実務の「管理画面のダッシュボード」や「月次レポート」で行う処理の縮図です。</p>
<h4>使う知識の整理</h4>
<table>
  <tr><th>処理</th><th>使う道具</th><th>学んだステップ</th></tr>
  <tr><td>部署ごとの人数を数える</td><td>reduce＋ブラケット記法＋?? 0</td><td>76</td></tr>
  <tr><td>開発部だけ取り出す</td><td>filter</td><td>72</td></tr>
  <tr><td>平均給与を求める</td><td>reduceで合計→lengthで割る</td><td>第6章56、72</td></tr>
  <tr><td>給与トップを求める</td><td>[...配列].sortで降順→先頭</td><td>75</td></tr>
  <tr><td>集計結果の表示</td><td>Object.entries＋for...of</td><td>69、76</td></tr>
</table>
<p>設計の道筋を先に描いてから書き始めるのがポイントです。</p>
<ol>
  <li><strong>人数集計</strong>：reduceで空オブジェクト<code>{}</code>から始め、<code>acc[e.dept]</code>に1ずつ足し込む</li>
  <li><strong>平均給与</strong>：まずfilterで開発部だけの配列を作り、reduceで給与を合計し、配列のlengthで割る。「絞る→集計する」の2段構え</li>
  <li><strong>トップ社員</strong>：スプレッド構文でコピーしてから降順ソートし、先頭<code>[0]</code>を取る。元の名簿の順序を壊さないため</li>
</ol>
<pre><code>// 平均の考え方
const devs = employees.filter((e) =&gt; e.dept === "開発");
const sum = devs.reduce((acc, e) =&gt; acc + e.salary, 0);
const average = sum / devs.length;</code></pre>
<p>1つの巨大な処理を書くのではなく、「絞り込み」「集計」「並べ替え」「表示」という小さな部品に分けて組み立てる感覚こそ、この章で身につけてほしい実務スキルです。</p>`,
      task: `TODOを3か所実装してください。(1)<code>reduce</code>で部署ごとの人数<code>counts</code>を集計、(2)開発部の平均給与<code>average</code>を計算、(3)コピーしてから給与の降順に並べ替えた<code>sorted</code>を作成、です。`,
      code: `const employees = [
  { name: "さとう", dept: "営業", salary: 320 },
  { name: "すずき", dept: "開発", salary: 400 },
  { name: "たかはし", dept: "営業", salary: 350 },
  { name: "たなか", dept: "開発", salary: 450 },
  { name: "いとう", dept: "人事", salary: 300 }
];

// TODO(1): reduceで部署ごとの人数を集計する（例: { 営業: 2, 開発: 2, 人事: 1 }）
const counts = {};

// TODO(2): 開発部だけをfilterで取り出し、reduceで合計した給与をlengthで割る
const devs = employees;
const average = 0;

// TODO(3): スプレッド構文でコピーしてから給与の降順に並べ替える
const sorted = employees;

console.log("=== 社員名簿レポート ===");
for (const [dept, count] of Object.entries(counts)) {
  console.log(dept + ": " + count + "人");
}
console.log("開発部の平均給与: " + average + "万円");
console.log("給与トップ: " + sorted[0].name + "（" + sorted[0].salary + "万円）");
console.log("名簿の先頭: " + employees[0].name);
`,
      solution: `const employees = [
  { name: "さとう", dept: "営業", salary: 320 },
  { name: "すずき", dept: "開発", salary: 400 },
  { name: "たかはし", dept: "営業", salary: 350 },
  { name: "たなか", dept: "開発", salary: 450 },
  { name: "いとう", dept: "人事", salary: 300 }
];

const counts = employees.reduce((acc, e) => {
  acc[e.dept] = (acc[e.dept] ?? 0) + 1;
  return acc;
}, {});

const devs = employees.filter((e) => e.dept === "開発");
const average = devs.reduce((acc, e) => acc + e.salary, 0) / devs.length;

const sorted = [...employees].sort((a, b) => b.salary - a.salary);

console.log("=== 社員名簿レポート ===");
for (const [dept, count] of Object.entries(counts)) {
  console.log(dept + ": " + count + "人");
}
console.log("開発部の平均給与: " + average + "万円");
console.log("給与トップ: " + sorted[0].name + "（" + sorted[0].salary + "万円）");
console.log("名簿の先頭: " + employees[0].name);
`,
      hints: [
        `人数集計はステップ76と同じ形です。加算する値が金額ではなく1になるだけです。`,
        `平均は「filterで絞る→reduce((acc, e) => acc + e.salary, 0)で合計→devs.lengthで割る」の3段階です。`,
        `並べ替えは [...employees].sort((a, b) => b.salary - a.salary) です。コピーを忘れると名簿の順序が壊れます。`
      ],
      expectedOutput: "開発部の平均給与: 425万円"
    }
  ]
});
