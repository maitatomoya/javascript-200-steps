// 第5章：配列の基本
registerChapter({
  number: 5,
  title: "配列の基本",
  description: "複数の値をひとまとめにして扱う「配列」の作成方法と、追加・削除・検索・変換といった基本操作を学びます。",
  steps: [
    {
      id: 41,
      title: "配列の作成とインデックス",
      explanation: `<p>配列（Array）は、複数の値を順番に並べて1つの変数で扱えるデータ構造です。これまで変数1つにつき値は1つでしたが、配列を使えば「果物のリスト」「点数の一覧」のような複数データをまとめて管理できます。</p>
<p>配列は角括弧<code>[ ]</code>の中に値をカンマ区切りで並べて作ります。これを配列リテラルと呼びます。各値のことを「要素」と呼び、要素の位置を表す番号を「インデックス（添字）」と呼びます。</p>
<pre><code>const colors = ["赤", "青", "緑"];
console.log(colors[0]); // 赤
console.log(colors[2]); // 緑
console.log(colors[3]); // undefined（存在しない位置）</code></pre>
<p>最重要ポイントは<strong>インデックスが0から始まる</strong>ことです。先頭の要素は<code>colors[0]</code>、2番目は<code>colors[1]</code>です。「N番目の要素はインデックスN-1」と覚えましょう。</p>
<table>
<tr><th>書き方</th><th>意味</th><th>結果</th></tr>
<tr><td><code>colors[0]</code></td><td>1番目の要素</td><td>"赤"</td></tr>
<tr><td><code>colors[1]</code></td><td>2番目の要素</td><td>"青"</td></tr>
<tr><td><code>colors[3]</code></td><td>存在しない位置</td><td>undefined</td></tr>
</table>
<p>存在しないインデックスを指定してもエラーにはならず<code>undefined</code>が返る点も、実務のバグ調査でよく出会う挙動なので覚えておきましょう。</p>`,
      task: `配列<code>fruits</code>から<code>"バナナ"</code>を取り出して表示するように、インデックスを修正してください。`,
      code: `const fruits = ["りんご", "バナナ", "みかん"];

// TODO: インデックスを修正して"バナナ"を表示する
console.log(fruits[0]);`,
      solution: `const fruits = ["りんご", "バナナ", "みかん"];

// インデックスは0から始まるので、2番目の要素はインデックス1
console.log(fruits[1]);`,
      hints: [
        `インデックスは0から始まります。1番目が[0]、2番目が[1]です。`,
        `"バナナ"は2番目の要素なので、fruits[1]で取り出せます。`
      ],
      expectedOutput: "バナナ"
    },
    {
      id: 42,
      title: "lengthと末尾要素の取得",
      explanation: `<p>配列の要素数は<code>length</code>プロパティで取得できます。プロパティとは、値に付属している情報のことで、メソッドと違い括弧を付けずに読み取ります。</p>
<pre><code>const animals = ["犬", "猫", "うさぎ"];
console.log(animals.length); // 3</code></pre>
<p><code>length</code>の代表的な使いどころが「末尾（最後）の要素の取得」です。インデックスは0始まりなので、要素数が3なら最後のインデックスは2、つまり<strong>末尾のインデックスは常にlength - 1</strong>になります。</p>
<pre><code>const animals = ["犬", "猫", "うさぎ"];
console.log(animals[animals.length - 1]); // うさぎ
console.log(animals[animals.length]);     // undefined（1つ行き過ぎ）</code></pre>
<p><code>animals[animals.length]</code>と書いてしまうと存在しない位置を指してundefinedになります。これは「off-by-oneエラー（1つずれるバグ）」と呼ばれ、プログラミング全般で最も多いバグの1つです。</p>
<table>
<tr><th>要素数</th><th>有効なインデックス</th><th>末尾のインデックス</th></tr>
<tr><td>3</td><td>0〜2</td><td>2（= 3 - 1）</td></tr>
<tr><td>5</td><td>0〜4</td><td>4（= 5 - 1）</td></tr>
</table>
<p>なお、要素数は配列の中身によって変わるため、末尾を取るときは具体的な数字ではなく必ず<code>length - 1</code>を使うのが実務の定石です。</p>`,
      task: `配列<code>animals</code>の要素数と末尾の要素を表示するコードを完成させてください。末尾は<code>length</code>を使って取得すること。`,
      code: `const animals = ["犬", "猫", "うさぎ", "ハムスター"];

console.log("要素数: " + animals.length);

// TODO: lengthを使って末尾の要素を取得する
console.log("末尾: " + animals[0]);`,
      solution: `const animals = ["犬", "猫", "うさぎ", "ハムスター"];

console.log("要素数: " + animals.length);

// 末尾のインデックスは常にlength - 1になる
console.log("末尾: " + animals[animals.length - 1]);`,
      hints: [
        `末尾のインデックスは「要素数 - 1」です。要素数はlengthで取得できます。`,
        `animals[animals.length - 1]と書くと、要素数が変わっても常に末尾を指します。`
      ],
      expectedOutput: "末尾: ハムスター"
    },
    {
      id: 43,
      title: "push・pop・shift・unshift",
      explanation: `<p>配列には要素を追加・削除するメソッドが用意されています。まずは基本の4つを覚えましょう。名前は覚えにくいですが「push/popは末尾、shift/unshiftは先頭」とセットで記憶すると整理できます。</p>
<table>
<tr><th>メソッド</th><th>操作</th><th>戻り値</th></tr>
<tr><td><code>push(値)</code></td><td>末尾に追加</td><td>新しい要素数</td></tr>
<tr><td><code>pop()</code></td><td>末尾から削除</td><td>削除した要素</td></tr>
<tr><td><code>unshift(値)</code></td><td>先頭に追加</td><td>新しい要素数</td></tr>
<tr><td><code>shift()</code></td><td>先頭から削除</td><td>削除した要素</td></tr>
</table>
<pre><code>const tasks = ["洗濯"];
tasks.push("掃除");        // ["洗濯", "掃除"]
tasks.unshift("朝食");     // ["朝食", "洗濯", "掃除"]
const done = tasks.shift(); // doneは"朝食"、配列は["洗濯", "掃除"]</code></pre>
<p>重要なのは、これらが<strong>元の配列そのものを書き換える（破壊的メソッド）</strong>という点と、<code>pop</code>と<code>shift</code>は<strong>削除した要素を戻り値として返す</strong>という点です。「取り出して使う」という処理が1行で書けます。</p>
<p>ちなみに<code>const</code>で宣言した配列でも要素の追加・削除はできます。<code>const</code>が禁止するのは変数への再代入であって、配列の中身の変更ではないからです。</p>`,
      task: `受付の待ち行列を処理します。<code>push</code>で<code>"佐藤"</code>を末尾に追加し、<code>shift</code>で先頭の人を取り出して<code>first</code>に代入してください。`,
      code: `const queue = ["田中", "鈴木"];

// TODO: pushで"佐藤"を末尾に追加する

// TODO: shiftで先頭の人を取り出してfirstに代入する
const first = "";

console.log(first + "さんを呼び出しました");
console.log("残り: " + queue.length + "人");`,
      solution: `const queue = ["田中", "鈴木"];

// pushは末尾に追加する
queue.push("佐藤");

// shiftは先頭の要素を削除し、その要素を戻り値として返す
const first = queue.shift();

console.log(first + "さんを呼び出しました");
console.log("残り: " + queue.length + "人");`,
      hints: [
        `pushは末尾への追加、shiftは先頭からの削除です。`,
        `shiftは削除した要素を返すので、const first = queue.shift();と書けます。`,
        `実行後のqueueは["鈴木", "佐藤"]の2人になります。`
      ],
      expectedOutput: "田中さんを呼び出しました"
    },
    {
      id: 44,
      title: "スプレッド構文とコピー（参照の罠）",
      explanation: `<p>配列を別の変数に代入するとき、初心者が必ずハマる罠があります。<strong>配列の代入はコピーではなく「参照の共有」</strong>だという点です。</p>
<pre><code>const a = [1, 2, 3];
const b = a;      // コピーではなく、同じ配列を指すだけ
b.push(4);
console.log(a);   // [ 1, 2, 3, 4 ] ←aまで変わってしまう！</code></pre>
<p>数値や文字列と違い、配列の変数には「配列本体の置き場所（参照）」が入っています。<code>b = a</code>は置き場所のメモを渡しただけなので、<code>b</code>を変更すると<code>a</code>から見ても同じ配列が変わってしまうのです。</p>
<p>独立したコピーを作るには、スプレッド構文<code>...</code>を使います。<code>[...a]</code>と書くと「<code>a</code>の要素を展開して新しい配列に詰め直す」という意味になり、別の配列が生まれます。</p>
<pre><code>const a = [1, 2, 3];
const b = [...a]; // 新しい配列としてコピー
b.push(4);
console.log(a);   // [ 1, 2, 3 ] ←影響を受けない
console.log(b);   // [ 1, 2, 3, 4 ]</code></pre>
<p>スプレッド構文は結合にも使えます（例：<code>[...a, ...b]</code>）。なお、この方法は「浅いコピー」と呼ばれ、配列の中に配列が入っている場合は内側までコピーされない点は、後の章で詳しく学びます。</p>`,
      task: `<code>copy</code>を変更すると<code>original</code>まで変わってしまうバグがあります。スプレッド構文を使って独立したコピーを作り、<code>original</code>が影響を受けないように修正してください。`,
      code: `const original = [1, 2, 3];

// TODO: スプレッド構文を使って独立したコピーにする
const copy = original;

copy.push(4);

console.log(original); // [ 1, 2, 3 ]のままにしたい
console.log(copy);     // [ 1, 2, 3, 4 ]`,
      solution: `const original = [1, 2, 3];

// スプレッド構文で要素を展開し、新しい配列として詰め直す
const copy = [...original];

copy.push(4);

console.log(original); // 影響を受けず[ 1, 2, 3 ]のまま
console.log(copy);     // [ 1, 2, 3, 4 ]`,
      hints: [
        `const copy = original;は同じ配列を2つの名前で指しているだけで、コピーではありません。`,
        `[...original]と書くと、要素を展開した新しい配列が作られます。`
      ],
      expectedOutput: "[ 1, 2, 3 ]"
    },
    {
      id: 45,
      title: "sliceで一部を取り出す",
      explanation: `<p><code>slice</code>は配列の一部を切り出して<strong>新しい配列として返す</strong>メソッドです。前ステップのpushなどと違い、<strong>元の配列は一切変更しません（非破壊的メソッド）</strong>。この「破壊的か非破壊的か」の区別は、配列メソッドを学ぶうえで常に意識すべき最重要ポイントです。</p>
<pre><code>const week = ["月", "火", "水", "木", "金", "土", "日"];
console.log(week.slice(1, 3)); // [ '火', '水' ]
console.log(week.length);      // 7（元の配列はそのまま）</code></pre>
<p><code>slice(開始, 終了)</code>の引数の意味は次の通りです。</p>
<table>
<tr><th>書き方</th><th>意味</th></tr>
<tr><td><code>slice(1, 3)</code></td><td>インデックス1から、<strong>3の直前まで</strong>（3は含まない）</td></tr>
<tr><td><code>slice(2)</code></td><td>インデックス2から末尾まで</td></tr>
<tr><td><code>slice(-2)</code></td><td>末尾から2個（マイナスは後ろから数える）</td></tr>
<tr><td><code>slice()</code></td><td>全体のコピー（スプレッドと同様の浅いコピー）</td></tr>
</table>
<p>「終了インデックスは含まれない」という仕様は間違えやすいので注意してください。取り出される個数は「終了 - 開始」で計算できます。<code>slice(0, 5)</code>なら5個です。マイナスのインデックスで「後ろからN個」を簡単に取れるのも実務で頻出のテクニックです。</p>`,
      task: `<code>slice</code>を使って、<code>week</code>から平日5日分（月〜金）を<code>weekdays</code>に、週末2日分（土・日）を<code>weekend</code>に取り出してください。`,
      code: `const week = ["月", "火", "水", "木", "金", "土", "日"];

// TODO: sliceで先頭から5個（月〜金）を取り出す
const weekdays = week;

// TODO: sliceで末尾から2個（土・日）を取り出す
const weekend = week;

console.log(weekdays);
console.log(weekend);
console.log("元の配列は" + week.length + "個のまま");`,
      solution: `const week = ["月", "火", "水", "木", "金", "土", "日"];

// slice(0, 5)はインデックス0から5の直前（=4）まで、計5個を取り出す
const weekdays = week.slice(0, 5);

// マイナスの引数は「後ろからN個」を意味する
const weekend = week.slice(-2);

console.log(weekdays);
console.log(weekend);
console.log("元の配列は" + week.length + "個のまま");`,
      hints: [
        `slice(開始, 終了)の「終了」は含まれません。先頭から5個ならslice(0, 5)です。`,
        `後ろから2個はslice(-2)で取り出せます。slice(5, 7)でも同じ結果です。`
      ],
      expectedOutput: "[ '土', '日' ]"
    },
    {
      id: 46,
      title: "spliceで削除・挿入する",
      explanation: `<p><code>splice</code>は配列の途中の要素を削除したり、途中に要素を挿入したりできる万能メソッドです。前ステップの<code>slice</code>と名前がそっくりですが、<code>splice</code>は<strong>元の配列を直接書き換える破壊的メソッド</strong>です。混同しないよう注意しましょう。</p>
<p>基本形は<code>splice(開始位置, 削除する個数, 追加する要素...)</code>です。</p>
<pre><code>const list = ["a", "b", "c", "d"];
const removed = list.splice(1, 2); // インデックス1から2個削除
console.log(removed); // [ 'b', 'c' ]（削除した要素が返る）
console.log(list);    // [ 'a', 'd' ]（元の配列が変わっている）</code></pre>
<p>削除する個数を0にすると、削除せずに挿入だけができます。</p>
<pre><code>const list = ["a", "d"];
list.splice(1, 0, "x"); // インデックス1の位置に"x"を挿入
console.log(list);      // [ 'a', 'x', 'd' ]</code></pre>
<table>
<tr><th>使い方</th><th>意味</th></tr>
<tr><td><code>splice(1, 2)</code></td><td>インデックス1から2個削除</td></tr>
<tr><td><code>splice(1, 0, "x")</code></td><td>インデックス1に"x"を挿入（削除なし）</td></tr>
<tr><td><code>splice(1, 1, "x")</code></td><td>インデックス1の1個を"x"に置き換え</td></tr>
</table>
<p>戻り値は「削除した要素の配列」です。sliceは「取り出す（元はそのまま）」、spliceは「切り取る・差し込む（元が変わる）」と対比で覚えてください。</p>`,
      task: `メンバー名簿を編集します。<code>splice</code>で「石田」「上野」の2人（インデックス1から2個）を削除し、続けてインデックス1の位置に<code>"加藤"</code>を挿入してください。`,
      code: `const members = ["青木", "石田", "上野", "遠藤"];

// TODO: インデックス1から2個（石田・上野）を削除してremovedに代入する
const removed = [];

// TODO: インデックス1の位置に"加藤"を挿入する（削除は0個）

console.log(removed);
console.log(members);
console.log("現在" + members.length + "人");`,
      solution: `const members = ["青木", "石田", "上野", "遠藤"];

// spliceは削除した要素の配列を返し、元の配列を書き換える
const removed = members.splice(1, 2);

// 削除数を0にすると、その位置への挿入だけを行う
members.splice(1, 0, "加藤");

console.log(removed);
console.log(members);
console.log("現在" + members.length + "人");`,
      hints: [
        `削除はsplice(開始位置, 個数)です。戻り値が削除された要素の配列になります。`,
        `挿入はsplice(位置, 0, 追加する値)のように、削除数に0を指定します。`,
        `実行後のmembersは["青木", "加藤", "遠藤"]の3人になります。`
      ],
      expectedOutput: "現在3人"
    },
    {
      id: 47,
      title: "indexOfとincludesで検索する",
      explanation: `<p>配列の中に目的の値があるかを調べるメソッドが<code>indexOf</code>と<code>includes</code>です。</p>
<table>
<tr><th>メソッド</th><th>戻り値</th><th>見つからないとき</th></tr>
<tr><td><code>indexOf(値)</code></td><td>最初に見つかった位置（number）</td><td><code>-1</code></td></tr>
<tr><td><code>includes(値)</code></td><td>含まれているか（boolean）</td><td><code>false</code></td></tr>
</table>
<pre><code>const stock = ["ペン", "ノート", "消しゴム"];
console.log(stock.indexOf("ノート"));  // 1
console.log(stock.indexOf("定規"));    // -1
console.log(stock.includes("ペン"));   // true</code></pre>
<p>使い分けの基準はシンプルです。「あるかないか」だけ知りたいなら<code>includes</code>、「どこにあるか」まで必要なら<code>indexOf</code>を使います。</p>
<p>歴史的には<code>includes</code>が登場する前、存在チェックは<code>arr.indexOf(x) !== -1</code>と書くのが定番でした。古いコードでは今もよく見かける書き方なので、読めるようにしておきましょう。</p>
<pre><code>// 古い書き方（今も動くが冗長）
if (stock.indexOf("ペン") !== -1) { console.log("あり"); }
// 現代的な書き方
if (stock.includes("ペン")) { console.log("あり"); }</code></pre>
<p>なお、<code>indexOf</code>が「-1」という一見不思議な値を返すのは、0が「先頭で見つかった」という正常な結果として使われているためです。<code>if (stock.indexOf(x))</code>のように直接条件式に入れると、先頭で見つかったときに0（falsy）となり誤動作します。必ず<code>!== -1</code>と比較してください。</p>`,
      task: `<code>indexOf</code>で<code>"ノート"</code>と<code>"定規"</code>の位置を表示し、<code>includes</code>を使って<code>"消しゴム"</code>があれば<code>消しゴムは在庫あり</code>と表示するコードを完成させてください。`,
      code: `const stock = ["ペン", "ノート", "消しゴム"];

// TODO: indexOfの引数を"ノート"にして位置を表示する
console.log("ノートの位置: " + stock.indexOf(""));

// TODO: indexOfの引数を"定規"にして位置を表示する（-1になるはず）
console.log("定規の位置: " + stock.indexOf(""));

// TODO: includesを使った条件式に書き換える
if (stock.length > 0) {
  console.log("消しゴムは在庫あり");
}`,
      solution: `const stock = ["ペン", "ノート", "消しゴム"];

// indexOfは最初に見つかった位置を返す
console.log("ノートの位置: " + stock.indexOf("ノート"));

// 見つからない場合は-1が返る
console.log("定規の位置: " + stock.indexOf("定規"));

// 「あるかないか」だけならincludesが読みやすい
if (stock.includes("消しゴム")) {
  console.log("消しゴムは在庫あり");
}`,
      hints: [
        `indexOfは位置の数値、includesはtrue/falseを返します。`,
        `if (stock.includes("消しゴム"))のように、includesの結果はそのまま条件式に使えます。`
      ],
      expectedOutput: "ノートの位置: 1"
    },
    {
      id: 48,
      title: "joinとsplit（配列と文字列の変換）",
      explanation: `<p>配列と文字列を相互に変換するペアが<code>join</code>と<code>split</code>です。データの整形や、CSV（カンマ区切りテキスト）の読み書きなど実務で非常によく使います。</p>
<p><code>join(区切り文字)</code>は配列の全要素を連結して<strong>1つの文字列</strong>にします。</p>
<pre><code>const words = ["JavaScript", "を", "学ぶ"];
console.log(words.join(""));   // JavaScriptを学ぶ
console.log(words.join(" / ")); // JavaScript / を / 学ぶ</code></pre>
<p>逆に、文字列のメソッド<code>split(区切り文字)</code>は文字列を分割して<strong>配列</strong>にします。</p>
<pre><code>const csv = "りんご,バナナ,みかん";
const items = csv.split(",");
console.log(items);        // [ 'りんご', 'バナナ', 'みかん' ]
console.log(items.length); // 3</code></pre>
<table>
<tr><th>メソッド</th><th>呼び出す側</th><th>結果</th></tr>
<tr><td><code>join</code></td><td>配列</td><td>文字列</td></tr>
<tr><td><code>split</code></td><td>文字列</td><td>配列</td></tr>
</table>
<p>注意点として、<code>join</code>の引数を省略するとカンマ区切りになります（<code>join()</code>と<code>join(",")</code>は同じ）。すき間なく連結したいときは明示的に<code>join("")</code>と空文字列を渡してください。また<code>split("")</code>と空文字列で分割すると1文字ずつの配列になり、文字列を文字単位で処理したいときに便利です。</p>`,
      task: `カンマ区切りの文字列<code>csv</code>を<code>split</code>で配列に分割し、その配列を<code>join</code>で「、」区切りの文字列に変換して表示してください。`,
      code: `const csv = "りんご,バナナ,みかん";

// TODO: splitでカンマ区切りの配列に分割する
const items = [];

console.log(items.length + "個に分割");

// TODO: joinで「、」区切りの1つの文字列にする
console.log("一覧: " + csv);`,
      solution: `const csv = "りんご,バナナ,みかん";

// splitは文字列のメソッドで、区切り文字で分割した配列を返す
const items = csv.split(",");

console.log(items.length + "個に分割");

// joinは配列のメソッドで、区切り文字を挟んで連結した文字列を返す
console.log("一覧: " + items.join("、"));`,
      hints: [
        `splitは文字列側のメソッドです。csv.split(",")で配列になります。`,
        `joinは配列側のメソッドです。items.join("、")で「、」区切りの文字列になります。`
      ],
      expectedOutput: "一覧: りんご、バナナ、みかん"
    },
    {
      id: 49,
      title: "for...ofと従来のforループ",
      explanation: `<p>配列の全要素を順に処理する（走査する）方法として、第3章で学んだ従来の<code>for</code>ループに加えて、配列向けに簡潔に書ける<code>for...of</code>があります。</p>
<pre><code>const scores = [80, 92, 65];

// for...of：要素そのものを順に取り出す
for (const score of scores) {
  console.log(score);
}

// 従来のfor：インデックスを自分で管理する
for (let i = 0; i &lt; scores.length; i++) {
  console.log(i + "番目: " + scores[i]);
}</code></pre>
<p><code>for...of</code>は「配列<code>scores</code>の中の要素を1つずつ<code>score</code>に入れて繰り返す」という意味です。インデックス管理が不要なので、<code>i &lt;= length</code>のようなoff-by-oneエラーが起きず、安全で読みやすいのが利点です。ループ変数は毎回作り直されるため<code>const</code>で宣言できます。</p>
<table>
<tr><th></th><th>for...of</th><th>従来のfor</th></tr>
<tr><td>書きやすさ</td><td>簡潔で安全</td><td>やや冗長</td></tr>
<tr><td>インデックス</td><td>取得できない</td><td>iとして使える</td></tr>
<tr><td>向く場面</td><td>全要素を順に処理</td><td>位置が必要・逆順・1つ飛ばしなど</td></tr>
</table>
<p>使い分けの目安は「要素だけでよければfor...of、位置情報や特殊な進み方が必要なら従来のfor」です。実務のコードレビューでも、単純な全件処理に従来のforを使っていると<code>for...of</code>への書き換えを提案されることがよくあります。</p>`,
      task: `<code>for...of</code>を使って<code>scores</code>の合計を計算し、さらに従来の<code>for</code>ループで「1番目: 80」のように順位付きで各点数を表示してください。`,
      code: `const scores = [80, 92, 65];

// TODO: for...ofで全要素をtotalに加算する
let total = 0;

console.log("合計: " + total);

// TODO: 従来のforループで「1番目: 80」の形式で表示する
// （iは0始まりなので表示はi + 1にする）`,
      solution: `const scores = [80, 92, 65];

// for...ofは要素そのものを1つずつ取り出す
let total = 0;
for (const score of scores) {
  total += score;
}

console.log("合計: " + total);

// インデックスが必要な処理は従来のforが向いている
for (let i = 0; i < scores.length; i++) {
  console.log((i + 1) + "番目: " + scores[i]);
}`,
      hints: [
        `for (const score of scores) { ... }で要素を1つずつ取り出せます。`,
        `合計はtotal += score;のように加算していきます。`,
        `従来のforはfor (let i = 0; i < scores.length; i++)の形です。表示時はi + 1を使います。`
      ],
      expectedOutput: "合計: 237"
    },
    {
      id: 50,
      title: "総合演習：買い物リスト操作",
      explanation: `<p>第5章の総合演習です。この章で学んだ配列の操作を組み合わせて、実用的な「買い物リスト管理」を作ります。使う知識を整理しましょう。</p>
<table>
<tr><th>機能</th><th>使うもの</th></tr>
<tr><td>重複チェック</td><td><code>includes</code></td></tr>
<tr><td>末尾に追加</td><td><code>push</code></td></tr>
<tr><td>位置を調べて削除</td><td><code>indexOf</code>＋<code>splice</code></td></tr>
<tr><td>一覧の整形表示</td><td><code>join</code></td></tr>
</table>
<p>実務のリスト管理でも「追加前に重複を確認する」「削除前に存在を確認する」というガード処理（不正な操作を先に弾く処理）は定番のパターンです。第4章で学んだ関数の早期リターン（<code>return</code>で関数を途中終了する書き方）と組み合わせると、次のような読みやすい構造になります。</p>
<pre><code>function removeItem(item) {
  const index = list.indexOf(item);
  if (index === -1) {
    console.log(item + "は見つかりません");
    return; // 見つからなければここで終了
  }
  list.splice(index, 1); // 見つかった位置の1個を削除
  console.log(item + "を削除しました");
}</code></pre>
<p><code>indexOf</code>で得た位置をそのまま<code>splice</code>の開始位置に渡すのがポイントです。値を指定して削除する専用メソッドは配列にないため、この「indexOfで探してspliceで消す」は頻出のイディオム（定型的な書き方）として覚えておく価値があります。</p>`,
      task: `買い物リストを完成させてください。<code>addItem</code>は重複時にメッセージを出して追加しない、<code>removeItem</code>は<code>indexOf</code>と<code>splice</code>で該当項目を削除するようにTODOを実装すること。`,
      code: `const list = [];

function addItem(item) {
  // TODO: すでにlistにitemが含まれていたら
  // 「(item)はすでにあります」と表示してreturnする

  list.push(item);
  console.log(item + "を追加しました");
}

function removeItem(item) {
  // TODO: indexOfでitemの位置を調べ、見つからなければ
  // 「(item)は見つかりません」と表示してreturnする
  // 見つかったらspliceで削除し「(item)を削除しました」と表示する
}

addItem("牛乳");
addItem("パン");
addItem("卵");
addItem("パン");
removeItem("牛乳");
console.log("買い物リスト: " + list.join("、"));`,
      solution: `const list = [];

function addItem(item) {
  // 重複チェック：すでにあれば追加せずに終了（ガード処理）
  if (list.includes(item)) {
    console.log(item + "はすでにあります");
    return;
  }
  list.push(item);
  console.log(item + "を追加しました");
}

function removeItem(item) {
  // indexOfで位置を調べ、見つからなければ-1が返る
  const index = list.indexOf(item);
  if (index === -1) {
    console.log(item + "は見つかりません");
    return;
  }
  // 見つかった位置の要素を1個だけ削除する
  list.splice(index, 1);
  console.log(item + "を削除しました");
}

addItem("牛乳");
addItem("パン");
addItem("卵");
addItem("パン");
removeItem("牛乳");
console.log("買い物リスト: " + list.join("、"));`,
      hints: [
        `重複チェックはif (list.includes(item))、見つからないチェックはif (index === -1)です。`,
        `削除はconst index = list.indexOf(item);で位置を調べてからlist.splice(index, 1);です。`,
        `最終的なリストは「パン、卵」の2つになるはずです。`
      ],
      expectedOutput: "買い物リスト: パン、卵"
    }
  ]
});
