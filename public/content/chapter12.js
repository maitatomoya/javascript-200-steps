// 第12章：継承とエラー処理
registerChapter({
  number: 12,
  title: "継承とエラー処理",
  description: "クラスの機能を引き継ぐ継承（extends・super）と、プログラムの異常を安全に扱うエラー処理（throw・try...catch）を学び、壊れにくいプログラムを書けるようになります。",
  steps: [
    {
      id: 111,
      title: "extends（継承）",
      explanation: `<p>前の章で作ったクラスに「ほぼ同じだけど少しだけ違うクラス」を追加したくなったら、どうすればよいでしょうか。コードをコピーするのは重複が増えて修正が大変です。そこで使うのが<strong>継承（けいしょう）</strong>です。</p>
<p><code>class 子クラス extends 親クラス</code>と書くと、子クラスは<strong>親クラスのプロパティとメソッドをすべて引き継ぎます</strong>。子クラスには「追加したい機能」だけを書けばよいのです。</p>
<pre><code>class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + "はエサを食べた");
  }
}

// DogはAnimalのすべてを引き継ぐ
class Dog extends Animal {
  bark() {
    console.log(this.name + ": ワンワン！");
  }
}

const pochi = new Dog("ポチ");
pochi.eat();  // 親から引き継いだメソッドが使える
pochi.bark(); // 自分だけのメソッドも使える
</code></pre>
<p>用語を整理します。継承元（Animal）を<strong>親クラス（スーパークラス）</strong>、継承先（Dog）を<strong>子クラス（サブクラス）</strong>と呼びます。継承は「DogはAnimalの一種である（is-aの関係）」が成り立つときに使うのが原則です。</p>
<p>なお、子クラスにconstructorを書かない場合は、<strong>親クラスのconstructorが自動的にそのまま使われます</strong>。上の例で<code>new Dog("ポチ")</code>と書けるのはそのためです。子クラス独自のconstructorを書く方法は次のステップで学びます。</p>`,
      task: `Animalを継承した<code>Cat</code>クラスを追加してください。<code>meow</code>メソッドを持ち、「タマ: ニャー」と鳴きます。インスタンスを作って<code>eat</code>と<code>meow</code>を呼び出してください。`,
      code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + "はエサを食べた");
  }
}

class Dog extends Animal {
  bark() {
    console.log(this.name + ": ワンワン！");
  }
}

const pochi = new Dog("ポチ");
pochi.eat();
pochi.bark();

// TODO: Animalを継承したCatクラスを定義する（meowメソッドで「名前: ニャー」と表示）

// TODO: 名前が「タマ」のCatインスタンスを作り、eat()とmeow()を呼ぶ
`,
      solution: `class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + "はエサを食べた");
  }
}

class Dog extends Animal {
  bark() {
    console.log(this.name + ": ワンワン！");
  }
}

const pochi = new Dog("ポチ");
pochi.eat();
pochi.bark();

// Animalを継承したCatクラス
class Cat extends Animal {
  meow() {
    console.log(this.name + ": ニャー");
  }
}

const tama = new Cat("タマ");
tama.eat();
tama.meow();
`,
      hints: [
        `Dogクラスの定義とまったく同じ形で、クラス名とメソッド名と鳴き声だけを変えます。`,
        `「class Cat extends Animal { meow() { ... } }」と定義し、「const tama = new Cat("タマ");」でインスタンスを作ります。`
      ],
      expectedOutput: "タマ: ニャー"
    },
    {
      id: 112,
      title: "super",
      explanation: `<p>子クラスに独自のconstructorを書きたいとき、たとえば「Dogは名前に加えて犬種（breed）も持つ」ようにしたいときは、<strong><code>super()</code></strong>を使います。<code>super()</code>は<strong>親クラスのconstructorを呼び出す</strong>特別な命令です。</p>
