// 第23章：よくあるエラー：関数とthis
registerChapter({
  number: 23,
  title: "よくあるエラー：関数とthis",
  description: "メソッドのthis喪失、コールバックの罠、sortやmapの落とし穴、再帰の暴走など、関数まわりで実際によく起きるエラーと誤動作を、本物のエラーメッセージを読みながら修正していきます。",
  steps: [
    {
      id: 221,
      title: "メソッドを取り出すとthisが消える（TypeError）",
      explanation: `<p>この章では、関数と<code>this</code>にまつわる「実際によく起きるエラー」を修正していきます。まずは最頻出のパターンです。左のコードを実行すると、1回目の呼び出しは成功するのに、2回目でこう表示されます。</p>
<pre><code>私はRYUです
TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at intro (main.js:5:34)</code></pre>
<p>エラーメッセージの読み方を整理しましょう。<code>TypeError</code>は「その型では許されない操作をした」という種別、<code>reading 'toUpperCase'</code>は「undefinedから<code>toUpperCase</code>を読もうとした」という直接の原因、<code>at intro (main.js:5:34)</code>は発生場所（関数名・ファイル・行・桁）です。つまり5行目で<code>this.name</code>がundefinedになっています。</p>
<p>なぜでしょうか。<code>this</code>は「関数がどこで定義されたか」ではなく<strong>「どう呼び出されたか」で決まる</strong>のがルールです。</p>
<table>
<tr><th>呼び出し方</th><th>thisの中身</th></tr>
<tr><td><code>player.intro()</code></td><td>ドットの左の<code>player</code></td></tr>
<tr><td><code>f()</code>（ただの関数として呼ぶ）</td><td>オブジェクトを指さない（strictモードではundefined）</td></tr>
</table>
<p><code>const f = player.intro;</code>と取り出した瞬間、<code>f</code>は「playerと無関係のただの関数」になります。修正の定番は<code>bind</code>です。</p>
<pre><code>// bindは「thisをplayerに固定した新しい関数」を返す
const f = player.intro.bind(player);
f(); // 私はRYUです</code></pre>`,
      task: `エラーを再現して確認したら、<code>bind</code>を使って<code>f()</code>でも正しく「私はRYUです」と表示されるように修正しましょう。`,
      code: `// ユーザーの自己紹介メソッドを、変数に取り出してから呼び出したい
const player = {
  name: "Ryu",
  intro: function () {
    console.log("私は" + this.name.toUpperCase() + "です");
  }
};

player.intro(); // これは動く

const f = player.intro; // メソッドを変数に取り出す
f(); // ここでTypeErrorが発生する`,
      solution: `const player = {
  name: "Ryu",
  intro: function () {
    console.log("私は" + this.name.toUpperCase() + "です");
  }
};

player.intro();

// bindでthisをplayerに固定した新しい関数を作る
const f = player.intro.bind(player);
f();`,
      hints: [`thisは「定義した場所」ではなく「呼び出し方」で決まります。f()というただの関数呼び出しでは、thisはplayerを指しません。`, `player.intro.bind(player)は、thisをplayerに固定した新しい関数を返します。それをfに代入しましょう。`],
      expectedOutput: "私はRYUです"
    },
    {
      id: 222,
      title: "アロー関数をメソッドにするとthisが効かない",
      explanation: `<p>左のコードはエラーにはなりませんが、出力がおかしくなります。</p>
<pre><code>残りundefined秒</code></pre>
<p>「エラーが出ないのに結果が変」なバグは、エラーで止まるバグより発見が遅れがちです。undefinedが出力に混ざったら「どの変数がundefinedか」を逆算して探します。ここでは<code>this.seconds</code>が原因です。</p>
<p>アロー関数は<strong>自分のthisを持ちません</strong>。呼び出し方に関係なく、<strong>定義された場所の外側のthisをそのまま使います</strong>。オブジェクトリテラルの中でアロー関数を書いても、「外側」はそのファイルのトップレベルであって<code>timer</code>ではないため、<code>this.seconds</code>はundefinedになります。</p>
<table>
<tr><th>関数の種類</th><th>thisの決まり方</th><th>メソッドに向くか</th></tr>
<tr><td>通常の関数・メソッド定義</td><td>呼び出し方で決まる</td><td>向いている</td></tr>
<tr><td>アロー関数</td><td>定義場所の外側のthisを使う</td><td>向いていない</td></tr>
</table>
<p>「アロー関数は新しい書き方だから常に良い」という思い込みが生むバグです。メソッドは短縮記法で書くのが安全です。</p>
<pre><code>const timer = {
  seconds: 30,
  show() { // メソッド短縮記法。thisはtimerを指す
    console.log("残り" + this.seconds + "秒");
  }
};</code></pre>
<p>次のステップで見るように、アロー関数のこの性質は「コールバックの中」でこそ武器になります。使い分けが重要です。</p>`,
      task: `<code>show</code>をアロー関数から通常のメソッド定義に書き換えて、「残り30秒」と表示されるように修正しましょう。`,
      code: `// 残り時間を表示するタイマーオブジェクト
const timer = {
  seconds: 30,
  // アロー関数でメソッドを定義してしまった
  show: () => {
    console.log("残り" + this.seconds + "秒");
  }
};

timer.show(); // 「残り30秒」と表示したいのに…`,
      solution: `const timer = {
  seconds: 30,
  // 通常のメソッド定義なら、thisは呼び出し元のtimerを指す
  show() {
    console.log("残り" + this.seconds + "秒");
  }
};

timer.show();`,
      hints: [`アロー関数は自分のthisを持たず、外側（ここではファイルのトップレベル）のthisを使ってしまいます。`, `show: () => { ... } を show() { ... } というメソッド短縮記法（またはshow: function () { ... }）に書き換えましょう。`],
      expectedOutput: "残り30秒"
    },
    {
      id: 223,
      title: "コールバックの中でthisを失う（bindとアロー関数）",
      explanation: `<p>今度は逆に「コールバックには通常の関数を使ってしまった」パターンです。実行結果はこうなります。</p>
<pre><code>undefinedチームのAoi
undefinedチームのBen</code></pre>
<p><code>list</code>メソッド自体は<code>team.list()</code>と呼ばれているので、その中の<code>this</code>は<code>team</code>です。しかし<code>forEach</code>に渡した<code>function (member) { ... }</code>は、forEachの内部で「ただの関数」として呼び出されます。ステップ221で見た通り、ただの関数呼び出しでは<code>this</code>は<code>team</code>を指しません。そのため<code>this.name</code>がundefinedになります。</p>
<p>修正方法は3つあり、現代のJavaScriptでは1つ目が定番です。</p>
<table>
<tr><th>方法</th><th>書き方</th></tr>
<tr><td>アロー関数にする（定番）</td><td><code>this.members.forEach((m) =&gt; { ... })</code></td></tr>
<tr><td>bindする</td><td><code>function (m) { ... }.bind(this)</code></td></tr>
<tr><td>forEachの第2引数</td><td><code>forEach(function (m) { ... }, this)</code></td></tr>
</table>
<p>前のステップで学んだ「アロー関数は外側のthisを使う」という性質を思い出してください。コールバックをアロー関数にすると、外側はメソッド<code>list</code>の中なので、<code>this</code>は<code>team</code>のまま保たれます。</p>
<pre><code>this.members.forEach((member) =&gt; {
  console.log(this.name + "チームの" + member); // thisはteamのまま
});</code></pre>
<p>「メソッド本体は通常の関数、その中のコールバックはアロー関数」。この組み合わせが実務での基本形です。</p>`,
      task: `<code>forEach</code>のコールバックをアロー関数に書き換えて、「RedチームのAoi」「RedチームのBen」と表示されるように修正しましょう。`,
      code: `const team = {
  name: "Red",
  members: ["Aoi", "Ben"],
  list: function () {
    // コールバックが通常のfunctionなので、中のthisはteamを指さない
    this.members.forEach(function (member) {
      console.log(this.name + "チームの" + member);
    });
  }
};

team.list(); // 「Redチームの…」と表示したいのに…`,
      solution: `const team = {
  name: "Red",
  members: ["Aoi", "Ben"],
  list: function () {
    // アロー関数は自分のthisを持たないので、外側のthis（team）をそのまま使える
    this.members.forEach((member) => {
      console.log(this.name + "チームの" + member);
    });
  }
};

team.list();`,
      hints: [`forEachに渡した通常の関数は「ただの関数」として呼ばれるため、thisがteamを指しません。`, `コールバックをアロー関数 (member) => { ... } に変えると、外側のlistメソッドのthis（=team）がそのまま使えます。`],
      expectedOutput: "RedチームのAoi"
    },
    {
      id: 224,
      title: "関数を「呼んで」渡してしまう（fnとfn()の違い）",
      explanation: `<p>コールバックを渡すときの超定番ミスです。実行するとこうなります。</p>
<pre><code>がんばれ！
TypeError: action is not a function
    at repeat (main.js:4:5)</code></pre>
<p>注目すべきは、エラーの前に<strong>「がんばれ！」が1回だけ表示されている</strong>ことです。これが原因を教えてくれます。<code>repeat(3, cheer())</code>と書くと、JavaScriptはrepeatを呼ぶ前に引数の式<code>cheer()</code>を評価、つまり<strong>その場でcheerを実行</strong>します（だから1回表示された）。cheerは何もreturnしないので戻り値はundefinedとなり、repeatには関数ではなくundefinedが渡ります。そして<code>action()</code>でundefinedを関数として呼ぼうとし、<code>action is not a function</code>になるのです。</p>
<table>
<tr><th>書き方</th><th>意味</th><th>渡るもの</th></tr>
<tr><td><code>repeat(3, cheer)</code></td><td>関数そのものを渡す</td><td>関数</td></tr>
<tr><td><code>repeat(3, cheer())</code></td><td>今すぐ実行して結果を渡す</td><td>戻り値（ここではundefined）</td></tr>
</table>
<p>「後で実行してほしい」ときは<code>()</code>を付けずに関数そのものを渡します。引数を渡したい場合は、アロー関数で包むのが定番です。</p>
<pre><code>// 「呼び出しを包んだ関数」を渡す
repeat(3, () =&gt; cheer("太郎"));</code></pre>
<p>ブラウザのイベント登録などでも<code>onClick(handler())</code>と書いてしまう同型のミスが頻発します。「is not a function」を見たら、まず余計な<code>()</code>を疑いましょう。</p>`,
      task: `<code>repeat</code>に関数そのものを渡すように修正して、「がんばれ！」が3回表示されるようにしましょう。`,
      code: `// 指定した回数だけactionを実行する関数
function repeat(times, action) {
  for (let i = 0; i < times; i++) {
    action();
  }
}

function cheer() {
  console.log("がんばれ！");
}

// 関数を「渡す」つもりが、その場で「呼んで」しまっている
repeat(3, cheer());`,
      solution: `function repeat(times, action) {
  for (let i = 0; i < times; i++) {
    action();
  }
}

function cheer() {
  console.log("がんばれ！");
}

// ()を付けずに、関数そのものを渡す
repeat(3, cheer);`,
      hints: [`cheer()と書くと「今すぐ実行した結果（undefined）」が渡ります。エラー前に1回だけ表示されるのがその証拠です。`, `repeat(3, cheer) のように、()を付けずに関数そのものを渡しましょう。`],
      expectedOutput: "がんばれ！"
    },
    {
      id: 225,
      title: "sort()は比較関数なしだと辞書順（数値の並べ替えミス）",
      explanation: `<p>エラーは出ないのに結果が明らかにおかしい、有名な罠です。</p>
<pre><code>昇順: 100,5,80,9</code></pre>
<p>100が先頭で5がその次。数値の大小と無関係に見えますが、実は規則的です。<code>sort()</code>は比較関数を渡さないと、<strong>各要素をいったん文字列に変換して辞書順（文字コード順）で並べます</strong>。"100"、"5"、"80"、"9"を先頭の文字で比べると"1"が最小なので"100"が先頭に来るのです。</p>
<p>数値として並べたいときは、比較関数を渡します。比較関数は2つの要素a、bを受け取り、戻り値の符号で順序を伝える約束になっています。</p>
<table>
<tr><th>戻り値</th><th>意味</th></tr>
<tr><td>負の数</td><td>aをbより前に置く</td></tr>
<tr><td>0</td><td>順序を変えない</td></tr>
<tr><td>正の数</td><td>bをaより前に置く</td></tr>
</table>
<p>数値なら引き算だけでこの約束を満たせます。</p>
<pre><code>scores.sort(function (a, b) {
  return a - b; // 昇順。降順にしたいなら b - a
});</code></pre>
<p>もう1つ注意点があります。<code>sort</code>は新しい配列を返すのではなく<strong>元の配列そのものを並べ替えます</strong>（破壊的メソッド）。元の順序を残したい場合は<code>slice()</code>でコピーしてから並べ替えます。この性質は第25章で詳しく扱います。</p>`,
      task: `<code>sort</code>に比較関数を渡して、「昇順: 5,9,80,100」と表示されるように修正しましょう。`,
      code: `const scores = [100, 9, 80, 5];

// 比較関数を渡していないので、辞書順（文字列として）並んでしまう
scores.sort();

console.log("昇順: " + scores.join(","));`,
      solution: `const scores = [100, 9, 80, 5];

// 比較関数を渡すと数値として比較される（負なら a が先、正なら b が先）
scores.sort(function (a, b) {
  return a - b;
});

console.log("昇順: " + scores.join(","));`,
      hints: [`sort()は引数なしだと要素を文字列として辞書順に並べます。"100"は"5"より先頭の文字コードが小さいので前に来ます。`, `sort(function (a, b) { return a - b; }) のように、引き算の結果を返す比較関数を渡しましょう。`],
      expectedOutput: "昇順: 5,9,80,100"
    },
    {
      id: 226,
      title: "mapのコールバックでreturnを忘れる（undefinedだらけの配列）",
      explanation: `<p>実行結果を見てみましょう。税込価格が並ぶはずが、こうなります。</p>
<pre><code>税込: ,,</code></pre>
<p>カンマだけが残っています。<code>withTax</code>の中身は<code>[undefined, undefined, undefined]</code>で、<code>join</code>はundefinedを空文字にするため、区切りのカンマだけが見えているのです。</p>
<p>原因は<code>map</code>のコールバックに<code>return</code>がないことです。<code>map</code>は「各要素をコールバックの<strong>戻り値</strong>に置き換えた新しい配列」を作ります。計算だけして戻り値を返さなければ、すべての要素がundefinedになります。関数は<code>return</code>を書かなければ常にundefinedを返す、という基本の帰結です。</p>
<p>まぎらわしいのは、アロー関数の2つの書き方です。</p>
<table>
<tr><th>書き方</th><th>returnの要否</th><th>例</th></tr>
<tr><td>式だけの本体（波かっこなし）</td><td>不要（暗黙のreturn）</td><td><code>p =&gt; p * 1.1</code></td></tr>
<tr><td>ブロック本体（波かっこあり）</td><td>必要</td><td><code>p =&gt; { return p * 1.1; }</code></td></tr>
</table>
<p>波かっこなしの形に慣れた後でブロック本体に書き換えたとき、<code>return</code>を書き忘れるミスが多発します。<strong>mapの結果にundefinedが混ざっていたら、まずコールバックのreturn忘れを疑う</strong>。これが今日の教訓です。なお、置き換えではなく「ただ全件に処理をしたい」だけなら、戻り値を使わない<code>forEach</code>を選ぶのが意図の伝わる書き方です。</p>`,
      task: `コールバックに<code>return</code>を追加して、「税込: 110,275,88」と表示されるように修正しましょう。`,
      code: `const prices = [100, 250, 80];

// 各価格を税込（1.1倍を四捨五入）にした新しい配列を作りたい
const withTax = prices.map(function (price) {
  Math.round(price * 1.1); // 計算しただけでreturnしていない
});

console.log("税込: " + withTax.join(","));`,
      solution: `const prices = [100, 250, 80];

const withTax = prices.map(function (price) {
  // mapのコールバックは、新しい配列に入れる値をreturnする必要がある
  return Math.round(price * 1.1);
});

console.log("税込: " + withTax.join(","));`,
      hints: [`mapは「コールバックの戻り値」を集めて新しい配列を作ります。returnがなければ全要素undefinedです。`, `Math.round(price * 1.1) の前に return を付けましょう。`],
      expectedOutput: "税込: 110,275,88"
    },
    {
      id: 227,
      title: "再帰の停止条件忘れ（RangeError: Maximum call stack size exceeded）",
      explanation: `<p>左のコードを実行すると、Node.js 20では次のエラーで停止します。</p>
<pre><code>RangeError: Maximum call stack size exceeded
    at sum (main.js:4:3)
    at sum (main.js:4:14)
    at sum (main.js:4:14)
    at sum (main.js:4:14)</code></pre>
<p><code>RangeError</code>は「許容範囲を超えた」という種別のエラーです。スタックトレースに<strong>同じ関数名がずらりと並んでいる</strong>のが最大のヒントで、これは「sumがsumを呼び、それがまたsumを呼び…」と無限に続いた証拠です。</p>
<p>関数を呼び出すたびに、JavaScriptエンジンは「どこに戻るか」「引数は何か」をコールスタック（呼び出しの積み重ねを記録するメモリ領域）に積みます。再帰が止まらないとスタックが積み上がり続け、上限に達した瞬間にこのRangeErrorが投げられます。</p>
<p>再帰関数には必ず<strong>基底ケース（base case：これ以上再帰しないで値を返す条件）</strong>が必要です。左のコードは<code>sum(5)</code>→<code>sum(4)</code>→…→<code>sum(0)</code>→<code>sum(-1)</code>→…と、止まる条件がないため負の無限へ進み続けます。</p>
<pre><code>function sum(n) {
  if (n &lt;= 0) {  // 基底ケースを最初に書く
    return 0;
  }
  return n + sum(n - 1); // nを1ずつ基底ケースへ近づける
}</code></pre>
<p>再帰を書くときのチェックリストは2つです。（1）基底ケースがあるか。（2）再帰のたびに引数が基底ケースへ<strong>確実に近づく</strong>か。<code>n === 0</code>ではなく<code>n &lt;= 0</code>としておくと、うっかり負の数を渡されても止まる、守りの堅い書き方になります。</p>`,
      task: `<code>sum</code>に基底ケース（停止条件）を追加して、「1から5の合計: 15」と表示されるように修正しましょう。`,
      code: `// 1からnまでの合計を再帰で求めたい
function sum(n) {
  // 停止条件（基底ケース）を書き忘れている
  return n + sum(n - 1);
}

console.log("1から5の合計: " + sum(5));`,
      solution: `function sum(n) {
  // 基底ケース：0以下になったら再帰を止めて0を返す
  if (n <= 0) {
    return 0;
  }
  return n + sum(n - 1);
}

console.log("1から5の合計: " + sum(5));`,
      hints: [`スタックトレースに同じ関数名が並んでいたら、再帰が止まっていないサインです。「どこで止まるべきか」を考えましょう。`, `関数の先頭に if (n <= 0) { return 0; } のような基底ケースを追加しましょう。`],
      expectedOutput: "1から5の合計: 15"
    },
    {
      id: 228,
      title: "varのループ変数とクロージャの罠",
      explanation: `<p>0、1、2を表示する関数を3つ作ったつもりが、実行結果はこうなります。</p>
<pre><code>i = 3
i = 3
i = 3</code></pre>
<p>これはJavaScript史上もっとも有名な罠の1つです。ポイントは2つあります。</p>
<p>第一に、クロージャ（関数が、自分の外側の変数を参照し続ける仕組み）は<strong>変数の「値のコピー」ではなく「変数そのもの」を覚えます</strong>。pushした3つの関数は、みな同じ変数<code>i</code>を見ています。</p>
<p>第二に、<code>var</code>で宣言した変数は関数（ここではファイル全体）にただ1つしか作られません。ループはすぐに最後まで回り、<code>i</code>は3（ループ終了条件を満たした値）になります。その後で関数を呼ぶので、3つとも「今のiの値=3」を表示するのです。</p>
<table>
<tr><th>宣言</th><th>変数が作られる単位</th><th>結果</th></tr>
<tr><td><code>var i</code></td><td>関数全体で1つを共有</td><td>全員が最終値3を見る</td></tr>
<tr><td><code>let i</code></td><td>ループ1周ごとに新しく作られる</td><td>各関数が自分の周のiを見る</td></tr>
</table>
<p>修正は1語、<code>var</code>を<code>let</code>に変えるだけです。<code>let</code>のループ変数は<strong>1周ごとに別の変数</strong>として作り直され、各クロージャは自分の周の<code>i</code>を覚えます。</p>
<pre><code>for (let i = 0; i &lt; 3; i++) {
  fns.push(function () { console.log("i = " + i); });
}</code></pre>
<p>第1章で「varを避ける」と学んだ最大の理由がこれです。古いコードや解説記事で<code>var</code>ループを見かけたら、この罠を思い出してください。</p>`,
      task: `ループ変数の宣言を修正して、「i = 0」「i = 1」「i = 2」と表示されるようにしましょう。`,
      code: `const fns = [];

// 「i = 0」「i = 1」「i = 2」と表示する関数を3つ作りたい
for (var i = 0; i < 3; i++) {
  fns.push(function () {
    console.log("i = " + i);
  });
}

fns[0]();
fns[1]();
fns[2]();`,
      solution: `const fns = [];

// letならループの1周ごとに新しいiが作られる
for (let i = 0; i < 3; i++) {
  fns.push(function () {
    console.log("i = " + i);
  });
}

fns[0]();
fns[1]();
fns[2]();`,
      hints: [`3つの関数は「iの値のコピー」ではなく「変数iそのもの」を覚えています。varのiはファイル全体で1つだけです。`, `for (var i = 0; ...) を for (let i = 0; ...) に変えるだけで、1周ごとに別のiが作られます。`],
      expectedOutput: "i = 0"
    },
    {
      id: 229,
      title: "デフォルト引数はnullでは発動しない",
      explanation: `<p>左のコードはエラーになりませんが、3行目の出力が期待と違います。</p>
<pre><code>ようこそ、さくらさん
ようこそ、ゲストさん
ようこそ、nullさん</code></pre>
<p>デフォルト引数（<code>name = "ゲスト"</code>のように引数の初期値を指定する構文）が発動するのは、<strong>引数がundefinedのときだけ</strong>です。nullは「値が存在しない」ことを表す立派な値として渡されるため、デフォルト値に置き換わりません。</p>
<table>
<tr><th>呼び出し</th><th>nameの値</th><th>デフォルト発動</th></tr>
<tr><td><code>greet()</code></td><td>undefined</td><td>する</td></tr>
<tr><td><code>greet(undefined)</code></td><td>undefined</td><td>する</td></tr>
<tr><td><code>greet(null)</code></td><td>null</td><td><strong>しない</strong></td></tr>
</table>
<p>実務では「外部データやAPIの戻りがnullを返してくる」場面が多く、デフォルト引数だけに頼ると<code>nullさん</code>のような表示バグや、後続処理でのTypeErrorにつながります。</p>
<p>nullとundefinedの両方を初期値に置き換えたいときは、第22章で学んだNull合体演算子<code>??</code>（左辺がnullまたはundefinedのときだけ右辺を使う）の出番です。</p>
<pre><code>function greet(name) {
  const display = name ?? "ゲスト"; // nullでもundefinedでも"ゲスト"
  console.log("ようこそ、" + display + "さん");
}</code></pre>
<p>使い分けの目安は、「呼び出し側が引数を省略できるようにしたい」ならデフォルト引数、「nullも含めて穴埋めしたい」なら<code>??</code>、です。</p>`,
      task: `<code>??</code>を使って、<code>greet(null)</code>でも「ようこそ、ゲストさん」と表示されるように修正しましょう。`,
      code: `// 名前が渡されなかったら「ゲスト」と表示したい
function greet(name = "ゲスト") {
  console.log("ようこそ、" + name + "さん");
}

greet("さくら");
greet();
greet(null); // デフォルト値が効かず「nullさん」になってしまう`,
      solution: `function greet(name) {
  // ??はnullとundefinedのときだけ右側の値を使う
  const display = name ?? "ゲスト";
  console.log("ようこそ、" + display + "さん");
}

greet("さくら");
greet();
greet(null);`,
      hints: [`デフォルト引数が発動するのはundefinedのときだけで、nullはそのまま渡されます。`, `関数の中で name ?? "ゲスト" を使えば、nullとundefinedの両方を"ゲスト"に置き換えられます。`],
      expectedOutput: "ようこそ、ゲストさん"
    },
    {
      id: 230,
      title: "総合演習：関数まわりのバグを3つ直す",
      explanation: `<p>この章の総合演習です。選手の記録を集計するプログラムに、この章で学んだバグが3つ仕込まれています。実行結果はこうなります。</p>
<pre><code>2倍: ,,
TypeError: Cannot read properties of undefined (reading 'slice')
    at best (main.js:7:32)</code></pre>
<p>実務のデバッグと同じ手順で読み解きましょう。まず<strong>エラーで止まった箇所</strong>から。<code>at best</code>とあるので<code>best</code>メソッドの中、<code>this.scores</code>がundefinedです。呼び出し側を見ると<code>const getBest = record.best;</code>と取り出してから呼んでいます。ステップ221のパターンですね。</p>
<p>次に<strong>エラーになっていない異常出力</strong>。「2倍: ,,」はステップ226で見た「undefinedだらけの配列」の症状で、mapのreturn忘れが疑われます。</p>
<p>最後に、エラーが直った後に現れる<strong>隠れた論理バグ</strong>。<code>sort()</code>を比較関数なしで呼んでいるため、[90, 8, 100]は辞書順で[100, 8, 90]となり、最大値のつもりの末尾要素は90になってしまいます（ステップ225）。</p>
<table>
<tr><th>症状</th><th>原因</th><th>復習ステップ</th></tr>
<tr><td>TypeError（reading 'slice'）</td><td>メソッド取り出しでthis喪失</td><td>221</td></tr>
<tr><td>2倍: ,,</td><td>mapのreturn忘れ</td><td>226</td></tr>
<tr><td>ベストが90になる</td><td>sortの比較関数なし</td><td>225</td></tr>
</table>
<p>「まずエラーを直し、次に出力を検算する」。エラーが消えても正しさの保証はない、というのが本章のまとめです。</p>`,
      task: `3つのバグをすべて修正して、「2倍: 180,16,200」と「ベスト: 100」が表示されるようにしましょう。`,
      code: `// 選手の記録を集計するプログラム。3つのバグがある
const record = {
  player: "Ken",
  scores: [90, 8, 100],
  best: function () {
    // バグ1: 比較関数がないので数値が正しく並ばない
    const sorted = this.scores.slice().sort();
    return sorted[sorted.length - 1];
  }
};

// バグ2: mapのコールバックでreturnを忘れている
const doubled = record.scores.map(function (s) {
  s * 2;
});

// バグ3: メソッドを取り出して呼ぶとthisが失われる
const getBest = record.best;

console.log("2倍: " + doubled.join(","));
console.log("ベスト: " + getBest());`,
      solution: `const record = {
  player: "Ken",
  scores: [90, 8, 100],
  best: function () {
    // 修正1: 比較関数を渡して数値として並べ替える
    const sorted = this.scores.slice().sort(function (a, b) {
      return a - b;
    });
    return sorted[sorted.length - 1];
  }
};

// 修正2: returnを付けて新しい配列に値を入れる
const doubled = record.scores.map(function (s) {
  return s * 2;
});

// 修正3: bindでthisをrecordに固定する
const getBest = record.best.bind(record);

console.log("2倍: " + doubled.join(","));
console.log("ベスト: " + getBest());`,
      hints: [`エラーメッセージのat bestから、best内のthisがrecordを指していないことが分かります。取り出すときにbindしましょう。`, `「2倍: ,,」はmapのreturn忘れの症状です。さらにsort()に比較関数を渡さないと[90, 8, 100]の最大値が90と誤判定されます。`, `record.best.bind(record)、return s * 2、sort(function (a, b) { return a - b; }) の3点を修正します。`],
      expectedOutput: "ベスト: 100"
    }
  ]
});
