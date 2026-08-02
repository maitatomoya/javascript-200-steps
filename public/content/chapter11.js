// 第11章：thisとクラス
registerChapter({
  number: 11,
  title: "thisとクラス",
  description: "オブジェクト指向プログラミングの土台となるthisの仕組みとclass構文を学び、データと処理をひとまとめにした「設計図」からオブジェクトを量産できるようになります。",
  steps: [
    {
      id: 101,
      title: "thisの基本",
      explanation: `<p><code>this</code>（ディス）は、JavaScriptで最も誤解されやすいキーワードの1つです。第7章でメソッド（オブジェクトのプロパティとして定義された関数）の中で<code>this</code>を少し使いましたが、この章で仕組みを正面から学びます。</p>
<p>最重要ルールは<strong>「thisはメソッドを呼び出したときの、ドットの左側のオブジェクトを指す」</strong>です。つまりthisの中身は「関数を定義した場所」ではなく<strong>「関数をどう呼び出したか」</strong>で決まります。</p>
<pre><code>const user = {
  name: "たろう",
  greet() {
    // user.greet()と呼べば、thisはuserを指す
    console.log("こんにちは、" + this.name + "さん");
  }
};
user.greet(); // こんにちは、たろうさん
</code></pre>
<p>同じ関数でも、別のオブジェクトのメソッドとして呼べばthisはそのオブジェクトを指します。</p>
<pre><code>const other = { name: "はなこ" };
other.greet = user.greet; // 関数を共有
other.greet(); // こんにちは、はなこさん（thisはother）
</code></pre>
<p>なぜthisが必要なのでしょうか。もし<code>user.name</code>と直接書いてしまうと、その関数はuser専用になってしまいます。<code>this.name</code>と書くことで「呼び出したオブジェクト自身のname」という意味になり、同じ処理をどのオブジェクトでも使い回せるのです。これが次のステップ以降で学ぶ「クラス」の土台になります。</p>`,
      task: `<code>introduce</code>メソッドの中でthisを使い、「私はたろうです。年齢は25歳です。」と表示されるように<code>???</code>の部分を修正してください。`,
      code: `const profile = {
  name: "たろう",
  age: 25,
  introduce() {
    // TODO: thisを使ってnameとageを埋め込む
    console.log("私は???です。年齢は???歳です。");
  }
};

profile.introduce();
`,
      solution: `const profile = {
  name: "たろう",
  age: 25,
  introduce() {
    // thisは呼び出し元のprofileを指す
    console.log("私は" + this.name + "です。年齢は" + this.age + "歳です。");
  }
};

profile.introduce();
`,
      hints: [
        `profile.introduce()と呼び出したとき、introduceの中のthisはドットの左側のprofileを指します。`,
        `文字列連結で「"私は" + this.name + "です。年齢は" + this.age + "歳です。"」のように組み立てます。`
      ],
      expectedOutput: "私はたろうです。年齢は25歳です。"
    },
    {
      id: 102,
      title: "thisが失われるケースとアロー関数",
      explanation: `<p>thisは「呼び出し方で決まる」ため、呼び出し方が変わるとthisが<strong>失われる</strong>ことがあります。代表例が、コールバック関数として普通の関数（function）を渡す場合です。</p>
<pre><code>const timer = {
  label: "タイマー",
  start() {
    setTimeout(function () {
      // この関数はsetTimeoutが「ドットなし」で呼ぶので
      // thisはtimerを指さない！
      console.log(this.label); // undefined
    }, 10);
  }
};
</code></pre>
<p>この問題を解決する現代的な方法が<strong>アロー関数</strong>です。アロー関数は<strong>自分自身のthisを持たず、定義された場所の外側のthisをそのまま使います</strong>（これをレキシカルthisと呼びます）。上の例をアロー関数に変えると、thisは外側の<code>start</code>メソッドのthis、つまりtimerを指します。</p>
<p>使い分けの目安を表にまとめます。</p>
<table>
<tr><th>場面</th><th>おすすめ</th><th>理由</th></tr>
<tr><td>オブジェクトのメソッド定義</td><td>普通の関数（省略記法）</td><td>thisが呼び出し元を指す</td></tr>
<tr><td>コールバック（setTimeoutなど）</td><td>アロー関数</td><td>外側のthisを引き継げる</td></tr>
</table>
<p>逆に、<strong>メソッド自体をアロー関数で定義してはいけません</strong>。アロー関数はthisを持たないため、<code>this.name</code>がオブジェクトを指さなくなります。「メソッドは省略記法、コールバックはアロー関数」と覚えましょう。</p>`,
      task: `<code>setTimeout</code>に渡している普通の関数をアロー関数に書き換えて、「料理タイマー: 時間です」と正しく表示されるようにしてください。`,
      code: `const timer = {
  label: "料理タイマー",
  start() {
    // TODO: この普通の関数をアロー関数に書き換える
    setTimeout(function () {
      console.log(this.label + ": 時間です");
    }, 10);
  }
};

timer.start();
`,
      solution: `const timer = {
  label: "料理タイマー",
  start() {
    // アロー関数は外側（startメソッド）のthisをそのまま使う
    setTimeout(() => {
      console.log(this.label + ": 時間です");
    }, 10);
  }
};

timer.start();
`,
      hints: [
        `普通の関数はsetTimeoutから呼ばれるときにthisとtimerのつながりを失います。アロー関数なら外側のthisを引き継げます。`,
        `「function () { ... }」を「() => { ... }」に書き換えるだけです。`
      ],
      expectedOutput: "料理タイマー: 時間です"
    },
    {
      id: 103,
      title: "classとnew",
      explanation: `<p>同じ形のオブジェクトをたくさん作りたいとき、毎回オブジェクトリテラルを書くのは大変ですし、メソッドの定義も重複します。そこで登場するのが<strong>class（クラス）</strong>です。クラスはオブジェクトの<strong>設計図</strong>で、<code>new</code>演算子を使うと設計図から実物のオブジェクト（<strong>インスタンス</strong>と呼びます）を何個でも作れます。</p>
<pre><code>class Dog {
  bark() {
    console.log(this.name + ": ワンワン！");
  }
}

const pochi = new Dog(); // インスタンスを生成
pochi.name = "ポチ";     // プロパティを後から設定
pochi.bark();            // ポチ: ワンワン！
</code></pre>
<p>ポイントを整理します。</p>
<ul>
<li>クラス名は慣習として<strong>大文字で始めます</strong>（Dog、UserProfileなど）</li>
<li><code>new クラス名()</code>で新しいインスタンスが作られます</li>
<li>クラス内のメソッドでは、thisが「そのインスタンス自身」を指します</li>
<li>インスタンスはそれぞれ独立しています（pochiのnameを変えても他の犬には影響しません）</li>
</ul>
<p>上の例では<code>pochi.name = "ポチ"</code>とインスタンス生成後にプロパティを設定していますが、毎回これを書くのは面倒でミスのもとです。次のステップで学ぶ<code>constructor</code>を使うと、生成と同時にプロパティを設定できるようになります。</p>`,
      task: `Dogクラスからもう1つインスタンスを作りましょう。名前が「クロ」のDogインスタンスを作成し、<code>bark</code>メソッドを呼び出して「クロ: ワンワン！」と表示してください。`,
      code: `class Dog {
  bark() {
    console.log(this.name + ": ワンワン！");
  }
}

const pochi = new Dog();
pochi.name = "ポチ";
pochi.bark();

// TODO: 名前が「クロ」のDogインスタンスkuroを作り、barkさせる
`,
      solution: `class Dog {
  bark() {
    console.log(this.name + ": ワンワン！");
  }
}

const pochi = new Dog();
pochi.name = "ポチ";
pochi.bark();

// 名前が「クロ」のDogインスタンスを作る
const kuro = new Dog();
kuro.name = "クロ";
kuro.bark();
`,
      hints: [
        `pochiを作っている3行とまったく同じ流れで、変数名と名前だけ変えて書きます。`,
        `「const kuro = new Dog();」でインスタンスを作り、「kuro.name = "クロ";」の後に「kuro.bark();」を呼びます。`
      ],
      expectedOutput: "クロ: ワンワン！"
    },
    {
      id: 104,
      title: "constructor",
      explanation: `<p><strong>constructor（コンストラクタ）</strong>は、<code>new</code>でインスタンスを作った瞬間に<strong>自動的に1回だけ実行される特別なメソッド</strong>です。主な仕事は「インスタンスの初期状態（プロパティ）を設定すること」です。</p>
<pre><code>class Dog {
  constructor(name, age) {
    // newに渡された引数を受け取り、インスタンスに保存する
    this.name = name;
    this.age = age;
  }
  bark() {
    console.log(this.name + "（" + this.age + "歳）: ワンワン！");
  }
}

const pochi = new Dog("ポチ", 3); // constructorが実行される
pochi.bark(); // ポチ（3歳）: ワンワン！
</code></pre>
<p>前のステップでは「newしてから1つずつプロパティを代入」していましたが、constructorを使えば<code>new Dog("ポチ", 3)</code>の1行で完結します。設定し忘れの心配もありません。</p>
<p>注意点をまとめます。</p>
<ul>
<li>constructorという名前は固定です（1つのクラスに1つだけ）</li>
<li><code>this.プロパティ名 = 値</code>の形で、引数をインスタンスに保存します</li>
<li>引数名とプロパティ名は同じにするのが読みやすい書き方です（<code>this.name = name</code>の左はインスタンスのプロパティ、右は引数）</li>
<li>constructorを書かない場合は、何もしない空のconstructorがあるものとして扱われます</li>
</ul>`,
      task: `Userクラスにconstructorを追加してください。引数として<code>name</code>と<code>age</code>を受け取り、それぞれ<code>this.name</code>と<code>this.age</code>に保存します。`,
      code: `class User {
  // TODO: nameとageを受け取るconstructorを定義する

  introduce() {
    console.log("こんにちは、" + this.name + "さん（" + this.age + "歳）");
  }
}

const user = new User("さくら", 20);
user.introduce();
`,
      solution: `class User {
  constructor(name, age) {
    // newに渡された引数をインスタンスのプロパティとして保存する
    this.name = name;
    this.age = age;
  }

  introduce() {
    console.log("こんにちは、" + this.name + "さん（" + this.age + "歳）");
  }
}

const user = new User("さくら", 20);
user.introduce();
`,
      hints: [
        `constructorは「constructor(引数1, 引数2) { ... }」の形でクラスの中に書きます。`,
        `中身は「this.name = name;」と「this.age = age;」の2行です。`
      ],
      expectedOutput: "こんにちは、さくらさん（20歳）"
    },
    {
      id: 105,
      title: "メソッド定義",
      explanation: `<p>クラスには複数のメソッドを定義できます。書き方はオブジェクトの省略記法と似ていますが、<strong>メソッド同士の間にカンマは書きません</strong>（初心者がつまずきやすいポイントです）。</p>
<pre><code>class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  area() {
    return this.width * this.height;
  }
  isSquare() {
    return this.width === this.height;
  }
}
</code></pre>
<p>そしてもう1つ重要なのが、<strong>メソッドの中から別のメソッドを呼ぶには<code>this.メソッド名()</code>と書く</strong>ことです。thisを付け忘れると「関数が見つからない」というReferenceErrorになります。</p>
<pre><code>class Rectangle {
  // …（constructorとareaは上と同じ）…
  describe() {
    // 自分自身のareaメソッドを呼ぶにはthisが必要
    console.log("面積は" + this.area() + "です");
  }
}
</code></pre>
<p>このように「計算するメソッド（area）」と「表示するメソッド（describe）」を分けておくと、計算結果を別の場所でも使い回せて便利です。1つのメソッドには1つの仕事だけをさせる、というのは読みやすいコードの基本原則です。</p>`,
      task: `Rectangleクラスに<code>describe</code>メソッドを追加してください。<code>this.area()</code>を呼び出して、「縦4×横6の長方形の面積は24です」と表示します。`,
      code: `class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  area() {
    return this.height * this.width;
  }

  // TODO: describeメソッドを追加する
  // 「縦4×横6の長方形の面積は24です」の形式で表示する
  // 面積はthis.area()で取得すること
}

const rect = new Rectangle(4, 6);
rect.describe();
`,
      solution: `class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  area() {
    return this.height * this.width;
  }

  describe() {
    // 自分自身のメソッドはthis.area()の形で呼び出す
    console.log(
      "縦" + this.height + "×横" + this.width +
      "の長方形の面積は" + this.area() + "です"
    );
  }
}

const rect = new Rectangle(4, 6);
rect.describe();
`,
      hints: [
        `describe() { ... }をareaメソッドの下に追加します。メソッドの間にカンマは不要です。`,
        `「"縦" + this.height + "×横" + this.width + "の長方形の面積は" + this.area() + "です"」と連結します。`
      ],
      expectedOutput: "縦4×横6の長方形の面積は24です"
    },
    {
      id: 106,
      title: "getter・setter",
      explanation: `<p><strong>getter（ゲッター）</strong>と<strong>setter（セッター）</strong>を使うと、メソッドを<strong>プロパティのように</strong>読み書きできます。メソッド名の前に<code>get</code>または<code>set</code>を付けるだけです。</p>
<pre><code>class Person {
  constructor(lastName, firstName) {
    this.lastName = lastName;
    this.firstName = firstName;
  }
  get fullName() {
    return this.lastName + " " + this.firstName;
  }
  set fullName(value) {
    const parts = value.split(" ");
    this.lastName = parts[0];
    this.firstName = parts[1];
  }
}

const p = new Person("山田", "太郎");
console.log(p.fullName);   // 「山田 太郎」（カッコなしで呼べる！）
p.fullName = "佐藤 花子";  // 代入するとsetterが動く
</code></pre>
<p>呼び出し方の違いに注目してください。</p>
<table>
<tr><th>種類</th><th>定義</th><th>使い方</th></tr>
<tr><td>通常のメソッド</td><td>fullName() { ... }</td><td>p.fullName()</td></tr>
<tr><td>getter</td><td>get fullName() { ... }</td><td>p.fullName（カッコなし）</td></tr>
<tr><td>setter</td><td>set fullName(value) { ... }</td><td>p.fullName = 値</td></tr>
</table>
<p>getterは「他のプロパティから計算で求められる値」に、setterは「代入時に検証や変換をはさみたい値」に使います。setterは<strong>必ず引数を1つだけ</strong>受け取ります（代入された値が渡ってきます）。使う側から見ると普通のプロパティと同じ形なので、コードがすっきり読みやすくなるのが利点です。</p>`,
      task: `Personクラスに<code>fullName</code>のsetterを追加してください。代入された文字列をスペースで分割し（<code>split(" ")</code>）、<code>this.lastName</code>と<code>this.firstName</code>を更新します。`,
      code: `class Person {
  constructor(lastName, firstName) {
    this.lastName = lastName;
    this.firstName = firstName;
  }

  get fullName() {
    return this.lastName + " " + this.firstName;
  }

  // TODO: set fullName(value)を定義する
  // valueをsplit(" ")で分割し、lastNameとfirstNameを更新する
}

const p = new Person("山田", "太郎");
console.log("フルネーム: " + p.fullName);

p.fullName = "佐藤 花子";
console.log("姓: " + p.lastName);
console.log("名: " + p.firstName);
`,
      solution: `class Person {
  constructor(lastName, firstName) {
    this.lastName = lastName;
    this.firstName = firstName;
  }

  get fullName() {
    return this.lastName + " " + this.firstName;
  }

  set fullName(value) {
    // 「姓 名」形式の文字列を分割してそれぞれ更新する
    const parts = value.split(" ");
    this.lastName = parts[0];
    this.firstName = parts[1];
  }
}

const p = new Person("山田", "太郎");
console.log("フルネーム: " + p.fullName);

p.fullName = "佐藤 花子";
console.log("姓: " + p.lastName);
console.log("名: " + p.firstName);
`,
      hints: [
        `setterは「set fullName(value) { ... }」の形で、引数を1つだけ受け取ります。`,
        `「const parts = value.split(" ");」で分割し、parts[0]をthis.lastNameに、parts[1]をthis.firstNameに代入します。`
      ],
      expectedOutput: "名: 花子"
    },
    {
      id: 107,
      title: "static",
      explanation: `<p>ここまでのメソッドはすべて「インスタンスのメソッド」で、<code>new</code>で作ったインスタンスから呼び出しました。一方、メソッドの前に<code>static</code>（スタティック）を付けると、<strong>インスタンスを作らずにクラス名から直接呼べるメソッド</strong>になります。</p>
<pre><code>class TemperatureUtil {
  static cToF(celsius) {
    return celsius * 9 / 5 + 32;
  }
}

// インスタンス不要。クラス名から直接呼ぶ
console.log(TemperatureUtil.cToF(25)); // 77
</code></pre>
<p>staticメソッドはいつ使うのでしょうか。目安は<strong>「特定のインスタンスの状態（this.〇〇）を使わない処理」</strong>です。温度変換のような純粋な計算は、どの犬・どのユーザーとも無関係なので、staticにしてクラスにまとめておくと整理しやすいのです。</p>
<table>
<tr><th>種類</th><th>呼び出し方</th><th>thisが指すもの</th><th>用途</th></tr>
<tr><td>インスタンスメソッド</td><td>インスタンス.メソッド()</td><td>そのインスタンス</td><td>個々のデータを使う処理</td></tr>
<tr><td>staticメソッド</td><td>クラス名.メソッド()</td><td>クラス自身</td><td>インスタンスに依存しない処理</td></tr>
</table>
<p>実は皆さんはstaticメソッドをすでに使っています。<code>Object.keys()</code>や<code>Array.isArray()</code>は、まさにクラス名（コンストラクタ名）から直接呼ぶstaticメソッドです。</p>`,
      task: `TemperatureUtilクラスに、華氏を摂氏に変換するstaticメソッド<code>fToC</code>を追加してください。計算式は「(華氏 - 32) × 5 ÷ 9」です。`,
      code: `class TemperatureUtil {
  static cToF(celsius) {
    return celsius * 9 / 5 + 32;
  }

  // TODO: staticメソッドfToC(fahrenheit)を追加する
  // 計算式: (fahrenheit - 32) * 5 / 9
}

console.log("摂氏25度は華氏" + TemperatureUtil.cToF(25) + "度");
console.log("華氏86度は摂氏" + TemperatureUtil.fToC(86) + "度");
`,
      solution: `class TemperatureUtil {
  static cToF(celsius) {
    return celsius * 9 / 5 + 32;
  }

  static fToC(fahrenheit) {
    // 華氏から摂氏への変換式
    return (fahrenheit - 32) * 5 / 9;
  }
}

console.log("摂氏25度は華氏" + TemperatureUtil.cToF(25) + "度");
console.log("華氏86度は摂氏" + TemperatureUtil.fToC(86) + "度");
`,
      hints: [
        `cToFと同じように、メソッド名の前にstaticを付けて定義します。`,
        `「static fToC(fahrenheit) { return (fahrenheit - 32) * 5 / 9; }」の形になります。`
      ],
      expectedOutput: "華氏86度は摂氏30度"
    },
    {
      id: 108,
      title: "クラスフィールドと#プライベート",
      explanation: `<p>constructorを使わずに、クラスの本体に直接プロパティを宣言する書き方を<strong>クラスフィールド</strong>と呼びます。初期値が引数に依存しないプロパティをすっきり書けます。</p>
<pre><code>class Counter {
  count = 0; // クラスフィールド（全インスタンスがcount: 0で始まる）
  increment() {
    this.count++;
  }
}
</code></pre>
<p>ただしこの<code>count</code>は外部から<code>c.count = 100</code>のように<strong>自由に書き換えられてしまいます</strong>。「incrementでしか増やせないはずのカウンタ」が簡単に壊せるのは危険です。</p>
<p>そこで使うのが<strong>プライベートフィールド</strong>です。フィールド名の先頭に<code>#</code>（ハッシュ）を付けると、<strong>クラスの中からしかアクセスできなくなります</strong>。外部から<code>c.#count</code>と書くと構文エラーになります。</p>
<pre><code>class Counter {
  #count = 0; // プライベートフィールド
  increment() {
    this.#count++; // クラスの中ではthis.#countでアクセス
  }
  get value() {
    return this.#count; // 読み取り専用の窓口をgetterで用意
  }
}
</code></pre>
<p>このように「データは隠して、操作の窓口（メソッドやgetter）だけを公開する」設計を<strong>カプセル化</strong>と呼びます。不正な状態変更を防げるため、クラス設計の重要な考え方です。なお<code>#</code>は宣言時にも参照時にも必ず付けます（<code>this.count</code>と<code>this.#count</code>は別物です）。</p>`,
      task: `Counterクラスの<code>count</code>をプライベートフィールド<code>#count</code>に変更し、値を読み取るためのgetter<code>value</code>を追加してください。最後の表示も<code>c.value</code>を使うように修正します。`,
      code: `class Counter {
  count = 0; // TODO: プライベートフィールド#countに変更する

  increment() {
    this.count++; // TODO: this.#countに変更する
  }

  // TODO: #countを返すgetter「value」を追加する
}

const c = new Counter();
c.increment();
c.increment();
c.increment();
console.log("カウント: " + c.count); // TODO: c.valueに変更する
`,
      solution: `class Counter {
  #count = 0; // プライベートフィールド：クラスの外からは触れない

  increment() {
    this.#count++;
  }

  get value() {
    // 読み取り専用の窓口だけを公開する（カプセル化）
    return this.#count;
  }
}

const c = new Counter();
c.increment();
c.increment();
c.increment();
console.log("カウント: " + c.value);
`,
      hints: [
        `フィールド宣言・increment内・getter内の3か所すべてで#countと書きます。#の付け忘れが1か所でもあるとエラーになります。`,
        `getterは「get value() { return this.#count; }」です。呼び出す側はカッコなしのc.valueで読み取れます。`
      ],
      expectedOutput: "カウント: 3"
    },
    {
      id: 109,
      title: "instanceof",
      explanation: `<p><code>instanceof</code>（インスタンスオブ）演算子は、<strong>「このオブジェクトはこのクラスから作られたものか？」</strong>を調べて<code>true</code>/<code>false</code>を返します。</p>
<pre><code>class Pen {}
class Book {}

const pen = new Pen();
console.log(pen instanceof Pen);  // true
console.log(pen instanceof Book); // false
console.log([1, 2] instanceof Array); // true（配列はArrayのインスタンス）
</code></pre>
<p>第2章で学んだ<code>typeof</code>との使い分けを整理しましょう。</p>
<table>
<tr><th>演算子</th><th>得意なこと</th><th>例</th></tr>
<tr><td>typeof</td><td>プリミティブ値の型を調べる</td><td>typeof "abc" は "string"</td></tr>
<tr><td>instanceof</td><td>オブジェクトの出自（どのクラス製か）を調べる</td><td>pen instanceof Pen は true</td></tr>
</table>
<p><code>typeof</code>はオブジェクトに対してはほぼすべて<code>"object"</code>を返すため、クラスの区別には役立ちません。逆に<code>instanceof</code>は<code>"abc" instanceof String</code>が<code>false</code>になるなど、プリミティブ値には使えません。<strong>プリミティブはtypeof、クラスのインスタンスはinstanceof</strong>と覚えてください。</p>
<p>instanceofの実用場面は「渡された値の種類によって処理を分けたいとき」です。次の章で学ぶエラー処理では、エラーの種類を見分けるためにinstanceofが大活躍します。</p>`,
      task: `<code>describe</code>関数を完成させてください。引数がPenのインスタンスなら「判定結果: ペン」、Bookのインスタンスなら「判定結果: 本」、どちらでもなければ「判定結果: 不明」と表示します。`,
      code: `class Pen {}
class Book {}

function describe(value) {
  // TODO: instanceofで判定して表示を分ける
  if (value) {
    console.log("判定結果: ペン");
  } else if (value) {
    console.log("判定結果: 本");
  } else {
    console.log("判定結果: 不明");
  }
}

describe(new Pen());
describe(new Book());
describe("ただの文字列");
`,
      solution: `class Pen {}
class Book {}

function describe(value) {
  // instanceofでどのクラスのインスタンスかを判定する
  if (value instanceof Pen) {
    console.log("判定結果: ペン");
  } else if (value instanceof Book) {
    console.log("判定結果: 本");
  } else {
    console.log("判定結果: 不明");
  }
}

describe(new Pen());
describe(new Book());
describe("ただの文字列");
`,
      hints: [
        `条件式は「値 instanceof クラス名」の形で書き、trueかfalseが返ります。`,
        `最初の条件は「value instanceof Pen」、2つ目は「value instanceof Book」です。文字列はどちらにも該当しないのでelseに流れます。`
      ],
      expectedOutput: "判定結果: 本"
    },
    {
      id: 110,
      title: "総合演習：BankAccountクラス",
      explanation: `<p>この章の総仕上げとして、銀行口座を表す<strong>BankAccountクラス</strong>を作ります。使う知識はすべてこの章で学んだものです。</p>
<ul>
<li><strong>constructor</strong>（ステップ104）：口座名義と初期残高を設定</li>
<li><strong>プライベートフィールド</strong>（ステップ108）：残高<code>#balance</code>を外部から直接書き換えられないように保護</li>
<li><strong>メソッド定義</strong>（ステップ105）：<code>deposit</code>（入金）と<code>withdraw</code>（出金）</li>
<li><strong>getter</strong>（ステップ106）：残高の読み取り専用窓口<code>balance</code></li>
</ul>
<p>実務のクラス設計で大切なのは、<strong>不正な操作をクラスの内側で防ぐ</strong>ことです。今回は次のルールを実装します。</p>
<table>
<tr><th>メソッド</th><th>正常時</th><th>異常時</th></tr>
<tr><td>deposit(amount)</td><td>残高に加算して報告を表示</td><td>0円以下なら入金せず警告を表示</td></tr>
<tr><td>withdraw(amount)</td><td>残高から減算して報告を表示</td><td>残高を超えたら出金せず警告を表示</td></tr>
</table>
<p>ガード節（不正な入力を関数の先頭でチェックして早めにreturnする書き方）を使うと読みやすくなります。</p>
<pre><code>deposit(amount) {
  if (amount &lt;= 0) {
    console.log("入金額は1円以上にしてください");
    return; // ここで処理を打ち切る
  }
  this.#balance += amount;
  // …報告を表示…
}
</code></pre>
<p>残高が<code>#balance</code>で守られているため、利用者はdepositとwithdrawという正しい窓口を通してしか残高を変更できません。これがカプセル化の実践です。</p>`,
      task: `BankAccountクラスのTODOを完成させてください。(1) <code>withdraw</code>は残高不足なら「残高不足です」と表示して出金しない、足りていれば残高を減らして「〇〇円を出金しました」と表示する。(2) getter<code>balance</code>で<code>#balance</code>を返す。`,
      code: `class BankAccount {
  #balance;

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) {
      console.log("入金額は1円以上にしてください");
      return;
    }
    this.#balance += amount;
    console.log(amount + "円を入金しました");
  }

  withdraw(amount) {
    // TODO: amountが#balanceより大きければ「残高不足です」と表示してreturnする
    // TODO: そうでなければ#balanceからamountを引き、「〇〇円を出金しました」と表示する
  }

  // TODO: #balanceを返すgetter「balance」を定義する
}

const account = new BankAccount("たろう", 5000);
account.deposit(3000);
account.withdraw(1000);
account.withdraw(100000);
console.log(account.owner + "さんの残高: " + account.balance + "円");
`,
      solution: `class BankAccount {
  #balance;

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) {
      console.log("入金額は1円以上にしてください");
      return;
    }
    this.#balance += amount;
    console.log(amount + "円を入金しました");
  }

  withdraw(amount) {
    // ガード節：残高不足なら出金せずに打ち切る
    if (amount > this.#balance) {
      console.log("残高不足です");
      return;
    }
    this.#balance -= amount;
    console.log(amount + "円を出金しました");
  }

  get balance() {
    // 残高は読み取り専用の窓口だけを公開する
    return this.#balance;
  }
}

const account = new BankAccount("たろう", 5000);
account.deposit(3000);
account.withdraw(1000);
account.withdraw(100000);
console.log(account.owner + "さんの残高: " + account.balance + "円");
`,
      hints: [
        `withdrawはdepositと同じ構造です。先頭で「if (amount > this.#balance)」をチェックし、問題なければ「this.#balance -= amount;」で減らします。`,
        `getterは「get balance() { return this.#balance; }」です。5000円で開始し、3000円入金、1000円出金なので最終残高は7000円になるはずです。`
      ],
      expectedOutput: "たろうさんの残高: 7000円"
    }
  ]
});