<pre><code>class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + "はエサを食べた");
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);        // 親のconstructorにnameを渡す
    this.breed = breed; // 子クラス独自のプロパティを追加
  }
  introduce() {
    console.log(this.name + "（" + this.breed + "）です");
  }
}
</code></pre>
<p>絶対に守るべきルールが1つあります。<strong>子クラスのconstructorでは、thisを使う前に必ずsuper()を呼ぶ</strong>ことです。順番を逆にすると「Must call super constructor before accessing 'this'」というReferenceErrorになります。インスタンスの土台は親クラスが作るため、土台ができる前にthisを触れない、とイメージしてください。</p>
<p>また、<code>super.メソッド名()</code>と書くと<strong>親クラスのメソッドを明示的に呼び出す</strong>こともできます。これは次のステップ「オーバーライド」で活躍します。</p>
<table>
<tr><th>書き方</th><th>意味</th><th>使える場所</th></tr>
<tr><td>super(引数)</td><td>親のconstructorを呼ぶ</td><td>子のconstructor内のみ</td></tr>
<tr><td>super.メソッド名()</td><td>親のメソッドを呼ぶ</td><td>子のメソッド内</td></tr>
</table>`,
      task: `Dogクラスにconstructorを追加してください。<code>name</code>と<code>breed</code>（犬種）を受け取り、<code>super(name)</code>で親に名前を渡してから、<code>this.breed</code>に犬種を保存します。`,
      code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + "はエサを食べた");
  }
}

class Dog extends Animal {
  // TODO: nameとbreedを受け取るconstructorを定義する
  // 先にsuper(name)を呼び、その後this.breedにbreedを保存する

  introduce() {
    console.log("名前: " + this.name + "、犬種: " + this.breed);
  }
}

const pochi = new Dog("ポチ", "柴犬");
pochi.introduce();
pochi.eat();
`,
      solution: `class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + "はエサを食べた");
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // thisを使う前に必ずsuper()を呼ぶ
    super(name);
    this.breed = breed;
  }

  introduce() {
    console.log("名前: " + this.name + "、犬種: " + this.breed);
  }
}

const pochi = new Dog("ポチ", "柴犬");
pochi.introduce();
pochi.eat();
`,
      hints: [
        `constructorの1行目はsuper(name)です。this.breed = breedはその後に書きます。`,
        `「constructor(name, breed) { super(name); this.breed = breed; }」の形になります。順番を逆にするとReferenceErrorになるので試してみましょう。`
      ],
      expectedOutput: "名前: ポチ、犬種: 柴犬"
    },
    {
      id: 113,
      title: "オーバーライド",
      explanation: `<p>子クラスで<strong>親クラスと同じ名前のメソッドを定義し直す</strong>ことを<strong>オーバーライド（上書き）</strong>と呼びます。同じメソッド名で呼び出しても、インスタンスのクラスに応じて違う動きをさせられます。</p>
<pre><code>class Animal {
  constructor(name) {
    this.name = name;
  }
  cry() {
    console.log(this.name + "が鳴いた");
  }
}

class Dog extends Animal {
  cry() {
    // 親のcryを上書きして、犬専用の鳴き方にする
    console.log(this.name + ": ワンワン！");
  }
}

new Animal("何かの動物").cry(); // 何かの動物が鳴いた
new Dog("ポチ").cry();          // ポチ: ワンワン！
</code></pre>
<p>「親の処理を完全に置き換える」のではなく<strong>「親の処理に追加したい」</strong>場合は、前のステップで学んだ<code>super.メソッド名()</code>をオーバーライドしたメソッドの中で呼びます。</p>
<pre><code>class Dog extends Animal {
  cry() {
    super.cry(); // まず親のcryを実行してから
    console.log("ワンワン！"); // 独自の処理を追加
  }
}
</code></pre>
<p>オーバーライドの実用例は身近にあります。実は<code>console.log</code>にオブジェクトを渡したときの表示や、文字列連結時の変換で使われる<code>toString</code>メソッドも、各クラスがオーバーライドして自分向けの表示を提供しているのです。「同じ名前の呼び出しで、クラスごとに適切な振る舞いをする」性質は<strong>ポリモーフィズム（多態性）</strong>と呼ばれ、オブジェクト指向の重要な柱の1つです。</p>`,
      task: `Dogクラスで<code>introduce</code>メソッドをオーバーライドしてください。まず<code>super.introduce()</code>で親の自己紹介を実行し、続けて「ワンワン！よろしく！」と表示します。`,
      code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  introduce() {
    console.log("私は" + this.name + "です");
  }
}

