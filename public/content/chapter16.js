// 第16章：イテレータとジェネレータ
registerChapter({
  number: 16,
  title: "イテレータとジェネレータ",
  description: "for...ofの裏側で動くイテレータの仕組みを理解し、ジェネレータ関数で「必要なときに必要なだけ値を生み出す」プログラミングを身につけます。",
  steps: [
    {
      id: 151,
      title: "イテラブルとfor...ofの仕組み",
      explanation: `<p>これまで配列や文字列、Map、Setを<code>for...of</code>で走査してきました。なぜこれらは<code>for...of</code>にかけられるのに、数値やただのオブジェクトはかけられないのでしょうか。その答えが「イテラブル（iterable、反復可能）」という共通の仕組みです。</p>
<p>イテラブルとは、<strong><code>Symbol.iterator</code>という特別なキーのメソッドを持つオブジェクト</strong>のことです。<code>for...of</code>は走査を始める前にこのメソッドを探し、見つかればそれを呼び出して走査を進めます。見つからなければ「not iterable」というエラーになります。</p>
<pre><code>const arr = [10, 20, 30];
// 配列はSymbol.iteratorメソッドを持っている
console.log(typeof arr[Symbol.iterator]); // function

const obj = { a: 1 };
// ただのオブジェクトは持っていない
console.log(typeof obj[Symbol.iterator]); // undefined
// for (const x of obj) {} はTypeErrorになる
</code></pre>
<p><code>Symbol.iterator</code>は言語があらかじめ用意している特殊な値（well-known symbol）で、「このキーにメソッドがあれば走査できる」という取り決めの目印です。主なイテラブルを整理しておきましょう。</p>
<table>
<tr><th>値</th><th>イテラブルか</th><th>for...ofで取り出せるもの</th></tr>
<tr><td>配列</td><td>はい</td><td>各要素</td></tr>
<tr><td>文字列</td><td>はい</td><td>1文字ずつ</td></tr>
<tr><td>Map</td><td>はい</td><td>[キー, 値]のペア</td></tr>
<tr><td>Set</td><td>はい</td><td>各値</td></tr>
<tr><td>ただのオブジェクト</td><td>いいえ</td><td>（TypeErrorになる）</td></tr>
</table>
<p>この「取り決め（プロトコル）さえ守れば誰でも仲間に入れる」という設計のおかげで、自作のオブジェクトも<code>for...of</code>対応にできます。それはステップ153で挑戦します。</p>`,
      task: `いろいろな値がイテラブルかどうかを確認するコードです。そのまま実行して結果を観察し、その後TODOの箇所で文字列についても同じ確認を追加してください。`,
      code: `const arr = [10, 20, 30];
console.log("配列: " + typeof arr[Symbol.iterator]);

const obj = { a: 1 };
console.log("オブジェクト: " + typeof obj[Symbol.iterator]);

const text = "こんにちは";
// TODO: textのSymbol.iteratorの型を「文字列: 」に続けて表示する

// 文字列はfor...ofで1文字ずつ取り出せる
for (const ch of text) {
  console.log(ch);
}
`,
      solution: `const arr = [10, 20, 30];
console.log("配列: " + typeof arr[Symbol.iterator]);

const obj = { a: 1 };
console.log("オブジェクト: " + typeof obj[Symbol.iterator]);

const text = "こんにちは";
// 文字列もSymbol.iteratorメソッドを持つイテラブル
console.log("文字列: " + typeof text[Symbol.iterator]);

// 文字列はfor...ofで1文字ずつ取り出せる
for (const ch of text) {
  console.log(ch);
}
`,
      hints: [
        `配列のときと同じ書き方で、対象をtextに変えるだけです。`,
        `console.log("文字列: " + typeof text[Symbol.iterator]); と書きます。functionと表示されれば、文字列もイテラブルだと確認できます。`
      ],
      expectedOutput: "文字列: function"
    },
    {
      id: 152,
      title: "イテレータとnext()",
      explanation: `<p><code>Symbol.iterator</code>メソッドを呼び出すと返ってくるのが「イテレータ（iterator、反復子）」です。イテレータは<code>next()</code>メソッドを持ち、呼ぶたびに次の値を1つ返します。<code>for...of</code>が裏側でやっているのは、まさにこの<code>next()</code>の連続呼び出しです。</p>
<p><code>next()</code>の戻り値は必ず次の形のオブジェクトです。</p>
<ul>
<li><code>value</code>：今回取り出された値</li>
<li><code>done</code>：走査が終わったかどうか（終わったら<code>true</code>）</li>
</ul>
<pre><code>const arr = ["a", "b"];
const it = arr[Symbol.iterator](); // イテレータを取得

console.log(it.next()); // { value: "a", done: false }
console.log(it.next()); // { value: "b", done: false }
console.log(it.next()); // { value: undefined, done: true }
</code></pre>
<p>ポイントは3つあります。第一に、イテレータは<strong>現在位置を記憶している</strong>こと。<code>next()</code>を呼ぶたびに1つずつ進み、巻き戻すことはできません。第二に、要素が尽きると<code>done: true</code>になり、それ以降は何度呼んでも<code>done: true</code>のままです。第三に、<code>for...of</code>はこの<code>done</code>が<code>true</code>になった時点でループを終える、という単純な規則で動いています。</p>
<pre><code>// for...of は次の処理とほぼ同じ意味
const it2 = arr[Symbol.iterator]();
let result = it2.next();
while (!result.done) {
  console.log(result.value);
  result = it2.next();
}
</code></pre>
<p>普段は<code>for...of</code>を使えば十分ですが、「1つだけ取り出して残りは後で」といった細かい制御をしたいとき、<code>next()</code>を直接呼ぶ技が効いてきます。この感覚は後のジェネレータの理解にも直結します。</p>`,
      task: `配列からイテレータを取り出し、next()を4回呼んで結果を観察します。TODOの箇所で3回目と4回目のnext()の結果を表示してください。`,
      code: `const colors = ["赤", "青", "緑"];
const it = colors[Symbol.iterator]();

const r1 = it.next();
console.log("1回目: " + r1.value + " / " + r1.done);
const r2 = it.next();
console.log("2回目: " + r2.value + " / " + r2.done);
// TODO: 3回目のnext()を呼び、同じ形式で表示する

// TODO: 4回目のnext()を呼び、同じ形式で表示する（doneがtrueになるはず）
`,
      solution: `const colors = ["赤", "青", "緑"];
const it = colors[Symbol.iterator]();

const r1 = it.next();
console.log("1回目: " + r1.value + " / " + r1.done);
const r2 = it.next();
console.log("2回目: " + r2.value + " / " + r2.done);
// 3回目は最後の要素「緑」が取り出される
const r3 = it.next();
console.log("3回目: " + r3.value + " / " + r3.done);
// 4回目は要素が尽きているのでdoneがtrueになる
const r4 = it.next();
console.log("4回目: " + r4.value + " / " + r4.done);
`,
      hints: [
        `1回目・2回目とまったく同じパターンで、変数名をr3、r4にして続けるだけです。`,
        `3回目は「緑 / false」、4回目は「undefined / true」と表示されれば正解です。イテレータが位置を覚えていることが分かります。`
      ],
      expectedOutput: "4回目: undefined / true"
    },
    {
      id: 153,
      title: "独自イテレータを作る（Symbol.iterator）",
      explanation: `<p>イテラブルの正体が「<code>Symbol.iterator</code>メソッドを持つオブジェクト」だと分かれば、自作オブジェクトを<code>for...of</code>対応にできます。ルールは2つだけです。</p>
<ol>
<li><code>[Symbol.iterator]()</code>メソッドを持つこと（キーを角括弧で囲む「計算されたプロパティ名」で定義します）</li>
<li>そのメソッドが「<code>next()</code>を持つオブジェクト（イテレータ）」を返すこと。<code>next()</code>は<code>{ value, done }</code>を返すこと</li>
</ol>
<p>例として、startからendまでの整数を順に返す「範囲オブジェクト」を作ってみます。</p>
<pre><code>const range = {
  start: 1,
  end: 3,
  [Symbol.iterator]: function () {
    let current = this.start; // 現在位置を覚える変数
    const last = this.end;
    return {
      next: function () {
        if (current &lt;= last) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const n of range) {
  console.log(n); // 1 2 3
}
</code></pre>
<p>注目してほしいのは、現在位置<code>current</code>が<code>[Symbol.iterator]()</code>の中のローカル変数だという点です。第9章で学んだクロージャ（関数が外側の変数を覚え続ける仕組み）によって、<code>next()</code>は呼ばれるたびに同じ<code>current</code>を参照して進めていけます。また、<code>for...of</code>のたびに<code>[Symbol.iterator]()</code>が呼び直されるので、走査するたびに最初からやり直せるのもこの構造の利点です。</p>
<p>正直なところ、この書き方は少し長くて面倒です。次のステップで学ぶジェネレータを使うと、同じことが劇的に短く書けます。まずは「手作りだとこうなる」を体験しておきましょう。</p>`,
      task: `startからendまでの整数を返す範囲オブジェクトを完成させましょう。TODOの箇所でnextメソッドの中身（currentがlast以下なら値を返して進める、超えたら終了を返す）を実装してください。`,
      code: `const range = {
  start: 1,
  end: 5,
  [Symbol.iterator]: function () {
    let current = this.start;
    const last = this.end;
    return {
      next: function () {
        // TODO: currentがlast以下なら { value: current++, done: false } を返す

        // TODO: 超えていたら { value: undefined, done: true } を返す
        return { value: undefined, done: true };
      }
    };
  }
};

let sum = 0;
for (const n of range) {
  console.log("取り出した値: " + n);
  sum += n;
}
console.log("合計: " + sum);
`,
      solution: `const range = {
  start: 1,
  end: 5,
  [Symbol.iterator]: function () {
    let current = this.start;
    const last = this.end;
    return {
      next: function () {
        // currentがlast以下なら値を返し、currentを1進める
        if (current <= last) {
          return { value: current++, done: false };
        }
        // 超えていたら終了を伝える
        return { value: undefined, done: true };
      }
    };
  }
};

let sum = 0;
for (const n of range) {
  console.log("取り出した値: " + n);
  sum += n;
}
console.log("合計: " + sum);
`,
      hints: [
        `next()は毎回 { value: 値, done: 真偽値 } の形のオブジェクトを返す必要があります。`,
        `if (current <= last) { return { value: current++, done: false }; } と書きます。current++は「値を使ってから1増やす」後置インクリメントです。`,
        `1から5まで取り出され、合計が15になれば正解です。`
      ],
      expectedOutput: "合計: 15"
    },
    {
      id: 154,
      title: "ジェネレータ関数function*とyield",
      explanation: `<p>前のステップの独自イテレータは、正しく書けるものの手間がかかりました。そこで登場するのが「ジェネレータ関数」です。<code>function*</code>（アスタリスク付き）で定義し、<code>yield</code>（イールド、「値を産出する」の意）というキーワードで値を1つずつ差し出します。</p>
<pre><code>function* greet() {
  yield "おはよう";
  yield "こんにちは";
  yield "こんばんは";
}

for (const word of greet()) {
  console.log(word);
}
// おはよう こんにちは こんばんは
</code></pre>
<p>ジェネレータ関数を呼び出しても、中身はまだ実行されません。返ってくるのは「ジェネレータオブジェクト」で、これはイテレータそのものです。<code>next()</code>が呼ばれて初めて、次の<code>yield</code>まで実行が進みます。</p>
<pre><code>function* demo() {
  console.log("ここは1回目のnextで動く");
  yield 1;
  console.log("ここは2回目のnextで動く");
  yield 2;
}

const gen = demo();
console.log("まだ何も表示されていない");
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
</code></pre>
<p>普通の関数は呼ばれたら最後まで一気に走りますが、ジェネレータは<strong><code>yield</code>のところで一時停止し、次の<code>next()</code>で続きから再開する</strong>のが決定的な違いです。関数の途中の状態（ローカル変数の値や実行位置）が丸ごと保存されるため、前ステップで手書きした「現在位置の管理」を言語が肩代わりしてくれます。ジェネレータオブジェクトはイテレータであると同時にイテラブルでもあるので、そのまま<code>for...of</code>にかけられます。</p>`,
      task: `曜日を順に返すジェネレータ関数weekdaysを完成させましょう。TODOの箇所にyieldを3つ書いて「月曜」「火曜」「水曜」を順に産出してください。`,
      code: `function* weekdays() {
  // TODO: 「月曜」「火曜」「水曜」を順にyieldする

}

for (const day of weekdays()) {
  console.log("曜日: " + day);
}

// next()で1つずつ取り出すこともできる
const gen = weekdays();
console.log("最初の値: " + gen.next().value);
`,
      solution: `function* weekdays() {
  // yieldするたびに一時停止し、次のnext()で再開される
  yield "月曜";
  yield "火曜";
  yield "水曜";
}

for (const day of weekdays()) {
  console.log("曜日: " + day);
}

// next()で1つずつ取り出すこともできる
const gen = weekdays();
console.log("最初の値: " + gen.next().value);
`,
      hints: [
        `yield 値; を1行に1つずつ、返したい順に並べます。`,
        `yield "月曜"; yield "火曜"; yield "水曜"; の3行です。functionの後ろの*を消さないよう注意しましょう。`
      ],
      expectedOutput: "曜日: 火曜"
    },
    {
      id: 155,
      title: "ジェネレータで数列を作る",
      explanation: `<p>ジェネレータの真価は、<code>yield</code>をループの中で使ったときに発揮されます。「規則に従って次々に値を生む数列」が、驚くほど素直に書けるのです。</p>
<pre><code>// 1からnまでの整数を生むジェネレータ
function* countUp(n) {
  for (let i = 1; i &lt;= n; i++) {
    yield i;
  }
}

for (const num of countUp(3)) {
  console.log(num); // 1 2 3
}
</code></pre>
<p>ステップ153で書いた範囲オブジェクトと同じ機能が、たった数行になりました。現在位置の変数も<code>{ value, done }</code>の組み立ても不要です。ループが<code>yield</code>に到達するたびに一時停止し、呼び出し側が次を要求したら続きから回る、という動きを言語が自動で行ってくれます。</p>
<p>もう少し実践的な例として、フィボナッチ数列（前の2つの数の和が次の数になる数列：1, 1, 2, 3, 5, 8, ...）を生成してみましょう。</p>
<pre><code>function* fibonacci(count) {
  let a = 1;
  let b = 1;
  for (let i = 0; i &lt; count; i++) {
    yield a;
    const next = a + b;
    a = b;
    b = next;
  }
}
</code></pre>
<p>変数<code>a</code>と<code>b</code>は<code>yield</code>で停止している間もずっと保持され、再開のたびに更新されていきます。「状態を持ちながら値を順に生む」処理は、ジェネレータを使わないと専用のクラスやクロージャが必要になりますが、ジェネレータなら普通のループを書く感覚で実現できます。ジェネレータで受け取った値は<code>Array.from</code>で配列にまとめることもできます。</p>`,
      task: `フィボナッチ数列を生成するジェネレータを完成させましょう。TODOの箇所で、aをyieldしてから、aとbを次の値に更新する処理を書いてください。`,
      code: `function* fibonacci(count) {
  let a = 1;
  let b = 1;
  for (let i = 0; i < count; i++) {
    // TODO: aをyieldする

    // TODO: 次の値（a + b）を計算し、aにbを、bに計算結果を入れる

  }
}

const result = Array.from(fibonacci(6));
console.log("フィボナッチ: " + result.join(","));
`,
      solution: `function* fibonacci(count) {
  let a = 1;
  let b = 1;
  for (let i = 0; i < count; i++) {
    // 現在の値を産出する（ここで一時停止する）
    yield a;
    // 前の2つの和を次の値にする
    const next = a + b;
    a = b;
    b = next;
  }
}

const result = Array.from(fibonacci(6));
console.log("フィボナッチ: " + result.join(","));
`,
      hints: [
        `まずyield a;で現在の値を差し出し、その後で次の値の準備をします。`,
        `const next = a + b; a = b; b = next; の3行で「1つずらす」更新ができます。`,
        `結果が1,1,2,3,5,8になれば正解です。`
      ],
      expectedOutput: "フィボナッチ: 1,1,2,3,5,8"
    },
    {
      id: 156,
      title: "無限ジェネレータとbreak",
      explanation: `<p>ジェネレータならではの面白い技が「無限に値を生むジェネレータ」です。普通の関数で<code>while (true)</code>と書いたら無限ループで固まってしまいますが、ジェネレータは<code>yield</code>のたびに止まるので、<strong>呼び出し側が要求した分しか実行されません</strong>。</p>
<pre><code>// 2の累乗を無限に生むジェネレータ
function* powersOfTwo() {
  let value = 1;
  while (true) {
    yield value;
    value *= 2;
  }
}
</code></pre>
<p>このジェネレータ自体は終わりを持ちませんが、呼び出し側が<code>break</code>で打ち切れば問題ありません。</p>
<pre><code>for (const n of powersOfTwo()) {
  if (n &gt; 100) {
    break; // 100を超えたらやめる
  }
  console.log(n); // 1 2 4 8 16 32 64
}
</code></pre>
<p>「終わりを決めるのは生産者ではなく消費者」という役割分担がポイントです。数列を作る側は純粋に規則だけを書き、どこまで使うかは使う側が決める。この分離によって、同じジェネレータを「最初の5個だけ」「1000未満まで」など様々な場面で再利用できます。</p>
<p>注意点として、無限ジェネレータを<code>Array.from</code>や<code>for...of</code>（breakなし）に渡すと本当に無限ループになります。「必ずどこかで打ち切る」ことが使う側の責任です。また、<code>for...of</code>を<code>break</code>で抜けるとジェネレータには終了が通知され、それ以降は<code>done: true</code>になります。途中で捨てても後始末が行われる、行儀の良い仕組みになっています。</p>`,
      task: `2の累乗を無限に生むジェネレータから、16以下の値だけを取り出しましょう。TODOの箇所で「nが16を超えたらbreakする」条件を書いてください。`,
      code: `function* powersOfTwo() {
  let value = 1;
  while (true) {
    yield value;
    value *= 2;
  }
}

const collected = [];
for (const n of powersOfTwo()) {
  // TODO: nが16を超えたらbreakでループを抜ける

  collected.push(n);
}

console.log("取り出した値: " + collected.join(","));
console.log("個数: " + collected.length);
`,
      solution: `function* powersOfTwo() {
  let value = 1;
  while (true) {
    yield value;
    value *= 2;
  }
}

const collected = [];
for (const n of powersOfTwo()) {
  // 16を超えたら消費側の判断で打ち切る
  if (n > 16) {
    break;
  }
  collected.push(n);
}

console.log("取り出した値: " + collected.join(","));
console.log("個数: " + collected.length);
`,
      hints: [
        `無限ジェネレータは、使う側がbreakしない限り止まりません。pushの前に打ち切り判定を入れます。`,
        `if (n > 16) { break; } をcollected.push(n)より前に書きます。1,2,4,8,16の5個が集まれば正解です。`
      ],
      expectedOutput: "取り出した値: 1,2,4,8,16"
    },
    {
      id: 157,
      title: "yield*で委譲",
      explanation: `<p>ジェネレータの中から別のイテラブルの値を「まとめて流し込みたい」ことがあります。素朴に書くとループになりますが、専用の構文<code>yield*</code>（yieldアスタリスク）を使うと1行で書けます。これを「委譲（デリゲーション）」と呼びます。他のイテラブルに産出を任せる、という意味です。</p>
<pre><code>function* inner() {
  yield 2;
  yield 3;
}

function* outer() {
  yield 1;
  yield* inner(); // innerの値を全部順番に産出する
  yield 4;
}

console.log(Array.from(outer())); // [1, 2, 3, 4]
</code></pre>
<p><code>yield inner()</code>（アスタリスクなし）と書いてしまうと、「ジェネレータオブジェクトそのもの」を1個の値として産出してしまうので注意してください。中身を展開して1つずつ産出するのが<code>yield*</code>です。</p>
<p><code>yield*</code>の後ろにはジェネレータに限らず、配列や文字列などあらゆるイテラブルを置けます。</p>
<pre><code>function* mixed() {
  yield* [10, 20];   // 配列の要素を順に産出
  yield* "AB";       // 文字列を1文字ずつ産出
}
console.log(Array.from(mixed())); // [10, 20, "A", "B"]
</code></pre>
<p>実用面では、<strong>複数のデータ源を1本の流れに合流させる</strong>ときに便利です。たとえば「固定のメニュー＋ユーザー定義のメニュー」を1つのジェネレータとして提供する、ツリー構造を再帰的にたどって全ノードを平らに列挙する、といった処理が<code>yield*</code>で簡潔に書けます。部品となる小さなジェネレータを組み合わせて大きな流れを作る、という発想を覚えておきましょう。</p>`,
      task: `前半と後半のジェネレータを合流させて1、2、3、4、5を順に産出するジェネレータallNumbersを完成させましょう。TODOの2箇所でyield*を使って委譲してください。`,
      code: `function* firstHalf() {
  yield 1;
  yield 2;
}

function* secondHalf() {
  yield 4;
  yield 5;
}

function* allNumbers() {
  // TODO: firstHalf()に委譲する

  yield 3;
  // TODO: secondHalf()に委譲する

}

const result = Array.from(allNumbers());
console.log("結果: " + result.join(","));
`,
      solution: `function* firstHalf() {
  yield 1;
  yield 2;
}

function* secondHalf() {
  yield 4;
  yield 5;
}

function* allNumbers() {
  // yield*でfirstHalfの値をすべて産出する
  yield* firstHalf();
  yield 3;
  // yield*でsecondHalfの値をすべて産出する
  yield* secondHalf();
}

const result = Array.from(allNumbers());
console.log("結果: " + result.join(","));
`,
      hints: [
        `別のジェネレータの中身を展開して産出するには、yieldではなくyield*を使います。`,
        `yield* firstHalf(); と yield* secondHalf(); を書きます。関数呼び出しの()を忘れないようにしましょう。`,
        `結果が1,2,3,4,5の順になれば正解です。`
      ],
      expectedOutput: "結果: 1,2,3,4,5"
    },
    {
      id: 158,
      title: "ジェネレータで遅延評価パイプライン",
      explanation: `<p>配列の<code>map</code>や<code>filter</code>は便利ですが、呼ぶたびに<strong>全要素を処理した新しい配列</strong>を作ります。100万件のデータから条件に合う最初の3件だけ欲しいときも、まず100万件全部を変換してしまうのは無駄です。ジェネレータを使うと「必要になった要素だけをその都度処理する」<strong>遅延評価（lazy evaluation）</strong>のパイプラインが作れます。</p>
<p>ジェネレータを「加工装置」として定義し、別のイテラブルを受け取って加工しながら流します。</p>
<pre><code>// 偶数だけを通すフィルタ装置
function* filterEven(source) {
  for (const n of source) {
    if (n % 2 === 0) {
      yield n;
    }
  }
}

// 2倍にする変換装置
function* double(source) {
  for (const n of source) {
    yield n * 2;
  }
}
</code></pre>
<p>装置同士は入れ子にして接続できます。データは配列のように一括で流れるのではなく、<strong>1個ずつパイプを通り抜けていきます</strong>。</p>
<pre><code>function* numbers(limit) {
  for (let i = 1; i &lt;= limit; i++) {
    yield i;
  }
}

const pipeline = double(filterEven(numbers(1000000)));
// この時点では何も計算されていない！

for (const n of pipeline) {
  console.log(n); // 4 8 12 ...（要求されるたびに計算される）
  if (n &gt;= 12) {
    break; // 3個で打ち切れば、残りの約100万件は一切処理されない
  }
}
</code></pre>
<p>パイプラインを組み立てた時点では計算ゼロ、<code>for...of</code>が値を要求して初めて上流にさかのぼって1個分だけ計算される、というのが遅延評価の動きです。大量データやログの逐次処理で威力を発揮する、実務でも役立つパターンです。</p>`,
      task: `1から始まる整数をフィルタして2倍にするパイプラインを完成させましょう。TODOの箇所でdouble装置（受け取った各値を2倍にしてyieldする）を実装してください。`,
      code: `function* numbers(limit) {
  for (let i = 1; i <= limit; i++) {
    yield i;
  }
}

function* filterEven(source) {
  for (const n of source) {
    if (n % 2 === 0) {
      yield n;
    }
  }
}

function* double(source) {
  // TODO: sourceから値を1つずつ受け取り、2倍にしてyieldする

}

const pipeline = double(filterEven(numbers(1000000)));

const results = [];
for (const n of pipeline) {
  results.push(n);
  if (results.length >= 3) {
    break;
  }
}

console.log("パイプライン結果: " + results.join(","));
`,
      solution: `function* numbers(limit) {
  for (let i = 1; i <= limit; i++) {
    yield i;
  }
}

function* filterEven(source) {
  for (const n of source) {
    if (n % 2 === 0) {
      yield n;
    }
  }
}

function* double(source) {
  // 値が要求されるたびに、上流から1つ受け取って2倍にして流す
  for (const n of source) {
    yield n * 2;
  }
}

const pipeline = double(filterEven(numbers(1000000)));

const results = [];
for (const n of pipeline) {
  results.push(n);
  if (results.length >= 3) {
    break;
  }
}

console.log("パイプライン結果: " + results.join(","));
`,
      hints: [
        `filterEvenと同じ構造です。条件分岐の代わりに値を変換してyieldします。`,
        `for (const n of source) { yield n * 2; } と書きます。`,
        `100万件を指定しても一瞬で終わるのは、3個分しか計算していないからです。結果は4,8,12になります。`
      ],
      expectedOutput: "パイプライン結果: 4,8,12"
    },
    {
      id: 159,
      title: "スプレッド構文・分割代入とイテラブルの関係",
      explanation: `<p>実は、これまで配列で使ってきたスプレッド構文（<code>...</code>）と分割代入は、内部で<strong>イテラブルの仕組みをそのまま使っています</strong>。つまり「配列専用の機能」ではなく「イテラブルなら何でも使える機能」なのです。ジェネレータもイテラブルなので、そのまま展開できます。</p>
<pre><code>function* gen() {
  yield 10;
  yield 20;
  yield 30;
}

// スプレッド構文：全要素を取り出して配列にする
const arr = [...gen()]; // [10, 20, 30]

// 分割代入：先頭から必要な数だけ取り出す
const [first, second] = gen();
console.log(first, second); // 10 20
</code></pre>
<p>分割代入で注目すべきは、<strong>必要な数しか<code>next()</code>が呼ばれない</strong>ことです。上の例では2回しか取り出されないので、3つ目の<code>yield</code>は実行されません。前ステップの遅延評価と同じ性質がここでも生きています（このため無限ジェネレータでも分割代入は安全に使えますが、スプレッドは全要素を取り出すため無限ジェネレータに使うと止まらなくなります）。</p>
<p>SetやMap、文字列でも同じことができます。</p>
<pre><code>const unique = new Set([1, 2, 2, 3]);
const uniqueArr = [...unique]; // [1, 2, 3]（重複排除の定番ワザ）

const chars = [..."abc"]; // ["a", "b", "c"]

const [head, ...rest] = [1, 2, 3, 4];
console.log(head); // 1
console.log(rest); // [2, 3, 4]（残りをまとめて受け取るレスト要素）
</code></pre>
<p>第15章では<code>Array.from</code>でSetを配列化しましたが、<code>[...set]</code>も同じ結果になります。<code>for...of</code>・スプレッド・分割代入・<code>Array.from</code>・<code>yield*</code>は、すべて同じ「イテラブルプロトコル」の上に成り立つ仲間だと分かると、言語の見通しが一気に良くなります。</p>`,
      task: `ジェネレータに対してスプレッド構文と分割代入を使ってみましょう。TODOの2箇所を埋めて、全要素の配列化と、先頭2つの取り出しを行ってください。`,
      code: `function* gen() {
  yield 10;
  yield 20;
  yield 30;
}

// TODO: スプレッド構文でgen()の全要素を配列にする
const all = [];

// TODO: 分割代入でgen()の先頭2つをfirstとsecondに取り出す
const first = 0;
const second = 0;

console.log("全要素: " + all.join(","));
console.log("先頭2つ: " + first + "と" + second);

// Setにも同じことができる（重複排除の定番）
const uniqueArr = [...new Set([1, 2, 2, 3])];
console.log("重複排除: " + uniqueArr.join(","));
`,
      solution: `function* gen() {
  yield 10;
  yield 20;
  yield 30;
}

// スプレッド構文でジェネレータの全要素を配列にする
const all = [...gen()];

// 分割代入で先頭2つだけ取り出す（3つ目のyieldは実行されない）
const [first, second] = gen();

console.log("全要素: " + all.join(","));
console.log("先頭2つ: " + first + "と" + second);

// Setにも同じことができる（重複排除の定番）
const uniqueArr = [...new Set([1, 2, 2, 3])];
console.log("重複排除: " + uniqueArr.join(","));
`,
      hints: [
        `スプレッド構文は[...イテラブル]、分割代入は const [a, b] = イテラブル; の形です。ジェネレータは呼び出す（()を付ける）のを忘れずに。`,
        `const all = [...gen()]; と const [first, second] = gen(); です。firstとsecondを別々のconstで宣言している行は削除して1行にまとめます。`
      ],
      expectedOutput: "先頭2つ: 10と20"
    },
    {
      id: 160,
      title: "総合演習（ページネーションジェネレータ）",
      explanation: `<p>この章の総仕上げとして、実務で頻出する「ページネーション（ページ分割）」をジェネレータで実装します。ページネーションとは、大量のデータを一定件数ずつの「ページ」に区切って順に提供する仕組みです。検索結果の「次のページ」やAPIの分割取得で必ず登場します。</p>
<p>設計はシンプルです。配列とページサイズを受け取り、<code>slice</code>で切り出した部分配列を1ページとして<code>yield</code>していきます。</p>
<pre><code>function* paginate(items, pageSize) {
  for (let i = 0; i &lt; items.length; i += pageSize) {
    yield items.slice(i, i + pageSize);
  }
}
</code></pre>
<p>ポイントを整理します。</p>
<ul>
<li>ループ変数<code>i</code>は<code>pageSize</code>ずつ進む（0、3、6、...）</li>
<li><code>slice(i, i + pageSize)</code>は範囲外を指定しても安全で、最後のページは残りの要素だけになる</li>
<li>ジェネレータなので、<strong>要求されるまで次のページは作られない</strong>。「ユーザーが次のページを押したときだけ処理する」という実際のUIの動きと自然に対応する</li>
</ul>
<p>使う側は2通りの顔を使い分けられます。全ページを一気に処理するなら<code>for...of</code>、「次のページ」ボタンのように1ページずつ進めるなら<code>next()</code>です。</p>
<pre><code>const pager = paginate(data, 3);
const page1 = pager.next(); // { value: [最初の3件], done: false }
const page2 = pager.next(); // 次の3件
</code></pre>
<p>この章で学んだ「イテレータの<code>next()</code>」「ジェネレータの一時停止」「遅延評価」がすべて1つの部品に詰まっています。小さいながらも実用品と呼べるコードです。自信を持って完成させましょう。</p>`,
      task: `ページネーションジェネレータを完成させましょう。TODOの箇所で、iをpageSizeずつ進めるループを書き、sliceで切り出した1ページ分をyieldしてください。`,
      code: `function* paginate(items, pageSize) {
  // TODO: iを0からitems.lengthまでpageSizeずつ進め、
  //       items.slice(i, i + pageSize)をyieldする

}

const items = ["a", "b", "c", "d", "e", "f", "g"];

let pageNo = 1;
for (const page of paginate(items, 3)) {
  console.log("ページ" + pageNo + ": " + page.join(","));
  pageNo++;
}

// next()で「次のページ」ボタンのように1ページずつ進める
const pager = paginate(items, 3);
console.log("最初のページ: " + pager.next().value.join(","));
console.log("次のページ: " + pager.next().value.join(","));
console.log("総ページ数: " + Math.ceil(items.length / 3));
`,
      solution: `function* paginate(items, pageSize) {
  // pageSizeずつ進めながら、1ページ分ずつ切り出して産出する
  for (let i = 0; i < items.length; i += pageSize) {
    yield items.slice(i, i + pageSize);
  }
}

const items = ["a", "b", "c", "d", "e", "f", "g"];

let pageNo = 1;
for (const page of paginate(items, 3)) {
  console.log("ページ" + pageNo + ": " + page.join(","));
  pageNo++;
}

// next()で「次のページ」ボタンのように1ページずつ進める
const pager = paginate(items, 3);
console.log("最初のページ: " + pager.next().value.join(","));
console.log("次のページ: " + pager.next().value.join(","));
console.log("総ページ数: " + Math.ceil(items.length / 3));
`,
      hints: [
        `for (let i = 0; i < items.length; i += pageSize) で、iがページの先頭位置になります。`,
        `ループの中は yield items.slice(i, i + pageSize); の1行だけです。`,
        `7件を3件ずつに分けるので、ページ1がa,b,c、ページ2がd,e,f、ページ3がgの3ページになれば正解です。`
      ],
      expectedOutput: "ページ1: a,b,c"
    }
  ]
});
