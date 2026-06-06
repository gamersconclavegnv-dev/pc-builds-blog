'use client';
import { useState, useEffect } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';

function PixelRobot() {
  const [frame, setFrame] = useState(0);
  const [bobY, setBobY] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [bubbleText, setBubbleText] = useState('');

  const thoughts = [
    'WHAT IF... DOOM BUT MULTIPLAYER?',
    'IDEA: RATE MY BUILD PAGE!',
    'HMMMM... LEADERBOARDS?',
    'WHAT ABOUT A DISCORD BOT?',
    'MORE GAMES PLEASE!',
    'IDEA: BUILD COST CALCULATOR!',
  ];

  useEffect(() => {
    const anim = setInterval(() => {
      setFrame(f => (f + 1) % 4);
      setBobY(Math.sin(Date.now() / 400) * 4);
    }, 200);
    return () => clearInterval(anim);
  }, []);

  useEffect(() => {
    const thinkLoop = setInterval(() => {
      setThinking(true);
      setBubbleText(thoughts[Math.floor(Math.random() * thoughts.length)]);
      setTimeout(() => setThinking(false), 3000);
    }, 5000);
    return () => clearInterval(thinkLoop);
  }, []);

  const eyeOpen = frame % 4 !== 3;

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
      {thinking && (
        <div style={{
          position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#0a0a0a', border: '2px solid #00ff00', color: '#00ff00',
          padding: '8px 14px', fontSize: '11px', fontFamily: '"Courier New", monospace',
          whiteSpace: 'nowrap', letterSpacing: '1px', zIndex: 10,
          animation: 'fadeIn 0.2s ease',
        }}>
          {bubbleText}
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderTop: '6px solid #00ff00',
          }} />
        </div>
      )}
      <svg
        width="80" height="100"
        style={{ transform: `translateY(${bobY}px)`, transition: 'transform 0.1s ease', display: 'block' }}
        viewBox="0 0 80 100"
      >
        <line x1="40" y1="4" x2="40" y2="16" stroke="#00ff00" strokeWidth="2"/>
        <rect x="36" y="0" width="8" height="6" fill="#00ff00"/>
        <rect x="16" y="14" width="48" height="36" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
        {eyeOpen ? (
          <>
            <rect x="24" y="24" width="10" height="10" fill="#00ff00"/>
            <rect x="46" y="24" width="10" height="10" fill="#00ff00"/>
            <rect x="27" y="27" width="4" height="4" fill="#0a0a0a"/>
            <rect x="49" y="27" width="4" height="4" fill="#0a0a0a"/>
          </>
        ) : (
          <>
            <line x1="24" y1="29" x2="34" y2="29" stroke="#00ff00" strokeWidth="2"/>
            <line x1="46" y1="29" x2="56" y2="29" stroke="#00ff00" strokeWidth="2"/>
          </>
        )}
        <rect x="26" y="40" width="4" height="4" fill="#00ff00"/>
        <rect x="34" y="40" width="4" height="4" fill="#00ff00"/>
        <rect x="42" y="40" width="4" height="4" fill="#00ff00"/>
        <rect x="50" y="40" width="4" height="4" fill="#00ff00"/>
        <rect x="34" y="50" width="12" height="6" fill="#00ff00"/>
        <rect x="12" y="56" width="56" height="32" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
        <rect x="32" y="64" width="16" height="8" fill="#003300" stroke="#00ff00" strokeWidth="1"/>
        <rect x={34 + (frame % 2) * 4} y="66" width="4" height="4" fill="#00ff00"/>
        <rect x="0" y="58" width="12" height="6" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
        <rect x="68" y="58" width="12" height="6" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
        <rect x="20" y="88" width="12" height="12" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
        <rect x="48" y="88" width="12" height="12" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
      </svg>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}

