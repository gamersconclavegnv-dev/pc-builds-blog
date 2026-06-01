'use client';
import { useAuth, useClerk } from '@clerk/nextjs';

export default function DonatePage() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  return (
    <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: '"Courier New", Courier, monospace', color: '#00ff00' }}>

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

      {/* HEADER */}
      <div style={{ padding: '40px 20px 30px', borderBottom: '1px solid #003300', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: '#006600', letterSpacing: '4px', marginBottom: '10px' }}>
         
        </div>
        <h1 style={{ fontSize: '32px', margin: '5px 0 10px', letterSpacing: '3px' }}>|| SUPPORT GAMER'S CONCLAVE ||</h1>
        <p style={{ fontSize: '13px', color: '#009900', margin: 0 }}>
          
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '700px', margin: '50px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>

        {/* CAT THANK YOU BOX */}
        <div style={{ border: '2px solid #00ff00', backgroundColor: '#0d0d0d', padding: '30px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '11px', color: '#006600', letterSpacing: '3px', marginBottom: '16px' }}>
          
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '3px', color: '#ffff00', marginBottom: '12px' }}>
            THANK YOU FOR YOUR PATRONAGE!
          </div>
          <pre style={{ color: '#00ff00', fontSize: '13px', lineHeight: '1.4', margin: '0 auto 20px', display: 'inline-block', textAlign: 'left', textShadow: '0 0 6px #00ff00' }}>{`
   /\\_____/\\
  /  ^   ^  \\
 ( ==  ω  == )  👍
  )         (
 (  |     |  )
  \\_________/
  
  THANK YOU!!!`}
          </pre>
          
          <div style={{ fontSize: '13px', color: '#009900', lineHeight: '1.9' }}>
            DONATE TO: <span style={{ color: '#00ff00', fontWeight: 'bold' }}>GAMER&apos;S CONCLAVE</span>,
            BROUGHT TO LIFE BY :: <span style={{ color: '#00ff00', fontWeight: 'bold' }}>JACOB </span><br />
            Every dollar keeps this site ad-free and the community growing.<br />
          If you enjoy the site, even $1 means a lot. 🐱
          </div>
        </div>

        {/* VENMO QR CODE BOX */}
        <div style={{ border: '1px solid #00ff00', backgroundColor: '#0d0d0d', padding: '30px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '3px', color: '#00ff00', marginBottom: '6px' }}>
            &gt; DONATE VIA VENMO
          </div>
          <div style={{ fontSize: '12px', color: '#006600', marginBottom: '24px' }}>
            Scan the QR code with your phone camera or Venmo app
          </div>
          <div style={{ display: 'inline-block', backgroundColor: '#ffffff', padding: '16px', border: '3px solid #00ff00', marginBottom: '20px' }}>
            <img src="/venmo-qr.png" alt="Venmo QR Code for Jacob-Campbell-33" style={{ width: '200px', height: '200px', display: 'block' }} />
          </div>
          <div style={{ fontSize: '13px', color: '#009900', marginBottom: '20px' }}>
            <span style={{ color: '#006600' }}>@</span>
            <span style={{ color: '#00ff00', fontWeight: 'bold', letterSpacing: '1px' }}>Jacob-Campbell-33</span>
          </div>
          <a href="https://venmo.com/u/Jacob-Campbell-33" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#00ff00', color: '#000', padding: '10px 28px', fontSize: '14px', fontFamily: '"Courier New", monospace', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px', textDecoration: 'none' }}>
            [ OPEN VENMO ]
          </a>
          <div style={{ fontSize: '11px', color: '#004400', marginTop: '14px' }}>
            Opens Venmo app or venmo.com — 100% safe, no data collected by this site
          </div>
        </div>

        {/* WHERE MONEY GOES */}
        <div style={{ border: '1px solid #003300', backgroundColor: '#0d0d0d', padding: '24px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', color: '#00ff00', marginBottom: '16px' }}>
            &gt; WHERE YOUR MONEY GOES
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { icon: '🖥️', label: 'HOSTING COSTS', desc: 'Keep the site live 24/7' },
              { icon: '🕹️', label: 'NEW GAMES', desc: 'More flash games added' },
              { icon: '🚫', label: 'NO ADS EVER', desc: 'Site stays clean forever' },
              { icon: '👥', label: 'COMMUNITY', desc: 'Features for members' },
            ].map((item, i) => (
              <div key={i} style={{ border: '1px solid #002200', backgroundColor: '#080808', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ fontSize: '11px', color: '#00ff00', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '11px', color: '#006600' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM NOTE */}
        <div style={{ fontSize: '12px', color: '#004400', textAlign: 'center', lineHeight: '1.8', paddingBottom: '20px' }}>

        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '2px solid #00ff00', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#006600', backgroundColor: '#111', marginTop: '20px' }}>
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
        <span>GAMER&apos;S CONCLAVE &copy; 2025 — BUILT FOR PASSION, NOT PROFIT</span>
      </footer>

    </main>
  );
}