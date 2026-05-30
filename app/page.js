"use client";

export default function Home() {
  const scrollImages = [
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=70",
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=70",
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&q=70",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=70",
    "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=500&q=70",
    "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&q=70",
    "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=500&q=70",
    "https://images.unsplash.com/photo-1603481546238-487240415921?w=500&q=70",
  ];

  // Duplicate for seamless loop
  const loopImages = [...scrollImages, ...scrollImages];

  return (
    <main style={{
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#00ff00',
      padding: '0',
    }}>

      {/* Marquee keyframe injected via style tag */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          gap: 12px;
          animation: marquee 35s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Navigation */}
      <nav style={{
        backgroundColor: '#111',
        borderBottom: '2px solid #00ff00',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px' }}>
          &#9608; GAMER'S CONCLAVE
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', flexWrap: 'wrap' }}>
          <a href="/builds" style={{ color: '#00ff00', textDecoration: 'none' }}>[ BUILDS ]</a>
          <a href="/games" style={{ color: '#00ff00', textDecoration: 'none' }}>[ FLASH GAMES ]</a>
          <a href="/doom" style={{ color: '#ff4444', textDecoration: 'none' }}>[ DOOM ]</a>
          <a href="/vote" style={{ color: '#00ff00', textDecoration: 'none' }}>[ VOTE ]</a>
          <a href="/ideas" style={{ color: '#00ff00', textDecoration: 'none' }}>[ IDEAS ]</a>
          <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none' }}>[ DONATE ]</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        borderBottom: '1px solid #003300',
      }}>
        <div style={{ fontSize: '12px', color: '#006600', marginBottom: '10px' }}>
          *** WELCOME TO THE INTERNET ***
        </div>
        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 48px)',
          fontWeight: 'bold',
          letterSpacing: '4px',
          margin: '0 0 10px 0',
          textShadow: '0 0 10px #00ff00',
        }}>
          GAMER'S CONCLAVE
        </h1>
        <div style={{ fontSize: '14px', color: '#009900', marginBottom: '30px' }}>
          // share your build. show your rig. join the community. //
        </div>
        <a href="/builds" style={{ textDecoration: 'none' }}>
          <button style={{
            backgroundColor: '#00ff00',
            color: '#000',
            border: 'none',
            padding: '12px 30px',
            fontSize: '16px',
            fontFamily: '"Courier New", monospace',
            fontWeight: 'bold',
            cursor: 'pointer',
            letterSpacing: '2px',
          }}>
            [ POST YOUR BUILD ]
          </button>
        </a>
      </div>

      {/* ── INFINITE SCROLL STRIP ── */}
      <div style={{
        borderBottom: '1px solid #003300',
        borderTop: '1px solid #003300',
        backgroundColor: '#050505',
        overflow: 'hidden',
        padding: '20px 0',
      }}>
        <div style={{ fontSize: '11px', color: '#004400', textAlign: 'center', marginBottom: '14px', letterSpacing: '2px' }}>
          &#9608;&#9608; HARDWARE REEL — HOVER TO PAUSE &#9608;&#9608;
        </div>
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div className="marquee-track">
            {loopImages.map((src, i) => (
              <div key={i} style={{
                flexShrink: 0,
                width: '260px',
                height: '175px',
                border: '1px solid #002200',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <img
                  src={src}
                  alt="hardware"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'brightness(0.88)',
                  }}
                  onError={e => { e.currentTarget.parentElement.style.display = 'none'; }}
                />
                {/* scanlines */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  pointerEvents: 'none',
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* PC of the Week */}
      <div style={{ padding: '40px 20px', borderBottom: '1px solid #003300' }}>
        <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; FEATURED &#9608;&#9608;</div>
        <h2 style={{ fontSize: '24px', margin: '5px 0 20px', letterSpacing: '2px' }}>
          PC OF THE WEEK
        </h2>
        <div style={{
          border: '1px solid #00ff00',
          padding: '20px',
          maxWidth: '500px',
          backgroundColor: '#0d0d0d',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            &gt; SLOT EMPTY — BE THE FIRST!
          </div>
          <div style={{ fontSize: '13px', color: '#009900' }}>
            No builds submitted yet. Post yours and get voted in.
          </div>
        </div>
      </div>

      {/* Recent Builds */}
      <div style={{ padding: '40px 20px' }}>
        <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; LATEST &#9608;&#9608;</div>
        <h2 style={{ fontSize: '24px', margin: '5px 0 20px', letterSpacing: '2px' }}>
          RECENT BUILDS
        </h2>
        <div style={{ color: '#006600', fontSize: '14px' }}>
          &gt; No builds yet. Be the first to post._
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '2px solid #00ff00',
        padding: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#006600',
        backgroundColor: '#111',
      }}>
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>
          [ DONATE ]
        </a>
        <span>GAMER'S CONCLAVE &copy; 2025 — BUILT WITH PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}