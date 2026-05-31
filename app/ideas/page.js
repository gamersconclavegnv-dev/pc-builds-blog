'use client';
import { useState, useEffect } from 'react';

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
      setBobY(b => Math.sin(Date.now() / 400) * 4);
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
        {/* Antenna */}
        <line x1="40" y1="4" x2="40" y2="16" stroke="#00ff00" strokeWidth="2"/>
        <rect x="36" y="0" width="8" height="6" fill="#00ff00"/>
        {/* Head */}
        <rect x="16" y="14" width="48" height="36" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
        {/* Eyes */}
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
        {/* Mouth */}
        <rect x="26" y="40" width="4" height="4" fill="#00ff00"/>
        <rect x="34" y="40" width="4" height="4" fill="#00ff00"/>
        <rect x="42" y="40" width="4" height="4" fill="#00ff00"/>
        <rect x="50" y="40" width="4" height="4" fill="#00ff00"/>
        {/* Neck */}
        <rect x="34" y="50" width="12" height="6" fill="#00ff00"/>
        {/* Body */}
        <rect x="12" y="56" width="56" height="32" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
        {/* Chest light */}
        <rect x="32" y="64" width="16" height="8" fill="#003300" stroke="#00ff00" strokeWidth="1"/>
        <rect x={34 + (frame % 2) * 4} y="66" width="4" height="4" fill="#00ff00"/>
        {/* Arms */}
        <rect x="0" y="58" width="12" height="6" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
        <rect x="68" y="58" width="12" height="6" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
        {/* Legs */}
        <rect x="20" y="88" width="12" height="12" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
        <rect x="48" y="88" width="12" height="12" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2"/>
      </svg>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}

export default function IdeasPage() {
  const [hover, setHover] = useState(false);

  return (
    <main style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: '"Courier New", Courier, monospace', color: '#00ff00'
    }}>
      <nav style={{
        backgroundColor: '#111', borderBottom: '2px solid #00ff00',
        padding: '10px 20px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '10px'
      }}>
        <a href="/" style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px', color: '#00ff00', textDecoration: 'none' }}>
          &#9608; GAMER'S CONCLAVE
        </a>
        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', flexWrap: 'wrap' }}>
          <a href="/builds" style={{ color: '#00ff00', textDecoration: 'none' }}>[ BUILDS ]</a>
          <a href="/games" style={{ color: '#00ff00', textDecoration: 'none' }}>[ FLASH GAMES ]</a>
          <a href="/doom" style={{ color: '#ff4444', textDecoration: 'none' }}>[ DOOM ]</a>
          <a href="/vote" style={{ color: '#00ff00', textDecoration: 'none' }}>[ VOTE ]</a>
          <a href="/ideas" style={{ color: '#ffff00', textDecoration: 'none' }}>[ IDEAS ]</a>
          <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none' }}>[ DONATE ]</a>
        </div>
      </nav>

      <div style={{ padding: '60px 20px 20px', borderBottom: '1px solid #003300' }}>
        <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; COMMUNITY &#9608;&#9608;</div>
        <h1 style={{ fontSize: '32px', margin: '5px 0 10px', letterSpacing: '3px' }}>IDEAS BOARD</h1>
        <p style={{ fontSize: '13px', color: '#009900', margin: 0 }}>Got a feature request or wild idea? We want to hear it.</p>
      </div>

      <div style={{
        maxWidth: '600px', margin: '60px auto', padding: '0 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
      }}>
        <PixelRobot />

        <div style={{ fontSize: '11px', color: '#006600', marginBottom: '30px', letterSpacing: '2px' }}>
          &#9608; IDEA-BOT 3000 IS LISTENING &#9608;
        </div>

        <div style={{
          border: '1px solid #003300', backgroundColor: '#0d0d0d',
          padding: '40px 30px', width: '100%', boxSizing: 'border-box'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>💡</div>
          <h2 style={{ fontSize: '20px', letterSpacing: '2px', marginBottom: '16px' }}>
            &gt; GOT AN IDEA?
          </h2>
          <p style={{ fontSize: '13px', color: '#009900', lineHeight: '1.8', marginBottom: '8px' }}>
            Want to suggest a new feature, game, section, or improvement for Gamer's Conclave?
          </p>
          <p style={{ fontSize: '13px', color: '#009900', lineHeight: '1.8', marginBottom: '32px' }}>
            Whether it's big, small, weird, or obvious — drop us a message. Every idea gets read.
          </p>

          <a
            href="mailto:gamersconclave.gnv@gmail.com?subject=Idea for Gamer's Conclave"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              display: 'inline-block',
              backgroundColor: hover ? '#00ff00' : '#111',
              color: hover ? '#000' : '#00ff00',
              border: '2px solid #00ff00',
              padding: '14px 32px',
              fontSize: '14px',
              fontFamily: '"Courier New", monospace',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            [ SEND YOUR IDEA ]
          </a>

          <div style={{ marginTop: '16px', fontSize: '11px', color: '#004400' }}>
            gamersconclave.gnv@gmail.com
          </div>
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
        <span>GAMER'S CONCLAVE &copy; 2025 — BUILT WITH PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}