class Dog extends Animal {
  // TODO: introduceをオーバーライドする
  // super.introduce()を呼んだ後、「ワンワン！よろしく！」と表示する
}

const pochi = new Dog("ポチ");
pochi.introduce();
`,
      solution: `class Animal {
  constructor(name) {
    this.name = name;
  }
  introduce() {
    console.log("私は" + this.name + "です");
  }
}

class Dog extends Animal {
  introduce() {
    // まず親クラスの自己紹介を実行する
    super.introduce();
    // その後に犬独自のあいさつを追加する
    console.log("ワンワン！よろしく！");
  }
}

const pochi = new Dog("ポチ");
pochi.introduce();
`,
      hints: [
        `子クラスに親と同じ名前のintroduce() { ... }を定義すると上書きされます。`,
        `メソッドの中身は「super.introduce();」と「console.log("ワンワン！よろしく！");」の2行です。`
      ],
      expectedOutput: "ワンワン！よろしく！"
    },
    {
      id: 114,
      title: "継承よりコンポジション",
      explanation: `<p>継承は便利ですが、<strong>使いすぎると逆にコードが壊れやすくなる</strong>ことが知られています。たとえば「車クラス」を作るとき、エンジンの機能を継承で取り込むと「車はエンジンの一種」という不自然な関係になってしまいます。継承の階層が深くなると、親クラスの小さな変更がすべての子孫クラスに影響し、修正が困難になります。</p>
<p>そこで実務では<strong>「継承よりコンポジション（合成）を優先せよ」</strong>という設計原則がよく使われます。コンポジションとは、<strong>必要な機能を持つオブジェクトをプロパティとして持つ（部品として組み込む）</strong>方法です。</p>
<pre><code>class Engine {
  start() {
    console.log("エンジン始動");
  }
}

class Car {
  constructor() {
    this.engine = new Engine(); // 部品として持つ
  }
  drive() {
    this.engine.start(); // 部品に仕事を任せる
    console.log("車が走り出した");
  }
}
</code></pre>
<p>使い分けの目安は関係性の言葉にすると分かりやすいです。</p>
<table>
<tr><th>関係</th><th>読み方</th><th>使う手法</th><th>例</th></tr>
<tr><td>is-a</td><td>〜は〜の一種である</td><td>継承（extends）</td><td>犬は動物の一種</td></tr>
<tr><td>has-a</td><td>〜は〜を持っている</td><td>コンポジション</td><td>車はエンジンを持つ</td></tr>
</table>
<p>コンポジションなら部品の差し替えが簡単で（電気モーターに交換など）、部品単体のテストもしやすくなります。継承は「is-aが自然に成り立ち、親の機能をほぼそのまま使う」場合に限定するのが安全です。</p>`,
      task: `「プップー！」と鳴る<code>Horn</code>（クラクション）クラスを部品として作り、CarクラスにHornを組み込んでください。Carの<code>honk</code>メソッドで<code>this.horn.beep()</code>を呼び出します。`,
      code: `class Engine {
  start() {
    console.log("エンジン始動");
  }
}

// TODO: beepメソッドで「プップー！」と表示するHornクラスを定義する

class Car {
  constructor() {
    this.engine = new Engine();
    // TODO: this.hornにHornのインスタンスを部品として持たせる
  }

  drive() {
    this.engine.start();
    console.log("車が走り出した");
  }

  honk() {
    // TODO: 部品のhornに仕事を任せる（this.horn.beep()）
  }
}

const car = new Car();
car.drive();
car.honk();
`,
      solution: `class Engine {
  start() {
    console.log("エンジン始動");
  }
}

// クラクションも独立した部品クラスとして定義する
class Horn {
  beep() {
    console.log("プップー！");
  }
}

class Car {
  constructor() {
    // 継承ではなく、部品として組み込む（コンポジション）
    this.engine = new Engine();
    this.horn = new Horn();
  }

