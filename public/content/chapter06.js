// 第6章：配列メソッド
registerChapter({
  number: 6,
  title: "配列メソッド",
  description: "forEach・map・filter・reduceなど、関数を渡して配列を処理する強力なメソッド群を学び、メソッドチェーンによるデータ加工をマスターします。",
  steps: [
    {
      id: 51,
      title: "forEachで全要素を処理する",
      explanation: `<p>この章では、配列の各要素に対して「関数を渡して処理させる」メソッド群を学びます。まずは最も基本の<code>forEach</code>です。</p>
<p><code>forEach</code>は、引数として渡した関数を全要素に対して1回ずつ呼び出します。このように「他の関数に渡して呼び出してもらう関数」をコールバック関数と呼びます。第4章で学んだアロー関数がここで大活躍します。</p>
<pre><code>const drinks = ["コーヒー", "紅茶", "緑茶"];

drinks.forEach((drink) =&gt; {
  console.log(drink + "があります");
});
// コーヒーがあります
// 紅茶があります
// 緑茶があります</code></pre>
<p>コールバック関数の第2引数には、その要素のインデックスが渡されます。連番付きの表示などに便利です。</p>
<pre><code>drinks.forEach((drink, index) =&gt; {
  console.log(index + ": " + drink);
});</code></pre>
<p><code>for...of</code>との違いも整理しておきましょう。</p>
<table>
<tr><th></th><th>forEach</th><th>for...of</th></tr>
<tr><td>インデックス</td><td>第2引数で取れる</td><td>取れない</td></tr>
<tr><td>途中で中断</td><td>できない（breakが使えない）</td><td>break可能</td></tr>
<tr><td>戻り値</td><td>なし（undefined）</td><td>—</td></tr>
</table>
<p>「全要素を必ず処理する」ならforEach、「条件次第で途中でやめたい」ならfor...ofという使い分けが目安です。</p>`,
      task: `<code>for...of</code>で書かれたループを<code>forEach</code>に書き換え、インデックスを使って「1. コーヒー」の形式で表示してください。`,
      code: `const drinks = ["コーヒー", "紅茶", "緑茶"];

// TODO: forEachに書き換えて「1. コーヒー」の形式で表示する
// （コールバックの第2引数indexを使う。表示はindex + 1にする）
for (const drink of drinks) {
  console.log(drink);
}`,
      solution: `const drinks = ["コーヒー", "紅茶", "緑茶"];

// forEachは各要素に対してコールバック関数を1回ずつ呼び出す
// 第1引数が要素、第2引数がインデックス（0始まり）
drinks.forEach((drink, index) => {
  console.log((index + 1) + ". " + drink);
});`,
      hints: [
        `drinks.forEach((drink, index) => { ... });の形で、要素とインデックスを同時に受け取れます。`,
        `インデックスは0始まりなので、表示するときは(index + 1)にします。`,
        `(index + 1) + ". " + drinkのように括弧を付けると、数値の加算が先に行われます。`
      ],
      expectedOutput: "1. コーヒー"
    },
    {
      id: 52,
      title: "mapで変換した新しい配列を作る",
      explanation: `<p><code>map</code>は、各要素をコールバック関数で変換した結果を集めて<strong>新しい配列を返す</strong>メソッドです。「元の配列と同じ要素数の、加工済み配列がほしい」ときに使います。</p>
<pre><code>const prices = [100, 250, 380];
const doubled = prices.map((price) =&gt; price * 2);

console.log(doubled); // [ 200, 500, 760 ]
console.log(prices);  // [ 100, 250, 380 ]（元は変わらない）</code></pre>
<p>ポイントは3つあります。</p>
<ul>
<li><strong>コールバックの戻り値</strong>が新しい配列の要素になる（アロー関数の省略記法なら式の値がそのまま戻り値）</li>
<li>元の配列は変更されない（非破壊的）</li>
<li>要素数は必ず元と同じになる</li>
</ul>
<p><code>forEach</code>との違いは戻り値です。<code>forEach</code>は何も返しませんが、<code>map</code>は変換結果の配列を返します。「表示などの作業をするだけならforEach、変換結果を後で使うならmap」と使い分けます。</p>
<pre><code>const names = ["tanaka", "suzuki"];
const upper = names.map((name) =&gt; name.toUpperCase());
console.log(upper); // [ 'TANAKA', 'SUZUKI' ]</code></pre>
<p>実務では「APIから受け取ったデータを表示用に整形する」「数値の単位を変換する」など、mapは配列メソッドの中でも最頻出です。ブロック<code>{ }</code>で書く場合は<code>return</code>を忘れると全要素がundefinedになる、という定番バグにも注意してください。</p>`,
      task: `<code>map</code>を使って、<code>prices</code>の各要素を2倍にした新しい配列<code>doubled</code>を作ってください。元の配列<code>prices</code>は変更しないこと。`,
      code: `const prices = [100, 250, 380];

// TODO: mapを使って各要素を2倍にした新しい配列を作る
const doubled = prices;

console.log(doubled);
console.log(prices);`,
      solution: `const prices = [100, 250, 380];

// mapはコールバックの戻り値を集めた新しい配列を返す
const doubled = prices.map((price) => price * 2);

console.log(doubled); // [ 200, 500, 760 ]
console.log(prices);  // 元の配列は変わらない`,
      hints: [
        `prices.map(コールバック関数)の形で呼び出します。`,
        `アロー関数の省略記法なら(price) => price * 2と1行で書けます。`
      ],
      expectedOutput: "[ 200, 500, 760 ]"
    },
    {
      id: 53,
      title: "filterで条件に合う要素を絞り込む",
      explanation: `<p><code>filter</code>は、コールバック関数が<code>true</code>を返した要素だけを集めた<strong>新しい配列を返す</strong>メソッドです。「条件に合うものだけ残す」絞り込み処理の定番です。</p>
<pre><code>const temps = [18, 25, 31, 22, 28, 35];
const hot = temps.filter((temp) =&gt; temp &gt;= 30);

console.log(hot);   // [ 31, 35 ]
console.log(temps); // 元の配列は変わらない</code></pre>
<p>コールバック関数には「要素を受け取ってtrue/falseを返す関数」を渡します。このような判定用の関数は述語（predicate）とも呼ばれます。第3章で学んだ比較演算子や論理演算子（<code>&amp;&amp;</code>、<code>||</code>）がそのまま条件式として使えます。</p>
<pre><code>// 20度以上30度未満の過ごしやすい日だけ残す
const mild = temps.filter((temp) =&gt; temp &gt;= 20 &amp;&amp; temp &lt; 30);
console.log(mild); // [ 25, 22, 28 ]</code></pre>
<p><code>map</code>との違いを整理しましょう。</p>
<table>
<tr><th></th><th>map</th><th>filter</th></tr>
<tr><td>目的</td><td>全要素を変換する</td><td>条件で絞り込む</td></tr>
<tr><td>要素数</td><td>元と同じ</td><td>元以下（0個もありうる）</td></tr>
<tr><td>コールバックの戻り値</td><td>新しい要素の値</td><td>残すかどうかのtrue/false</td></tr>
</table>
<p>1件も条件に合わなくてもエラーにはならず、空の配列<code>[]</code>が返る点も覚えておきましょう。</p>`,
      task: `<code>filter</code>を使って、<code>temps</code>から30度以上の日だけを集めた配列<code>hot</code>を作ってください。`,
      code: `const temps = [18, 25, 31, 22, 28, 35];

// TODO: filterで30以上の要素だけを集めた新しい配列を作る
const hot = temps;

console.log(hot);
console.log("真夏日は" + hot.length + "日");`,
      solution: `const temps = [18, 25, 31, 22, 28, 35];

// filterはコールバックがtrueを返した要素だけを集めた新しい配列を返す
const hot = temps.filter((temp) => temp >= 30);

console.log(hot); // [ 31, 35 ]
console.log("真夏日は" + hot.length + "日");`,
      hints: [
        `filterには「残したい条件」をtrue/falseで返す関数を渡します。`,
        `(temp) => temp >= 30のように、比較式の結果をそのまま返せば十分です。`
      ],
      expectedOutput: "真夏日は2日"
    },
    {
      id: 54,
      title: "findとfindIndexで探す",
      explanation: `<p><code>find</code>は、条件に合う<strong>最初の1つの要素</strong>を返すメソッドです。<code>filter</code>が「全部集める」のに対し、<code>find</code>は「最初の1つが見つかった時点で探索を打ち切る」ため、1件だけほしい場面ではfindのほうが意図が明確で効率的です。</p>
<pre><code>const scores = [55, 72, 48, 91, 63];

const firstHigh = scores.find((score) =&gt; score &gt;= 70);
console.log(firstHigh); // 72（最初に見つかった1つだけ）

const notFound = scores.find((score) =&gt; score &gt;= 100);
console.log(notFound);  // undefined（見つからないとき）</code></pre>
<p>兄弟分の<code>findIndex</code>は、要素そのものではなく<strong>位置（インデックス）</strong>を返します。見つからないときは<code>-1</code>です。</p>
<pre><code>console.log(scores.findIndex((score) =&gt; score &gt;= 70)); // 1</code></pre>
<p>第5章で学んだ<code>indexOf</code>・<code>includes</code>との関係も整理しておきましょう。</p>
<table>
<tr><th>メソッド</th><th>探し方</th><th>戻り値</th><th>見つからないとき</th></tr>
<tr><td><code>indexOf</code></td><td>値の完全一致</td><td>位置</td><td>-1</td></tr>
<tr><td><code>find</code></td><td>条件式（関数）</td><td>要素</td><td>undefined</td></tr>
<tr><td><code>findIndex</code></td><td>条件式（関数）</td><td>位置</td><td>-1</td></tr>
</table>
<p>「特定の値そのものを探すならindexOf、条件で探すならfind系」という使い分けです。findがundefinedを返しうるため、結果を使う前に存在チェックをするのが実務での安全な書き方です。</p>`,
      task: `<code>find</code>で90点以上の最初の点数を、<code>findIndex</code>でその位置を取得して表示するコードを完成させてください。`,
      code: `const scores = [55, 72, 48, 91, 63];

// TODO: 条件を「90以上」に修正する
const firstHigh = scores.find((score) => score >= 0);
const position = scores.findIndex((score) => score >= 0);

console.log("最初の90点以上: " + firstHigh);
console.log("その位置: " + position);`,
      solution: `const scores = [55, 72, 48, 91, 63];

// findは条件に合う最初の要素そのものを返す
const firstHigh = scores.find((score) => score >= 90);

// findIndexは条件に合う最初の要素の位置を返す
const position = scores.findIndex((score) => score >= 90);

console.log("最初の90点以上: " + firstHigh);
console.log("その位置: " + position);`,
      hints: [
        `コールバックの条件式をscore >= 90に変更します。`,
        `findは要素（91）、findIndexは位置（3）を返します。`
      ],
      expectedOutput: "最初の90点以上: 91"
    },
    {
      id: 55,
      title: "someとeveryで全体を判定する",
      explanation: `<p>配列全体に対して「1つでも条件を満たすか」「全部が条件を満たすか」を調べるのが<code>some</code>と<code>every</code>です。どちらも戻り値はtrue/falseの1つだけです。</p>
<table>
<tr><th>メソッド</th><th>意味</th><th>trueになる条件</th></tr>
<tr><td><code>some</code></td><td>どれか1つでも</td><td>条件を満たす要素が1つ以上ある</td></tr>
<tr><td><code>every</code></td><td>すべて</td><td>全要素が条件を満たす</td></tr>
</table>
<pre><code>const ages = [24, 31, 19, 45];

console.log(ages.some((age) =&gt; age &gt;= 40));  // true（45がいる）
console.log(ages.every((age) =&gt; age &gt;= 20)); // false（19がいる）</code></pre>
<p>戻り値がbooleanなので、そのままif文の条件式に使えるのが便利なところです。</p>
<pre><code>if (ages.every((age) =&gt; age &gt;= 18)) {
  console.log("全員入場できます");
}</code></pre>
<p>どちらも結果が確定した時点で探索を打ち切ります。<code>some</code>は最初にtrueが出たら即終了、<code>every</code>は最初にfalseが出たら即終了です。これは論理演算子<code>&amp;&amp;</code>や<code>||</code>の短絡評価と同じ考え方です。</p>
<p>細かい仕様ですが、空の配列に対しては<code>some</code>は必ずfalse、<code>every</code>は必ずtrueを返します。「全員が条件を満たす（違反者がいない）」という論理のため、0人なら違反者もいないという理屈です。実務でバリデーション（入力チェック）に使うときに意外な落とし穴になるので、頭の片隅に置いておきましょう。</p>`,
      task: `<code>some</code>で40歳以上が1人でもいるか、<code>every</code>で全員が20歳以上かを調べて表示し、さらに<code>every</code>を使った条件式で全員18歳以上なら<code>全員18歳以上です</code>と表示してください。`,
      code: `const ages = [24, 31, 19, 45];

// TODO: someを使って40歳以上が1人でもいるか調べる
console.log("40歳以上がいる: " + false);

// TODO: everyを使って全員が20歳以上か調べる
console.log("全員20歳以上: " + true);

// TODO: everyを使った条件式に書き換える
if (false) {
  console.log("全員18歳以上です");
}`,
      solution: `const ages = [24, 31, 19, 45];

// someは1つでも条件を満たせばtrue
console.log("40歳以上がいる: " + ages.some((age) => age >= 40));

// everyは全要素が条件を満たしたときだけtrue
console.log("全員20歳以上: " + ages.every((age) => age >= 20));

// 戻り値がbooleanなので、そのまま条件式に使える
if (ages.every((age) => age >= 18)) {
  console.log("全員18歳以上です");
}`,
      hints: [
        `「1人でも」はsome、「全員」はeveryです。`,
        `ages.some((age) => age >= 40)のように、結果を直接文字列連結やif文に使えます。`,
        `19歳がいるので「全員20歳以上」はfalse、「全員18歳以上」はtrueになります。`
      ],
      expectedOutput: "全員18歳以上です"
    },
    {
      id: 56,
      title: "reduce基本：合計を求める",
      explanation: `<p><code>reduce</code>は、配列の全要素を1つの値に「畳み込む」メソッドです。配列メソッドの中で最も難しいと言われますが、まずは定番の「合計」で仕組みを理解しましょう。</p>
<pre><code>const sales = [1200, 800, 1500, 950];
const total = sales.reduce((sum, value) =&gt; sum + value, 0);
console.log(total); // 4450</code></pre>
<p>reduceの引数は2つです。第1引数がコールバック関数、第2引数が初期値（この例では0）。コールバックの第1引数<code>sum</code>は「ここまでの累積値（アキュムレータ）」、第2引数<code>value</code>が現在の要素で、<strong>コールバックが返した値が次の回のsumになる</strong>のが核心です。</p>
<table>
<tr><th>回</th><th>sum</th><th>value</th><th>戻り値（次のsum）</th></tr>
<tr><td>1回目</td><td>0（初期値）</td><td>1200</td><td>1200</td></tr>
<tr><td>2回目</td><td>1200</td><td>800</td><td>2000</td></tr>
<tr><td>3回目</td><td>2000</td><td>1500</td><td>3500</td></tr>
<tr><td>4回目</td><td>3500</td><td>950</td><td>4450</td></tr>
</table>
<p>最後の戻り値4450がreduce全体の結果になります。第5章で書いた「for...ofでtotalに加算する」処理と同じことを、外部の変数を使わず1つの式で書けるのがreduceの価値です。初期値は省略もできますが、空配列でエラーになるため<strong>初期値は必ず書く</strong>のが実務の鉄則です。</p>`,
      task: `<code>reduce</code>を使って<code>sales</code>の合計を計算し、<code>total</code>に代入してください。初期値には0を指定すること。`,
      code: `const sales = [1200, 800, 1500, 950];

// TODO: reduceを使って合計を計算する（初期値は0）
const total = 0;

console.log("売上合計: " + total + "円");`,
      solution: `const sales = [1200, 800, 1500, 950];

// 第1引数sumは累積値、第2引数valueは現在の要素
// コールバックの戻り値が次の回のsumになる
const total = sales.reduce((sum, value) => sum + value, 0);

console.log("売上合計: " + total + "円");`,
      hints: [
        `reduce((累積値, 現在の要素) => 新しい累積値, 初期値)の形です。`,
        `合計ならsales.reduce((sum, value) => sum + value, 0)と書きます。`
      ],
      expectedOutput: "売上合計: 4450円"
    },
    {
      id: 57,
      title: "reduce応用：最大値を求める",
      explanation: `<p>reduceは合計以外にも「全要素を見て1つの結論を出す」処理全般に使えます。今回は最大値を求めてみましょう。考え方は「これまでの暫定チャンピオン<code>best</code>と現在の要素<code>value</code>を毎回比べ、強いほうを次に残す」です。</p>
<pre><code>const records = [312, 458, 291, 503, 377];

const max = records.reduce((best, value) =&gt; {
  return value &gt; best ? value : best;
}, records[0]);

console.log(max); // 503</code></pre>
<p>第3章で学んだ三項演算子を使い、「valueが大きければvalue、そうでなければbestを返す」と書いています。この「勝ち残り方式」の流れを追ってみましょう。</p>
<table>
<tr><th>回</th><th>best</th><th>value</th><th>残るのは</th></tr>
<tr><td>1回目</td><td>312</td><td>312</td><td>312</td></tr>
<tr><td>2回目</td><td>312</td><td>458</td><td>458</td></tr>
<tr><td>3回目</td><td>458</td><td>291</td><td>458</td></tr>
<tr><td>4回目</td><td>458</td><td>503</td><td>503</td></tr>
<tr><td>5回目</td><td>503</td><td>377</td><td>503</td></tr>
</table>
<p>注意すべきは初期値です。合計のときは0で良かったのですが、最大値で初期値0を使うと、全要素がマイナスの配列で「最大値0」という誤答になります。<strong>先頭の要素<code>records[0]</code>を初期値にする</strong>のが安全です。なお、オブジェクトへの集約などさらに高度なreduce活用は、オブジェクトを学んだ後の章で扱います。</p>`,
      task: `<code>reduce</code>を使って<code>records</code>の最大値を求めてください。初期値には<code>records[0]</code>を指定し、三項演算子で大きいほうを残すこと。`,
      code: `const records = [312, 458, 291, 503, 377];

// TODO: reduceで最大値を求める（初期値はrecords[0]）
const max = records[0];

console.log("最高記録: " + max + "m");`,
      solution: `const records = [312, 458, 291, 503, 377];

// 暫定1位bestと現在の要素valueを比べ、大きいほうを次に残す
// 初期値を0にすると全要素が負のとき壊れるため、先頭要素を使う
const max = records.reduce((best, value) => {
  return value > best ? value : best;
}, records[0]);

console.log("最高記録: " + max + "m");`,
      hints: [
        `「暫定1位と現在の要素を比べて大きいほうを返す」を全要素に繰り返します。`,
        `コールバックはvalue > best ? value : bestと三項演算子で書けます。`,
        `初期値はreduceの第2引数として、コールバックの後ろに書きます。`
      ],
      expectedOutput: "最高記録: 503m"
    },
    {
      id: 58,
      title: "sortの罠と比較関数",
      explanation: `<p>配列を並べ替える<code>sort</code>には、JavaScriptで最も有名な罠があります。<strong>引数なしのsortは、要素を文字列に変換して辞書順で並べる</strong>のです。</p>
<pre><code>const numbers = [40, 1, 5, 200];
console.log(numbers.sort()); // [ 1, 200, 40, 5 ] ←数値順ではない！</code></pre>
<p>"200"は"40"より先頭の文字（"2"と"4"）の比較で小さいと判定されるため、辞書順ではこの並びになります。数値として正しく並べるには、比較関数（2つの要素の大小をsortに教える関数）を渡します。</p>
<pre><code>numbers.sort((a, b) =&gt; a - b); // [ 1, 5, 40, 200 ] 昇順
numbers.sort((a, b) =&gt; b - a); // [ 200, 40, 5, 1 ] 降順</code></pre>
<p>比較関数のルールは「負の数を返すとaが前、正の数を返すとbが前、0なら同順位」です。<code>a - b</code>なら、aが小さいとき負になってaが前に来るので昇順になります。</p>
<table>
<tr><th>書き方</th><th>結果</th></tr>
<tr><td><code>sort()</code></td><td>文字列として辞書順（数値では事故）</td></tr>
<tr><td><code>sort((a, b) =&gt; a - b)</code></td><td>数値の昇順</td></tr>
<tr><td><code>sort((a, b) =&gt; b - a)</code></td><td>数値の降順</td></tr>
</table>
<p>もう1つの注意点は、<strong>sortが元の配列を直接並べ替える破壊的メソッド</strong>だということです。元の順序を残したいときは、第5章で学んだスプレッド構文で<code>[...numbers].sort(...)</code>とコピーしてから並べ替えるのが定石です。</p>`,
      task: `1つ目の出力で罠の挙動を観察したあと、2つ目に昇順、3つ目に降順の比較関数を追加してください。元の配列を壊さないよう、スプレッド構文でのコピーはそのまま使うこと。`,
      code: `const numbers = [40, 1, 5, 200];

// 罠：引数なしのsortは文字列の辞書順で並べる
console.log([...numbers].sort());

// TODO: 比較関数を渡して数値の昇順にする
console.log([...numbers].sort());

// TODO: 比較関数を渡して数値の降順にする
console.log([...numbers].sort());`,
      solution: `const numbers = [40, 1, 5, 200];

// 罠：引数なしのsortは文字列の辞書順で並べる
console.log([...numbers].sort()); // [ 1, 200, 40, 5 ]

// (a, b) => a - bは、aが小さいとき負を返しaが前に来る（昇順）
console.log([...numbers].sort((a, b) => a - b)); // [ 1, 5, 40, 200 ]

// 引き算を逆にすれば降順になる
console.log([...numbers].sort((a, b) => b - a)); // [ 200, 40, 5, 1 ]`,
      hints: [
        `比較関数は2つの要素を受け取り、数値を返す関数です。`,
        `昇順は(a, b) => a - b、降順は(a, b) => b - aです。`,
        `[...numbers]でコピーしているのは、sortが元の配列を書き換える破壊的メソッドだからです。`
      ],
      expectedOutput: "[ 1, 5, 40, 200 ]"
    },
    {
      id: 59,
      title: "メソッドチェーンでつなげる",
      explanation: `<p><code>filter</code>や<code>map</code>は新しい配列を返すため、<strong>戻り値に対して続けて次のメソッドを呼ぶ</strong>ことができます。これをメソッドチェーンと呼びます。</p>
<pre><code>const scores = [45, 82, 91, 60, 77];

const bonusTotal = scores
  .filter((score) =&gt; score &gt;= 60)  // [82, 91, 60, 77]
  .map((score) =&gt; score + 5)       // [87, 96, 65, 82]
  .reduce((sum, score) =&gt; sum + score, 0); // 330

console.log(bonusTotal); // 330</code></pre>
<p>「60点以上に絞り込み、5点加点し、合計する」という3段階の加工が、上から下へ読むだけで理解できます。同じ処理をforループで書くと、条件分岐と一時変数が絡み合って読みにくくなりがちです。チェーンは<strong>データが流れるパイプライン</strong>のイメージで、各段の責務が1つずつに分かれるのが強みです。</p>
<p>読みやすく書くコツは、例のように<strong>メソッドごとに改行してドットを行頭に置く</strong>ことです。各行の変換結果をコメントで添えると、レビューする人にも親切です。</p>
<p>順序にも意味があります。先にfilterで要素数を減らしてからmapするほうが、無駄な変換をしない分効率的です。また、チェーンの途中に<code>reduce</code>や<code>join</code>のような「配列以外を返すメソッド」が入ると、その先で配列メソッドは呼べなくなる点に注意してください（チェーンの終端に置くのが基本です）。</p>`,
      task: `メソッドチェーンを完成させてください。<code>scores</code>から60点以上を<code>filter</code>で絞り込み、<code>map</code>で5点加点し、<code>reduce</code>で合計を求めます。`,
      code: `const scores = [45, 82, 91, 60, 77];

// TODO: filter（60以上）→ map（+5点）→ reduce（合計）のチェーンを書く
const bonusTotal = 0;

console.log("合格者の加点後合計: " + bonusTotal);`,
      solution: `const scores = [45, 82, 91, 60, 77];

// 各メソッドが新しい配列を返すので、続けて次のメソッドを呼べる
const bonusTotal = scores
  .filter((score) => score >= 60)          // [82, 91, 60, 77]
  .map((score) => score + 5)               // [87, 96, 65, 82]
  .reduce((sum, score) => sum + score, 0); // 330

console.log("合格者の加点後合計: " + bonusTotal);`,
      hints: [
        `filterとmapは配列を返すので、そのままドットで次のメソッドをつなげられます。`,
        `scores.filter(...).map(...).reduce(..., 0)の順につなぎます。`,
        `絞り込み結果は[82, 91, 60, 77]、加点後は[87, 96, 65, 82]、合計は330です。`
      ],
      expectedOutput: "合格者の加点後合計: 330"
    },
    {
      id: 60,
      title: "総合演習：成績データ加工",
      explanation: `<p>第6章の総合演習です。テストの点数データから「合格者数」「合格者平均」「上位3名」を求めるレポート処理を作ります。この章で学んだメソッドの総動員です。</p>
<table>
<tr><th>求めるもの</th><th>使うメソッド</th></tr>
<tr><td>合格者の絞り込み</td><td><code>filter</code></td></tr>
<tr><td>合計→平均</td><td><code>reduce</code>＋<code>length</code>で割る</td></tr>
<tr><td>降順ランキング</td><td>スプレッドでコピー→<code>sort((a, b) =&gt; b - a)</code></td></tr>
<tr><td>上位3名の取り出しと表示</td><td><code>slice(0, 3)</code>＋<code>join</code></td></tr>
</table>
<p>実務のデータ加工でも「絞り込む→集計する→並べ替えて上位を取る」は最頻出の流れです。ポイントを2つ確認しておきましょう。</p>
<ul>
<li><strong>平均は「合計÷件数」</strong>。全体のlengthではなく、filter後の配列のlengthで割ることに注意（合格者平均なので）</li>
<li><strong>sortの前にコピー</strong>。sortは破壊的なので、絞り込み結果をそのまま並べ替えると後続の処理に影響します。<code>[...passed].sort(...)</code>の形を習慣にしましょう</li>
</ul>
<pre><code>// 例：上位2名をカンマ区切りで表示する
const top = [...values].sort((a, b) =&gt; b - a).slice(0, 2);
console.log(top.join(", "));</code></pre>
<p>ここまでできれば、数値配列のデータ加工は一通り自力で書けるレベルです。次章でオブジェクトを学ぶと、この技術は「名前付きデータの集計」へと一気に広がります。</p>`,
      task: `成績レポートを完成させてください。60点以上を<code>filter</code>で抽出、<code>reduce</code>で合計して平均を計算、スプレッド＋<code>sort</code>で降順に並べて上位3名を表示します。`,
      code: `const scores = [72, 45, 88, 91, 60, 53, 79, 66];

// TODO: filterで60点以上の合格者だけを取り出す
const passed = scores;

console.log("合格者数: " + passed.length + "人");

// TODO: reduceで合格者の合計点を求める（初期値0）
const total = 0;

console.log("合格者平均: " + total / passed.length + "点");

// TODO: スプレッドでコピーしてから、比較関数付きsortで降順に並べる
const ranking = passed;

console.log("上位3名: " + ranking.slice(0, 3).join("点、") + "点");`,
      solution: `const scores = [72, 45, 88, 91, 60, 53, 79, 66];

// 60点以上だけを絞り込む
const passed = scores.filter((score) => score >= 60);

console.log("合格者数: " + passed.length + "人");

// 合格者の合計点。平均は合格者数（passed.length）で割る
const total = passed.reduce((sum, score) => sum + score, 0);

console.log("合格者平均: " + total / passed.length + "点");

// sortは破壊的なので、スプレッドでコピーしてから降順に並べ替える
const ranking = [...passed].sort((a, b) => b - a);

console.log("上位3名: " + ranking.slice(0, 3).join("点、") + "点");`,
      hints: [
        `合格者はscores.filter((score) => score >= 60)で取り出せます（6人になります）。`,
        `平均は「reduceの合計 ÷ passed.length」です。全体の人数で割らないよう注意。`,
        `降順は[...passed].sort((a, b) => b - a)、上位3名はslice(0, 3)とjoinで整形します。`
      ],
      expectedOutput: "合格者平均: 76点"
    }
  ]
});
