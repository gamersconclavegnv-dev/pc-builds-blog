export default function Home() {
  const galleryImages = [
    {
      src: "https://i5.walmartimages.com/asr/cb41a3e7-3eab-4c7d-a7bd-4a4bc3c4b2b0.d43dac5c7c15a0e7e2b9d4dc8f8e3e1f.jpeg",
      alt: "EVGA RTX 3060 XC Gaming GPU",
      label: "EVGA RTX 3060 XC",
    },
    {
      src: "https://cdn.vox-cdn.com/thumbor/rHKMcpFPZHClkCvJyRlXm3jgFOI=/0x0:2040x1360/1200x800/filters:focal(857x517:1183x843)/cdn.vox-cdn.com/uploads/chorus_image/image/73150729/246388_RTX_4090_AKrales_0414.0.jpg",
      alt: "High end GPU close up",
      label: "FLAGSHIP SILICON",
    },
    {
      src: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
      alt: "RGB gaming PC build",
      label: "CUSTOM RGB RIG",
    },
    {
      src: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&q=80",
      alt: "Water cooled gaming PC",
      label: "WATER LOOP BUILD",
    },
  ];

  return (
    <main style={{
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#00ff00',
      padding: '0',
    }}>

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

      {/* ── PHOTO GALLERY STRIP ── */}
      <div style={{
        borderBottom: '1px solid #003300',
        padding: '40px 20px',
        backgroundColor: '#0d0d0d',
      }}>
        {/* Section header */}
        <div style={{ fontSize: '11px', color: '#006600', marginBottom: '4px' }}>
          &#9608;&#9608; HARDWARE SPOTLIGHT &#9608;&#9608;
        </div>
        <h2 style={{ fontSize: '22px', margin: '0 0 6px', letterSpacing: '2px' }}>
          SILICON &amp; STEEL
        </h2>
        <div style={{ fontSize: '12px', color: '#005500', marginBottom: '24px' }}>
          &gt; community-grade hardware, enthusiast-level passion_
        </div>

        {/* Photo grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {galleryImages.map((img, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                border: '1px solid #003300',
                overflow: 'hidden',
                backgroundColor: '#000',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#00ff00';
                e.currentTarget.style.boxShadow = '0 0 14px #00ff0055';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#003300';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Photo */}
              <img
                src={img.src}
                alt={img.alt}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(0.85) saturate(0.9) sepia(0.15) hue-rotate(80deg)',
                  transition: 'filter 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.filter = 'brightness(1) saturate(1.1) sepia(0) hue-rotate(0deg)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter = 'brightness(0.85) saturate(0.9) sepia(0.15) hue-rotate(80deg)';
                }}
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />

              {/* Scanline overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
              }} />

              {/* Label bar */}
              <div style={{
                padding: '8px 10px',
                fontSize: '11px',
                color: '#00cc00',
                letterSpacing: '1px',
                borderTop: '1px solid #003300',
                backgroundColor: '#0a0a0a',
              }}>
                &gt; {img.label}
              </div>
            </div>
          ))}
        </div>

        {/* Flavor text */}
        <div style={{
          marginTop: '20px',
          fontSize: '12px',
          color: '#004400',
          textAlign: 'center',
          letterSpacing: '1px',
        }}>
          — hover to reveal true colors —
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