  drive() {
    this.engine.start();
    console.log("車が走り出した");
  }

  honk() {
    // 部品に仕事を任せる
    this.horn.beep();
  }
}

const car = new Car();
car.drive();
car.honk();
`,
      hints: [
        `HornはEngineと同じ形の小さなクラスです。CarはextendsせずにconstructorでnewしてプロパティにHornを持ちます。`,
        `constructorに「this.horn = new Horn();」を追加し、honkメソッドの中で「this.horn.beep();」を呼びます。`
      ],
      expectedOutput: "プップー！"
    },
    {
      id: 115,
      title: "throw",
      explanation: `<p>ここからはエラー処理を学びます。プログラムでは「0で割ろうとした」「必須の値が空だった」など、<strong>処理を続けてはいけない異常事態</strong>が起こります。そんなとき、<code>throw</code>（スロー：投げる）文で<strong>エラーを発生させて処理を強制的に中断</strong>できます。</p>
<pre><code>function divide(a, b) {
  if (b === 0) {
    // Errorオブジェクトを作って投げる
    throw new Error("0で割ることはできません");
  }
  return a / b;
}
</code></pre>
<p><code>new Error("メッセージ")</code>でエラーオブジェクトを作り、<code>throw</code>で投げます。throwが実行されると、<strong>その行で関数の実行は即座に打ち切られ</strong>、returnには到達しません。</p>
<p>投げられたエラーを誰も受け止めない（キャッチしない）場合、プログラム全体が停止し、エラーメッセージが表示されます。これは一見怖い挙動ですが、<strong>間違った値のまま処理を続けて壊れたデータを作るより、すぐ止まる方が安全</strong>という考え方に基づいています。</p>
<p>「エラーを返す」のではなく「投げる」利点は次の通りです。</p>
<ul>
<li>戻り値と混ざらない（-1やnullを「エラーの印」に使う必要がない）</li>
<li>呼び出し側がエラーの見逃しに気づける（受け止めなければ止まるため）</li>
<li>エラーメッセージで原因を正確に伝えられる</li>
</ul>
<p>投げたエラーを受け止めて処理を続ける方法（try...catch）は、次のステップで学びます。</p>`,
      task: `<code>divide</code>関数を完成させてください。<code>b</code>が0のときは<code>throw new Error("0で割ることはできません")</code>でエラーを投げ、それ以外は割り算の結果を返します。`,
      code: `function divide(a, b) {
  // TODO: bが0ならエラーを投げる（メッセージは「0で割ることはできません」）

  return a / b;
}

console.log("10 / 2 = " + divide(10, 2));
console.log("20 / 4 = " + divide(20, 4));
`,
      solution: `function divide(a, b) {
  if (b === 0) {
    // 処理を続けられない異常事態なのでエラーを投げて中断する
    throw new Error("0で割ることはできません");
  }
  return a / b;
}

console.log("10 / 2 = " + divide(10, 2));
console.log("20 / 4 = " + divide(20, 4));
`,
      hints: [
        `関数の先頭で「if (b === 0)」をチェックし、条件を満たしたらthrowします（ガード節）。`,
        `「throw new Error("0で割ることはできません");」と書きます。試しにdivide(10, 0)を呼んでプログラムが止まる様子も観察してみましょう。`
      ],
      expectedOutput: "10 / 2 = 5"
    },
    {
      id: 116,
      title: "try...catch",
      explanation: `<p>前のステップで、投げられたエラーを誰も受け止めないとプログラム全体が停止することを学びました。エラーを<strong>受け止めて（キャッチして）プログラムを続行する</strong>仕組みが<code>try...catch</code>（トライ・キャッチ）文です。</p>
