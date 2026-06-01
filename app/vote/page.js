'use client';
import { useAuth, useClerk } from '@clerk/nextjs';

export default function VotePage() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  return (
    <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: '"Courier New", Courier, monospace', color: '#00ff00' }}>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blink { animation: blink 1s step-start infinite; }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .progress-bar {
          height: 18px;
          background: repeating-linear-gradient(
            90deg,
            #00ff00 0px, #00ff00 12px,
            #003300 12px, #003300 16px
          );
          width: 0%;
          animation: fillBar 3s ease-out forwards;
        }
        @keyframes fillBar {
          0%   { width: 0%; }
          60%  { width: 72%; }
          80%  { width: 72%; }
          100% { width: 72%; }
        }
      `}</style>

      {/* NAV — sticky */}
      <nav style={{ backgroundColor: '#111', borderBottom: '2px solid #00ff00', padding: '10px 20px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <a href="/" style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px', color: '#00ff00', textDecoration: 'none' }}>
          &#9608; GAMER&apos;S CONCLAVE
        </a>
        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="/builds" style={{ color: '#00ff00', textDecoration: 'none' }}>[ BUILDS ]</a>
          <a href="/games" style={{ color: '#00ff00', textDecoration: 'none' }}>[ FLASH GAMES ]</a>
          <a href="/doom" style={{ color: '#ff4444', textDecoration: 'none' }}>[ DOOM ]</a>
          <a href="/vote" style={{ color: '#00ff00', textDecoration: 'none' }}>[ VOTE ]</a>
          <a href="/ideas" style={{ color: '#00ff00', textDecoration: 'none' }}>[ IDEAS ]</a>
          <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none' }}>[ DONATE ]</a>
          {isSignedIn ? (
            <button onClick={() => signOut({ redirectUrl: '/' })} style={{ background: 'none', border: '1px solid #ff4444', color: '#ff4444', fontFamily: '"Courier New", monospace', fontSize: '13px', cursor: 'pointer', padding: '2px 8px', letterSpacing: '1px' }}>
              [ SIGN OUT ]
            </button>
          ) : (
            <a href="/sign-in" style={{ color: '#00ff00', textDecoration: 'none' }}>[ SIGN IN ]</a>
          )}
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: '40px 20px', textAlign: 'center' }}>

        {/* NYAN CAT */}
        <div style={{ marginBottom: '32px' }}>
          <img
            src="https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif"
            alt="Nyan Cat"
            style={{ width: '280px', imageRendering: 'pixelated', border: '2px solid #00ff00', display: 'block', margin: '0 auto' }}
          />
        </div>

        {/* HEADER */}
        <div style={{ fontSize: '11px', color: '#006600', letterSpacing: '4px', marginBottom: '10px' }}>
          &#9608;&#9608; COMING SOON &#9608;&#9608;
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 48px)', fontWeight: 'bold', letterSpacing: '4px', margin: '0 0 16px', textShadow: '0 0 10px #00ff00' }}>
          VOTE PAGE
        </h1>
        <div style={{ fontSize: '16px', color: '#009900', marginBottom: '40px', maxWidth: '480px', lineHeight: '1.7' }}>
          // PC of the Week · Month · Year voting is under construction //<br />
          <span style={{ fontSize: '13px', color: '#006600' }}>
           
          </span>
        </div>

        {/* FAKE PROGRESS BAR */}
        <div style={{ width: '100%', maxWidth: '440px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#006600', marginBottom: '6px' }}>
            <span>VOTE PAGE PROGRESS</span>
            <span>72%</span>
          </div>
          <div style={{ backgroundColor: '#0d0d0d', border: '1px solid #003300', height: '18px', overflow: 'hidden' }}>
            <div className="progress-bar" />
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#004400', marginBottom: '40px' }}>
          LOADING: vote_system.exe<span className="blink">_</span>
        </div>

        {/* NOTIFY BOX */}
        <div style={{ border: '1px solid #003300', backgroundColor: '#0d0d0d', padding: '24px', maxWidth: '440px', width: '100%' }}>
          <div style={{ fontSize: '13px', color: '#009900', marginBottom: '16px' }}>

          </div>
          <a href="/ideas" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#00ff00', color: '#000', border: 'none', padding: '10px 28px', fontSize: '13px', fontFamily: '"Courier New", monospace', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px' }}>
              [ DROP AN IDEA ON THE BOARD ]
            </button>
          </a>
          <div style={{ fontSize: '11px', color: '#004400', marginTop: '12px' }}>
           
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '2px solid #00ff00', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#006600', backgroundColor: '#111' }}>
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
        <span>GAMER&apos;S CONCLAVE &copy; 2025 — BUILT WITH PASSION, NOT PROFIT</span>
      </footer>

    </main>
  );
}