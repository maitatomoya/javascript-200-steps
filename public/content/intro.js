// 「はじめに」：JavaScriptという言語を知る
registerIntro({
  tocTitle: "はじめに：JavaScriptという言語を知る",
  content: `<h2>はじめに：JavaScriptという言語を知る</h2>
<p>学習を始める前に、「JavaScriptとはどんな言語で、なぜ避けて通れないのか」を整理しておきましょう。JavaScriptは好き嫌い以前に、<strong>Webの画面を動かせる唯一の言語</strong>という特別な立場にあります。</p>

<h3>JavaScriptを一言でいうと</h3>
<p>JavaScriptは「<strong>ブラウザの中で動く唯一の言語として生まれ、いまやWebの内外すべてに広がった</strong>」言語です。1995年にわずか10日間で設計されたという逸話を持ち、その後Webの爆発的な普及とともに進化しました。現在はブラウザ（フロントエンド）だけでなく、Node.jsによってサーバーサイドでも動き、世界で最も使用者の多い言語の1つです。</p>

<h3>基本プロフィール</h3>
<table>
<tr><th>項目</th><th>内容</th></tr>
<tr><td>登場年</td><td>1995年（現代的なJS＝ES2015以降は2015年〜）</td></tr>
<tr><td>実行方式</td><td>インタープリタ方式（ブラウザやNode.jsが実行）</td></tr>
<tr><td>型付け</td><td>動的型付け（型を厳密にしたTypeScriptという拡張が普及）</td></tr>
<tr><td>メモリ管理</td><td>自動（ガベージコレクション）</td></tr>
<tr><td>得意分野</td><td>Webフロントエンド・サーバー（Node.js）・モバイル/デスクトップアプリ</td></tr>
<tr><td>代表的な採用例</td><td>ほぼすべてのWebサイト。React/Vue/Next.js、Slack、VS Code</td></tr>
</table>

<h3>JavaScriptの強み</h3>
<ul>
<li><strong>ブラウザで動く唯一の言語</strong>：Webの画面に動きをつけるにはJSしかない。Web開発をするなら職種を問わず必須知識。</li>
<li><strong>1つの言語でどこでも書ける</strong>：フロントエンド・サーバー（Node.js）・スマホアプリ（React Native）・デスクトップ（Electron）まで、JSだけで全部作れる。</li>
<li><strong>始めるのが最も簡単</strong>：ブラウザさえあれば環境構築ゼロで試せる。</li>
<li><strong>エコシステムが世界最大</strong>：npmのパッケージ数は全言語で最大。作りたいものの部品が大抵見つかる。</li>
<li><strong>非同期処理に強い</strong>：通信しながら画面を止めない、というWebに必須の処理が言語の中心に据えられている（async/await）。</li>
</ul>

<h3>JavaScriptの弱み（正直なところ）</h3>
<ul>
<li><strong>歴史的な仕様の罠が多い</strong>：<code>==</code>の暗黙変換、<code>this</code>の挙動、<code>typeof null</code>など、知らないと踏む地雷が多い（この教材のエラー編で重点的に扱う）。</li>
<li><strong>動的型付けによる実行時エラー</strong>：型の間違いが実行するまで見つからない。このため実務では型を追加したTypeScriptを使うのが主流になっている。</li>
<li><strong>選択肢が多すぎる</strong>：フレームワークやツールの流行り廃りが速く、「何を学べばいいか」で迷いやすい。</li>
<li><strong>CPUを使い切る重い計算は苦手</strong>：シングルスレッドが基本のため、動画処理のような重い計算にはRustやGoが向く。</li>
</ul>

<h3>技術選定のときの考え方</h3>
<table>
<tr><th>状況</th><th>判断の目安</th></tr>
<tr><td>Webの画面（フロントエンド）</td><td>JS一択（実務ではTypeScript化が主流）</td></tr>
<tr><td>フロントとサーバーを同じ言語で書きたい小規模チーム</td><td>Node.js（JS/TS）が有力。学習コストを1言語に集約できる</td></tr>
<tr><td>リアルタイム通信（チャット、通知）</td><td>Node.jsの得意分野</td></tr>
<tr><td>大規模・長期運用のコードベース</td><td>素のJSではなくTypeScriptを選ぶのが現代の標準</td></tr>
<tr><td>CPU負荷の高いAPIサーバー</td><td>GoやRustの方が向くことが多い</td></tr>
<tr><td>データ分析・機械学習</td><td>Pythonが第一候補</td></tr>
</table>
<div class="intro-note">
<p><strong>選定のポイント</strong>：JavaScriptは「選ぶかどうか」より「どこまで使うか」を考える言語です。フロントエンドでは必須として、サーバーサイドまでJSで統一するか、別の言語と組み合わせるかが設計判断になります。そしてその判断の土台になるのが、この教材で学ぶ<strong>素のJavaScriptの正確な理解</strong>です。TypeScriptもReactも、すべてこの上に建っています。</p>
</div>

<h3>この教材の進め方</h3>
<p>全25章・250ステップで、基本文法からクロージャ・this・非同期処理・関数型まで段階的に学びます。この教材ではブラウザ環境に依存しないNode.jsでJSそのものを学びます（DOM操作は扱いません。姉妹教材のStimulus 200 Stepsで学べます）。第21〜25章の「よくあるエラー50選」では、<code>undefined</code>まわりや非同期の典型的なバグを、実際にエラーを起こしながら直す訓練をします。</p>`
});