export default function IdeasPage() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  const handleSubmit = async () => {
    if (!idea.trim()) return;
    setStatus('sending');
    try {
      const senderName = name.trim() || 'Anonymous';
      const ideaHtml = idea.trim().split('\n').join('<br/>');
      const html = '<div style="font-family:monospace;background:#0a0a0a;color:#00ff00;padding:24px">'
        + '<h2>NEW IDEA TRANSMISSION</h2>'
        + '<p><strong>FROM:</strong> ' + senderName + '</p>'
        + '<p>' + ideaHtml + '</p>'
        + '<p style="color:#004400;font-size:11px">Sent via IDEA-BOT 3000 - gamersconclave.net</p>'
        + '</div>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_RESEND_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'IDEA-BOT 3000 <ideas@gamersconclave.net>',
          to: ['gamersconclave.gnv@gmail.com'],
          subject: 'New Idea from ' + senderName,
          html: html,
        }),
      });
      if (res.ok) {
        setStatus('sent');
        setName('');
        setIdea('');
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  const inputStyle = {
    backgroundColor: '#0d0d0d',
    border: '1px solid #00ff00',
    color: '#00ff00',
    padding: '10px 12px',
    fontSize: '13px',
    fontFamily: '"Courier New", monospace',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
  };

  return (
    <main style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: '"Courier New", Courier, monospace', color: '#00ff00'
    }}>


      <div style={{ padding: '60px 20px 20px', borderBottom: '1px solid #003300' }}>
        <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; COMMUNITY &#9608;&#9608;</div>
        <h1 style={{ fontSize: '32px', margin: '5px 0 10px', letterSpacing: '3px' }}>IDEAS BOARD</h1>
        <p style={{ fontSize: '13px', color: '#009900', margin: 0 }}></p>
      </div>

      <div style={{
        maxWidth: '600px', margin: '60px auto', padding: '0 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
      }}>
        <PixelRobot />

        <div style={{ fontSize: '11px', color: '#006600', marginBottom: '30px', letterSpacing: '2px' }}>
          &#9608; IDEA-BOT 3000 IS LISTENING &#9608;
        </div>

        {/* IDEA FORM */}
        <div style={{
          border: '1px solid #003300', backgroundColor: '#0d0d0d',
          padding: '40px 30px', width: '100%', boxSizing: 'border-box', textAlign: 'left'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '16px', textAlign: 'center' }}>💡</div>
          <h2 style={{ fontSize: '20px', letterSpacing: '2px', marginBottom: '8px', textAlign: 'center' }}>
            &gt; GOT AN IDEA?
          </h2>
          <p style={{ fontSize: '13px', color: '#009900', lineHeight: '1.8', marginBottom: '28px', textAlign: 'center' }}>
            Big, small, weird, or obvious. Every idea gets read :)
          </p>

          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px', color: '#00ff00', marginBottom: '8px' }}>
                IDEA TRANSMITTED!
              </div>
              <div style={{ fontSize: '13px', color: '#009900', marginBottom: '24px' }}>
                IDEA-BOT 3000 has received your transmission.
              </div>
              <button
                onClick={() => setStatus(null)}
                style={{ backgroundColor: '#111', color: '#00ff00', border: '1px solid #00ff00', padding: '8px 20px', fontFamily: '"Courier New", monospace', fontSize: '13px', cursor: 'pointer', letterSpacing: '1px' }}>
                [ SEND ANOTHER ]
              </button>
            </div>
          ) : (
            <>
              <label style={{ fontSize: '11px', color: '#006600', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                YOUR NAME (OPTIONAL)
              </label>
              <input
                style={{ ...inputStyle, marginBottom: '16px' }}
                placeholder="e.g. RigMaster3000"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={60}
              />

              <label style={{ fontSize: '11px', color: '#006600', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                YOUR IDEA *
              </label>
              <textarea
                style={{ ...inputStyle, height: '140px', marginBottom: '8px' }}
                placeholder="e.g. Add a leaderboard for most reactions on a build..."
                value={idea}
                onChange={e => setIdea(e.target.value)}
                maxLength={1000}
              />
              <div style={{ fontSize: '11px', color: '#004400', marginBottom: '20px', textAlign: 'right' }}>
                {idea.length}/1000
              </div>

              {status === 'error' && (
                <div style={{ color: '#ff4444', fontSize: '12px', marginBottom: '14px', border: '1px solid #ff4444', padding: '8px 12px' }}>
                  ⚠ TRANSMISSION FAILED. Please try again or email us directly at gamersconclave.gnv@gmail.com
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!idea.trim() || status === 'sending'}
                style={{
                  width: '100%',
                  backgroundColor: (!idea.trim() || status === 'sending') ? '#003300' : '#00ff00',
                  color: (!idea.trim() || status === 'sending') ? '#006600' : '#000',
                  border: 'none',
                  padding: '14px',
                  fontSize: '14px',
                  fontFamily: '"Courier New", monospace',
                  fontWeight: 'bold',
                  cursor: (!idea.trim() || status === 'sending') ? 'not-allowed' : 'pointer',
                  letterSpacing: '2px',
                  touchAction: 'manipulation',
                }}>
                {status === 'sending' ? '[ TRANSMITTING... ]' : '[ SEND TO IDEA-BOT 3000 ]'}
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: '40px', fontSize: '12px', color: '#004400', letterSpacing: '1px' }}>
          ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        </div>
        <div style={{ marginTop: '12px', fontSize: '11px', color: '#006600' }}>
          ALL IDEAS WELCOME · NO IDEA TOO SMALL
        </div>
      </div>

      <footer style={{
        borderTop: '2px solid #00ff00', padding: '20px', textAlign: 'center',
        fontSize: '12px', color: '#006600', backgroundColor: '#111', marginTop: '60px'
      }}>
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
        <span>GAMER&apos;S CONCLAVE &copy; 2025 — BUILT FOR PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}