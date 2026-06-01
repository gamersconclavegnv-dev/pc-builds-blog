import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, idea } = await req.json();
    if (!idea?.trim()) return NextResponse.json({ error: 'No idea provided' }, { status: 400 });

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) return NextResponse.json({ error: 'No email key configured' }, { status: 500 });

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'IDEA-BOT 3000 <ideas@gamersconclave.net>',
        to: ['gamersconclave.gnv@gmail.com'],
        subject: `💡 New Idea from ${name || 'Anonymous'}`,
        html: `
          <div style="font-family: monospace; background: #0a0a0a; color: #00ff00; padding: 24px; border: 2px solid #00ff00;">
            <h2 style="color: #00ff00; letter-spacing: 2px;">&#9608; NEW IDEA TRANSMISSION &#9608;</h2>
            <p><strong style="color: #006600;">FROM:</strong> ${name || 'Anonymous'}</p>
            <hr style="border-color: #003300;" />
            <p style="color: #00ff00; line-height: 1.8;">${idea.replace(/\n/g, '<br/>')}</p>
            <hr style="border-color: #003300;" />
            <p style="color: #004400; font-size: 11px;">Sent via IDEA-BOT 3000 · gamersconclave.net</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return NextResponse.json({ error: 'Email failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('send-idea error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}