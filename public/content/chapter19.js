// 第19章：発展トピック
registerChapter({
  number: 19,
  title: "発展トピック",
  description: "プロトタイプ、Symbol、Proxy、WeakMap、メモリ管理など、JavaScriptの内部の仕組みに一歩踏み込み、言語への理解を深めます。",
  steps: [
    {
      id: 181,
      title: "プロトタイプの仕組み",
      explanation: `<p>第11章で学んだclassは、実はJavaScriptに昔からある<strong>プロトタイプ</strong>という仕組みの上に作られた「読みやすい書き方（糖衣構文）」です。JavaScriptのオブジェクトは、それぞれ「お手本となる別のオブジェクト」への隠しリンクを持っており、このお手本を<strong>プロトタイプ</strong>と呼びます。</p>
<p>プロパティやメソッドにアクセスしたとき、自分自身に見つからなければ、JavaScriptはプロトタイプ、そのまたプロトタイプ……と順にたどって探します。このつながりを<strong>プロトタイプチェーン</strong>と呼び、終点は<code>null</code>です。</p>
<pre><code>const animal = {
  greet() {
    console.log(this.name + "です");
  }
};

// animalをプロトタイプに持つオブジェクトを作る
const dog = Object.create(animal);
dog.name = "ポチ";
dog.greet(); // dog自身にgreetはないが、animalから見つかる</code></pre>
<p>プロトタイプの確認や操作には次の関数を使います。</p>
<table>
<tr><th>関数</th><th>役割</th></tr>
<tr><td><code>Object.create(proto)</code></td><td>protoをプロトタイプに持つ新しいオブジェクトを作る</td></tr>
<tr><td><code>Object.getPrototypeOf(obj)</code></td><td>objのプロトタイプを取得する</td></tr>
<tr><td><code>obj.hasOwnProperty(key)</code></td><td>プロトタイプではなく自分自身が持つプロパティか調べる</td></tr>
</table>
<p>classの<code>extends</code>による継承も、内部ではこのプロトタイプチェーンで実現されています。「探して、なければ親をたどる」というシンプルなルールを知っておくと、classの挙動やライブラリのコードが格段に読み解きやすくなります。</p>`,
      task: `<code>Object.create</code>を使って、<code>animal</code>をプロトタイプに持つ<code>dog</code>を作り、プロトタイプチェーン経由で<code>eat</code>メソッドが呼べることを確認しましょう。`,
      code: `const animal = {
  eat: function () {
    console.log(this.name + "は食事中");
  }
};

// TODO: Object.createを使って、animalをプロトタイプに持つdogを作る
const dog = {};
dog.name = "ポチ";

// dog自身にeatはないが、プロトタイプチェーンをたどれば見つかるはず
dog.eat();
console.log(Object.getPrototypeOf(dog) === animal);`,
      solution: `const animal = {
  eat: function () {
    console.log(this.name + "は食事中");
  }
};

// Object.createは「指定したオブジェクトをプロトタイプに持つ」新しいオブジェクトを作る
const dog = Object.create(animal);
dog.name = "ポチ";

// dog自身にeatはないが、プロトタイプチェーンをたどってanimalのeatが見つかる
dog.eat();
console.log(Object.getPrototypeOf(dog) === animal);`,
      hints: [
        `そのままのコードは「dog.eat is not a function」で失敗します。空オブジェクトのプロトタイプにはeatがないからです。`,
        `const dog = Object.create(animal); とすると、dogのプロトタイプがanimalになります。`
      ],
      expectedOutput: "ポチは食事中"
    },
    {
      id: 182,
      title: "プロパティディスクリプタ概要",
      explanation: `<p>オブジェクトの各プロパティには、値そのものとは別に「どう振る舞うか」を決める設定情報が隠れています。これを<strong>プロパティディスクリプタ</strong>と呼びます。主な設定は次の3つです。</p>
<table>
<tr><th>属性</th><th>trueのときの意味</th></tr>
<tr><td><code>writable</code></td><td>値を書き換えられる</td></tr>
<tr><td><code>enumerable</code></td><td>for...inやObject.keysで列挙される</td></tr>
<tr><td><code>configurable</code></td><td>属性の変更やプロパティの削除ができる</td></tr>
</table>
<p>通常の代入で作ったプロパティはすべて<code>true</code>ですが、<code>Object.defineProperty</code>を使うと細かく制御できます。</p>
<pre><code>const config = {};
Object.defineProperty(config, "appName", {
  value: "MyApp",
  writable: false,   // 書き換え禁止
  enumerable: true,
  configurable: false
});

config.appName = "書き換え"; // 無視される（strictモードではTypeError）
console.log(config.appName); // "MyApp"</code></pre>
<p>設定内容は<code>Object.getOwnPropertyDescriptor(obj, "キー")</code>で確認できます。第17章で学んだ<code>Object.freeze</code>は、内部的には全プロパティの<code>writable</code>と<code>configurable</code>を<code>false</code>にする操作です。ライブラリが「読み取り専用プロパティ」や「隠しプロパティ」を実現しているのは、この仕組みのおかげです。普段の開発で多用するものではありませんが、フレームワークの挙動を理解する鍵になります。</p>`,
      task: `<code>Object.defineProperty</code>で<code>config</code>に書き換え不可の<code>appName</code>プロパティ（値は"MyApp"）を追加し、代入しても値が変わらないことを確認しましょう。`,
      code: `const config = { version: "1.0" };

// TODO: Object.definePropertyでappNameプロパティを追加する
//       value: "MyApp"、writable: false、enumerable: true にする

config.appName = "上書きした名前"; // writable: falseなら、この代入は無視される
console.log("appName: " + config.appName);

const desc = Object.getOwnPropertyDescriptor(config, "appName");
console.log("writable: " + desc.writable);`,
      solution: `const config = { version: "1.0" };

// definePropertyで「書き換え不可」のプロパティを定義する
Object.defineProperty(config, "appName", {
  value: "MyApp",
  writable: false,
  enumerable: true
});

config.appName = "上書きした名前"; // writable: falseなら、この代入は無視される
console.log("appName: " + config.appName);

const desc = Object.getOwnPropertyDescriptor(config, "appName");
console.log("writable: " + desc.writable);`,
      hints: [
        `Object.defineProperty(オブジェクト, "プロパティ名", 設定オブジェクト) の形で呼び出します。`,
        `設定オブジェクトには value: "MyApp", writable: false, enumerable: true を指定します。`
      ],
      expectedOutput: "appName: MyApp"
    },
    {
      id: 183,
      title: "Symbol",
      explanation: `<p><strong>Symbol</strong>は、ES2015で追加された7番目のプリミティブ型で、「絶対に他と重複しない一意の値」を作ります。<code>Symbol("説明")</code>で生成し、主にオブジェクトのプロパティキーとして使います。</p>
<pre><code>const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2); // false（説明が同じでも別物）</code></pre>
<p>文字列キーと違い、Symbolキーには次の特徴があります。</p>
<ul>
<li>他のコードが偶然同じキーを使って上書きしてしまう事故が起きない</li>
<li><code>Object.keys</code>や<code>for...in</code>、<code>JSON.stringify</code>に<strong>現れない</strong>（隠しプロパティ的に使える）</li>
<li>アクセスには必ずブラケット記法<code>obj[シンボル変数]</code>を使う（ドット記法は不可）</li>
</ul>
<pre><code>const secret = Symbol("secret");
const user = { name: "たろう" };
user[secret] = "内部管理用データ";

console.log(Object.keys(user)); // ["name"] だけ
console.log(user[secret]);      // "内部管理用データ"</code></pre>
<p>また、JavaScript本体が動作をカスタマイズするための「よく知られたSymbol」も用意されています。たとえば<code>Symbol.iterator</code>というキーにメソッドを持つオブジェクトはfor...ofで回せるようになります。配列やMapがfor...ofで回せるのは、これらが<code>Symbol.iterator</code>を実装しているからです。ライブラリの内部データの保護や、言語仕様レベルの拡張ポイントとして使われる、縁の下の力持ちです。</p>`,
      task: `シンボル<code>id</code>をキーとして<code>user</code>に値<code>1001</code>を設定し、<code>Object.keys</code>には現れないことを確認しましょう。`,
      code: `const id = Symbol("id");
const user = { name: "たろう" };

// TODO: ブラケット記法で、userにシンボルidをキーとして値1001を設定する

console.log("idの値: " + user[id]);
console.log("Object.keys: " + Object.keys(user).join(","));`,
      solution: `const id = Symbol("id");
const user = { name: "たろう" };

// Symbolをキーにするときは必ずブラケット記法を使う
user[id] = 1001;

console.log("idの値: " + user[id]);
// SymbolキーはObject.keysに現れない（隠しプロパティのように使える）
console.log("Object.keys: " + Object.keys(user).join(","));`,
      hints: [
        `Symbolをキーにした読み書きはブラケット記法だけです。user.idと書くと"id"という文字列キーになってしまいます。`,
        `user[id] = 1001; のように、変数idを角括弧の中に入れます。`
      ],
      expectedOutput: "idの値: 1001"
    },
    {
      id: 184,
      title: "タグ付きテンプレート概要",
      explanation: `<p>第9章で学んだテンプレートリテラルには、<strong>タグ付きテンプレート</strong>という発展形があります。関数名の直後に（丸括弧なしで）テンプレートリテラルを置くと、その関数が「文字列の固定部分」と「埋め込まれた値」を分解された状態で受け取ります。</p>
<pre><code>function tag(strings, ...values) {
  console.log(strings); // ["こんにちは、", "さん"] ←固定部分の配列
  console.log(values);  // ["太郎"] ←埋め込まれた値の配列
  return "好きな文字列を返せる";
}

const name = "太郎";
const result = tag\`こんにちは、\${name}さん\`;</code></pre>
<p>ポイントは、タグ関数が<strong>結合前の材料</strong>を受け取ることです。固定部分と値を別々に扱えるため、次のような加工が自由にできます。</p>
<ul>
<li>値だけをHTMLエスケープして、安全なHTML文字列を組み立てる（XSS対策）</li>
<li>値を強調記号で囲んで整形する</li>
<li>SQLのプレースホルダに変換する</li>
</ul>
<p><code>strings</code>の要素数は必ず<code>values</code>の要素数より1つ多くなります（値の前後に固定部分があるため。空文字列の場合もあります）。標準ライブラリにも<code>String.raw</code>というタグ関数が用意されており、バックスラッシュのエスケープ処理をせずそのままの文字列を得られます。ライブラリのstyled-componentsやSQLクライアントなどで広く使われている構文なので、「関数名の直後にテンプレートリテラルが続いていたらタグ付きテンプレート」と読めるようにしておきましょう。</p>`,
      task: `文字列連結で書かれた出力を、タグ関数<code>highlight</code>を使ったタグ付きテンプレートの呼び出しに書き換え、埋め込んだ値が【】で強調されるようにしましょう。`,
      code: `// 埋め込まれた値を【】で囲んで強調するタグ関数
function highlight(strings, ...values) {
  let result = "";
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += "【" + values[i] + "】";
    }
  }
  return result;
}

const user = "はなこ";
const score = 95;

// TODO: 下の行を、highlightを使ったタグ付きテンプレートの呼び出しに書き換える
//       （関数名の直後にテンプレートリテラルを続ける。丸括弧は使わない）
console.log("ユーザー" + user + "の得点は" + score + "点です");`,
      solution: `// 埋め込まれた値を【】で囲んで強調するタグ関数
function highlight(strings, ...values) {
  let result = "";
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += "【" + values[i] + "】";
    }
  }
  return result;
}

const user = "はなこ";
const score = 95;

// タグ付きテンプレート：固定部分と値が分解されてhighlightに渡る
console.log(highlight\`ユーザー\${user}の得点は\${score}点です\`);`,
      hints: [
        `タグ付きテンプレートは「関数名+テンプレートリテラル」の形で、丸括弧を使わずに呼び出します。`,
        `console.log(highlight\`ユーザー\${user}の得点は\${score}点です\`); のように、値の埋め込みにはドルマークと波括弧を使います。`
      ],
      expectedOutput: "ユーザー【はなこ】の得点は【95】点です"
    },
    {
      id: 185,
      title: "Proxy・Reflect入門",
      explanation: `<p><strong>Proxy</strong>は、オブジェクトへの操作（読み取り・書き込み・削除など）に割り込んで、独自の処理を差し込める仕組みです。<code>new Proxy(対象, ハンドラ)</code>で作り、ハンドラに<strong>トラップ</strong>と呼ばれるメソッドを定義します。</p>
<table>
<tr><th>トラップ</th><th>割り込むタイミング</th></tr>
<tr><td><code>get(target, prop)</code></td><td>プロパティの読み取り時</td></tr>
<tr><td><code>set(target, prop, value)</code></td><td>プロパティへの代入時</td></tr>
<tr><td><code>has(target, prop)</code></td><td>in演算子の使用時</td></tr>
<tr><td><code>deleteProperty(target, prop)</code></td><td>delete時</td></tr>
</table>
<pre><code>const user = { name: "たろう" };
const proxied = new Proxy(user, {
  get(target, prop) {
    console.log(prop + "を読み取りました");
    return Reflect.get(target, prop); // 本来の読み取りを実行
  }
});
proxied.name; // "nameを読み取りました" と表示されてから値が返る</code></pre>
<p>トラップの中で「本来の動作」を行うときに使うのが<strong>Reflect</strong>です。<code>Reflect.get</code>や<code>Reflect.set</code>はProxyのトラップと同じ名前・同じ引数を持つ関数を集めたオブジェクトで、「割り込んだあと、標準の動作に処理を戻す」用途にぴったり対応します。トラップで<code>return</code>を忘れると読み取り結果がすべて<code>undefined</code>になるので注意してください。Vue.jsのリアクティブシステム（データの変更を検知して画面を更新する仕組み）は、このProxyで実現されています。</p>`,
      task: `<code>get</code>トラップの中で<code>Reflect.get</code>を使って本来の値を返すようにし、アクセスログが表示されたうえで正しい値が取得できるようにしましょう。`,
      code: `const user = { name: "たろう", age: 20 };

const handler = {
  get(target, prop) {
    console.log("アクセス: " + String(prop));
    // TODO: Reflect.getを使って、本来の値を返す（returnを忘れずに）
  }
};

const proxied = new Proxy(user, handler);
console.log("名前: " + proxied.name);
console.log("年齢: " + proxied.age);`,
      solution: `const user = { name: "たろう", age: 20 };

const handler = {
  get(target, prop) {
    console.log("アクセス: " + String(prop));
    // Reflect.getで「本来の読み取り」を実行して結果を返す
    return Reflect.get(target, prop);
  }
};

const proxied = new Proxy(user, handler);
console.log("名前: " + proxied.name);
console.log("年齢: " + proxied.age);`,
      hints: [
        `そのまま実行すると「名前: undefined」になります。getトラップが何もreturnしていないからです。`,
        `return Reflect.get(target, prop); で標準の読み取り動作に処理を渡せます。`
      ],
      expectedOutput: "名前: たろう"
    },
    {
      id: 186,
      title: "WeakMap概要",
      explanation: `<p>第15章で学んだMapの兄弟分に<strong>WeakMap</strong>があります。名前の通り、キーを<strong>弱く（weak）</strong>保持するMapで、次の点が通常のMapと異なります。</p>
<table>
<tr><th></th><th>Map</th><th>WeakMap</th></tr>
<tr><td>キーにできる値</td><td>何でも</td><td>オブジェクトのみ</td></tr>
<tr><td>キーの保持</td><td>強い（消えない）</td><td>弱い（他から参照されなくなれば消える）</td></tr>
<tr><td>for...of・size</td><td>使える</td><td>使えない</td></tr>
<tr><td>主なメソッド</td><td>set/get/has/delete他</td><td>set/get/has/deleteのみ</td></tr>
</table>
<p>「弱く保持する」とは、キーのオブジェクトがWeakMap以外のどこからも参照されなくなったら、対応する値ごと自動的にメモリから消えてよい、という意味です。通常のMapでは、キーとして登録したオブジェクトはMapが存在する限り消えないため、大量のオブジェクトを登録し続けるとメモリを圧迫します。</p>
<pre><code>const metadata = new WeakMap();
let user = { name: "たろう" };
metadata.set(user, { lastLogin: "2026-01-10" });

console.log(metadata.get(user).lastLogin); // "2026-01-10"
user = null; // userが誰からも参照されなくなると、
             // WeakMap内の対応データも自動で回収対象になる</code></pre>
<p>典型的な用途は「他人のオブジェクトに、直接書き込まずにメタデータ（付随情報）を関連付ける」ことです。元のオブジェクトを汚さず、寿命の管理も自動なので、キャッシュやライブラリの内部データ保存に向いています。列挙できないのは不便に見えますが、これは「いつ消えるか分からないものを数えられては困る」という設計上の必然です。</p>`,
      task: `<code>user2</code>にもメタデータ<code>{ lastLogin: "2026-01-12" }</code>を関連付けて、両方のユーザーの最終ログイン日を表示しましょう。`,
      code: `const metadata = new WeakMap();

const user1 = { name: "たろう" };
const user2 = { name: "はなこ" };

metadata.set(user1, { lastLogin: "2026-01-10" });
// TODO: user2にもメタデータ { lastLogin: "2026-01-12" } を関連付ける

console.log("user1: " + metadata.get(user1).lastLogin);
console.log("user2: " + metadata.get(user2).lastLogin);
console.log("user2は登録済み: " + metadata.has(user2));`,
      solution: `const metadata = new WeakMap();

const user1 = { name: "たろう" };
const user2 = { name: "はなこ" };

metadata.set(user1, { lastLogin: "2026-01-10" });
// WeakMapの使い方はMapと同じ（ただしキーはオブジェクト限定）
metadata.set(user2, { lastLogin: "2026-01-12" });

console.log("user1: " + metadata.get(user1).lastLogin);
console.log("user2: " + metadata.get(user2).lastLogin);
console.log("user2は登録済み: " + metadata.has(user2));`,
      hints: [
        `WeakMapへの登録はMapと同じくsetメソッドです。`,
        `metadata.set(user2, { lastLogin: "2026-01-12" }); の1行を追加します。`
      ],
      expectedOutput: "user2: 2026-01-12"
    },
    {
      id: 187,
      title: "エラーのcauseとスタックトレース",
      explanation: `<p>第12章では<code>try...catch</code>とカスタムエラーを学びました。実務では、低レベルのエラー（例：DB接続失敗）を捕まえて、より分かりやすい高レベルのエラー（例：ユーザー読み込み失敗）に包み直して投げることがよくあります。このとき元のエラー情報を捨ててしまうと、原因調査ができなくなります。</p>
<p>ES2022で追加された<strong>cause</strong>オプションを使うと、元のエラーを新しいエラーにぶら下げて引き継げます。</p>
<pre><code>try {
  connectDb(); // ここで低レベルのエラーが発生
} catch (err) {
  // 第2引数の { cause: err } で元のエラーを保持する
  throw new Error("ユーザーの読み込みに失敗", { cause: err });
}</code></pre>
<p>受け取った側は<code>err.cause</code>で元のエラーにアクセスできます。原因が多段になっていれば<code>err.cause.cause</code>とたどることも可能です。</p>
<p>もう1つの調査道具が<strong>スタックトレース</strong>（<code>err.stack</code>）です。エラー発生時点の関数呼び出しの積み重ねが文字列として入っており、上の行ほどエラー発生地点に近い呼び出しです。</p>
<ul>
<li>1行目：エラー名とメッセージ</li>
<li>2行目以降：「at 関数名 (ファイル:行:列)」の形式で呼び出し履歴</li>
</ul>
<p>「エラーメッセージだけ見て、スタックトレースを読まない」のは初心者が最初に卒業すべき習慣です。一番上の「自分が書いたファイル」の行を見つければ、原因箇所に一直線にたどり着けます。</p>`,
      task: `<code>loadUser</code>のcatch節で投げ直すエラーに<code>{ cause: err }</code>を付けて、最終的なcatchで元のエラーメッセージが表示されるようにしましょう。`,
      code: `function connectDb() {
  throw new Error("DB接続がタイムアウトした");
}

function loadUser() {
  try {
    connectDb();
  } catch (err) {
    // TODO: 第2引数に { cause: err } を追加して、元のエラーを引き継ぐ
    throw new Error("ユーザーの読み込みに失敗");
  }
}

try {
  loadUser();
} catch (err) {
  console.log("エラー: " + err.message);
  console.log("原因: " + (err.cause ? err.cause.message : "不明"));
}`,
      solution: `function connectDb() {
  throw new Error("DB接続がタイムアウトした");
}

function loadUser() {
  try {
    connectDb();
  } catch (err) {
    // causeで元のエラーを新しいエラーにぶら下げて引き継ぐ
    throw new Error("ユーザーの読み込みに失敗", { cause: err });
  }
}

try {
  loadUser();
} catch (err) {
  console.log("エラー: " + err.message);
  // err.causeで包み直す前の元エラーにアクセスできる
  console.log("原因: " + (err.cause ? err.cause.message : "不明"));
}`,
      hints: [
        `そのまま実行すると「原因: 不明」になります。元のエラーがどこにも保存されていないからです。`,
        `new Error("メッセージ", { cause: err }) のように、Errorのコンストラクタは第2引数にオプションを取れます。`
      ],
      expectedOutput: "原因: DB接続がタイムアウトした"
    },
    {
      id: 188,
      title: "console.timeと計算量体感",
      explanation: `<p>コードの速さを手軽に測るには<code>console.time("ラベル")</code>と<code>console.timeEnd("ラベル")</code>のペアを使います。同じラベルのtimeからtimeEndまでの経過時間が「ラベル: 12.34ms」の形式で表示されます。</p>
<p>速さを考えるときの共通言語が<strong>計算量</strong>（データ量nが増えたとき処理時間がどう増えるかの目安）で、<strong>O記法</strong>で表します。</p>
<table>
<tr><th>計算量</th><th>意味</th><th>例</th></tr>
<tr><td>O(1)</td><td>データ量に関係なく一定</td><td>Set・Mapのhas、配列の添字アクセス</td></tr>
<tr><td>O(n)</td><td>データ量に比例</td><td>1重ループ、includes</td></tr>
<tr><td>O(n²)</td><td>データ量の2乗に比例</td><td>2重ループ</td></tr>
</table>
<p>「配列に重複があるか」を2重ループで調べるとO(n²)です。n=3000なら比較回数は約450万回。一方、第15章で学んだSetの<code>has</code>はO(1)なので、1重ループと組み合わせればO(n)、つまり3000回程度の反復で済みます。</p>
<pre><code>const seen = new Set();
for (const item of items) {
  if (seen.has(item)) {
    // 既に見た値＝重複を発見
  }
  seen.add(item);
}</code></pre>
<p>実測すると、データ量を10倍にしたときO(n)は約10倍、O(n²)は約100倍遅くなります。数千件程度なら差はミリ秒単位ですが、実務のデータ量では「動くけれど使い物にならない」コードの原因になります。まず正しく動かし、遅いと分かったら計測してから直す。この順番を体に染み込ませましょう。</p>`,
      task: `Setを使ったO(n)の重複検出を実装して<code>dup2</code>を求め、2重ループ版と同じ結果がより速く得られることを実行時間の表示で確認しましょう。`,
      code: `const size = 3000;
const items = [];
for (let i = 0; i < size; i++) {
  items.push(i);
}
items.push(1500); // 重複を1つ混ぜる

console.time("二重ループ O(n2)");
let dup1 = false;
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    if (items[i] === items[j]) {
      dup1 = true;
    }
  }
}
console.timeEnd("二重ループ O(n2)");
console.log("二重ループの結果: " + dup1);

console.time("Set O(n)");
let dup2 = false;
// TODO: Setを使って1重ループで重複を検出し、見つけたらdup2をtrueにする

console.timeEnd("Set O(n)");
console.log("Setの結果: " + dup2);`,
      solution: `const size = 3000;
const items = [];
for (let i = 0; i < size; i++) {
  items.push(i);
}
items.push(1500); // 重複を1つ混ぜる

console.time("二重ループ O(n2)");
let dup1 = false;
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    if (items[i] === items[j]) {
      dup1 = true;
    }
  }
}
console.timeEnd("二重ループ O(n2)");
console.log("二重ループの結果: " + dup1);

console.time("Set O(n)");
let dup2 = false;
// Setのhasは一定時間で判定できるため、全体でO(n)になる
const seen = new Set();
for (const item of items) {
  if (seen.has(item)) {
    dup2 = true;
  }
  seen.add(item);
}
console.timeEnd("Set O(n)");
console.log("Setの結果: " + dup2);`,
      hints: [
        `「今までに見た値」をSetに記録しながら1周するだけで、2重ループと同じ判定ができます。`,
        `各要素について seen.has(item) で既出かを確認し、そのあと seen.add(item) で記録します。`
      ],
      expectedOutput: "Setの結果: true"
    },
    {
      id: 189,
      title: "GCとメモリ（クロージャリーク）",
      explanation: `<p>JavaScriptのメモリ管理は<strong>ガベージコレクション（GC）</strong>が自動で行います。GCの基本ルールはただ1つ、<strong>どこからも到達できなくなった値は回収される</strong>です。逆に言えば、どこかから参照が1本でも残っていると、そのデータは回収されません。</p>
<p>ここで第10章のクロージャを思い出してください。クロージャは「外側の変数を覚えている関数」でした。この「覚えている」がまさに参照です。つまり、<strong>クロージャが生きている限り、捕まえている変数も回収されません</strong>。</p>
<pre><code>function build() {
  const bigData = new Array(100000).fill("データ"); // 10万件
  return function () {
    return bigData.length; // bigData全体を捕まえ続けている
  };
}
const fn = build(); // fnが生きている限り10万件が居座る</code></pre>
<p>この例で本当に必要なのは配列の「件数」だけです。必要な情報を先に変数へ写し取り、クロージャからは配列そのものを参照しないようにすれば、配列は回収可能になります。</p>
<pre><code>function build() {
  const bigData = new Array(100000).fill("データ");
  const size = bigData.length; // 必要な情報だけ写し取る
  return function () {
    return size; // 配列本体はもう参照していない
  };
}</code></pre>
<p>このような「不要なのに参照が残り続けてメモリを占有する」状態を<strong>メモリリーク</strong>と呼びます。長時間動き続けるサーバーやSPA（シングルページアプリ）では、小さなリークが積もって深刻な問題になります。前ステップのWeakMapが「弱い参照」を提供するのは、まさにこの問題への対策です。</p>`,
      task: `<code>createLightCounter</code>のクロージャが<code>bigData</code>本体ではなく<code>size</code>だけを参照するように書き換えて、大きな配列を回収可能にしましょう。`,
      code: `function createHeavyCounter() {
  const bigData = new Array(100000).fill("データ");
  let count = 0;
  return function () {
    count++;
    // クロージャがbigData全体を参照し続ける＝回収されない
    return count + "回目(要素数: " + bigData.length + ")";
  };
}

function createLightCounter() {
  const bigData = new Array(100000).fill("データ");
  const size = bigData.length; // 必要な情報だけを先に写し取ってある
  let count = 0;
  return function () {
    count++;
    // TODO: bigData.lengthではなくsizeを使い、配列本体への参照を残さない
    return count + "回目(元の要素数: " + bigData.length + ")";
  };
}

const heavy = createHeavyCounter();
const light = createLightCounter();
console.log("heavy: " + heavy());
console.log("light: " + light());`,
      solution: `function createHeavyCounter() {
  const bigData = new Array(100000).fill("データ");
  let count = 0;
  return function () {
    count++;
    // クロージャがbigData全体を参照し続ける＝回収されない
    return count + "回目(要素数: " + bigData.length + ")";
  };
}

function createLightCounter() {
  const bigData = new Array(100000).fill("データ");
  const size = bigData.length; // 必要な情報だけを先に写し取る
  let count = 0;
  return function () {
    count++;
    // sizeだけを参照するので、10万件の配列はGCの回収対象になれる
    return count + "回目(元の要素数: " + size + ")";
  };
}

const heavy = createHeavyCounter();
const light = createLightCounter();
console.log("heavy: " + heavy());
console.log("light: " + light());`,
      hints: [
        `クロージャの中でbigDataという名前を使った時点で、配列全体が「捕まえられて」しまいます。`,
        `返す関数の中の bigData.length を size に置き換えるだけです。出力は同じでも、メモリ上の意味が変わります。`
      ],
      expectedOutput: "light: 1回目(元の要素数: 100000)"
    },
    {
      id: 190,
      title: "総合演習（Proxyでバリデーション付きオブジェクト）",
      explanation: `<p>この章の総仕上げとして、Proxyの<code>set</code>トラップで「不正な値の代入をその場で拒否するオブジェクト」を作ります。使う知識を整理しましょう。</p>
<ul>
<li><strong>Proxyのsetトラップ</strong>（ステップ185）：代入に割り込む。正常時は<code>Reflect.set</code>で本来の代入を実行する</li>
<li><strong>throwとエラーの種類</strong>（第12章）：型の誤りは<code>TypeError</code>、範囲外は<code>RangeError</code>と、意味に合ったエラーを投げ分ける</li>
<li><strong>try...catch</strong>（第12章）：呼び出し側で拒否を検知する</li>
</ul>
<p>setトラップの設計はこうなります。</p>
<pre><code>set(target, prop, value) {
  if (prop === "age") {
    if (typeof value !== "number") {
      throw new TypeError("ageは数値で指定してください");
    }
    // 範囲チェックもここで行う
  }
  return Reflect.set(target, prop, value); // 検査を通過したら本来の代入
}</code></pre>
<p>この方式の優れた点は、<strong>検証ロジックがオブジェクトの利用側から完全に見えない</strong>ことです。利用者は<code>user.age = 30</code>と普通に代入するだけで、裏で自動的に検証されます。setterを1つずつ書く方法（第11章）と違い、あらゆるプロパティへの代入を1か所で監視できるのも強みです。フォーム入力の検証や、設定オブジェクトの保護など、実務でそのまま応用できるパターンです。エラーを投げたときは代入が行われないため、オブジェクトは常に正しい状態に保たれます。</p>`,
      task: `<code>set</code>トラップに検証を実装しましょう。<code>age</code>は数値以外なら<code>TypeError</code>、0未満または150超なら<code>RangeError</code>、<code>name</code>は空文字列なら<code>Error</code>を投げ、正常な値だけ代入されるようにします。`,
      code: `function createValidatedUser(initial) {
  const handler = {
    set(target, prop, value) {
      // TODO: propが"age"のとき
      //   - typeof value が "number" でなければ TypeError("ageは数値で指定してください")
      //   - 0未満または150超なら RangeError("ageは0以上150以下で指定してください")
      // TODO: propが"name"のとき
      //   - 空文字列なら Error("nameは空にできません")
      return Reflect.set(target, prop, value);
    }
  };
  return new Proxy(initial, handler);
}

const user = createValidatedUser({ name: "たろう", age: 20 });

user.age = 30;
console.log("更新成功: age = " + user.age);

try {
  user.age = -5;
} catch (err) {
  console.log(err.name + ": " + err.message);
}

try {
  user.age = "三十";
} catch (err) {
  console.log(err.name + ": " + err.message);
}

try {
  user.name = "";
} catch (err) {
  console.log(err.name + ": " + err.message);
}

console.log("最終状態: " + user.name + "(" + user.age + "歳)");`,
      solution: `function createValidatedUser(initial) {
  const handler = {
    set(target, prop, value) {
      if (prop === "age") {
        // 型の誤りはTypeError
        if (typeof value !== "number") {
          throw new TypeError("ageは数値で指定してください");
        }
        // 範囲外はRangeError
        if (value < 0 || value > 150) {
          throw new RangeError("ageは0以上150以下で指定してください");
        }
      }
      if (prop === "name") {
        if (value === "") {
          throw new Error("nameは空にできません");
        }
      }
      // 検査を通過したものだけ、本来の代入を実行する
      return Reflect.set(target, prop, value);
    }
  };
  return new Proxy(initial, handler);
}

const user = createValidatedUser({ name: "たろう", age: 20 });

user.age = 30;
console.log("更新成功: age = " + user.age);

try {
  user.age = -5;
} catch (err) {
  console.log(err.name + ": " + err.message);
}

try {
  user.age = "三十";
} catch (err) {
  console.log(err.name + ": " + err.message);
}

try {
  user.name = "";
} catch (err) {
  console.log(err.name + ": " + err.message);
}

console.log("最終状態: " + user.name + "(" + user.age + "歳)");`,
      hints: [
        `setトラップの中でprop（プロパティ名）ごとに条件分岐し、問題があればthrowします。throwすれば、その代入は実行されません。`,
        `ageの検証は「typeofが"number"でない」を先に、「value < 0 || value > 150」を後に判定します。`,
        `throw new TypeError("...")、throw new RangeError("...")、throw new Error("...")と、意味に合ったエラークラスを使い分けます。`
      ],
      expectedOutput: "最終状態: たろう(30歳)"
    }
  ]
});
