import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { Webhook } from 'svix';

export async function POST(request) {
  const payload = await request.text();
  const headers = {
    'svix-id': request.headers.get('svix-id'),
    'svix-timestamp': request.headers.get('svix-timestamp'),
    'svix-signature': request.headers.get('svix-signature'),
  };

  let event;
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    event = wh.verify(payload, headers);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'user.deleted') {
    const userId = event.data.id;
    await supabase
      .from('builds')
      .update({ author: 'anonymous', user_id: null })
      .eq('user_id', userId);
  }

  return NextResponse.json({ success: true });
}