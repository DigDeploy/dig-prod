## 開発

# プロジェクトディレクトリに入る
cd ymsc-ui

# 依存関係をインストール
npm install

# cnpm を直接使用して依存関係をインストールしないことを推奨します。様々な奇妙なバグが発生する可能性があります。以下の操作で npm のダウンロード速度が遅い問題を解決できます
npm install --registry=https://registry.npmmirror.com

# サービスを起動
npm run dev
```

ブラウザで http://localhost:80

## リリース

```bash
# テスト環境を構築
npm run build:stage

# 本番環境を構築
npm run build:prod
```

# ファイルオンラインプレビュー統合
1.Docker で onlyoffice をインストール

2.index.html に js を導入

```
<script type='text/javascript' src='http://192.168.2.145:8500//web-apps/apps/api/documents/api.js'></script>
```

3.システムパラメータを开启 仮定

4. 単一ファイルのオンラインプレビューが必要な場合は、コンポーネント FileTable 内を参照してください。注意：PDF ファイルはオンラインで閲覧することのみをサポートします
