import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { title, author, cpu, gpu, description } = await request.json();

    await resend.emails.send({
      from: 'Gamer\'s Conclave <notifications@gamersconclave.net>',
      to: process.env.ADMIN_EMAIL,
      subject: `🖥️ New Build Posted: ${title}`,
      html: `
        <div style="background:#0a0a0a;color:#00ff00;font-family:'Courier New',monospace;padding:30px;max-width:600px;">
          <h2 style="color:#00ff00;letter-spacing:2px;">█ NEW BUILD POSTED</h2>
          <p style="color:#009900;">A new build has been submitted to Gamer's Conclave.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr><td style="color:#006600;padding:6px 0;width:100px;">TITLE</td><td style="color:#00ff00;">${title}</td></tr>
            <tr><td style="color:#006600;padding:6px 0;">AUTHOR</td><td style="color:#00ff00;">${author}</td></tr>
            ${cpu ? `<tr><td style="color:#006600;padding:6px 0;">CPU</td><td style="color:#00ff00;">${cpu}</td></tr>` : ''}
            ${gpu ? `<tr><td style="color:#006600;padding:6px 0;">GPU</td><td style="color:#00ff00;">${gpu}</td></tr>` : ''}
            ${description ? `<tr><td style="color:#006600;padding:6px 0;">DESC</td><td style="color:#009900;">${description}</td></tr>` : ''}
          </table>
          <a href="https://gamersconclave.net/builds" style="color:#00ff00;border:1px solid #00ff00;padding:8px 20px;text-decoration:none;display:inline-block;">[ VIEW BUILDS ]</a>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Notify build error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}