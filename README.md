# DrizzleORM to SQL to Supabase SDK サンプルプロジェクト

このプロジェクトは、DrizzleORMを使用してSQLを生成し、Supabase SDKと連携するサンプル実装です。
TODO Listアプリケーションとして実装されています。

> **最終更新日**: 2025年3月1日

## プロジェクト概要

- **目的**: DrizzleORMからSQLを生成し、Supabase SDKと連携する方法を示す
- **サンプルアプリ**: シンプルなTODO Listアプリケーション
- **フレームワーク**: Next.js

## 技術スタック

- Next.js 15.2.0
- React 19
- DrizzleORM 0.40.0
- Supabase SDK 2.49.1
- TypeScript 5
- TailwindCSS 4
- Biome (リンター/フォーマッター)

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

### 3. 開発コマンド

package.jsonに以下のスクリプトを追加しています：

```bash
# 開発サーバーの起動
npm run dev

# プロジェクトのビルド
npm run build

# ビルドしたアプリケーションの起動
npm run start

# Biomeによるリント
npm run lint
npm run lint:fix

# Biomeによるフォーマット
npm run format
npm run format:fix

# DrizzleORMコマンド
# スキーマからマイグレーションファイルを生成
npm run db:generate

# マイグレーションを実行
npm run db:migrate

# データベースに直接変更をプッシュ（開発環境向け）
npm run db:push

# Drizzle Studioを起動してデータを可視化
npm run db:studio

# Drizzleマイグレーションの生成とSupabase型定義の生成を同時に行う
npm run db:gen-types
```

## プロジェクト構成

```
📦 <project root>
 ├ 📂 src
 │   ├ 📂 app            # Next.jsアプリケーション
 │   ├ 📂 db
 │   │  ├ 📜 index.ts    # データベース接続設定
 │   │  └ 📜 schema.ts   # テーブルスキーマ定義
 │   ├ 📂 lib
 │   │  ├ 📜 supabase.ts # Supabase接続設定
 │   │  └ 📜 todos.ts    # Todoアプリのビジネスロジック
 │   ├ 📂 types
 │   │  └ 📜 database.types.ts # Supabase生成型定義
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

## Supabase型定義とクライアント

### 型定義の生成

Supabaseの型定義を生成するには以下のコマンドを実行します：

```bash
npm run db:gen-types
```

このコマンドはDrizzleのマイグレーションファイル生成と同時にSupabaseの型定義も生成し、`src/types/database.types.ts`に保存します。

### Supabaseクライアントの使用

`src/lib/supabase.ts`に型付きのSupabaseクライアントを実装しています：

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

## Todoアプリのビジネスロジック

`src/lib/todos.ts`にTodoの操作に関する各種関数を実装しています：

```typescript
// Todo一覧を取得
export async function getTodos() { ... }

// 特定のTodoを取得
export async function getTodo(id: number) { ... }

// Todoを作成
export async function createTodo(todo: NewTodo) { ... }

// Todoを更新
export async function updateTodo(id: number, todo: Partial<NewTodo>) { ... }

// Todoを削除
export async function deleteTodo(id: number) { ... }

// 複数のTodoを一括削除
export async function deleteTodos(ids: number[]) { ... }

// 完了したTodoをすべて削除
export async function deleteCompletedTodos() { ... }

// Todoの完了状態を切り替え
export async function toggleTodo(id: number) { ... }

// すべてのTodoの完了状態を一括更新
export async function toggleAllTodos(completed: boolean) { ... }
```

これらの関数を使用することで、型安全にTodoの操作を行うことができます。

## 参考リソース

- [DrizzleORM Documentation](https://orm.drizzle.team/)
- [Supabase Documentation](https://supabase.com/docs)
- [DrizzleORM with Supabase Tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Biome Documentation](https://biomejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
