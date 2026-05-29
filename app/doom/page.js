'use client';
import { useState, useEffect } from 'react';

export default function DoomPage() {
  const [launched, setLaunched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // DOS.zone direct game page — has mobile touch controls built in
  const DOOM_IFRAME_URL =
    'https://js-dos.com/games/doom.exe.html';

  const DOOM_DIRECT_URL = 'https://dos.zone/doom-dec-1993/';

  return (
    <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: '"Courier New", Courier, monospace', color: '#00ff00' }}>

      {/* NAV */}
      <nav style={{ backgroundColor: '#111', borderBottom: '2px solid #00ff00', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <a href="/" style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px', color: '#00ff00', textDecoration: 'none' }}>
          &#9608; GAMER'S CONCLAVE
        </a>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px', flexWrap: 'wrap' }}>
          <a href="/builds" style={{ color: '#00ff00', textDecoration: 'none' }}>[ BUILDS ]</a>
          <a href="/games" style={{ color: '#00ff00', textDecoration: 'none' }}>[ FLASH GAMES ]</a>
          <a href="/doom" style={{ color: '#ff4444', textDecoration: 'none' }}>[ DOOM ]</a>
          <a href="/vote" style={{ color: '#00ff00', textDecoration: 'none' }}>[ VOTE ]</a>
          <a href="/ideas" style={{ color: '#00ff00', textDecoration: 'none' }}>[ IDEAS ]</a>
          <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none' }}>[ DONATE ]</a>
        </div>
      </nav>

      {/* HERO HEADER */}
      <div style={{ padding: '40px 20px 30px', borderBottom: '1px solid #330000', textAlign: 'center', backgroundColor: '#0d0000' }}>
        <div style={{ fontSize: '11px', color: '#660000', letterSpacing: '4px', marginBottom: '10px' }}>
          &#9608;&#9608; RIP AND TEAR &#9608;&#9608;
        </div>

        {/* ASCII DOOM LOGO */}
        <pre style={{
          color: '#ff2200',
          fontSize: 'clamp(6px, 1.2vw, 13px)',
          lineHeight: '1.2',
          margin: '0 auto 20px',
          display: 'inline-block',
          textAlign: 'left',
          textShadow: '0 0 10px #ff0000, 0 0 20px #ff0000',
          letterSpacing: '1px',
        }}>{`
██████╗  ██████╗  ██████╗ ███╗   ███╗
██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║
██║  ██║██║   ██║██║   ██║██╔████╔██║
██║  ██║██║   ██║██║   ██║██║╚██╔╝██║
██████╔╝╚██████╔╝╚██████╔╝██║ ╚═╝ ██║
╚═════╝  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝`}
        </pre>

        <p style={{ fontSize: '14px', color: '#cc3300', margin: '0 0 6px', letterSpacing: '2px' }}>
          THE ORIGINAL 1993 CLASSIC — RUNNING IN YOUR BROWSER
        </p>
        <p style={{ fontSize: '12px', color: '#660000', margin: 0 }}>
          Powered by js-dos · Shareware Episode 1: Knee-Deep in the Dead
        </p>

        {/* MOBILE BADGE */}
        {isMobile && (
          <div style={{ marginTop: '14px', display: 'inline-block', border: '1px solid #ff4400', backgroundColor: '#1a0500', padding: '8px 16px', fontSize: '12px', color: '#ff6600', letterSpacing: '1px' }}>
            &#128241; MOBILE DETECTED — TOUCH CONTROLS ENABLED
          </div>
        )}
      </div>

      {/* PRE-LAUNCH INFO PANEL */}
      {!launched && (
        <div style={{ maxWidth: '860px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '30px', alignItems: 'start' }}>

          {/* Left: ASCII preview */}
          <div style={{ border: '2px solid #550000', backgroundColor: '#0d0000', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#1a0000', padding: '8px 12px', fontSize: '11px', color: '#660000', borderBottom: '1px solid #330000', letterSpacing: '2px' }}>
              &#9608; PREVIEW
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <pre style={{ color: '#cc2200', fontSize: '10px', lineHeight: '1.4', margin: '0 0 16px', textAlign: 'left', display: 'inline-block' }}>{`
  /\\_____/\\   HELL ON EARTH
 /  o   o  \\  ══════════════
( ==  ^  == ) ► Episode 1
 )         (  ► Episode 2
(           ) ► Episode 3
 \\ ~~~~~~~ /  
  )       (   RUNES AWAIT...
 (  DOOM  )
  \\_______/
  
  ┌─────────────────────────┐
  │ ░░░░░░░░░░░░░░░░░░░░░░ │ HP
  │ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░ │ AMMO
  │ ████████████████░░░░░░ │ ARMOR
  └─────────────────────────┘
  PISTOL  SHOTGUN  CHAINGUN
              `}</pre>
              <div style={{ fontSize: '11px', color: '#550000', letterSpacing: '1px' }}>
                ● KEYBOARD + MOUSE &nbsp;●&nbsp; TOUCH CONTROLS
              </div>
            </div>
          </div>

          {/* Right: controls + launch */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{ border: '1px solid #330000', backgroundColor: '#0d0000', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#ff2200', letterSpacing: '2px', marginBottom: '10px', fontWeight: 'bold' }}>
                &gt; ABOUT
              </div>
              <div style={{ fontSize: '12px', color: '#993300', lineHeight: '1.7' }}>
                The original DOOM (1993) by id Software. Shareware release — Episode 1 fully playable free.
                Running via DOSBox WebAssembly. No download, no install. Works on desktop and mobile.
              </div>
            </div>

            {/* Desktop controls */}
            {!isMobile && (
              <div style={{ border: '1px solid #330000', backgroundColor: '#0d0000', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: '#ff2200', letterSpacing: '2px', marginBottom: '10px', fontWeight: 'bold' }}>
                  &gt; KEYBOARD CONTROLS
                </div>
                <div style={{ fontSize: '12px', color: '#993300', lineHeight: '2' }}>
                  <div>↑ ↓ &nbsp;&nbsp;&nbsp;&nbsp; MOVE FORWARD / BACK</div>
                  <div>← → &nbsp;&nbsp;&nbsp;&nbsp; TURN LEFT / RIGHT</div>
                  <div>CTRL &nbsp;&nbsp;&nbsp; FIRE</div>
                  <div>SPACE &nbsp;&nbsp; USE / OPEN DOORS</div>
                  <div>SHIFT &nbsp;&nbsp; RUN</div>
                  <div>ALT+← → STRAFE</div>
                  <div>1–7 &nbsp;&nbsp;&nbsp;&nbsp; SWITCH WEAPON</div>
                  <div>ESC &nbsp;&nbsp;&nbsp;&nbsp; MENU</div>
                </div>
              </div>
            )}

            {/* Mobile controls */}
            {isMobile && (
              <div style={{ border: '1px solid #ff4400', backgroundColor: '#0d0000', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: '#ff6600', letterSpacing: '2px', marginBottom: '10px', fontWeight: 'bold' }}>
                  &gt; &#128241; TOUCH CONTROLS
                </div>
                <div style={{ fontSize: '12px', color: '#993300', lineHeight: '1.9' }}>
                  <div>&#128367; LEFT JOYSTICK &nbsp;&nbsp; MOVE</div>
                  <div>&#128367; RIGHT JOYSTICK &nbsp; AIM / TURN</div>
                  <div>&#128308; FIRE BUTTON &nbsp;&nbsp;&nbsp;&nbsp; SHOOT</div>
                  <div>&#9654; USE BUTTON &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; DOORS / SWITCHES</div>
                  <div>&#9650; RUN BUTTON &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SPRINT</div>
                  <div>&#9776; MENU BUTTON &nbsp;&nbsp;&nbsp;&nbsp; OPTIONS / SAVE</div>
                  <div style={{ marginTop: '8px', color: '#663300' }}>
                    Controls appear as an overlay on the game screen.
                  </div>
                </div>
              </div>
            )}

            <div style={{ border: '1px solid #330000', backgroundColor: '#0d0000', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#ff2200', letterSpacing: '2px', marginBottom: '10px', fontWeight: 'bold' }}>
                &gt; TIPS
              </div>
              <div style={{ fontSize: '12px', color: '#993300', lineHeight: '1.7' }}>
                {isMobile
                  ? 'Tap the game screen to start. Touch controls overlay will appear automatically. Landscape mode recommended for best experience.'
                  : 'Click the game window first to capture keyboard input. Press F1 in-game for help. Use F9/F10 to quick save/load.'}
              </div>
            </div>

            {/* LAUNCH BUTTON */}
            <button
              onClick={() => setLaunched(true)}
              style={{
                backgroundColor: '#cc0000',
                color: '#fff',
                border: '2px solid #ff2200',
                padding: '14px 20px',
                fontSize: '16px',
                fontFamily: '"Courier New", monospace',
                fontWeight: 'bold',
                cursor: 'pointer',
                letterSpacing: '3px',
                textShadow: '0 0 8px #ff0000',
                boxShadow: '0 0 16px #ff000055',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ff0000'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#cc0000'}
            >
              {isMobile ? '[ LAUNCH DOOM — TOUCH READY ]' : '[ LAUNCH DOOM ]'}
            </button>

            {/* Mobile fallback link */}
            {isMobile && (
              <a
                href={DOOM_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px',
                  border: '1px solid #440000',
                  backgroundColor: '#0d0000',
                  color: '#663300',
                  fontSize: '11px',
                  textDecoration: 'none',
                  letterSpacing: '1px',
                }}
              >
                &#128279; HAVING TROUBLE? OPEN DIRECTLY ON DOS.ZONE
              </a>
            )}
          </div>
        </div>
      )}

      {/* GAME EMBED */}
      {launched && (
        <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff2200', letterSpacing: '2px' }}>
              &gt; NOW RUNNING: DOOM (1993)
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {isMobile && (
                <a
                  href={DOOM_DIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: '#111', color: '#ff8800', border: '1px solid #ff8800', padding: '6px 14px', fontFamily: '"Courier New", monospace', fontSize: '12px', textDecoration: 'none' }}
                >
                  [ FULL SITE ]
                </a>
              )}
              <button
                onClick={() => setLaunched(false)}
                style={{ backgroundColor: '#111', color: '#ff4444', border: '1px solid #ff4444', padding: '6px 16px', cursor: 'pointer', fontFamily: '"Courier New", monospace', fontSize: '12px' }}
              >
                [ EXIT ]
              </button>
            </div>
          </div>

          {/* Taller iframe on mobile for touch overlay room */}
          <div style={{ border: '2px solid #ff2200', boxShadow: '0 0 20px #ff000044', lineHeight: 0 }}>
            <iframe
              src={DOOM_IFRAME_URL}
              width="100%"
              height={isMobile ? '620' : '520'}
              style={{ border: 'none', display: 'block' }}
              allow="autoplay; fullscreen"
              title="DOOM"
            />
          </div>

          <div style={{ marginTop: '10px', fontSize: '11px', color: '#550000', textAlign: 'center', letterSpacing: '1px' }}>
            {isMobile
              ? 'TAP THE SCREEN TO START · TOUCH CONTROLS APPEAR AUTOMATICALLY · ROTATE TO LANDSCAPE FOR BEST VIEW'
              : 'CLICK INSIDE THE GAME WINDOW TO CAPTURE INPUT · ESC = MENU · F11 = FULLSCREEN'}
          </div>
        </div>
      )}

      {/* LORE FOOTER STRIP */}
      <div style={{ margin: '60px 20px 0', borderTop: '1px solid #330000', borderBottom: '1px solid #330000', padding: '20px', backgroundColor: '#0d0000', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: '#440000', letterSpacing: '3px', lineHeight: '2' }}>
          "KNEE-DEEP IN THE DEAD" &nbsp;·&nbsp; "THE SHORES OF HELL" &nbsp;·&nbsp; "INFERNO"
        </div>
        <div style={{ fontSize: '10px', color: '#330000', marginTop: '6px' }}>
          DOOM © 1993 id Software · Shareware version — free to play and distribute
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '2px solid #00ff00', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#006600', backgroundColor: '#111', marginTop: '40px' }}>
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
        <span>GAMER'S CONCLAVE &copy; 2025 — BUILT WITH PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}