import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request) {
  try {
    const { pageType, pageId, userId } = await request.json();

    if (!pageType || !pageId) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    // don't count admin's own views
    const adminId = process.env.ADMIN_CLERK_USER_ID;
    if (adminId && userId === adminId) {
      return NextResponse.json({ skipped: true });
    }

    await supabase.from('page_views').insert({
      page_type: pageType,
      page_id: pageId,
      user_id: userId || null,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('View count error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('pageType');
    const pageId = searchParams.get('pageId');

    if (!pageType || !pageId) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    const { count } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .eq('page_type', pageType)
      .eq('page_id', pageId);

    return NextResponse.json({ count: count || 0 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}