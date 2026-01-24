# 植物認識アプリ（ブラウザ版） - PlantARApp-Web

カメラで植物を撮影して名前を表示するWebアプリケーションです。

## 機能

- 📷 カメラで植物を撮影
- 🌿 Plant.id API を使用した高精度な植物認識
- 🇯🇵 日本語名表示（600+ 植物名の翻訳辞書）
- 📊 認識信頼度の表示
- 🖼️ 類似画像のサムネイル表示
- ⚙️ カスタマイズ可能な設定
- 📱 PWA対応（オフライン動作可能）

## 技術スタック

- **フレームワーク**: React 19.2.3
- **言語**: TypeScript 5.9.3
- **ビルドツール**: Vite 7.3.1
- **スタイリング**: Tailwind CSS 4.1.18
- **PWA**: vite-plugin-pwa
- **API**: Plant.id v3

## 必要要件

- Node.js 18.0.0 以上
- npm または yarn
- Plant.id API キー（[こちら](https://web.plant.id/)から取得）
- カメラ対応のデバイス

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

### 3. ビルド

```bash
npm run build
```

ビルドされたファイルは `dist` ディレクトリに出力されます。

### 4. プレビュー

```bash
npm run preview
```

ビルドされたアプリをローカルでプレビューします。

## 初回起動時の設定

1. アプリを開いたら、右上の⚙️アイコンをクリック
2. Plant.id API キーを入力
3. 必要に応じて最低信頼度とサムネイル表示を調整
4. 「保存する」をクリック

## 使い方

1. カメラへのアクセスを許可
2. 植物にカメラを向けて、ガイドフレームに収める
3. 下部の⚪️ボタンをタップして撮影
4. 認識結果が表示されるまで待つ（数秒）
5. 結果を確認したら「📷 再撮影する」で次の撮影へ

## 設定項目

### Plant.id API キー
- Plant.id の API キーを設定
- 無料プランでは月間100リクエストまで利用可能

### 最低信頼度（50% - 95%）
- この値未満の認識結果は表示されません
- **推奨**: 65%（標準）
- 高精度（80%以上）: 誤認識が少ない
- 低精度（50%以上）: より多くの結果を表示

### サムネイル表示
- 認識結果に類似画像を表示するかどうか
- オンにすると、Plant.id から提供される類似画像が表示されます

## プロジェクト構成

```
PlantARApp-Web/
├── public/
│   └── plants_ja.json          # 植物名翻訳辞書（600+ エントリ）
├── src/
│   ├── components/
│   │   ├── CameraView.tsx      # カメラビュー
│   │   ├── PlantInfoCard.tsx   # 認識結果表示
│   │   └── SettingsView.tsx    # 設定画面
│   ├── hooks/
│   │   └── useCamera.ts        # カメラアクセスフック
│   ├── services/
│   │   ├── plantIdApi.ts       # Plant.id API サービス
│   │   └── translationService.ts # 翻訳サービス
│   ├── types/
│   │   └── plant.ts            # 型定義
│   ├── App.tsx                 # メインアプリ
│   ├── main.tsx                # エントリーポイント
│   └── index.css               # スタイル
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 翻訳辞書について

`public/plants_ja.json` には600以上の植物名が登録されています。

### カテゴリ
- 観葉植物（ツル性、多肉質、フィカス属、ヤシ類、ドラセナ属、大型、小型、エアプランツ）
- 樹木
- 草花
- 園芸植物
- 野草
- 果樹
- 野菜
- ハーブ

Plant.id APIから返される英語名や学名を日本語に翻訳します。

## トラブルシューティング

### カメラが起動しない
- ブラウザのカメラ権限を確認
- HTTPS接続であることを確認（HTTPではカメラにアクセスできません）
- 別のブラウザで試す

### 認識結果が表示されない
- API キーが正しく設定されているか確認
- ネットワーク接続を確認
- Plant.id の利用上限（月間リクエスト数）を確認
- ブラウザのコンソールでエラーログを確認

### 認識精度が低い
- 植物を明るい場所で撮影
- 葉や花がはっきり写るように撮影
- ピントが合っていることを確認
- 設定で最低信頼度を下げる（例: 50%）

### ビルドエラー
```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## 開発モード

開発モードでは、以下の追加情報が表示されます：
- 認識ID（デバッグ用）
- 詳細なコンソールログ

## デプロイ

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
# dist フォルダの内容を gh-pages ブランチにプッシュ
```

## ライセンス

MIT License

## クレジット

- Plant.id API: [https://web.plant.id/](https://web.plant.id/)
- Icons: Heroicons
- UI Framework: React + Tailwind CSS

## 関連プロジェクト

- iOS版: PlantARApp（Swift + SwiftUI）
