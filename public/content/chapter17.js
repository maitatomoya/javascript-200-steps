// 第17章：組み込みオブジェクト
registerChapter({
  number: 17,
  title: "組み込みオブジェクト",
  description: "Math・Date・Number・Intlなど、JavaScriptに最初から用意されている組み込みオブジェクトの実践的な使い方を学びます。",
  steps: [
    {
      id: 161,
      title: "Mathオブジェクトの基本",
      explanation: `<p>JavaScriptには、数学的な計算のための機能をまとめた<strong>Mathオブジェクト</strong>が最初から用意されています。<code>new</code>で作る必要はなく、<code>Math.メソッド名()</code>の形でそのまま使えます。</p>
<p>まず押さえておきたいのが、小数の端数を整数にする3つのメソッドです。</p>
<table>
<tr><th>メソッド</th><th>意味</th><th>例（3.7）</th><th>例（-3.7）</th></tr>
<tr><td><code>Math.floor(x)</code></td><td>切り捨て（小さい方の整数へ）</td><td>3</td><td>-4</td></tr>
<tr><td><code>Math.ceil(x)</code></td><td>切り上げ（大きい方の整数へ）</td><td>4</td><td>-3</td></tr>
<tr><td><code>Math.round(x)</code></td><td>四捨五入</td><td>4</td><td>-4</td></tr>
</table>
<p>負の数のときの挙動に注意しましょう。<code>Math.floor(-3.7)</code>は「-3.7より小さい整数」である<code>-4</code>になります。単純に小数部を捨てたいなら<code>Math.trunc(x)</code>（符号に関係なく小数部を切り落とす）を使います。</p>
<p>そのほか、実務でよく使うメソッドを挙げます。</p>
<pre><code>console.log(Math.abs(-5));      // 5（絶対値）
console.log(Math.max(3, 7, 5)); // 7（最大値）
console.log(Math.min(3, 7, 5)); // 3（最小値）
console.log(Math.sqrt(16));     // 4（平方根）
console.log(Math.pow(2, 10));   // 1024（2の10乗。2 ** 10と同じ）</code></pre>
<p>金額計算では「小数点以下は切り捨て」のような仕様が頻繁に登場するため、<code>Math.floor</code>は特に出番が多いメソッドです。まずは3つの端数処理の違いを、実際に動かして確かめましょう。</p>`,
      task: `TODOの3か所を<code>Math.floor</code>・<code>Math.ceil</code>・<code>Math.round</code>を使って書き換え、123.456の端数処理の結果をそれぞれ表示しましょう。`,
      code: `const price = 123.456;

// TODO: Math.floorで切り捨てた値を表示する
console.log("切り捨て: " + price);

// TODO: Math.ceilで切り上げた値を表示する
console.log("切り上げ: " + price);

// TODO: Math.roundで四捨五入した値を表示する
console.log("四捨五入: " + price);

// こちらは完成済み。絶対値と最大・最小
console.log("絶対値: " + Math.abs(-5));
console.log("最大値: " + Math.max(3, 7, 5));`,
      solution: `const price = 123.456;

// Math.floorは小さい方の整数へ切り捨てる
console.log("切り捨て: " + Math.floor(price));

// Math.ceilは大きい方の整数へ切り上げる
console.log("切り上げ: " + Math.ceil(price));

// Math.roundは四捨五入する
console.log("四捨五入: " + Math.round(price));

// こちらは完成済み。絶対値と最大・最小
console.log("絶対値: " + Math.abs(-5));
console.log("最大値: " + Math.max(3, 7, 5));`,
      hints: [
        `Mathのメソッドは Math.floor(値) のように、引数に数値を渡して呼び出します。`,
        `console.log("切り捨て: " + Math.floor(price)); のように、priceをメソッドで包んだ結果を連結します。`
      ],
      expectedOutput: "切り上げ: 124"
    },
    {
      id: 162,
      title: "決定的な擬似乱数（線形合同法）",
      explanation: `<p><code>Math.random()</code>は0以上1未満のランダムな数を返しますが、実行するたびに違う値になるため、この教材の自動判定やプログラムのテストには使えません。そこで、<strong>同じ種（seed）から始めれば毎回同じ数列を返す</strong>擬似乱数を自作してみましょう。</p>
<p>最も古典的なアルゴリズムが<strong>線形合同法</strong>（Linear Congruential Generator）です。仕組みは驚くほど単純で、現在の状態に「掛けて、足して、割った余りを取る」だけです。</p>
<pre><code>次の状態 = (現在の状態 × A + C) % M</code></pre>
<p>定数には昔から使われてきた組み合わせを使います：A = 1103515245、C = 12345、M = 2147483648（2の31乗）。得られた状態をMで割れば、<code>Math.random()</code>と同じ0以上1未満の小数になります。</p>
<pre><code>function createRandom(seed) {
  let state = seed;
  return function () {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}</code></pre>
<p>第10章で学んだ<strong>クロージャ</strong>を使い、<code>state</code>を外から触れない内部状態として保持している点に注目してください。呼ぶたびに<code>state</code>が更新され、次の「乱数」が生まれます。</p>
<p>同じseedで作った2つのジェネレータは、まったく同じ数列を返します。この<strong>再現性</strong>こそが自作乱数の価値で、ゲームのリプレイ機能やテストデータの生成などで実際に使われるテクニックです。</p>`,
      task: `TODOの部分に線形合同法の更新式（state × 1103515245 + 12345 を 2147483648 で割った余り）を書き、同じseedから同じ数列が出ることを確認しましょう。`,
      code: `function createRandom(seed) {
  let state = seed;
  return function () {
    // TODO: 線形合同法の式でstateを更新する
    // state = (state × A + C) % M  ※A=1103515245、C=12345、M=2147483648

    return state / 2147483648;
  };
}

const randA = createRandom(42);
console.log("A-1回目: " + Math.floor(randA() * 100));
console.log("A-2回目: " + Math.floor(randA() * 100));

// 同じseedで作ったジェネレータは同じ数列になる
const randB = createRandom(42);
console.log("B-1回目: " + Math.floor(randB() * 100));`,
      solution: `function createRandom(seed) {
  let state = seed;
  return function () {
    // 線形合同法：掛けて、足して、余りを取るだけで擬似乱数になる
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

const randA = createRandom(42);
console.log("A-1回目: " + Math.floor(randA() * 100));
console.log("A-2回目: " + Math.floor(randA() * 100));

// 同じseedで作ったジェネレータは同じ数列になる
const randB = createRandom(42);
console.log("B-1回目: " + Math.floor(randB() * 100));`,
      hints: [
        `掛け算は*、余りは%演算子です。計算結果をstateに再代入します。`,
        `state = (state * 1103515245 + 12345) % 2147483648; の1行を書きます。`
      ],
      expectedOutput: "A-1回目: 58"
    },
    {
      id: 163,
      title: "Dateオブジェクトの基本",
      explanation: `<p>日付と時刻を扱うには<strong>Dateオブジェクト</strong>を使います。<code>new Date(年, 月, 日)</code>で特定の日付を表すオブジェクトを作れます。</p>
<pre><code>const date = new Date(2026, 0, 15); // 2026年1月15日</code></pre>
<p>ここでJavaScript史上最大級の罠があります。<strong>月だけは0から始まる</strong>のです。</p>
<table>
<tr><th>引数</th><th>渡す値</th><th>例（2026年1月15日）</th></tr>
<tr><td>年</td><td>西暦そのまま</td><td>2026</td></tr>
<tr><td>月</td><td><strong>0〜11</strong>（0が1月、11が12月）</td><td>0</td></tr>
<tr><td>日</td><td>1〜31（そのまま）</td><td>15</td></tr>
</table>
<p>つまり<code>new Date(2026, 1, 15)</code>と書くと、2026年<strong>2月</strong>15日になってしまいます。年と日は直感どおりなのに月だけ0始まりという仕様は、経験豊富なエンジニアでも時々間違えるポイントです。</p>
<p>作ったDateオブジェクトから値を取り出すには<strong>ゲッターメソッド</strong>を使います。</p>
<pre><code>const date = new Date(2026, 0, 15);
console.log(date.getFullYear()); // 2026
console.log(date.getMonth());    // 0（1月。表示するときは+1する）
console.log(date.getDate());     // 15</code></pre>
<p><code>getMonth()</code>の戻り値も0始まりなので、人間向けに表示するときは<code>+ 1</code>するのが定番です。なお引数なしの<code>new Date()</code>は現在時刻を返しますが、実行のたびに結果が変わるため、この教材では固定の日付だけを使います。</p>`,
      task: `このコードは「2026年1月15日」を表示するつもりが、月の指定を間違えています。<code>new Date</code>の引数を修正して正しく表示しましょう。`,
      code: `// 2026年1月15日を作りたいが、月の指定が間違っている
const date = new Date(2026, 1, 15);

const text = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
console.log(text);`,
      solution: `// 月は0始まりなので、1月は0を指定する
const date = new Date(2026, 0, 15);

// getMonth()も0始まりのため、表示時に+1する
const text = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
console.log(text);`,
      hints: [
        `月の引数は0が1月、1が2月です。実行すると「2月15日」と表示されるはずです。`,
        `new Date(2026, 0, 15) と書くと2026年1月15日になります。`
      ],
      expectedOutput: "2026年1月15日"
    },
    {
      id: 164,
      title: "Dateのゲッターと曜日",
      explanation: `<p>Dateオブジェクトには前ステップで学んだ年月日以外にも、さまざまなゲッターメソッドがあります。</p>
<table>
<tr><th>メソッド</th><th>戻り値</th><th>範囲</th></tr>
<tr><td><code>getFullYear()</code></td><td>年</td><td>西暦そのまま</td></tr>
<tr><td><code>getMonth()</code></td><td>月</td><td>0〜11</td></tr>
<tr><td><code>getDate()</code></td><td>日</td><td>1〜31</td></tr>
<tr><td><code>getDay()</code></td><td><strong>曜日</strong></td><td>0（日曜）〜6（土曜）</td></tr>
<tr><td><code>getHours()</code> / <code>getMinutes()</code></td><td>時 / 分</td><td>0〜23 / 0〜59</td></tr>
</table>
<p>注意したいのは<code>getDate()</code>と<code>getDay()</code>の紛らわしさです。「日にち」が<code>getDate()</code>、「曜日」が<code>getDay()</code>です。曜日は0が日曜日で、月曜=1、火曜=2…と続きます。</p>
<p>曜日を「木」のような文字で表示したいとき、数値0〜6をそのまま<strong>配列のインデックス</strong>として使うテクニックが定番です。</p>
<pre><code>const days = ["日", "月", "火", "水", "木", "金", "土"];
const date = new Date(2026, 0, 15);
console.log(days[date.getDay()]); // 木</code></pre>
<p><code>getDay()</code>が返す0〜6と、配列の添字0〜6がぴったり対応しているため、if文やswitch文を7回書かずに1行で変換できます。「数値コードを配列やオブジェクトで表示名に変換する」発想は、曜日以外にもステータス表示などあらゆる場面で応用が利きます。</p>`,
      task: `曜日名の配列と<code>getDay()</code>を使って、「2026年1月15日(木)」の形式で表示されるようにTODOを完成させましょう。`,
      code: `const days = ["日", "月", "火", "水", "木", "金", "土"];
const date = new Date(2026, 0, 15);

// TODO: getDay()と配列daysを使って曜日の文字を取り出す
const dayName = "?";

const text = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日(" + dayName + ")";
console.log(text);`,
      solution: `const days = ["日", "月", "火", "水", "木", "金", "土"];
const date = new Date(2026, 0, 15);

// getDay()は0（日曜）〜6（土曜）を返すので、そのまま配列の添字に使う
const dayName = days[date.getDay()];

const text = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日(" + dayName + ")";
console.log(text);`,
      hints: [
        `getDay()は曜日を0〜6の数値で返します。この数値は配列daysの添字として使えます。`,
        `days[date.getDay()] と書くと、曜日番号に対応する文字が取り出せます。`
      ],
      expectedOutput: "2026年1月15日(木)"
    },
    {
      id: 165,
      title: "日付の差分計算",
      explanation: `<p>「イベントまであと何日？」のような日付の差を計算するには、Dateオブジェクトの<code>getTime()</code>メソッドを使います。<code>getTime()</code>は、<strong>1970年1月1日0時（UTC）からの経過ミリ秒</strong>を返します。この基準時刻はエポック（epoch）と呼ばれ、コンピュータの世界の共通の「時刻の原点」です。</p>
<pre><code>const date = new Date(2026, 0, 15);
console.log(date.getTime()); // 1768402800000のような巨大な数値</code></pre>
<p>2つの日付をミリ秒に変換して引き算すれば、差もミリ秒で得られます。あとは単位を換算するだけです。</p>
<table>
<tr><th>単位</th><th>ミリ秒に直すと</th></tr>
<tr><td>1秒</td><td>1000</td></tr>
<tr><td>1分</td><td>1000 × 60 = 60000</td></tr>
<tr><td>1時間</td><td>60000 × 60 = 3600000</td></tr>
<tr><td>1日</td><td>3600000 × 24 = <strong>86400000</strong></td></tr>
</table>
<pre><code>const start = new Date(2026, 0, 15);
const end = new Date(2026, 0, 20);
const diffMs = end.getTime() - start.getTime(); // ミリ秒の差
const diffDays = diffMs / 86400000;             // 日数に換算
console.log(diffDays); // 5</code></pre>
<p>「1日 = 86400000ミリ秒」は日付計算の頻出定数なので、<code>1000 * 60 * 60 * 24</code>のように計算式のまま書くと意図が伝わりやすくなります。差がマイナスになった場合は「過去の日付」という意味になるので、必要に応じて<code>Math.abs()</code>で絶対値を取ります。</p>`,
      task: `開始日2026年1月15日から締切日2026年2月14日までの日数を、<code>getTime()</code>の差から計算して「残り30日」と表示しましょう。`,
      code: `const start = new Date(2026, 0, 15);
const deadline = new Date(2026, 1, 14); // 2026年2月14日

// TODO: getTime()同士の差を取り、ミリ秒の差をdiffMsに入れる
const diffMs = 0;

// TODO: diffMsを1日のミリ秒数（1000 * 60 * 60 * 24）で割って日数にする
const diffDays = 0;

console.log("残り" + diffDays + "日");`,
      solution: `const start = new Date(2026, 0, 15);
const deadline = new Date(2026, 1, 14); // 2026年2月14日

// getTime()でミリ秒に変換してから引き算する
const diffMs = deadline.getTime() - start.getTime();

// 1日 = 1000ミリ秒 × 60秒 × 60分 × 24時間 = 86400000ミリ秒
const diffDays = diffMs / (1000 * 60 * 60 * 24);

console.log("残り" + diffDays + "日");`,
      hints: [
        `未来の日付から過去の日付を引くと、正のミリ秒差が得られます。`,
        `diffMs = deadline.getTime() - start.getTime(); とし、86400000（1日のミリ秒数）で割ります。`
      ],
      expectedOutput: "残り30日"
    },
    {
      id: 166,
      title: "Numberの便利メソッド",
      explanation: `<p>数値まわりの判定や変換には、Numberオブジェクトと数値のメソッドが活躍します。実務でよく使う4つを整理しましょう。</p>
<table>
<tr><th>機能</th><th>書き方</th><th>例</th></tr>
<tr><td>整数かどうか判定</td><td><code>Number.isInteger(x)</code></td><td><code>Number.isInteger(5)</code> → true</td></tr>
<tr><td>文字列から小数を取り出す</td><td><code>Number.parseFloat(s)</code></td><td><code>parseFloat("3.14kg")</code> → 3.14</td></tr>
<tr><td>小数点以下の桁数を固定</td><td><code>x.toFixed(n)</code></td><td><code>(3.14159).toFixed(2)</code> → "3.14"</td></tr>
<tr><td>3桁区切りで表示</td><td><code>x.toLocaleString("ja-JP")</code></td><td><code>(1234567).toLocaleString("ja-JP")</code> → "1,234,567"</td></tr>
</table>
<p>それぞれ注意点があります。</p>
<ul>
<li><code>Number.isInteger(5.0)</code>は<strong>true</strong>です。JavaScriptの数値に「5と5.0の区別」はなく、値として整数なら整数と判定されます。</li>
<li><code>parseFloat</code>は先頭から数値として読める部分だけを取り出します。<code>"3.14kg"</code>のような単位付き文字列の解析に便利です。</li>
<li><code>toFixed</code>の戻り値は<strong>文字列</strong>です。計算を続けたい場合はNumber()で数値に戻す必要があります。</li>
<li><code>toLocaleString</code>は地域（ロケール）の慣習に合わせて整形します。<code>"ja-JP"</code>を明示すると日本式の3桁区切りになります。</li>
</ul>
<pre><code>const input = "72.5kg";
const weight = Number.parseFloat(input);
console.log(Number.isInteger(weight));  // false
console.log(weight.toFixed(1));         // "72.5"</code></pre>
<p>「判定はNumberの静的メソッド、整形は数値自身のメソッド」と覚えておくと迷いません。</p>`,
      task: `TODOの3か所を埋めて、文字列から数値を取り出し、整数判定と3桁区切り表示を行いましょう。`,
      code: `const priceText = "1234567.89円";

// TODO: Number.parseFloatでpriceTextから数値部分を取り出す
const price = 0;

// TODO: Number.isIntegerでpriceが整数かどうかを判定する
const isInt = false;

console.log("数値: " + price);
console.log("整数か: " + isInt);
console.log("小数2桁: " + price.toFixed(2));

// TODO: toLocaleString("ja-JP")で3桁区切りにして表示する
console.log("3桁区切り: " + Math.floor(price));`,
      solution: `const priceText = "1234567.89円";

// parseFloatは先頭から数値として読める部分だけを取り出す
const price = Number.parseFloat(priceText);

// 1234567.89は整数ではないのでfalse
const isInt = Number.isInteger(price);

console.log("数値: " + price);
console.log("整数か: " + isInt);
console.log("小数2桁: " + price.toFixed(2));

// toLocaleStringはロケールの慣習に合わせて3桁区切りにする
console.log("3桁区切り: " + Math.floor(price).toLocaleString("ja-JP"));`,
      hints: [
        `parseFloatとisIntegerはどちらもNumber.のあとに続けて呼び出します。`,
        `最後の行は Math.floor(price).toLocaleString("ja-JP") のように、整数化した値に対して呼び出します。`
      ],
      expectedOutput: "3桁区切り: 1,234,567"
    },
    {
      id: 167,
      title: "Intl.NumberFormatで通貨表示",
      explanation: `<p>金額の表示は「¥1,980」「$12.50」のように、通貨記号・区切り文字・小数桁数が国や通貨ごとに異なります。これを自力で組み立てるのは大変ですが、JavaScriptには国際化（Internationalization）のための<strong>Intlオブジェクト</strong>が組み込まれています。</p>
<p>通貨表示には<code>Intl.NumberFormat</code>を使います。ロケール（言語と地域の指定）とオプションを渡してフォーマッタを作り、<code>format()</code>メソッドで数値を整形します。</p>
<pre><code>const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY"
});
console.log(yen.format(1980)); // ￥1,980</code></pre>
<table>
<tr><th>オプション</th><th>意味</th><th>例</th></tr>
<tr><td><code>style: "currency"</code></td><td>通貨として整形する</td><td>記号付きになる</td></tr>
<tr><td><code>currency: "JPY"</code></td><td>通貨コード（ISO 4217）</td><td>JPY、USD、EURなど</td></tr>
</table>
<p>通貨コードを変えるだけで、小数の扱いも自動で切り替わります。日本円は小数なし、米ドルはセント2桁が慣習なので、<code>USD</code>を指定すると自動的に小数2桁で表示されます。</p>
<pre><code>const dollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});
console.log(dollar.format(1234.5)); // $1,234.50</code></pre>
<p>フォーマッタは一度作れば何度でも使い回せます。金額を表示するたびにnewするのではなく、<strong>先に1つ作って使い回す</strong>のが性能面でも定石です。</p>`,
      task: `日本円用のフォーマッタ<code>yen</code>を完成させて、2つの金額を通貨形式で表示しましょう。`,
      code: `// TODO: ロケール"ja-JP"、style: "currency"、currency: "JPY"のフォーマッタを作る
const yen = null;

console.log("商品A: " + yen.format(1980));
console.log("商品B: " + yen.format(128000));

// こちらは完成済み。米ドルは自動的に小数2桁になる
const dollar = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
console.log("参考USD: " + dollar.format(1234.5));`,
      solution: `// 通貨フォーマッタは一度作って使い回すのが定石
const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" });

console.log("商品A: " + yen.format(1980));
console.log("商品B: " + yen.format(128000));

// こちらは完成済み。米ドルは自動的に小数2桁になる
const dollar = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
console.log("参考USD: " + dollar.format(1234.5));`,
      hints: [
        `new Intl.NumberFormat(ロケール, オプションのオブジェクト) の形で作ります。`,
        `new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }) と書きます。`
      ],
      expectedOutput: "商品A: ￥1,980"
    },
    {
      id: 168,
      title: "structuredCloneと深いコピー",
      explanation: `<p>第7章で、スプレッド構文によるコピーは<strong>浅いコピー</strong>（shallow copy）だと学びました。オブジェクトの中にネストしたオブジェクトがある場合、外側だけが複製され、内側は同じものを共有してしまいます。</p>
<pre><code>const original = { name: "たろう", address: { city: "東京" } };
const copy = { ...original };

copy.address.city = "大阪";      // コピー側だけ変えたつもりが…
console.log(original.address.city); // "大阪" ← 元まで変わってしまう！</code></pre>
<p>ネストの内側まで完全に複製する<strong>深いコピー</strong>（deep copy）を作るには、組み込み関数の<code>structuredClone()</code>を使います。</p>
<pre><code>const copy = structuredClone(original);
copy.address.city = "大阪";
console.log(original.address.city); // "東京" ← 元は無事</code></pre>
<table>
<tr><th>方法</th><th>コピーの深さ</th><th>特徴</th></tr>
<tr><td>スプレッド構文 { ...obj }</td><td>浅い（1階層のみ）</td><td>ネストの内側は共有される</td></tr>
<tr><td><code>structuredClone(obj)</code></td><td>深い（全階層）</td><td>Date・Map・配列のネストもOK</td></tr>
</table>
<p>かつては「JSONに変換して戻す」という裏技が使われていましたが、Dateが文字列になる・関数が消えるなどの欠点がありました。<code>structuredClone</code>はDateや入れ子の配列も正しく複製できる公式の解決策です（関数は複製できずエラーになる点だけ注意）。データを加工する前に安全な複製を作る、という場面で頼りになります。</p>`,
      task: `スプレッド構文のコピーを<code>structuredClone</code>に書き換えて、コピー側を変更しても元のデータが変わらないようにしましょう。`,
      code: `const original = { name: "たろう", address: { city: "東京", zip: "100-0001" } };

// TODO: スプレッド構文を structuredClone を使った深いコピーに書き換える
const copy = { ...original };

copy.address.city = "大阪";

console.log("コピーの都市: " + copy.address.city);
console.log("元の都市: " + original.address.city);`,
      solution: `const original = { name: "たろう", address: { city: "東京", zip: "100-0001" } };

// structuredCloneはネストの内側まで複製する深いコピー
const copy = structuredClone(original);

copy.address.city = "大阪";

console.log("コピーの都市: " + copy.address.city);
console.log("元の都市: " + original.address.city);`,
      hints: [
        `スプレッド構文ではaddressの中身が共有されるため、「元の都市: 大阪」になってしまいます。`,
        `const copy = structuredClone(original); と書くだけで深いコピーになります。`
      ],
      expectedOutput: "元の都市: 東京"
    },
    {
      id: 169,
      title: "Object.freezeで変更を防ぐ",
      explanation: `<p><code>const</code>で宣言したオブジェクトは再代入こそできませんが、<strong>プロパティの変更は自由にできてしまいます</strong>。設定値など「絶対に書き換えられたくないデータ」を守るには、<code>Object.freeze()</code>でオブジェクトを凍結します。</p>
<pre><code>const config = Object.freeze({ theme: "dark", fontSize: 14 });

config.theme = "light"; // 変更しようとしても…
console.log(config.theme); // "dark" ← 変わらない</code></pre>
<p>凍結されたオブジェクトには、次の操作がすべて効かなくなります。</p>
<ul>
<li>既存プロパティの<strong>変更</strong>（<code>config.theme = "light"</code>）</li>
<li>プロパティの<strong>追加</strong>（<code>config.lang = "ja"</code>）</li>
<li>プロパティの<strong>削除</strong>（<code>delete config.theme</code>）</li>
</ul>
<p>注意すべきは、通常モードでは変更が<strong>エラーにならず黙って無視される</strong>ことです（strictモードではTypeErrorになります）。「代入したのに値が変わっていない」という不思議な現象に見えるので、凍結されているかは<code>Object.isFrozen(obj)</code>で確認できます。</p>
<p>もうひとつの注意点は、<code>Object.freeze</code>が<strong>浅い凍結</strong>だということです。ネストした内側のオブジェクトまでは凍結されません。前ステップの浅いコピーと同じ構図で、内側まで守りたければ内側にも個別にfreezeをかける必要があります。</p>
<pre><code>const settings = Object.freeze({ ui: { theme: "dark" } });
settings.ui.theme = "light"; // 内側は凍結されていないので変わる
console.log(settings.ui.theme); // "light"</code></pre>
<p>定数として扱いたい設定オブジェクトには「constで宣言＋Object.freeze」のセットが定番です。</p>`,
      task: `設定オブジェクト<code>config</code>を<code>Object.freeze</code>で凍結し、変更が無視されることと<code>Object.isFrozen</code>の結果を確認しましょう。`,
      code: `// TODO: Object.freezeでオブジェクトを凍結する
const config = { theme: "dark", fontSize: 14 };

// 凍結されていれば、この変更は黙って無視される
config.theme = "light";
config.fontSize = 20;

console.log("テーマ: " + config.theme);
console.log("フォント: " + config.fontSize);
console.log("凍結済み: " + Object.isFrozen(config));`,
      solution: `// Object.freezeは変更・追加・削除をすべて禁止する
const config = Object.freeze({ theme: "dark", fontSize: 14 });

// 凍結されていれば、この変更は黙って無視される
config.theme = "light";
config.fontSize = 20;

console.log("テーマ: " + config.theme);
console.log("フォント: " + config.fontSize);
console.log("凍結済み: " + Object.isFrozen(config));`,
      hints: [
        `Object.freeze(オブジェクト) は凍結したオブジェクト自身を返すので、宣言と同時に包めます。`,
        `const config = Object.freeze({ theme: "dark", fontSize: 14 }); と書きます。`
      ],
      expectedOutput: "テーマ: dark"
    },
    {
      id: 170,
      title: "総合演習：請求書計算レポート",
      explanation: `<p>この章の総仕上げとして、組み込みオブジェクトを総動員した<strong>請求書レポート</strong>を作ります。使う道具を整理しましょう。</p>
<table>
<tr><th>処理</th><th>使う機能</th><th>学んだステップ</th></tr>
<tr><td>発行日の表示</td><td>Date・ゲッター・曜日配列</td><td>163〜164</td></tr>
<tr><td>消費税の端数切り捨て</td><td>Math.floor</td><td>161</td></tr>
<tr><td>金額の通貨表示</td><td>Intl.NumberFormat</td><td>167</td></tr>
<tr><td>商品マスタの保護</td><td>Object.freeze</td><td>169</td></tr>
</table>
<p>処理の流れは次のとおりです。</p>
<ol>
<li>明細（商品名・単価・数量の配列）から、各行の金額（単価×数量）を計算する</li>
<li>全行を合計して<strong>小計</strong>を出す</li>
<li>小計×0.1の<strong>消費税</strong>を計算し、小数点以下は<code>Math.floor</code>で切り捨てる</li>
<li>小計＋消費税で<strong>合計</strong>を出し、すべて通貨形式で表示する</li>
</ol>
<p>実務の請求書計算では「税額の端数をどう処理するか」が必ず仕様として決められます（切り捨てが最も一般的）。<code>Math.round</code>と<code>Math.floor</code>では1円ずれることがあり、経理システムではこの1円が大問題になります。</p>
<pre><code>// 消費税計算の例：端数は切り捨てが一般的
const subtotal = 12345;
const tax = Math.floor(subtotal * 0.1); // 1234（1234.5を切り捨て）</code></pre>
<p>金額の計算は「数値のまま」行い、通貨記号付きの整形は「表示する直前」だけにするのがポイントです。整形後の文字列で計算してはいけません。</p>`,
      task: `TODOの3か所（小計の集計・消費税の切り捨て計算・合計）を完成させて、請求書レポートを表示しましょう。`,
      code: `const days = ["日", "月", "火", "水", "木", "金", "土"];
const issueDate = new Date(2026, 0, 15);
const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" });

// 商品マスタは凍結して書き換えを防ぐ
const items = Object.freeze([
  Object.freeze({ name: "ノートPC", price: 128000, quantity: 1 }),
  Object.freeze({ name: "マウス", price: 3800, quantity: 2 }),
  Object.freeze({ name: "USBケーブル", price: 1200, quantity: 3 })
]);

const dateText = issueDate.getFullYear() + "年" + (issueDate.getMonth() + 1) + "月" +
  issueDate.getDate() + "日(" + days[issueDate.getDay()] + ")";
console.log("請求書 発行日: " + dateText);

// TODO: reduceで各行の金額（price × quantity）を合計してsubtotalを求める
let subtotal = 0;

for (const item of items) {
  const lineTotal = item.price * item.quantity;
  console.log(item.name + " x " + item.quantity + ": " + yen.format(lineTotal));
}

// TODO: 消費税（subtotalの10%）をMath.floorで切り捨てて求める
const tax = 0;

// TODO: 小計と消費税を足して合計を求める
const total = 0;

console.log("小計: " + yen.format(subtotal));
console.log("消費税(10%): " + yen.format(tax));
console.log("合計: " + yen.format(total));`,
      solution: `const days = ["日", "月", "火", "水", "木", "金", "土"];
const issueDate = new Date(2026, 0, 15);
const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" });

// 商品マスタは凍結して書き換えを防ぐ
const items = Object.freeze([
  Object.freeze({ name: "ノートPC", price: 128000, quantity: 1 }),
  Object.freeze({ name: "マウス", price: 3800, quantity: 2 }),
  Object.freeze({ name: "USBケーブル", price: 1200, quantity: 3 })
]);

const dateText = issueDate.getFullYear() + "年" + (issueDate.getMonth() + 1) + "月" +
  issueDate.getDate() + "日(" + days[issueDate.getDay()] + ")";
console.log("請求書 発行日: " + dateText);

// 各行の金額（単価×数量）をreduceで合計する
let subtotal = items.reduce(function (sum, item) {
  return sum + item.price * item.quantity;
}, 0);

for (const item of items) {
  const lineTotal = item.price * item.quantity;
  console.log(item.name + " x " + item.quantity + ": " + yen.format(lineTotal));
}

// 消費税の端数は切り捨てが一般的
const tax = Math.floor(subtotal * 0.1);

// 合計 = 小計 + 消費税
const total = subtotal + tax;

console.log("小計: " + yen.format(subtotal));
console.log("消費税(10%): " + yen.format(tax));
console.log("合計: " + yen.format(total));`,
      hints: [
        `小計はreduceを使い、初期値0から item.price * item.quantity を足し込んでいきます。`,
        `消費税は Math.floor(subtotal * 0.1)、合計は subtotal + tax です。`,
        `小計139200円、消費税13920円、合計153120円になれば正解です。`
      ],
      expectedOutput: "合計: ￥153,120"
    }
  ]
});
