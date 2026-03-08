# セットアップ手順

このドキュメントでは、WESON MUSEUM の開発環境を初めて構築する手順を説明します。

## 前提ツール

| ツール | 用途 | インストール方法 |
|--------|------|-----------------|
| [asdf](https://asdf-vm.com/) | Node.js バージョン管理 | 下記参照 |
| [pnpm](https://pnpm.io/) | Node.js パッケージ管理 | `npm install -g pnpm` または Corepack |
| Git | バージョン管理 | OS 標準 or Homebrew |

## 1. asdf のインストール

```bash
# macOS（Homebrew）
brew install asdf

# シェル設定に追加（.zshrc または .bashrc）
echo 'source $(brew --prefix asdf)/libexec/asdf.sh' >> ~/.zshrc
source ~/.zshrc

# Node.js プラグインを追加
asdf plugin add nodejs
```

詳細は [asdf 公式ドキュメント](https://asdf-vm.com/guide/getting-started.html) を参照してください。

## 2. Node.js のインストール

`.tool-versions` に記載のバージョンが自動的に使用されます。

```bash
# リポジトリルートで実行
asdf install

# バージョン確認
node --version
```

## 3. pnpm のセットアップ

```bash
# Corepack（Node.js 付属）を使う方法（推奨）
corepack enable
corepack prepare pnpm@latest --activate

# または npm で直接インストール
npm install -g pnpm

# バージョン確認
pnpm --version
```

## 4. 依存関係のインストール

```bash
# リポジトリルートで実行
pnpm install
```

## 5. 開発サーバーの起動

```bash
pnpm dev
# → http://localhost:4321 でアクセス可能
```

## GitHub Pages の初期設定（初回のみ）

1. GitHub リポジトリの **Settings > Pages** を開く
2. **Source** を `GitHub Actions` に設定する
3. `astro.config.mjs` の以下を自分の環境に合わせて変更する:

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://<あなたの GitHub ユーザー名>.github.io',
  base: '/weson-museum',   // リポジトリ名
});
```

4. `main` ブランチにプッシュすると自動デプロイが始まります。

## カスタムドメイン設定

独自ドメイン（例: `museum.weson.jp`）を使う場合:

1. DNS の CNAME レコードを `<username>.github.io` に向ける
2. GitHub リポジトリの **Settings > Pages > Custom domain** を設定する
3. `public/CNAME` ファイルにドメインを記載する:
   ```
   museum.weson.jp
   ```
4. `astro.config.mjs` を変更する:
   ```js
   export default defineConfig({
     site: 'https://museum.weson.jp',
     base: '/',  // カスタムドメイン時はサブパス不要
   });
   ```

## Python 環境（任意）

現時点で Python は必須ではありませんが、将来的に画像リサイズや
コンテンツ補助スクリプトを追加する可能性があります。その場合は
[uv](https://github.com/astral-sh/uv) を使用してください。

```bash
# uv のインストール（macOS）
brew install uv

# プロジェクト内仮想環境の作成（scripts/ 以下で作業する場合）
cd scripts
uv init
uv add pillow  # 例: 画像処理
```

詳細は [docs/architecture.md](architecture.md#python-の位置づけ) を参照してください。

## よくあるハマりどころ

### `pnpm install` でエラーが出る

Node.js のバージョンが合っていない可能性があります。

```bash
asdf current   # 現在のバージョン確認
asdf install   # .tool-versions に合わせてインストール
```

### `pnpm dev` でポートが使われている

```bash
pnpm dev --port 4322  # 別のポートで起動
```

### GitHub Actions でデプロイが失敗する

- `Settings > Pages > Source` が `GitHub Actions` になっているか確認する
- `astro.config.mjs` の `site` と `base` が正しいか確認する
- ワークフローの実行ログを **Actions** タブで確認する
