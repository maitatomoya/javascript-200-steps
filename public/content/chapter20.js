// 第20章：総合演習
registerChapter({
  number: 20,
  title: "総合演習",
  description: "全19章で学んだ知識を組み合わせて、10個の実践的なプログラムを骨組みから完成させます。JavaScript 200 Stepsの卒業章です。",
  steps: [
    {
      id: 191,
      title: "じゃんけん判定",
      explanation: `<p>最終章へようこそ。ここからは新しい文法は登場しません。各ステップで「どの章の知識を、どう組み合わせるか」を考えながら、骨組み（TODO付きのコード）を完成させていきます。</p>
<p>最初の題材はじゃんけんの勝敗判定です。使う知識を整理しましょう。</p>
<table>
<tr><th>使う知識</th><th>章</th><th>役割</th></tr>
<tr><td>関数</td><td>第4章</td><td>判定ロジックをjudge(a, b)にまとめる</td></tr>
<tr><td>オブジェクト</td><td>第7章</td><td>「勝てる相手」の対応表を作る</td></tr>
<tr><td>if文</td><td>第3章</td><td>あいこ・勝ち・負けの分岐</td></tr>
<tr><td>配列分割代入とfor...of</td><td>第5・7章</td><td>対戦リストを順に処理</td></tr>
</table>
<p>設計のポイントは、勝敗ルールを<strong>if文の羅列ではなくデータ（対応表）で表す</strong>ことです。</p>
<pre><code>// 「キーの手は、値の手に勝つ」という対応表
const WINS = {
  "グー": "チョキ",
  "チョキ": "パー",
  "パー": "グー"
};</code></pre>
<p>この表があれば、判定は「同じならあいこ」「WINS[a]がbなら勝ち」「それ以外は負け」の3行で書けます。ルールが9通りの組み合わせのif文に散らばらないので、読みやすく、手の種類が増えるゲームにも拡張しやすくなります。<strong>ロジックをデータに変換できないか考える</strong>のは、実務でも頻繁に使う設計テクニックです。</p>`,
      task: `<code>judge</code>関数を完成させて、対戦リストのすべての組み合わせで「勝ち・負け・あいこ」が正しく表示されるようにしましょう。`,
      code: `// 手は "グー" "チョキ" "パー" のいずれか
// judge(a, b)は、aから見た結果 "勝ち" "負け" "あいこ" を返す

// 「キーの手は、値の手に勝つ」という対応表
const WINS = {
  "グー": "チョキ",
  "チョキ": "パー",
  "パー": "グー"
};

function judge(a, b) {
  // TODO 1: aとbが同じなら "あいこ" を返す
  // TODO 2: WINS[a]がbと等しければ "勝ち" を返す
  // TODO 3: それ以外は "負け" を返す
}

const matches = [
  ["グー", "チョキ"],
  ["パー", "グー"],
  ["チョキ", "チョキ"],
  ["チョキ", "グー"]
];

for (const [a, b] of matches) {
  console.log(a + " vs " + b + ": " + judge(a, b));
}`,
      solution: `// 手は "グー" "チョキ" "パー" のいずれか
// judge(a, b)は、aから見た結果 "勝ち" "負け" "あいこ" を返す

// 「キーの手は、値の手に勝つ」という対応表
const WINS = {
  "グー": "チョキ",
  "チョキ": "パー",
  "パー": "グー"
};

function judge(a, b) {
  // 同じ手ならあいこ
  if (a === b) {
    return "あいこ";
  }
  // aが勝てる手がbなら勝ち
  if (WINS[a] === b) {
    return "勝ち";
  }
  // それ以外は負け
  return "負け";
}

const matches = [
  ["グー", "チョキ"],
  ["パー", "グー"],
  ["チョキ", "チョキ"],
  ["チョキ", "グー"]
];

for (const [a, b] of matches) {
  console.log(a + " vs " + b + ": " + judge(a, b));
}`,
      hints: [
        `3つの結果を順番に判定します。早期returnを使えばelseは不要です。`,
        `WINS[a]は「aが勝てる手」です。それがbと一致するかを===で比較します。`
      ],
      expectedOutput: "チョキ vs チョキ: あいこ"
    },
    {
      id: 192,
      title: "成績集計（メソッドチェーン）",
      explanation: `<p>次はオブジェクト配列の集計です。第6章の配列メソッドと第8章のオブジェクト配列操作を組み合わせます。</p>
<table>
<tr><th>使う知識</th><th>章</th><th>役割</th></tr>
<tr><td>filter</td><td>第6・8章</td><td>条件（70点以上）で絞り込む</td></tr>
<tr><td>map</td><td>第6・8章</td><td>表示用の文字列に変換する</td></tr>
<tr><td>forEach</td><td>第6章</td><td>1行ずつ出力する</td></tr>
<tr><td>reduce</td><td>第6章</td><td>点数を合計する</td></tr>
</table>
<p>処理の流れは「絞る→変換する→出力する」「絞る→合計する→平均を出す」の2本です。設計のコツは、<strong>絞り込んだ結果を一度変数に受ける</strong>ことです。</p>
<pre><code>const passed = students.filter(function (s) {
  return s.score &gt;= 70;
});
// passedは「表示」と「平均計算」の両方で使い回せる</code></pre>
<p>filterの結果をチェーンでそのままmapに流すこともできますが、今回は合格者リストを2回使う（表示と平均）ため、変数に受けたほうが無駄な再計算を避けられます。<strong>チェーンでつなぐか、変数に受けるか</strong>は「その中間結果を後で再利用するか」で判断しましょう。平均は「合計÷件数」なので、reduceで合計を出してから<code>passed.length</code>で割ります。実務のデータ集計はほぼこのパターン（絞る→変換→畳み込む）の変奏なので、手が勝手に動くまで練習する価値があります。</p>`,
      task: `TODOを実装し、70点以上の合格者を「名前(教科): 点数」の形式で表示したあと、合格者の平均点を表示しましょう。`,
      code: `const students = [
  { name: "たろう", score: 82, subject: "数学" },
  { name: "はなこ", score: 91, subject: "数学" },
  { name: "じろう", score: 58, subject: "数学" },
  { name: "さくら", score: 76, subject: "英語" },
  { name: "けんた", score: 64, subject: "英語" },
  { name: "あおい", score: 88, subject: "英語" }
];

// TODO 1: filterでscoreが70以上の合格者だけの配列passedを作る
const passed = [];

// TODO 2: passedをmapで "名前(教科): 点数" の文字列配列に変換し、
//         forEachで1行ずつ表示する

// TODO 3: passedのscoreをreduceで合計し、平均点を計算する
const total = 0;

console.log("合格者数: " + passed.length + "人");
console.log("合格者の平均点: " + total / passed.length);`,
      solution: `const students = [
  { name: "たろう", score: 82, subject: "数学" },
  { name: "はなこ", score: 91, subject: "数学" },
  { name: "じろう", score: 58, subject: "数学" },
  { name: "さくら", score: 76, subject: "英語" },
  { name: "けんた", score: 64, subject: "英語" },
  { name: "あおい", score: 88, subject: "英語" }
];

// 合格者リストは「表示」と「平均計算」の2回使うので変数に受ける
const passed = students.filter(function (s) {
  return s.score >= 70;
});

// 変換と出力はチェーンでつなぐ
passed
  .map(function (s) {
    return s.name + "(" + s.subject + "): " + s.score;
  })
  .forEach(function (line) {
    console.log(line);
  });

// reduceで合計し、件数で割って平均を出す
const total = passed.reduce(function (sum, s) {
  return sum + s.score;
}, 0);

console.log("合格者数: " + passed.length + "人");
console.log("合格者の平均点: " + total / passed.length);`,
      hints: [
        `filterのコールバックは「残したい要素でtrueを返す」でした。s.scoreを70と比較します。`,
        `mapで文字列に変換した配列に対して、続けて.forEach(...)をつなげられます。`,
        `reduceは第2引数に初期値0を渡し、(sum, s)で受けてsum + s.scoreを返します。`
      ],
      expectedOutput: "合格者の平均点: 84.25"
    },
    {
      id: 193,
      title: "在庫管理（class＋Map）",
      explanation: `<p>今度は「状態を持つモノ」を作ります。第11章のclassでデータと操作をひとまとめにし、内部のデータ構造には第15章のMapを使います。</p>
<table>
<tr><th>使う知識</th><th>章</th><th>役割</th></tr>
<tr><td>class・constructor</td><td>第11章</td><td>在庫という「状態＋操作」のまとまりを表現</td></tr>
<tr><td>Map</td><td>第15章</td><td>商品名→個数の対応を管理</td></tr>
<tr><td>??演算子</td><td>第7章</td><td>未登録商品の個数を0として扱う</td></tr>
<tr><td>for...of</td><td>第15章</td><td>Mapを回してレポートを出力</td></tr>
</table>
<p>なぜオブジェクトではなくMapなのか。商品名はユーザー由来の任意の文字列であり、追加・削除が頻繁だからです（第15章「Mapとオブジェクトの使い分け」の判断基準そのものです）。</p>
<p>設計の急所は<code>add</code>と<code>remove</code>の境界処理です。</p>
<pre><code>// 未登録ならgetはundefinedを返す → ??で0に変換すると
// 「新規登録」と「加算」を1行で書ける
const current = this.items.get(name) ?? 0;
this.items.set(name, current + count);</code></pre>
<p><code>remove</code>では「在庫不足」を先に検出して弾き（ガード節）、正常時のみ減算します。減らした結果が0になったら<code>delete</code>でMapから取り除くと、レポートに「0個」の行が残りません。<strong>異常系を先に処理して早期リターンする</strong>書き方は、ネストを浅く保つ定番テクニックです。</p>`,
      task: `<code>Inventory</code>クラスの3つのメソッドを実装して、入荷・出荷・在庫レポートが正しく動くようにしましょう。`,
      code: `class Inventory {
  constructor() {
    this.items = new Map(); // 商品名 → 個数
  }

  add(name, count) {
    // TODO 1: 現在の個数（未登録なら0）にcountを加算してsetする
    //         ヒント: this.items.get(name) ?? 0
  }

  remove(name, count) {
    // TODO 2: 現在の個数（未登録なら0）がcount未満なら
    //         "在庫不足: " + name を表示してfalseを返す
    // TODO 3: 足りていれば減算してsetし、trueを返す
    //         （結果が0ならdeleteで取り除く）
  }

  report() {
    console.log("--- 在庫レポート ---");
    // TODO 4: for...ofでMapを回し、"名前: N個" を1行ずつ表示する
  }
}

const inv = new Inventory();
inv.add("りんご", 3);
inv.add("みかん", 5);
inv.add("りんご", 2);
inv.remove("みかん", 2);
inv.remove("バナナ", 1);
inv.report();`,
      solution: `class Inventory {
  constructor() {
    this.items = new Map(); // 商品名 → 個数
  }

  add(name, count) {
    // 未登録ならgetはundefined → ??で0にして、新規も加算も1行で扱う
    const current = this.items.get(name) ?? 0;
    this.items.set(name, current + count);
  }

  remove(name, count) {
    const current = this.items.get(name) ?? 0;
    // 異常系（在庫不足）を先に弾くガード節
    if (current < count) {
      console.log("在庫不足: " + name);
      return false;
    }
    const rest = current - count;
    if (rest === 0) {
      this.items.delete(name); // 0個の行をレポートに残さない
    } else {
      this.items.set(name, rest);
    }
    return true;
  }

  report() {
    console.log("--- 在庫レポート ---");
    // Mapはfor...ofで[キー, 値]のペアが取り出せる
    for (const [name, count] of this.items) {
      console.log(name + ": " + count + "個");
    }
  }
}

const inv = new Inventory();
inv.add("りんご", 3);
inv.add("みかん", 5);
inv.add("りんご", 2);
inv.remove("みかん", 2);
inv.remove("バナナ", 1);
inv.report();`,
      hints: [
        `addは「今の個数を取得（なければ0）→ 足してset」の2行で書けます。`,
        `removeはまず在庫不足かをif文で判定し、不足ならメッセージ表示とreturn falseで抜けます。`,
        `for (const [name, count] of this.items) { ... } でMapのキーと値を同時に取り出せます。`
      ],
      expectedOutput: "りんご: 5個"
    },
    {
      id: 194,
      title: "テキスト統計（Map＋ソート）",
      explanation: `<p>文章中の単語の出現回数を数えて、多い順にランキング表示します。これは検索エンジンやログ解析の最も基本的な処理の縮小版です。</p>
<table>
<tr><th>使う知識</th><th>章</th><th>役割</th></tr>
<tr><td>split</td><td>第9章</td><td>文章を単語の配列に分割</td></tr>
<tr><td>Map＋??</td><td>第15・7章</td><td>単語→回数のカウント</td></tr>
<tr><td>スプレッド構文</td><td>第15章</td><td>Mapを[単語, 回数]の配列に変換</td></tr>
<tr><td>sortと比較関数</td><td>第6章</td><td>回数の降順に並べ替え</td></tr>
<tr><td>slice</td><td>第5章</td><td>上位3件を切り出す</td></tr>
</table>
<p>処理は「分割→集計→配列化→ソート→切り出し→表示」という一本道のパイプラインです。集計は前ステップと同じ<code>get(word) ?? 0</code>パターンが使えます。</p>
<p>設計の急所はソートの比較関数です。回数の降順を第一条件、同数の場合は単語の昇順を第二条件にします。</p>
<pre><code>entries.sort(function (a, b) {
  if (b[1] !== a[1]) {
    return b[1] - a[1]; // 第一条件: 回数の降順
  }
  return a[0] &lt; b[0] ? -1 : 1; // 第二条件: 単語の昇順
});</code></pre>
<p>第二条件を入れないと、同数の単語の順序が実行環境しだいになり、テストできない出力になってしまいます。<strong>並び順を完全に決定的にする</strong>のは、実務でレポートやランキングを作るときの重要な習慣です。</p>`,
      task: `TODOを実装し、単語の出現回数を集計して、回数の降順（同数なら単語の昇順）で上位3件を「単語: N回」の形式で表示しましょう。`,
      code: `const text = "js node js map set js node map";

// TODO 1: splitで半角スペース区切りの単語配列に分割する
const words = [];

// TODO 2: Mapを使って単語→出現回数を数える（get(word) ?? 0 のパターン）
const counts = new Map();

// TODO 3: スプレッド構文でcountsを[単語, 回数]の配列にし、
//         回数の降順（同数なら単語の昇順）でsortする
const entries = [];

// TODO 4: sliceで上位3件を取り出し、"単語: N回" で表示する
console.log("--- 頻出単語トップ3 ---");`,
      solution: `const text = "js node js map set js node map";

// 半角スペースで区切って単語の配列にする
const words = text.split(" ");

// 単語→出現回数をMapで集計する
const counts = new Map();
for (const word of words) {
  counts.set(word, (counts.get(word) ?? 0) + 1);
}

// Mapを[単語, 回数]の配列に変換してソートする
const entries = [...counts.entries()];
entries.sort(function (a, b) {
  if (b[1] !== a[1]) {
    return b[1] - a[1]; // 第一条件: 回数の降順
  }
  return a[0] < b[0] ? -1 : 1; // 第二条件: 単語の昇順
});

console.log("--- 頻出単語トップ3 ---");
entries.slice(0, 3).forEach(function (entry) {
  console.log(entry[0] + ": " + entry[1] + "回");
});`,
      hints: [
        `text.split(" ")で単語の配列が得られます。`,
        `集計はfor...ofで回しながら counts.set(word, (counts.get(word) ?? 0) + 1) とします。`,
        `[...counts.entries()]で[[単語, 回数], ...]の配列になります。比較関数ではa[1]（回数）とa[0]（単語）を使い分けます。`
      ],
      expectedOutput: "js: 3回"
    },
    {
      id: 195,
      title: "エラー処理付き計算パイプライン",
      explanation: `<p>外部から来るデータは信用できません。このステップでは「変換→検証→計算」と関数を通していき、途中で失敗したデータはエラーとして記録し、<strong>正常なデータの処理は最後まで続ける</strong>パイプラインを作ります。</p>
<table>
<tr><th>使う知識</th><th>章</th><th>役割</th></tr>
<tr><td>throw・カスタムメッセージ</td><td>第12章</td><td>不正データをその場で失敗させる</td></tr>
<tr><td>try...catch</td><td>第12章</td><td>1件の失敗を全体の停止にしない</td></tr>
<tr><td>Number・isNaN</td><td>第2・17章</td><td>文字列→数値の変換と検証</td></tr>
<tr><td>純粋関数の合成</td><td>第18章</td><td>小さな関数をつないで処理を組み立てる</td></tr>
</table>
<p>設計の急所は<strong>try...catchを置く場所</strong>です。ループの外に置くと最初の失敗で全体が止まりますが、ループの中の1件分だけを囲めば、失敗はその1件の記録にとどまり、残りの処理は続行されます。</p>
<pre><code>for (const input of inputs) {
  try {
    // 1件分のパイプライン処理
  } catch (err) {
    errors.push(err.message); // この1件だけ失敗として記録
  }
}</code></pre>
<p>また、各関数は「検証に通れば値を返し、通らなければthrowする」という約束で統一されています。この約束のおかげで、<code>double(validatePositive(parseNumber(input)))</code>と素直に入れ子にするだけでパイプラインが完成し、どの段階の失敗も同じcatchに集まります。バッチ処理やCSV取り込みなど、実務の定番パターンです。</p>`,
      task: `<code>validatePositive</code>のTODOとループ内のパイプライン処理を実装し、成功した結果の一覧と失敗の件数・理由が表示されるようにしましょう。`,
      code: `function parseNumber(input) {
  const n = Number(input);
  if (Number.isNaN(n)) {
    throw new Error("数値に変換できません: " + input);
  }
  return n;
}

function validatePositive(n) {
  // TODO 1: nが0以下なら Error("正の数ではありません: " + n) をthrowする
  return n;
}

function double(n) {
  return n * 2;
}

const inputs = ["10", "abc", "25", "-3", "0.5"];
const results = [];
const errors = [];

for (const input of inputs) {
  try {
    // TODO 2: parseNumber → validatePositive → double の順に通して
    //         結果をresultsにpushする
  } catch (err) {
    errors.push(err.message);
  }
}

console.log("成功: " + results.join(", "));
console.log("失敗: " + errors.length + "件");
errors.forEach(function (msg) {
  console.log("  - " + msg);
});`,
      solution: `function parseNumber(input) {
  const n = Number(input);
  if (Number.isNaN(n)) {
    throw new Error("数値に変換できません: " + input);
  }
  return n;
}

function validatePositive(n) {
  // 0以下は不正データとしてその場で失敗させる
  if (n <= 0) {
    throw new Error("正の数ではありません: " + n);
  }
  return n;
}

function double(n) {
  return n * 2;
}

const inputs = ["10", "abc", "25", "-3", "0.5"];
const results = [];
const errors = [];

for (const input of inputs) {
  try {
    // 変換→検証→計算のパイプライン。どこでthrowしても下のcatchに集まる
    const value = double(validatePositive(parseNumber(input)));
    results.push(value);
  } catch (err) {
    // 1件の失敗を記録するだけで、ループ全体は続行される
    errors.push(err.message);
  }
}

console.log("成功: " + results.join(", "));
console.log("失敗: " + errors.length + "件");
errors.forEach(function (msg) {
  console.log("  - " + msg);
});`,
      hints: [
        `validatePositiveは if (n <= 0) { throw new Error(...); } のガード節を先頭に置きます。`,
        `パイプラインは内側から実行されます。double(validatePositive(parseNumber(input))) の順で入れ子にします。`,
        `try...catchがループの中にあるので、throwされてもcatchで受けて次のinputに進めます。`
      ],
      expectedOutput: "成功: 20, 50, 1"
    },
    {
      id: 196,
      title: "図書館貸出管理（class＋配列）",
      explanation: `<p>在庫管理（ステップ193）ではMapを使いましたが、今回は<strong>オブジェクトの配列</strong>を内部データにしたclassを作ります。本には「タイトル」と「貸出中かどうか」という複数の属性があり、属性を持つデータの集まりは第8章で学んだオブジェクト配列が適任だからです。</p>
<table>
<tr><th>使う知識</th><th>章</th><th>役割</th></tr>
<tr><td>class</td><td>第11章</td><td>蔵書リストと貸出操作をまとめる</td></tr>
<tr><td>オブジェクト配列＋find</td><td>第8章</td><td>タイトルで本を検索</td></tr>
<tr><td>早期リターン</td><td>第4・12章</td><td>「見つからない」「貸出中」を先に弾く</td></tr>
<tr><td>三項演算子</td><td>第3章</td><td>状態表示の切り替え</td></tr>
</table>
<p><code>lend</code>（貸出）メソッドの設計は、失敗パターンを先に列挙するときれいになります。</p>
<pre><code>lend(title) {
  const book = this.books.find(function (b) { return b.title === title; });
  if (!book) { /* 見つからない */ }
  if (book.borrowed) { /* すでに貸出中 */ }
  // ここまで来たら必ず貸出できる
}</code></pre>
<p><code>find</code>は見つからないと<code>undefined</code>を返すので、<code>!book</code>で「未所蔵」を判定できます。正常系のコードが失敗チェックの下に平らに続く構造は、ステップ193のガード節と同じ思想です。<strong>データ構造の選択（Mapか、オブジェクト配列か）は「キーだけで引くのか、属性で探すのか」で決める</strong>——この2つのステップを見比べると、その判断基準が体感できるはずです。</p>`,
      task: `<code>lend</code>と<code>giveBack</code>を実装して、貸出・返却・エラーメッセージ・蔵書一覧が正しく表示されるようにしましょう。`,
      code: `class Library {
  constructor() {
    this.books = []; // { title: string, borrowed: boolean } の配列
  }

  addBook(title) {
    this.books.push({ title: title, borrowed: false });
  }

  lend(title) {
    // TODO 1: findでタイトルが一致する本を探す
    // TODO 2: 見つからなければ "未所蔵: " + title を表示してreturn
    // TODO 3: borrowedがtrueなら "貸出中のため不可: " + title を表示してreturn
    // TODO 4: borrowedをtrueにして "貸出: " + title を表示する
  }

  giveBack(title) {
    // TODO 5: findで本を探し、見つかったらborrowedをfalseにして
    //         "返却: " + title を表示する
  }

  list() {
    console.log("--- 蔵書一覧 ---");
    for (const book of this.books) {
      console.log(book.title + " [" + (book.borrowed ? "貸出中" : "在庫あり") + "]");
    }
  }
}

const lib = new Library();
lib.addBook("JS入門");
lib.addBook("Node実践");
lib.addBook("アルゴリズム図鑑");
lib.lend("JS入門");
lib.lend("JS入門");
lib.lend("存在しない本");
lib.lend("Node実践");
lib.giveBack("Node実践");
lib.list();`,
      solution: `class Library {
  constructor() {
    this.books = []; // { title: string, borrowed: boolean } の配列
  }

  addBook(title) {
    this.books.push({ title: title, borrowed: false });
  }

  lend(title) {
    const book = this.books.find(function (b) {
      return b.title === title;
    });
    // 失敗パターンを先に弾く（ガード節）
    if (!book) {
      console.log("未所蔵: " + title);
      return;
    }
    if (book.borrowed) {
      console.log("貸出中のため不可: " + title);
      return;
    }
    // ここまで来たら必ず貸出できる
    book.borrowed = true;
    console.log("貸出: " + title);
  }

  giveBack(title) {
    const book = this.books.find(function (b) {
      return b.title === title;
    });
    if (book) {
      book.borrowed = false;
      console.log("返却: " + title);
    }
  }

  list() {
    console.log("--- 蔵書一覧 ---");
    for (const book of this.books) {
      console.log(book.title + " [" + (book.borrowed ? "貸出中" : "在庫あり") + "]");
    }
  }
}

const lib = new Library();
lib.addBook("JS入門");
lib.addBook("Node実践");
lib.addBook("アルゴリズム図鑑");
lib.lend("JS入門");
lib.lend("JS入門");
lib.lend("存在しない本");
lib.lend("Node実践");
lib.giveBack("Node実践");
lib.list();`,
      hints: [
        `findのコールバックは b.title === title を返します。見つからないときはundefinedが返ります。`,
        `if (!book) と if (book.borrowed) の2つのガード節で失敗を先に処理し、それぞれreturnで抜けます。`,
        `findが返すのは配列内のオブジェクトそのものなので、book.borrowed = true とすれば配列の中身が書き換わります。`
      ],
      expectedOutput: "JS入門 [貸出中]"
    },
    {
      id: 197,
      title: "図形の面積（継承＋多態）",
      explanation: `<p>第12章の継承を使って、図形の面積計算を<strong>多態性（ポリモーフィズム）</strong>で設計します。多態性とは「同じメソッド名の呼び出しでも、実際のクラスに応じて異なる処理が動く」性質です。</p>
<table>
<tr><th>使う知識</th><th>章</th><th>役割</th></tr>
<tr><td>extends・super</td><td>第12章</td><td>共通部分を親クラスにまとめる</td></tr>
<tr><td>オーバーライド</td><td>第12章</td><td>図形ごとにarea()を差し替える</td></tr>
<tr><td>Math.PI</td><td>第17章</td><td>円の面積計算</td></tr>
<tr><td>toFixed</td><td>第2・17章</td><td>小数の表示桁をそろえる</td></tr>
</table>
<p>設計の核心は、親クラス<code>Shape</code>の<code>describe</code>が「まだ存在しない子クラスのarea()」を呼んでいることです。</p>
<pre><code>class Shape {
  describe() {
    // this.area()は実行時に「実際のクラスのarea」が選ばれる
    return this.name + "の面積: " + this.area().toFixed(2);
  }
}</code></pre>
<p>おかげで、図形の配列を回すループはこう書けます。</p>
<pre><code>for (const s of shapes) {
  console.log(s.describe()); // 長方形でも円でも同じ1行
}</code></pre>
<p>もし多態性を使わなければ、ループの中に「長方形なら縦×横、円なら半径×半径×π……」というif文が増殖します。図形の種類を増やすたびにループを修正するのではなく、<strong>新しいクラスを追加するだけで既存コードが無修正で動く</strong>——これが継承と多態性の実用上の価値です。親クラスのarea()がthrowするのは「子クラスでのオーバーライドを強制する」ための仕掛けです。</p>`,
      task: `<code>Rectangle</code>と<code>Circle</code>を完成させて、図形一覧の面積と合計面積が表示されるようにしましょう。`,
      code: `class Shape {
  constructor(name) {
    this.name = name;
  }
  area() {
    // 子クラスでのオーバーライドを強制するための仕掛け
    throw new Error("サブクラスでareaを実装してください");
  }
  describe() {
    return this.name + "の面積: " + this.area().toFixed(2);
  }
}

class Rectangle extends Shape {
  // TODO 1: constructor(width, height)を定義する
  //         super("長方形")を呼んでからwidthとheightを保存する
  // TODO 2: area()をオーバーライドして 幅×高さ を返す
}

class Circle extends Shape {
  // TODO 3: constructor(radius)を定義する（super("円")を忘れずに）
  // TODO 4: area()をオーバーライドして Math.PI×半径×半径 を返す
}

const shapes = [new Rectangle(4, 5), new Circle(3), new Rectangle(2, 8)];

let total = 0;
for (const s of shapes) {
  console.log(s.describe());
  total += s.area();
}
console.log("合計面積: " + total.toFixed(2));`,
      solution: `class Shape {
  constructor(name) {
    this.name = name;
  }
  area() {
    // 子クラスでのオーバーライドを強制するための仕掛け
    throw new Error("サブクラスでareaを実装してください");
  }
  describe() {
    // this.area()は実行時に「実際のクラスのarea」が選ばれる（多態性）
    return this.name + "の面積: " + this.area().toFixed(2);
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super("長方形"); // 親のconstructorで名前を設定する
    this.width = width;
    this.height = height;
  }
  area() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super("円");
    this.radius = radius;
  }
  area() {
    return Math.PI * this.radius * this.radius;
  }
}

const shapes = [new Rectangle(4, 5), new Circle(3), new Rectangle(2, 8)];

let total = 0;
for (const s of shapes) {
  // どのクラスの図形でも同じ1行で扱える
  console.log(s.describe());
  total += s.area();
}
console.log("合計面積: " + total.toFixed(2));`,
      hints: [
        `子クラスのconstructorでは、thisを使う前に必ずsuper(...)を呼ぶ必要があります。`,
        `Rectangleのareaは this.width * this.height、Circleのareaは Math.PI * this.radius * this.radius を返します。`,
        `area()を正しくオーバーライドすれば、親のdescribe()とループは一切変更せずに動きます。`
      ],
      expectedOutput: "合計面積: 64.27"
    },
    {
      id: 198,
      title: "簡易スタックマシン",
      explanation: `<p>少しコンピュータサイエンス寄りの題材に挑戦します。<strong>スタックマシン</strong>は「数値はスタック（後入れ先出しの入れ物）に積み、演算子はスタックから2つ取り出して計算し、結果を積み戻す」だけで動く計算機です。JavaScriptエンジンやJava VMの内部も、この方式の親戚で動いています。</p>
<table>
<tr><th>使う知識</th><th>章</th><th>役割</th></tr>
<tr><td>push・pop</td><td>第5章</td><td>配列をスタックとして使う</td></tr>
<tr><td>typeof</td><td>第2章</td><td>数値と命令（文字列）を見分ける</td></tr>
<tr><td>if...else if</td><td>第3章</td><td>命令ごとの分岐</td></tr>
<tr><td>throw</td><td>第12章</td><td>不明な命令をエラーにする</td></tr>
</table>
<p>たとえば「(2+3)×4」は、命令列<code>[2, 3, "add", 4, "mul"]</code>になります。実行の様子を追ってみましょう。</p>
<table>
<tr><th>命令</th><th>動作</th><th>スタックの中身</th></tr>
<tr><td>2</td><td>積む</td><td>[2]</td></tr>
<tr><td>3</td><td>積む</td><td>[2, 3]</td></tr>
<tr><td>"add"</td><td>2つ取り出して和を積む</td><td>[5]</td></tr>
<tr><td>4</td><td>積む</td><td>[5, 4]</td></tr>
<tr><td>"mul"</td><td>2つ取り出して積を積む</td><td>[20]</td></tr>
</table>
<p>注意点は引き算です。popは後に積んだものから出てくるので、<strong>先にpopしたものが右側の値</strong>になります。<code>const b = stack.pop(); const a = stack.pop();</code>としてから<code>a - b</code>を計算する順序を間違えると、符号が逆になります。小さなコードですが「データ構造＋規則の解釈」というインタプリタの本質が詰まっています。</p>`,
      task: `<code>run</code>関数の各命令（数値のpush、add、sub、mul）を実装して、2つの計算例が正しい結果になるようにしましょう。`,
      code: `function run(program) {
  const stack = [];
  for (const token of program) {
    if (typeof token === "number") {
      // TODO 1: 数値はスタックに積む
    } else if (token === "add") {
      // TODO 2: 2つpopして和をpushする
    } else if (token === "sub") {
      // TODO 3: 先にpopした方をb、次をaとして a - b をpushする（順序に注意）
    } else if (token === "mul") {
      // TODO 4: 2つpopして積をpushする
    } else {
      throw new Error("不明な命令: " + token);
    }
  }
  return stack.pop(); // 最後に残った値が計算結果
}

console.log("(2+3)*4 = " + run([2, 3, "add", 4, "mul"]));
console.log("10-(2*3) = " + run([10, 2, 3, "mul", "sub"]));`,
      solution: `function run(program) {
  const stack = [];
  for (const token of program) {
    if (typeof token === "number") {
      // 数値はそのまま積む
      stack.push(token);
    } else if (token === "add") {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(a + b);
    } else if (token === "sub") {
      // popは後に積んだものから出る＝先に出た方が右側の値
      const b = stack.pop();
      const a = stack.pop();
      stack.push(a - b);
    } else if (token === "mul") {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(a * b);
    } else {
      throw new Error("不明な命令: " + token);
    }
  }
  return stack.pop(); // 最後に残った値が計算結果
}

console.log("(2+3)*4 = " + run([2, 3, "add", 4, "mul"]));
console.log("10-(2*3) = " + run([10, 2, 3, "mul", "sub"]));`,
      hints: [
        `各演算は「const b = stack.pop(); const a = stack.pop(); stack.push(計算結果);」の3行パターンです。`,
        `subだけ順序が重要です。10 - 6 の計算では、6（後に積まれた方）が先にpopされるので a - b とします。`
      ],
      expectedOutput: "(2+3)*4 = 20"
    },
    {
      id: 199,
      title: "非同期タスクランナー",
      explanation: `<p>第13・14章の非同期処理を総動員して、複数のタスクを<strong>並行実行</strong>するタスクランナーを作ります。</p>
<table>
<tr><th>使う知識</th><th>章</th><th>役割</th></tr>
<tr><td>Promise・setTimeout</td><td>第13章</td><td>時間のかかるタスクを再現</td></tr>
<tr><td>async/await</td><td>第14章</td><td>非同期処理を同期処理のように書く</td></tr>
<tr><td>Promise.all</td><td>第14章</td><td>複数のPromiseを並行実行して全完了を待つ</td></tr>
<tr><td>map・reduce</td><td>第6章</td><td>結果の整形と集計</td></tr>
</table>
<p>3つのタスク（30ms・10ms・20ms）を順番にawaitすると合計60ms待つことになりますが、<code>Promise.all</code>なら3つ同時に走らせて、一番遅い30msで全部そろいます。</p>
<pre><code>const results = await Promise.all([
  runTask("A", 30, 10),
  runTask("B", 10, 20),
  runTask("C", 20, 30)
]);</code></pre>
<p>ここで重要な性質が1つあります。タスクBが最初に完了しても、<strong>Promise.allの結果配列は「渡した順」で並ぶ</strong>ことです。完了の速さは実行のたびに揺らぎますが、結果の順序は常に一定——つまり後続の処理は決定的に書けます。「実行は並行で速く、結果の順序は安定」という、この2つの性質の組み合わせがPromise.allの実務価値です。複数のAPIを同時に呼んで画面を組み立てる、複数ファイルを同時に読む、といった場面でそのまま使えます。</p>`,
      task: `TODOを実装し、3つのタスクを<code>Promise.all</code>で並行実行して、完了後にタスク名の一覧と値の合計を表示しましょう。`,
      code: `function runTask(name, ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log("完了: " + name + " (" + ms + "ms)");
      resolve({ name: name, value: value });
    }, ms);
  });
}

async function main() {
  console.log("タスク開始");

  // TODO 1: runTask("A", 30, 10)、runTask("B", 10, 20)、runTask("C", 20, 30)を
  //         Promise.allで並行実行し、awaitで結果の配列resultsを受け取る

  // TODO 2: resultsのnameをmapで取り出し、joinして
  //         "実行順: " + つないだ文字列 を表示する（渡した順になる）

  // TODO 3: resultsのvalueをreduceで合計し、"合計: " + 合計値 を表示する
}

main();`,
      solution: `function runTask(name, ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log("完了: " + name + " (" + ms + "ms)");
      resolve({ name: name, value: value });
    }, ms);
  });
}

async function main() {
  console.log("タスク開始");

  // 3つのタスクを同時に開始し、全完了を待つ（最長の30msで全部そろう）
  const results = await Promise.all([
    runTask("A", 30, 10),
    runTask("B", 10, 20),
    runTask("C", 20, 30)
  ]);

  // 完了はB→C→Aの順でも、resultsは渡した順（A, B, C）で並ぶ
  const names = results.map(function (r) {
    return r.name;
  });
  console.log("実行順: " + names.join(", "));

  const total = results.reduce(function (sum, r) {
    return sum + r.value;
  }, 0);
  console.log("合計: " + total);
}

main();`,
      hints: [
        `Promise.allにはPromiseの配列を渡します。await Promise.all([...]) の結果は各Promiseの結果の配列です。`,
        `awaitはasync関数の中でしか使えません。main関数はすでにasyncになっています。`,
        `resultsの各要素は { name, value } のオブジェクトです。mapでname、reduceでvalueを集めます。`
      ],
      expectedOutput: "合計: 60"
    },
    {
      id: 200,
      title: "卒業課題（家計簿レポート）",
      explanation: `<p>いよいよ最後のステップです。卒業課題は家計簿プログラム。データの集計・並べ替え・整形出力という「実務プログラムの3点セット」を、これまでの知識だけで組み上げます。</p>
<table>
<tr><th>工程</th><th>使う知識</th><th>章</th></tr>
<tr><td>カテゴリ別集計</td><td>Map＋??パターン</td><td>第15・7章</td></tr>
<tr><td>降順ソート</td><td>スプレッド＋sort比較関数</td><td>第6・15章</td></tr>
<tr><td>金額の3桁区切り</td><td>Intl.NumberFormat</td><td>第17章</td></tr>
<tr><td>列ぞろえ</td><td>padEnd・padStart</td><td>第9章</td></tr>
<tr><td>総合計</td><td>ループでの加算</td><td>第3章</td></tr>
</table>
<p>集計は在庫管理やテキスト統計で繰り返し使った<code>get(key) ?? 0</code>パターン、ソートはテキスト統計と同じ「Mapを配列化してsort」です。仕上げの整形出力だけが新しい組み合わせで、カテゴリ名は<code>padEnd</code>で左寄せ、金額は<code>padStart</code>で右寄せにすると、帳票らしい見た目になります。</p>
<pre><code>// "食費　　" + "  3,950円" のように列がそろう
console.log(cat.padEnd(4, "　") + text.padStart(9));</code></pre>
<p>200ステップ、本当にお疲れさまでした。変数から始まり、関数、オブジェクト、クラス、非同期、そして言語の内部の仕組みまで——ここまで来たあなたは、公式ドキュメント（MDNなど）を自力で読み解ける土台を手に入れています。次の一歩は、自分の困りごとを解決する小さなツールを1つ作ってみることです。書いた分だけ、力になります。</p>`,
      task: `TODOを実装して、カテゴリ別の合計を金額の降順で整形表示し、最後に総合計を表示する家計簿レポートを完成させましょう。`,
      code: `const entries = [
  { date: "01-05", category: "食費", amount: 1200 },
  { date: "01-06", category: "交通費", amount: 480 },
  { date: "01-07", category: "食費", amount: 1800 },
  { date: "01-08", category: "娯楽", amount: 3000 },
  { date: "01-09", category: "食費", amount: 950 },
  { date: "01-10", category: "交通費", amount: 520 }
];

const yen = new Intl.NumberFormat("ja-JP");

console.log("=== 家計簿レポート ===");

// TODO 1: Mapでカテゴリ→合計金額を集計する（get(key) ?? 0 のパターン）
const totals = new Map();

// TODO 2: スプレッドで[カテゴリ, 合計]の配列にして、合計金額の降順にsortする
const sorted = [];

// TODO 3: for...ofで1行ずつ表示する
//         カテゴリ名は padEnd(4, "　")（全角スペース）で左寄せ、
//         金額は yen.format(合計) + "円" を padStart(9) で右寄せにする
//         あわせて総合計grandTotalに加算していく
let grandTotal = 0;

console.log("----------------------");
console.log("総合計: " + yen.format(grandTotal) + "円");`,
      solution: `const entries = [
  { date: "01-05", category: "食費", amount: 1200 },
  { date: "01-06", category: "交通費", amount: 480 },
  { date: "01-07", category: "食費", amount: 1800 },
  { date: "01-08", category: "娯楽", amount: 3000 },
  { date: "01-09", category: "食費", amount: 950 },
  { date: "01-10", category: "交通費", amount: 520 }
];

const yen = new Intl.NumberFormat("ja-JP");

console.log("=== 家計簿レポート ===");

// カテゴリ→合計金額をMapで集計する
const totals = new Map();
for (const entry of entries) {
  const current = totals.get(entry.category) ?? 0;
  totals.set(entry.category, current + entry.amount);
}

// [カテゴリ, 合計]の配列に変換して、金額の降順に並べ替える
const sorted = [...totals.entries()];
sorted.sort(function (a, b) {
  return b[1] - a[1];
});

// 整形して1行ずつ出力する（カテゴリは左寄せ、金額は右寄せ）
let grandTotal = 0;
for (const [category, total] of sorted) {
  grandTotal += total;
  const amountText = yen.format(total) + "円";
  console.log(category.padEnd(4, "　") + amountText.padStart(9));
}

console.log("----------------------");
console.log("総合計: " + yen.format(grandTotal) + "円");`,
      hints: [
        `集計はfor...ofで entries を回し、totals.set(entry.category, (totals.get(entry.category) ?? 0) + entry.amount) とします。`,
        `[...totals.entries()] で配列化し、比較関数 b[1] - a[1] で降順ソートします。`,
        `表示行は category.padEnd(4, "　") + (yen.format(total) + "円").padStart(9) の形です。全角スペースを使うと日本語の列がそろいます。`
      ],
      expectedOutput: "総合計: 7,950円"
    }
  ]
});