<pre><code>try {
  // エラーが起こる可能性のある処理をこの中に書く
  const result = divide(10, 0);
  console.log(result); // エラーが投げられるとここは実行されない
} catch (error) {
  // エラーが投げられたら、ここに飛んでくる
  console.log("エラーが発生: " + error.message);
}
console.log("プログラムは続行できる");
</code></pre>
<p>動きの流れを整理します。</p>
<ol>
<li><code>try</code>ブロックの中を上から実行する</li>
<li>エラーが投げられた瞬間、tryブロックの残りをスキップして<code>catch</code>に移動する</li>
<li><code>catch (error)</code>の<code>error</code>には、投げられたErrorオブジェクトが入る</li>
<li>catchを抜けた後、プログラムは通常どおり続行する</li>
</ol>
<p><code>error.message</code>で、throwのときに<code>new Error("...")</code>へ渡したメッセージを取り出せます。tryの中でエラーが起こらなければ、catchブロックは<strong>実行されません</strong>。</p>
<p>注意点として、try...catchで囲むのは「エラーが起きうると分かっていて、起きたときの対応を決めている処理」だけにしましょう。何でも囲んでエラーを握りつぶすと、バグの発見が遅れる原因になります。</p>`,
      task: `<code>divide(10, 0)</code>の呼び出しをtry...catchで囲んでください。エラーが起きたら「エラーが発生: 」に続けて<code>error.message</code>を表示します。最後の行が実行されることも確認しましょう。`,
      code: `function divide(a, b) {
  if (b === 0) {
    throw new Error("0で割ることはできません");
  }
  return a / b;
}

// TODO: 次の2行をtryブロックで囲み、catchでエラーを受け止める
// catchでは「"エラーが発生: " + error.message」を表示する
const result = divide(10, 0);
console.log("結果: " + result);

console.log("プログラムは最後まで実行されました");
`,
      solution: `function divide(a, b) {
  if (b === 0) {
    throw new Error("0で割ることはできません");
  }
  return a / b;
}

try {
  // エラーが起こる可能性のある処理をtryで囲む
  const result = divide(10, 0);
  console.log("結果: " + result);
} catch (error) {
  // 投げられたErrorオブジェクトがerrorに入る
  console.log("エラーが発生: " + error.message);
}

console.log("プログラムは最後まで実行されました");
`,
      hints: [
        `「try { ... } catch (error) { ... }」の形です。エラーが起きうる2行をtryの中に移動します。`,
        `catchブロックには「console.log("エラーが発生: " + error.message);」と書きます。error.messageにはthrow時のメッセージが入っています。`
      ],
      expectedOutput: "エラーが発生: 0で割ることはできません"
    },
    {
      id: 117,
      title: "finally",
      explanation: `<p>try...catchには、もう1つのブロック<code>finally</code>（ファイナリー）を追加できます。finallyブロックは<strong>エラーが起きても起きなくても、最後に必ず実行されます</strong>。</p>
<pre><code>try {
  console.log("処理を実行");
} catch (error) {
  console.log("エラー対応");
} finally {
  console.log("必ず実行される後片付け");
}
</code></pre>
<p>各ブロックの実行パターンを整理します。</p>
<table>
<tr><th>状況</th><th>try</th><th>catch</th><th>finally</th></tr>
<tr><td>エラーなし</td><td>最後まで実行</td><td>実行されない</td><td>実行される</td></tr>
<tr><td>エラーあり</td><td>途中で中断</td><td>実行される</td><td>実行される</td></tr>
<tr><td>tryの中でreturnした場合</td><td>returnまで実行</td><td>実行されない</td><td>それでも実行される</td></tr>
</table>
<p>特に3行目に注目してください。tryブロックの中で<code>return</code>しても、finallyは<strong>関数を抜ける直前に必ず割り込んで実行されます</strong>。この「絶対に実行される」性質から、finallyは<strong>後片付け（クリーンアップ）</strong>に使われます。実務では「開いたファイルを閉じる」「データベース接続を切断する」「読み込み中の表示を消す」など、成功でも失敗でも必ずやるべき処理を書く場所です。</p>
<p>後片付けをtryの最後とcatchの両方に書いてしまうと重複しますし、書き忘れの危険もあります。finallyに1回だけ書くのが正しい形です。</p>`,
      task: `データ処理のtry...catchに<code>finally</code>ブロックを追加し、「後片付けを実行しました」と表示してください。成功する呼び出しと失敗する呼び出しの両方でfinallyが動くことを確認しましょう。`,
      code: `function processData(data) {
  try {
    if (data === "") {
      throw new Error("データが空です");
    }
    console.log("処理成功: " + data);
  } catch (error) {
    console.log("処理失敗: " + error.message);
  }
  // TODO: finallyブロックを追加して「後片付けを実行しました」と表示する
}

