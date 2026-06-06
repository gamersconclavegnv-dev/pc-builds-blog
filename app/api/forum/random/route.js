import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET() {
  // get all thread ids
  const { data: threads, error } = await supabase
    .from('forum_threads')
    .select('id, category_id');

  if (error || !threads || threads.length === 0) {
    return NextResponse.redirect(new URL('/forum', process.env.NEXT_PUBLIC_BASE_URL));
  }

  // pick a random one
  const random = threads[Math.floor(Math.random() * threads.length)];

  // get its category slug
  const { data: cat } = await supabase
    .from('forum_categories')
    .select('slug')
    .eq('id', random.category_id)
    .single();

  if (!cat) {
    return NextResponse.redirect(new URL('/forum', process.env.NEXT_PUBLIC_BASE_URL));
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/forum/${cat.slug}/${random.id}`;
  return NextResponse.redirect(url);
}