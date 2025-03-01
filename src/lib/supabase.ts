import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// 環境変数からURLとanonymousキーを取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 型付きのSupabaseクライアントを作成
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
