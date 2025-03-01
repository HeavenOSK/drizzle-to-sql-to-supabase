# DrizzleORM to SQL to Supabase SDK サンプルプロジェクト

このプロジェクトは、DrizzleORMを使用してSQLを生成し、Supabase SDKと連携するサンプル実装です。
TODO Listアプリケーションとして実装されています。

## プロジェクト概要

- **目的**: DrizzleORMからSQLを生成し、Supabase SDKと連携する方法を示す
- **サンプルアプリ**: シンプルなTODO Listアプリケーション
- **フレームワーク**: Next.js

## 技術スタック

- Next.js
- DrizzleORM
- Supabase SDK
- TypeScript
- TailwindCSS

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成し、以下のように設定します：

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<あなたのSupabase Anon Key>
DATABASE_URL=postgres://postgres:postgres@localhost:54321/postgres
```

- Supabaseローカル開発環境: `DATABASE_URL=postgres://postgres:postgres@localhost:54321/postgres`
- Supabaseクラウド環境: Supabaseダッシュボードから「Settings > Database」で「Connection String > URI」をコピー

### 3. DrizzleORMコマンド

package.jsonに以下のスクリプトを追加しています：

```bash
# スキーマからマイグレーションファイルを生成
npm run db:generate

# マイグレーションを実行
npm run db:migrate

# データベースに直接変更をプッシュ（開発環境向け）
npm run db:push

# Drizzle Studioを起動してデータを可視化
npm run db:studio
```

## プロジェクト構成

```
📦 <project root>
 ├ 📂 src
 │   ├ 📂 db
 │   │  ├ 📜 index.ts    # データベース接続設定
 │   │  └ 📜 schema.ts   # テーブルスキーマ定義
 ├ 📂 supabase
 │   ├ 📂 migrations     # 生成されたマイグレーションファイル
 ├ 📜 .env               # 環境変数
 ├ 📜 drizzle.config.ts  # Drizzle設定ファイル
```

## DrizzleORMの使い方

### スキーマ定義

`src/db/schema.ts`にテーブル定義を記述します：

```typescript
import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const todosTable = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertTodo = typeof todosTable.$inferInsert;
export type SelectTodo = typeof todosTable.$inferSelect;
```

### マイグレーションの生成

```bash
npm run db:generate
```

このコマンドにより`supabase/migrations`ディレクトリにSQLマイグレーションファイルが生成されます。

### マイグレーションの適用

ローカル開発環境：
```bash
npm run db:push
```

Supabase環境（Supabase CLIを使用）：
```bash
supabase init
supabase link
supabase db push
```

## 参考リソース

- [DrizzleORM Documentation](https://orm.drizzle.team/)
- [Supabase Documentation](https://supabase.com/docs)
- [DrizzleORM with Supabase Tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase)
- [Next.js Documentation](https://nextjs.org/docs)