processData("売上データ");
processData("");
`,
      solution: `function processData(data) {
  try {
    if (data === "") {
      throw new Error("データが空です");
    }
    console.log("処理成功: " + data);
  } catch (error) {
    console.log("処理失敗: " + error.message);
  } finally {
    // 成功しても失敗しても必ず実行される
    console.log("後片付けを実行しました");
  }
}

processData("売上データ");
processData("");
`,
      hints: [
        `finallyはcatchブロックの閉じ波カッコの直後に「finally { ... }」と続けて書きます。`,
        `正しく書けると「後片付けを実行しました」が2回（成功時と失敗時の両方で）表示されます。`
      ],
      expectedOutput: "後片付けを実行しました"
    },
    {
      id: 118,
      title: "Errorオブジェクト",
      explanation: `<p>これまで投げてきた<code>Error</code>オブジェクトの中身を詳しく見てみましょう。Errorオブジェクトは主に3つのプロパティを持ちます。</p>
<table>
<tr><th>プロパティ</th><th>内容</th><th>例</th></tr>
<tr><td>name</td><td>エラーの種類名</td><td>"Error"、"TypeError"</td></tr>
<tr><td>message</td><td>new Error()に渡したメッセージ</td><td>"0で割ることはできません"</td></tr>
<tr><td>stack</td><td>エラー発生地点までの呼び出し履歴（スタックトレース）</td><td>どのファイルの何行目かの情報</td></tr>
</table>
<p>また、JavaScriptには用途別の<strong>組み込みエラークラス</strong>が用意されています。実はこれらはすべてErrorを継承した子クラスです（この章で学んだ継承がここで登場します）。</p>
<ul>
<li><code>TypeError</code>：値の型が不正（例：undefinedのプロパティを読んだ）</li>
<li><code>RangeError</code>：値が許容範囲外（例：配列の長さに負の数を指定）</li>
<li><code>ReferenceError</code>：存在しない変数を参照した</li>
<li><code>SyntaxError</code>：構文の誤り</li>
</ul>
<p>自分でエラーを投げるときも、型の問題なら<code>throw new TypeError("...")</code>のように適切なクラスを選ぶと、エラーの原因が伝わりやすくなります。</p>
<pre><code>try {
  throw new TypeError("文字列を渡してください");
} catch (error) {
  console.log(error.name);    // TypeError
  console.log(error.message); // 文字列を渡してください
  console.log(error instanceof TypeError); // true
  console.log(error instanceof Error);     // true（継承しているため）
}
</code></pre>
<p>最後の2行に注目してください。TypeErrorはErrorの子クラスなので、<code>instanceof Error</code>も<code>true</code>になります。</p>`,
      task: `catchブロックを完成させてください。<code>error.name</code>と<code>error.message</code>を「名前: メッセージ」の形式（区切りは「: 」）で表示します。`,
      code: `function toUpper(value) {
  if (typeof value !== "string") {
    // 型の問題なのでTypeErrorを選んで投げる
    throw new TypeError("文字列を渡してください");
  }
  return value.toUpperCase();
}

try {
  console.log(toUpper(123));
} catch (error) {
  // TODO: error.nameとerror.messageを「名前: メッセージ」の形式で表示する

  // TODO: 「Errorを継承? true」となるようerror instanceof Errorの結果も表示する
  console.log("Errorを継承? " + false);
}
`,
      solution: `function toUpper(value) {
  if (typeof value !== "string") {
    // 型の問題なのでTypeErrorを選んで投げる
    throw new TypeError("文字列を渡してください");
  }
  return value.toUpperCase();
}

