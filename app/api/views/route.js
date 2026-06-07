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

    if (userId) {
      // logged in — check if this user already viewed this page
      const { data: existing } = await supabase
        .from('page_views')
        .select('id')
        .eq('page_type', pageType)
        .eq('page_id', pageId)
        .eq('user_id', userId)
        .single();

      if (existing) return NextResponse.json({ skipped: true });
    } else {
      // guest — use IP address to deduplicate
      const ip = request.headers.get('cf-connecting-ip') ||
                 request.headers.get('x-forwarded-for')?.split(',')[0] ||
                 'unknown';

      const { data: existing } = await supabase
        .from('page_views')
        .select('id')
        .eq('page_type', pageType)
        .eq('page_id', pageId)
        .eq('user_id', ip)
        .single();

      if (existing) return NextResponse.json({ skipped: true });

      // store IP as user_id for guests
      await supabase.from('page_views').insert({
        page_type: pageType,
        page_id: pageId,
        user_id: ip,
      });

      return NextResponse.json({ success: true });
    }

    await supabase.from('page_views').insert({
      page_type: pageType,
      page_id: pageId,
      user_id: userId,
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