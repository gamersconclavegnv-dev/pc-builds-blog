import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { type, username, title, body, threadTitle, categorySlug, threadId } = await request.json();

    const isThread = type === 'thread';
    const subject = isThread
      ? `💬 New Thread: ${title}`
      : `💬 New Reply in: ${threadTitle}`;

    const viewUrl = isThread
      ? `https://gamersconclave.net/forum/${categorySlug}/${threadId}`
      : `https://gamersconclave.net/forum/${categorySlug}/${threadId}`;

    await resend.emails.send({
      from: 'Gamer\'s Conclave <notifications@gamersconclave.net>',
      to: process.env.ADMIN_EMAIL,
      subject,
      html: `
        <div style="background:#0a0a0a;color:#00ff00;font-family:'Courier New',monospace;padding:30px;max-width:600px;">
          <h2 style="color:#00ff00;letter-spacing:2px;">█ ${isThread ? 'NEW THREAD POSTED' : 'NEW FORUM REPLY'}</h2>
          <p style="color:#009900;">${isThread ? 'A new thread has been created.' : 'A new reply has been posted.'}</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr><td style="color:#006600;padding:6px 0;width:100px;">USER</td><td style="color:#00ff00;">${username}</td></tr>
            ${isThread ? `<tr><td style="color:#006600;padding:6px 0;">TITLE</td><td style="color:#00ff00;">${title}</td></tr>` : ''}
            ${!isThread ? `<tr><td style="color:#006600;padding:6px 0;">THREAD</td><td style="color:#00ff00;">${threadTitle}</td></tr>` : ''}
            <tr><td style="color:#006600;padding:6px 0;">POST</td><td style="color:#009900;">${body?.slice(0, 300)}${body?.length > 300 ? '...' : ''}</td></tr>
          </table>
          <a href="${viewUrl}" style="color:#00ff00;border:1px solid #00ff00;padding:8px 20px;text-decoration:none;display:inline-block;">[ VIEW POST ]</a>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Notify forum error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}