try {
  console.log(toUpper(123));
} catch (error) {
  // nameにはエラーの種類、messageには渡した説明文が入っている
  console.log(error.name + ": " + error.message);

  // TypeErrorはErrorの子クラスなのでinstanceof Errorもtrueになる
  console.log("Errorを継承? " + (error instanceof Error));
}
`,
      hints: [
        `1つ目のTODOは「console.log(error.name + ": " + error.message);」です。`,
        `2つ目はfalseの部分を「(error instanceof Error)」に置き換えます。連結の優先順位のためカッコで囲むのを忘れずに。`
      ],
      expectedOutput: "TypeError: 文字列を渡してください"
    },
    {
      id: 119,
      title: "カスタムエラー（extends Error）",
      explanation: `<p>組み込みのエラークラスだけでは「入力チェックのエラー」「在庫不足のエラー」といった<strong>アプリ固有のエラーの種類</strong>を表現できません。そこで、<code>Error</code>を継承して<strong>自分専用のエラークラス（カスタムエラー）</strong>を作ります。この章で学んだextendsとsuperがそのまま使えます。</p>
<pre><code>class ValidationError extends Error {
  constructor(message) {
    super(message); // 親のErrorにメッセージを渡す
    this.name = "ValidationError"; // nameを自分の名前に変える
  }
}

throw new ValidationError("名前は必須です");
</code></pre>
<p>ポイントは2つです。<code>super(message)</code>で親クラスのErrorにメッセージを渡すこと（これで<code>error.message</code>が使えるようになります）、そして<code>this.name</code>を上書きすること（既定では"Error"のままなので、自分のクラス名にしておくとログで見分けやすくなります）。</p>
<p>カスタムエラーの最大の利点は、<strong>catch側でinstanceofを使ってエラーの種類ごとに対応を分けられる</strong>ことです。</p>
<pre><code>try {
  registerUser(input);
} catch (error) {
  if (error instanceof ValidationError) {
    // 入力ミスはユーザーに優しく伝える
    console.log("入力エラー: " + error.message);
  } else {
    // 想定外のエラーは握りつぶさず再度投げる
    throw error;
  }
}
</code></pre>
<p>「想定したエラーだけを処理し、想定外のエラーはthrowし直す」のは実務でも重要なパターンです。すべてのエラーを同じように握りつぶすと、本物のバグが隠れてしまうからです。</p>`,
      task: `Errorを継承した<code>ValidationError</code>クラスを定義してください。constructorで<code>message</code>を受け取って<code>super(message)</code>を呼び、<code>this.name</code>を<code>"ValidationError"</code>に設定します。`,
      code: `// TODO: Errorを継承したValidationErrorクラスを定義する
// constructor(message)でsuper(message)を呼び、this.nameを"ValidationError"にする

function checkName(name) {
  if (name === "") {
    throw new ValidationError("名前は必須です");
  }
  console.log("チェックOK: " + name);
}

try {
  checkName("たろう");
  checkName("");
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("入力エラー: " + error.message);
  } else {
    throw error;
  }
}
`,
      solution: `// Errorを継承したカスタムエラークラス
class ValidationError extends Error {
  constructor(message) {
    super(message); // 親のErrorにメッセージを渡す
    this.name = "ValidationError"; // ログで見分けやすいように名前を変更
  }
}

function checkName(name) {
  if (name === "") {
    throw new ValidationError("名前は必須です");
  }
  console.log("チェックOK: " + name);
}

try {
  checkName("たろう");
  checkName("");
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("入力エラー: " + error.message);
  } else {
    throw error;
  }
}
`,
      hints: [
        `解説のコード例とほぼ同じ形です。「class ValidationError extends Error { ... }」から書き始めます。`,
        `constructorの中身は「super(message);」と「this.name = "ValidationError";」の2行です。`
      ],
      expectedOutput: "入力エラー: 名前は必須です"
    },
    {
      id: 120,
      title: "総合演習：バリデーション付きフォームデータ処理",
      explanation: `<p>この章の総仕上げとして、<strong>会員登録フォームのデータを検証（バリデーション）して処理するプログラム</strong>を作ります。実務のWebアプリで毎日のように書かれる、実用性の高いパターンです。使う知識を整理します。</p>
