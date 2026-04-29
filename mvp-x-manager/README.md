# 承認付きX投稿管理ツール (MVP)

## 概要
AIが投稿案を生成し、人間が承認した draft のみを X に投稿できる安全重視の管理ツールです。

## セットアップ手順（具体）
1. `cp .env.example .env.local` で環境変数ファイルを作成
2. Supabaseプロジェクトを作成し、URL/anon/service roleを設定
3. SQL Editorで `supabase/migrations/202604290001_mvp.sql` を実行
4. Supabase AuthでEmail/Passwordログインを有効化し、ユーザーを作成
5. `npm install`
6. `npm run dev`
7. `http://localhost:3000/login` からログイン

## 必要な環境変数
`.env.example` を参照。

## Supabase migration適用方法
Supabase CLIを使う場合は `supabase db push`、または SQL Editor で migration SQL を実行してください。

## ローカル起動方法
`npm run dev` で `http://localhost:3000`。

## X API連携の注意点
- `approved` draft のみ投稿
- `posted` draft の再投稿禁止
- APIトークンは必ずサーバー環境変数管理

## OpenAI API連携の注意点
- 生成結果は自動投稿しない
- 生成結果は drafts 保存後、人間承認が必要

## MVPの範囲
- Auth, Topics, Draft生成/承認/投稿, Posts履歴
- 高度な分析、自動運用機能は未対応

## 今後の拡張案
- スケジュール投稿
- 組織向け承認フロー
- 監査ログ詳細化
