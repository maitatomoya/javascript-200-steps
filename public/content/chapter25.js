// 第25章：よくあるエラー：実行時と論理
registerChapter({
  number: 25,
  title: "よくあるエラー：実行時と論理",
  description: "エラーメッセージが出ない、あるいは出ても原因が離れた場所にある「実行時の罠」と「論理バグ」を修復する訓練をします。よくあるエラー50選の最終章であり、200ステップの卒業章です。",
  steps: [
    {
      id: 241,
      title: "スプレッドは浅いコピー",
      explanation: `<p>最終章へようこそ。この章で扱うのは、<strong>エラーメッセージが出ないバグ</strong>が中心です。プログラムは正常終了するのに結果がおかしい。実務で最も時間を奪うのはこのタイプです。</p>
<p>最初の罠は「コピーしたつもりが繋がっていた」問題です。スプレッド構文やObject.assignが行うのは<strong>浅いコピー（シャローコピー：1段目のプロパティだけを複製すること）</strong>です。1段目の値がオブジェクトや配列の場合、複製されるのは<strong>参照（実体の場所を指す情報）だけ</strong>で、実体は元と共有されたままになります。</p>
<pre><code>const original = { name: "たろう", tags: ["初級"] };
const copy = { ...original };

copy.name = "はなこ";     // 1段目の書き換え → originalは無事
copy.tags.push("追加");   // 2段目の書き換え → original.tagsも変わる!</code></pre>
<p>copy.nameへの代入はcopy自身のプロパティを差し替えるだけですが、copy.tags.pushは<strong>共有されている配列そのもの</strong>を変更するため、originalにも影響します。エラーは一切出ないため、「別の場所のデータがいつの間にか壊れている」という形で発覚します。</p>
<h4>修正パターン</h4>
<ul>
<li>ネストした部分を個別にコピーする：<code>{ ...original, tags: original.tags.slice() }</code></li>
<li>深いコピー（ネストの奥まで複製すること）を作る：<code>structuredClone(original)</code>（Node.js 17以降・モダンブラウザで使用可）</li>
</ul>
<p>「コピーを編集したのに元が変わった」と感じたら、まず浅いコピーを疑ってください。</p>`,
      task: `編集用の<code>copy</code>を変更しても<code>original</code>が変わらないように、コピーの作り方を修正しましょう。最後の行が「originalは無傷: true」になれば成功です。`,
      code: `// 会員データをコピーして、コピー側だけを編集したい
const original = { name: "たろう", tags: ["初級", "会員"] };

// コピーを作る（このコピーの作り方に問題がある）
const copy = { ...original };

copy.name = "はなこ";
copy.tags.push("編集済み");

console.log("copy.tags: " + copy.tags.join(", "));
console.log("original.tags: " + original.tags.join(", "));
// originalのtagsが2件のままなら無傷
console.log("originalは無傷: " + (original.tags.length === 2));`,
      solution: `// 会員データをコピーして、コピー側だけを編集したい
const original = { name: "たろう", tags: ["初級", "会員"] };

// tagsは別の配列として複製する（ネスト部分を個別にコピー）
const copy = { ...original, tags: original.tags.slice() };

copy.name = "はなこ";
copy.tags.push("編集済み");

console.log("copy.tags: " + copy.tags.join(", "));
console.log("original.tags: " + original.tags.join(", "));
// originalのtagsが2件のままなら無傷
console.log("originalは無傷: " + (original.tags.length === 2));`,
      hints: [
        `スプレッド構文は1段目しか複製しません。tagsという配列の「実体」がoriginalとcopyで共有されているのが原因です。`,
        `コピーを作るときに、tagsだけはoriginal.tags.slice()で新しい配列に差し替えましょう。structuredClone(original)でも直せます。`
      ],
      expectedOutput: "originalは無傷: true"
    },
    {
      id: 242,
      title: "sliceとspliceの混同",
      explanation: `<p>名前が1文字しか違わない<code>slice</code>と<code>splice</code>は、JavaScriptで最も混同されやすいメソッドのペアです。</p>
<table>
<tr><th>メソッド</th><th>元の配列</th><th>返り値</th><th>用途</th></tr>
<tr><td>slice(開始, 終了)</td><td><strong>変更しない</strong></td><td>切り出した新しい配列</td><td>一部を取り出す</td></tr>
<tr><td>splice(開始, 個数)</td><td><strong>変更する（破壊的）</strong></td><td>削除した要素の配列</td><td>削除・挿入する</td></tr>
</table>
<p>厄介なのは、<strong>返り値がどちらも「取り出した要素の配列」に見える</strong>ことです。次のコードは一見どちらも正しく動きます。</p>
<pre><code>const arr = ["a", "b", "c", "d"];
arr.slice(0, 2);   // ["a", "b"] を返す。arrは4件のまま
arr.splice(0, 2);  // ["a", "b"] を返す。だがarrは["c", "d"]になる!</code></pre>
<p>spliceを使ってしまうと、取り出した瞬間には正しい結果が得られるため気づかず、<strong>あとで元の配列を使う処理が壊れる</strong>という時間差のバグになります。エラーメッセージは出ません。</p>
<h4>見分け方と対策</h4>
<ul>
<li>sliceは「スライスチーズを切り分ける」イメージ。元の塊は残る（非破壊）</li>
<li>spliceは「継ぎ接ぎ（スプライス）」で、配列そのものを編集する（破壊的）</li>
<li>「取り出したいだけ」ならslice。「元から削除したい」ときだけsplice</li>
</ul>
<p>「配列の中身が知らないうちに減っている」と感じたら、途中のspliceを疑ってください。</p>`,
      task: `先頭2件を「表示用に取り出すだけ」のつもりが、元の配列から削除されてしまっています。元の配列<code>fruits</code>が4件のまま残るように修正しましょう。`,
      code: `const fruits = ["りんご", "みかん", "ぶどう", "もも"];

// 先頭2件を取り出して表示したいだけ（元の配列は残したい）
const top2 = fruits.splice(0, 2);

console.log("top2: " + top2.join(", "));
// 元の配列が2件に減ってしまっている!
console.log("元の配列: " + fruits.join(", "));`,
      solution: `const fruits = ["りんご", "みかん", "ぶどう", "もも"];

// sliceは元の配列を変更せずに切り出す（非破壊）
const top2 = fruits.slice(0, 2);

console.log("top2: " + top2.join(", "));
// 元の配列は4件のまま残っている
console.log("元の配列: " + fruits.join(", "));`,
      hints: [
        `spliceは元の配列から要素を「削除」する破壊的メソッドです。取り出すだけなら別のメソッドがあります。`,
        `fruits.slice(0, 2)に変えると、元の配列を変更せずに先頭2件のコピーを取り出せます。`
      ],
      expectedOutput: "元の配列: りんご, みかん, ぶどう, もも"
    },
    {
      id: 243,
      title: "sortは元の配列を破壊する",
      explanation: `<p><code>sort</code>にはspliceと同じ罠があります。<strong>sortは元の配列をその場で並び替える破壊的メソッド</strong>で、返り値は新しい配列ではなく「並び替えられた元の配列そのもの」です。</p>
<pre><code>const prices = [300, 120, 980];
const sorted = prices.sort(function (a, b) { return a - b; });
// sortedとpricesは同じ実体を指している
// pricesも[120, 300, 980]に変わってしまっている</code></pre>
<p>返り値を別の変数に代入しているので「コピーを並び替えた」ように見えますが、実際は<strong>同じ配列に2つの名前が付いただけ</strong>です。「入荷順」「登録順」など元の順序に意味があるデータでは、これが深刻な論理バグになります。</p>
<h4>修正パターン</h4>
<table>
<tr><th>破壊的メソッド</th><th>非破壊の代替（ES2023）</th><th>従来の書き方</th></tr>
<tr><td>sort()</td><td>toSorted()</td><td>slice().sort()</td></tr>
<tr><td>reverse()</td><td>toReversed()</td><td>slice().reverse()</td></tr>
<tr><td>splice()</td><td>toSpliced()</td><td>slice()の組み合わせ</td></tr>
</table>
<p>ES2023（Node.js 20やモダンブラウザで使用可）で追加された<code>toSorted</code>は、<strong>コピーを作ってから並び替えて返す</strong>非破壊版のsortです。古い環境も考慮するなら<code>slice().sort(...)</code>で「先にコピーしてから並び替える」書き方が定番です。どちらも比較関数の書き方はsortと同じです。</p>`,
      task: `並び替えた結果を<code>sorted</code>に入れたら、元の<code>prices</code>まで並び替わってしまいました。<code>prices</code>が入荷順（300, 120, 980, 450）のまま残るように修正しましょう。`,
      code: `// 入荷順の価格リスト。この順序は保ったまま、安い順の一覧も作りたい
const prices = [300, 120, 980, 450];

// sortは元の配列を破壊してしまう
const sorted = prices.sort(function (a, b) {
  return a - b;
});

console.log("安い順: " + sorted.join(", "));
// 入荷順のはずが、並び替わってしまっている!
console.log("入荷順: " + prices.join(", "));`,
      solution: `// 入荷順の価格リスト。この順序は保ったまま、安い順の一覧も作りたい
const prices = [300, 120, 980, 450];

// toSortedはコピーを並び替えて返す（元の配列は変更しない）
const sorted = prices.toSorted(function (a, b) {
  return a - b;
});

console.log("安い順: " + sorted.join(", "));
// 入荷順はそのまま残っている
console.log("入荷順: " + prices.join(", "));`,
      hints: [
        `sortの返り値は「並び替えられた元の配列そのもの」です。sortedとpricesは同じ実体を指しています。`,
        `prices.toSorted(...)に変えるか、prices.slice().sort(...)で先にコピーを作ってから並び替えましょう。`
      ],
      expectedOutput: "入荷順: 300, 120, 980, 450"
    },
    {
      id: 244,
      title: "オブジェクトのキーは文字列",
      explanation: `<p>オブジェクトのキーに数値を書いても、<strong>内部ではすべて文字列に変換されて保存されます</strong>。<code>{ 1: "りんご" }</code>と書いても、実際のキーは文字列の<code>"1"</code>です。</p>
<pre><code>const stock = { 1: "りんご" };
Object.keys(stock);   // ["1"] ← 文字列の配列が返る
stock[1];             // "りんご" ← 読み取りは数値でもOK（自動で文字列化）</code></pre>
<p>読み書きのときは<code>stock[1]</code>と数値で書いても自動変換されるため、普段は問題に気づきません。罠が発動するのは<strong>Object.keysで取り出したキーを厳密等価<code>===</code>で数値と比較したとき</strong>です。</p>
<pre><code>for (const id of Object.keys(stock)) {
  if (id === 1) { ... }   // "1" === 1 は型が違うのでfalse
}</code></pre>
<p>第22章で見たとおり、<code>===</code>は型まで一致しないとtrueになりません。条件が一度も成立しないままループが終わるだけなので、<strong>エラーは出ず「何も表示されない」という症状</strong>になります。</p>
<h4>修正パターン</h4>
<ul>
<li>文字列同士で比較する：<code>id === "1"</code></li>
<li>数値に変換してから比較する：<code>Number(id) === 1</code></li>
</ul>
<p>また、キーを使った計算<code>id + 1</code>も<code>"1" + 1</code>で<code>"11"</code>になる（第22章の暗黙変換）ので、キーで計算するときは必ずNumberで数値に戻してからにしましょう。</p>`,
      task: `ID1の商品を表示するはずの<code>if</code>文が一度も成立していません。Object.keysが返すキーの型を考えて、比較を修正しましょう。`,
      code: `// 商品IDから商品名を引く在庫表
const stock = { 1: "りんご", 2: "みかん", 3: "ぶどう" };

// ID1の商品を探して表示したいのに、何も表示されない
for (const id of Object.keys(stock)) {
  if (id === 1) {
    console.log("ID1の商品: " + stock[id]);
  }
}
console.log("チェック完了");`,
      solution: `// 商品IDから商品名を引く在庫表
const stock = { 1: "りんご", 2: "みかん", 3: "ぶどう" };

// Object.keysのキーは文字列なので、数値に変換してから比較する
for (const id of Object.keys(stock)) {
  if (Number(id) === 1) {
    console.log("ID1の商品: " + stock[id]);
  }
}
console.log("チェック完了");`,
      hints: [
        `Object.keys(stock)が返すのは["1", "2", "3"]という文字列の配列です。"1" === 1は型が違うためfalseになります。`,
        `Number(id) === 1と数値に変換して比較するか、id === "1"と文字列同士で比較しましょう。`
      ],
      expectedOutput: "ID1の商品: りんご"
    },
    {
      id: 245,
      title: "Dateの月は0から始まる",
      explanation: `<p>Dateオブジェクトには、JavaScript最古の罠のひとつがあります。<strong>月だけが0始まり</strong>なのです（0が1月、11が12月）。年と日は普通の数え方なので、この非対称が事故を生みます。</p>
<table>
<tr><th>部分</th><th>コンストラクタに渡す値</th><th>取得メソッド</th><th>注意</th></tr>
<tr><td>年</td><td>2026 → 2026年</td><td>getFullYear()</td><td>そのまま</td></tr>
<tr><td>月</td><td><strong>11 → 12月</strong></td><td><strong>getMonth()は0〜11を返す</strong></td><td>0始まり!</td></tr>
<tr><td>日</td><td>25 → 25日</td><td>getDate()</td><td>1始まり</td></tr>
</table>
<p>さらに厄介なことに、範囲外の月を渡しても<strong>エラーにならず翌年に繰り上がります</strong>。</p>
<pre><code>// 12月のつもりで12を渡すと…
const d = new Date(2026, 12, 25);
d.getFullYear();   // 2027 ← 翌年の1月25日に繰り上がる!</code></pre>
<p>12は「0始まりの13番目の月」なので、翌年1月として解釈されるのです。エラーが出ないため、<strong>日付が1ヶ月（場合によっては1年）ずれる</strong>という静かなバグになります。</p>
<h4>対策</h4>
<ul>
<li>コンストラクタに渡す月は「表示したい月 - 1」（12月なら11）</li>
<li>getMonth()の結果を表示するときは「+ 1」</li>
<li>「入口で-1、出口で+1」とセットで覚える</li>
</ul>
<p>日付ずれのバグを見たら、まず月の0始まりを疑うのが定石です。</p>`,
      task: `2026年12月25日を表示するはずが、翌年の1月25日になってしまっています。コンストラクタに渡す月の値を修正しましょう。`,
      code: `// 2026年12月25日（クリスマス）を表示したい
const xmas = new Date(2026, 12, 25);

// 2027年1月25日と表示されてしまう!
console.log(
  xmas.getFullYear() + "年" +
  (xmas.getMonth() + 1) + "月" +
  xmas.getDate() + "日"
);`,
      solution: `// 2026年12月25日（クリスマス）を表示したい
// 月は0始まりなので、12月は11を渡す
const xmas = new Date(2026, 11, 25);

// getMonth()も0始まりなので、表示時に+1する
console.log(
  xmas.getFullYear() + "年" +
  (xmas.getMonth() + 1) + "月" +
  xmas.getDate() + "日"
);`,
      hints: [
        `Dateの月は0が1月、11が12月です。12を渡すと「翌年の1月」に繰り上がってしまいます。`,
        `new Date(2026, 11, 25)に修正しましょう。表示側のgetMonth() + 1はそのままで正しいです。`
      ],
      expectedOutput: "2026年12月25日"
    },
    {
      id: 246,
      title: "0.1+0.2は0.3ではない",
      explanation: `<p>電卓では当たり前の<code>0.1 + 0.2 = 0.3</code>が、JavaScriptでは成立しません。</p>
<pre><code>0.1 + 0.2            // 0.30000000000000004
0.1 + 0.2 === 0.3    // false!</code></pre>
<p>これはJavaScriptのバグではなく、<strong>浮動小数点数（IEEE 754という規格の、2進数で小数を表す方式）の宿命</strong>です。10進数の0.1や0.2は、2進数では割り切れない無限小数になるため、コンピュータはわずかに誤差を含んだ近似値で計算します。その誤差が足し算で表面化したのが上の結果です。PythonでもJavaでも同じことが起きます。</p>
<p>危険なのは、この誤差を含む値を<code>===</code>で比較したときです。見た目は等しいはずの値がfalseになり、<strong>「合計チェックが通らない」「割引条件が発動しない」</strong>といった論理バグになります。</p>
<h4>修正パターン</h4>
<ul>
<li><strong>許容誤差で比較する</strong>：差の絶対値が十分小さければ等しいとみなす<br><code>Math.abs(a - b) &lt; 1e-9</code>（JavaScriptには基準値としてNumber.EPSILONも用意されています）</li>
<li><strong>整数にして計算する</strong>：金額なら「円」ではなく「銭」、つまり10倍・100倍して整数で計算し、表示時に戻す</li>
<li><strong>toFixedは表示専用</strong>：文字列を返すので計算には使わない</li>
</ul>
<p>「小数を===で比較しない」はどの言語でも通用する鉄則です。</p>`,
      task: `<code>0.1 + 0.2</code>と<code>0.3</code>の比較が失敗しています。<code>===</code>ではなく許容誤差を使った比較に修正して、「合計は0.3です」と表示させましょう。`,
      code: `// 0.1kgと0.2kgの合計が0.3kgちょうどか確認したい
const total = 0.1 + 0.2;
console.log("計算結果: " + total);

// 誤差のせいでelse側に入ってしまう
if (total === 0.3) {
  console.log("合計は0.3です");
} else {
  console.log("合計が合いません");
}`,
      solution: `// 0.1kgと0.2kgの合計が0.3kgちょうどか確認したい
const total = 0.1 + 0.2;
console.log("計算結果: " + total);

// 差が十分小さければ等しいとみなす（許容誤差での比較）
if (Math.abs(total - 0.3) < 1e-9) {
  console.log("合計は0.3です");
} else {
  console.log("合計が合いません");
}`,
      hints: [
        `0.1 + 0.2は内部的に0.30000000000000004なので、===では一致しません。「差がほぼゼロか」で判定します。`,
        `Math.abs(total - 0.3) < 1e-9のように、差の絶対値が十分小さいかを条件にしましょう。`
      ],
      expectedOutput: "合計は0.3です"
    },
    {
      id: 247,
      title: "off-by-oneエラー",
      explanation: `<p>「1つずれ」を意味する<strong>off-by-oneエラー</strong>は、プログラミング史上最も多発しているバグと言われます。原因は、配列の<code>length</code>が3のとき、<strong>有効な添字は0〜2まで</strong>という「個数と添字のずれ」です。</p>
<pre><code>const arr = ["a", "b", "c"];   // length は 3
arr[2]   // "c" ← 最後の要素
arr[3]   // undefined ← 範囲外。エラーにはならない!</code></pre>
<p>第22章で見たとおり、範囲外アクセス自体はundefinedを返すだけです。しかしそのundefinedに対してプロパティを読むと、そこで初めてエラーになります。</p>
<pre><code>TypeError: Cannot read properties of undefined (reading 'length')</code></pre>
<p>このエラーメッセージの読み方はもう身についているはずです。「undefinedの<code>length</code>を読もうとした」→「なぜundefinedが来たのか」と遡ると、<code>i &lt;= arr.length</code>という条件にたどり着きます。<code>&lt;=</code>だとiがlengthと同じ値（範囲外）まで進んでしまうのです。</p>
<h4>対策</h4>
<ul>
<li>添字ループの条件は<code>i &lt; arr.length</code>が原則。<code>&lt;=</code>を書いたら一度疑う</li>
<li>ループの最初と最後の回を頭の中で実行してみる（i=0のときとi=length-1のとき）</li>
<li>添字が不要なら<code>for...of</code>を使えば、そもそもずれが起きない</li>
</ul>
<p>「最後の1回だけ失敗する」「1件多い・少ない」という症状を見たら、まずoff-by-oneを疑いましょう。</p>`,
      task: `最後の周回で<code>undefined</code>にアクセスしてTypeErrorが発生しています。ループの条件を修正して、3名全員の表示と最後の報告まで完走させましょう。`,
      code: `// 参加者を順番に表示して、最後に人数を報告したい
const runners = ["たろう", "はなこ", "じろう"];

// 最後の周回でrunners[3]（undefined）にアクセスしてしまう
for (let i = 0; i <= runners.length; i++) {
  console.log((i + 1) + "番: " + runners[i] + "（" + runners[i].length + "文字）");
}
console.log("全" + runners.length + "名を表示しました");`,
      solution: `// 参加者を順番に表示して、最後に人数を報告したい
const runners = ["たろう", "はなこ", "じろう"];

// 添字は0〜length-1まで。条件は i < length が原則
for (let i = 0; i < runners.length; i++) {
  console.log((i + 1) + "番: " + runners[i] + "（" + runners[i].length + "文字）");
}
console.log("全" + runners.length + "名を表示しました");`,
      hints: [
        `lengthが3のとき、有効な添字は0・1・2です。i <= 3だとi = 3の周回でrunners[3]（undefined）を触ってしまいます。`,
        `ループ条件をi < runners.lengthに変えれば、範囲内だけを回れます。`
      ],
      expectedOutput: "全3名を表示しました"
    },
    {
      id: 248,
      title: "配列は===で比較できない",
      explanation: `<p>数値や文字列では当たり前に使ってきた<code>===</code>が、配列やオブジェクトでは期待どおりに動きません。</p>
<pre><code>[1, 2, 3] === [1, 2, 3]   // false!
{} === {}                  // false!
"abc" === "abc"            // true（プリミティブは中身で比較）</code></pre>
<p>理由は第241ステップでも登場した<strong>参照</strong>です。<code>===</code>は配列やオブジェクトに対して「中身が同じか」ではなく<strong>「同じ実体を指しているか」</strong>を比較します。別々に作った配列は、中身がまったく同じでも別の実体なので必ずfalseになります。</p>
<p>この罠から生まれる典型的なバグが2つあります。</p>
<ul>
<li><strong>答え合わせが常に不正解</strong>：<code>guess === answer</code>は別実体同士なのでfalse</li>
<li><strong>空チェックが常に失敗</strong>：<code>arr === []</code>は「いま作った新しい空配列」と比べるので必ずfalse</li>
</ul>
<h4>修正パターン</h4>
<table>
<tr><th>やりたいこと</th><th>正しい書き方</th></tr>
<tr><td>空かどうか調べる</td><td><code>arr.length === 0</code></td></tr>
<tr><td>中身が同じか調べる（単純な値の配列）</td><td><code>a.join(",") === b.join(",")</code></td></tr>
<tr><td>中身が同じか調べる（ネストあり）</td><td><code>JSON.stringify(a) === JSON.stringify(b)</code></td></tr>
</table>
<p>joinやJSON.stringifyで<strong>いったん文字列に変換すれば、プリミティブとして中身を比較できる</strong>のがポイントです（要素の順序が同じであることが前提です）。</p>`,
      task: `中身がまったく同じなのに「不正解」と判定されてしまいます。配列同士を<code>===</code>で直接比較せず、中身を比較する方法に修正して「正解！」を表示させましょう。`,
      code: `// クイズの答え合わせ：選んだ番号が正解と一致するか判定したい
const answer = [1, 3, 4];
const guess = [1, 3, 4];

// 中身は同じなのに「不正解」になってしまう
if (guess === answer) {
  console.log("正解！");
} else {
  console.log("不正解…");
}`,
      solution: `// クイズの答え合わせ：選んだ番号が正解と一致するか判定したい
const answer = [1, 3, 4];
const guess = [1, 3, 4];

// 文字列に変換して「中身」を比較する
if (guess.join(",") === answer.join(",")) {
  console.log("正解！");
} else {
  console.log("不正解…");
}`,
      hints: [
        `===は配列に対して「同じ実体か」を比較します。別々に作った配列は中身が同じでも必ずfalseです。`,
        `guess.join(",") === answer.join(",")のように文字列に変換すれば中身で比較できます。JSON.stringify同士の比較でも構いません。`
      ],
      expectedOutput: "正解！"
    },
    {
      id: 249,
      title: "終わらないループ",
      explanation: `<p>プログラムが応答しなくなり、出力も止まったまま。<strong>無限ループ</strong>はエラーメッセージが出ない（出せない）バグの代表です。原因はほぼ次の3パターンに分類できます。</p>
<table>
<tr><th>パターン</th><th>例</th></tr>
<tr><td>更新を忘れた</td><td>while内で<code>i++</code>を書き忘れる</td></tr>
<tr><td>更新が条件に到達しない</td><td>下のコード例。値が終了値を飛び越える</td></tr>
<tr><td>条件が常にtrue</td><td><code>while (true)</code>にbreakがない</td></tr>
</table>
<p>特に見落としやすいのが2つ目の「飛び越え」です。</p>
<pre><code>let count = 10;
while (count !== 0) {
  count = count - 3;   // 10 → 7 → 4 → 1 → -2 → …
}</code></pre>
<p>3ずつ減らすと10, 7, 4, 1, -2…と変化し、<strong>ちょうど0になる瞬間が一度も来ません</strong>。条件<code>count !== 0</code>は永遠にtrueのままです。書いた本人は「0になったら止まる」と信じているので、なかなか気づけません。</p>
<h4>対策</h4>
<ul>
<li>終了条件には<code>!==</code>のような「一点狙い」ではなく、<code>count &gt; 0</code>のような<strong>範囲で判定する不等号</strong>を使う。飛び越えても必ず止まる</li>
<li>怪しいループの中に<code>console.log</code>を入れて変数の変化を観察する</li>
<li>実行が止まらないときはCtrl+C（実行環境の停止操作）で強制終了してから調べる</li>
</ul>
<p>「終了条件は等号ではなく不等号で書く」は、無限ループを未然に防ぐ防御的プログラミングの基本です。</p>`,
      task: `<code>count</code>が0ちょうどにならないため、ループが永遠に終わりません。終了条件を「一点狙い」から「範囲の判定」に修正して、「終了: count = -2」まで到達させましょう。`,
      code: `// 10から3ずつ減らしていき、0以下になったら終了したい
let count = 10;

// countは 10 → 7 → 4 → 1 → -2 → … と0を飛び越えるので
// この条件は永遠にtrueのまま（無限ループ!）
while (count !== 0) {
  count = count - 3;
}

console.log("終了: count = " + count);`,
      solution: `// 10から3ずつ減らしていき、0以下になったら終了したい
let count = 10;

// 「0より大きい間は続ける」と範囲で判定すれば、飛び越えても必ず止まる
while (count > 0) {
  count = count - 3;
}

console.log("終了: count = " + count);`,
      hints: [
        `countは10, 7, 4, 1, -2…と変化します。0ちょうどになる瞬間がないため、count !== 0が永遠にtrueです。`,
        `条件をcount > 0に変えましょう。「0より大きい間だけ続ける」なら、0を飛び越えても必ずループを抜けられます。`
      ],
      expectedOutput: "終了: count = -2"
    },
    {
      id: 250,
      title: "卒業課題：バグだらけのプログラムを完全修復",
      explanation: `<p>いよいよ最後のステップです。テスト結果レポートを作るプログラムに、<strong>この50選で学んだバグが6個</strong>仕込まれています。エラーで止まるものは1つもなく、すべて「動くのに結果がおかしい」論理バグです。実務のデバッグと同じように、<strong>期待する出力と実際の出力を1行ずつ見比べて</strong>原因を特定してください。</p>
<h4>期待する出力</h4>
<pre><code>実施日: 8月10日
トップ3:
1位: 100点
2位: 90点
3位: 78点
受験順: 90, 5, 63, 100, 41, 78
平均点: 62.8点
0点の受験者はいません</code></pre>
<h4>デバッグの手順（実務と同じ）</h4>
<ol>
<li>まず実行して、期待する出力とのずれを<strong>全部</strong>書き出す（1つ直して満足しない）</li>
<li>ずれの1つひとつについて「どの行が原因か」を仮説を立てて特定する</li>
<li>1箇所直すたびに再実行して、他のずれに影響していないか確認する</li>
</ol>
<h4>この章の復習ポイント</h4>
<ul>
<li>日付の表示がずれるのはなぜだったか（第245ステップ）</li>
<li>数値の並び替えで比較関数を省略するとどうなるか（第23章・第250ステップの前提知識）</li>
<li>sortが元の配列に何をするか（第243ステップ）</li>
<li>ループの回数が1つ多いときに疑うことは（第247ステップ）</li>
<li>合計の変数を初期化しないとどうなるか（undefined + 数値 = NaN、第22章）</li>
<li>空配列の判定に===を使うとどうなるか（第248ステップ）</li>
</ul>
<p>全部直せたら、あなたは200ステップとエラー50選を完走したことになります。<strong>エラーメッセージと出力のずれは、敵ではなく最高の手がかりです。</strong>この感覚を持ってJavaScriptの世界へ卒業してください。</p>`,
      task: `プログラムに仕込まれた6個のバグをすべて修正して、解説の「期待する出力」と完全に一致させましょう。1つ直すごとに実行して確認するのがおすすめです。`,
      code: `// テスト結果レポート（バグが6個ある。すべて直して期待する出力と一致させよう）
const scores = [90, 5, 63, 100, 41, 78];

// 実施日は8月10日のつもり
const day = new Date(2026, 8, 10);
console.log("実施日: " + (day.getMonth() + 1) + "月" + day.getDate() + "日");

// 高い得点から順に並べて、トップ3を表示したい
const ranking = scores.sort();
ranking.reverse();
console.log("トップ3:");
for (let i = 0; i <= 3; i++) {
  console.log((i + 1) + "位: " + ranking[i] + "点");
}

// 受験した順番の一覧（元の順序のまま表示したい）
console.log("受験順: " + scores.join(", "));

// 平均点を計算したい
let sum;
for (const s of scores) {
  sum = sum + s;
}
console.log("平均点: " + (sum / scores.length).toFixed(1) + "点");

// 0点の受験者がいないことを確認したい
const zeros = scores.filter(function (s) {
  return s === 0;
});
if (zeros === []) {
  console.log("0点の受験者はいません");
}`,
      solution: `// テスト結果レポート（6個のバグをすべて修正済み）
const scores = [90, 5, 63, 100, 41, 78];

// 修正1: 月は0始まりなので、8月は7を渡す
const day = new Date(2026, 7, 10);
console.log("実施日: " + (day.getMonth() + 1) + "月" + day.getDate() + "日");

// 修正2: sliceでコピーしてから並び替える（元の配列を破壊しない）
// 修正3: 数値は比較関数を渡して並び替える（省略すると辞書順になる）
const ranking = scores.slice().sort(function (a, b) {
  return b - a;
});
console.log("トップ3:");
// 修正4: トップ3なので3回だけ回す（i < 3）
for (let i = 0; i < 3; i++) {
  console.log((i + 1) + "位: " + ranking[i] + "点");
}

// 受験した順番の一覧（コピーを並び替えたので元の順序が残っている）
console.log("受験順: " + scores.join(", "));

// 修正5: 合計は0から始める（初期化しないとundefined + 数値 = NaN）
let sum = 0;
for (const s of scores) {
  sum = sum + s;
}
console.log("平均点: " + (sum / scores.length).toFixed(1) + "点");

// 修正6: 空配列の判定は===ではなくlengthで行う
const zeros = scores.filter(function (s) {
  return s === 0;
});
if (zeros.length === 0) {
  console.log("0点の受験者はいません");
}`,
      hints: [
        `ずれは6箇所です。日付・並び順（2つ）・表示件数・平均点・最後の1行が出ない、という症状から章の復習ポイントと照らし合わせましょう。`,
        `並び替えは「コピーしてから」「数値用の比較関数を渡して」の2点セットです。scores.slice().sort(function (a, b) { return b - a; })の形になります。`,
        `残りは、Dateの月に渡す値、ループ条件の<=、let sumの初期値、zeros === []の4箇所です。それぞれ第245・247・248ステップと第22章の知識で直せます。`
      ],
      expectedOutput: "平均点: 62.8点"
    }
  ]
});