<ul>
<li><strong>カスタムエラー</strong>（ステップ119）：ValidationErrorで入力エラーを表現</li>
<li><strong>throw</strong>（ステップ115）：検証関数が不正な値を検出したら投げる</li>
<li><strong>try...catch</strong>（ステップ116）：1件のエラーで全体を止めず、失敗した件だけ記録して続行</li>
<li><strong>instanceof</strong>（ステップ109・119）：想定したエラーだけを処理</li>
</ul>
<p>設計の要点は<strong>「検証する関数」と「処理を回すループ」の役割分担</strong>です。</p>
<pre><code>function validateForm(data) {
  if (data.name === "") {
    throw new ValidationError("名前は必須です");
  }
  // …他のチェック…
}

for (const form of forms) {
  try {
    validateForm(form); // 不合格ならここでエラーが飛ぶ
    // 合格したデータだけがこの行に到達する
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("NG: " + error.message);
    } else {
      throw error; // 想定外はそのまま上に投げる
    }
  }
}
</code></pre>
<p>validateFormは「検証だけ」に集中し、エラーをどう扱うかは呼び出し側が決めます。この分担のおかげで、同じ検証関数を「1件ずつ登録する画面」でも「一括登録のバッチ処理」でも使い回せます。ループの中にtry...catchを置くことで、<strong>1件の不正データがあっても残りの処理を続行できる</strong>のがポイントです。</p>`,
      task: `<code>validateForm</code>関数のTODOを完成させてください。(1) <code>name</code>が空文字列なら「名前は必須です」、(2) <code>age</code>が数値でなければ「年齢は数値で入力してください」、(3) <code>age</code>が0未満または120超なら「年齢は0〜120の範囲で入力してください」というValidationErrorを投げます。`,
      code: `class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateForm(data) {
  // TODO: data.nameが""なら「名前は必須です」を投げる

  // TODO: typeof data.ageが"number"でなければ「年齢は数値で入力してください」を投げる

  // TODO: data.ageが0未満または120より大きければ「年齢は0〜120の範囲で入力してください」を投げる
}

const forms = [
  { name: "たろう", age: 25 },
  { name: "", age: 30 },
  { name: "はなこ", age: 200 },
  { name: "じろう", age: "20" },
  { name: "さくら", age: 18 }
];

const validUsers = [];
for (const form of forms) {
  try {
    validateForm(form);
    validUsers.push(form);
    console.log("OK: " + form.name + "（" + form.age + "歳）");
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("NG: " + error.message);
    } else {
      throw error;
    }
  }
}

console.log("登録成功: " + validUsers.length + "件 / 全" + forms.length + "件");
`,
      solution: `class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateForm(data) {
  // 名前の必須チェック
  if (data.name === "") {
    throw new ValidationError("名前は必須です");
  }

  // 年齢の型チェック（文字列の"20"などを弾く）
  if (typeof data.age !== "number") {
    throw new ValidationError("年齢は数値で入力してください");
  }

  // 年齢の範囲チェック
  if (data.age < 0 || data.age > 120) {
    throw new ValidationError("年齢は0〜120の範囲で入力してください");
  }
}

const forms = [
  { name: "たろう", age: 25 },
  { name: "", age: 30 },
  { name: "はなこ", age: 200 },
  { name: "じろう", age: "20" },
  { name: "さくら", age: 18 }
];

const validUsers = [];
for (const form of forms) {
  try {
    validateForm(form);
    validUsers.push(form);
    console.log("OK: " + form.name + "（" + form.age + "歳）");
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("NG: " + error.message);
    } else {
      throw error;
    }
  }
}

console.log("登録成功: " + validUsers.length + "件 / 全" + forms.length + "件");
`,
      hints: [
        `3つのチェックはすべて「if (条件) { throw new ValidationError("メッセージ"); }」の形のガード節です。`,
        `型チェックは「typeof data.age !== "number"」、範囲チェックは「data.age < 0 || data.age > 120」と書きます。`,
        `正しく実装できると、5件中「たろう」と「さくら」の2件だけが登録成功になります。`
      ],
      expectedOutput: "登録成功: 2件 / 全5件"
    }
  ]
});
