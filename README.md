# Kintone Email Sender via AWS

Kintone から AWS (API Gateway + Lambda + SES) を経由してメールを送信するシステムです。

## セットアップ手順

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Terraform (AWSリソース) の設定

`terraform/` ディレクトリに移動し、`terraform.tfvars` ファイルを作成して必要な変数を設定します。

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars` を編集し、以下の値を設定してください：
- `sender_email`: 送信元メールアドレス (AWS SESで検証済みである必要があります)
- `api_token`: API認証用のトークン (任意の文字列)

デプロイを実行します：
```bash
terraform init
terraform apply
```

### 3. Kintone アプリの設定

1. Kintone アプリの設定画面を開きます。
2. **JavaScript / CSS でカスタマイズ** 設定を開きます。
3. `kintone-customization/` ディレクトリ内のファイルを以下の順序でアップロードします。

**アップロード順序 (重要):**
1. `kintone-config.js` (作成が必要)
2. `email-template.js`
3. `send-email.js`

#### kintone-config.js の作成
`kintone-customization/kintone-config.sample.js` をコピーして `kintone-config.js` を作成し、値を設定してください。

```javascript
window.KintoneConfig = {
    apiEndpoint: 'https://xxx.execute-api.us-west-2.amazonaws.com/send', // Terraform の出力 (api_endpoint)
    apiToken: 'your-secure-api-token', // terraform.tfvars で設定したトークン
    bccEmail: 'your-bcc-email@example.com' // BCC 送信先
};
```

## 注意事項
- `terraform.tfvars` や `kintone-config.js` には機密情報が含まれるため、Git リポジトリにはコミットしないでください (すでに `.gitignore` に設定されています)。
