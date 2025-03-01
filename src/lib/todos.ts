import type { Database } from '../types/database.types';
import { supabaseClient } from './supabase';

// Todoの型定義
export type Todo = Database['public']['Tables']['todos']['Row'];
export type NewTodo = Omit<Todo, 'id' | 'created_at' | 'updated_at'>;

// Todo一覧を取得
export async function getTodos() {
  const { data, error } = await supabaseClient
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// 特定のTodoを取得
export async function getTodo(id: number) {
  const { data, error } = await supabaseClient
    .from('todos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Todoを作成
export async function createTodo(todo: NewTodo) {
  const { data, error } = await supabaseClient
    .from('todos')
    .insert(todo)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Todoを更新
export async function updateTodo(id: number, todo: Partial<NewTodo>) {
  const { data, error } = await supabaseClient
    .from('todos')
    .update(todo)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Todoを削除
export async function deleteTodo(id: number) {
  const { error } = await supabaseClient
    .from('todos')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// 複数のTodoを一括削除
export async function deleteTodos(ids: number[]) {
  const { error } = await supabaseClient
    .from('todos')
    .delete()
    .in('id', ids);
  
  if (error) throw error;
  return true;
}

// 完了したTodoをすべて削除
export async function deleteCompletedTodos() {
  const { error } = await supabaseClient
    .from('todos')
    .delete()
    .eq('completed', true);
  
  if (error) throw error;
  return true;
}

// Todoの完了状態を切り替え
export async function toggleTodo(id: number) {
  // まず現在の完了状態を取得
  const todo = await getTodo(id);
  
  // 反転した完了状態で更新
  return updateTodo(id, { completed: !todo.completed });
}

// すべてのTodoの完了状態を一括更新
export async function toggleAllTodos(completed: boolean) {
  const { error } = await supabaseClient
    .from('todos')
    .update({ completed })
    .neq('completed', completed); // 現在の状態と異なるものだけ更新
  
  if (error) throw error;
  return true;
}
