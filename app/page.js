"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [scrollImages, setScrollImages] = useState([]);
  const [recentBuilds, setRecentBuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Marquee refs
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const fetchBuilds = async () => {
      const { data, error } = await supabase
        .from('builds')
        .select('id, title, author, created_at, parts, description')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data?.length) {
        setRecentBuilds(data.slice(0, 4));
        const photos = [];
        data.forEach(build => {
          try {
            const parts = build.parts ? JSON.parse(build.parts) : {};
            if (parts.photos?.length) {
              parts.photos.forEach(p => { if (p) photos.push(p); });
            } else if (parts.photo) {
              photos.push(parts.photo);
            }
          } catch (e) {}
        });
        if (photos.length >= 3) setScrollImages(photos);
      }
      setLoading(false);
    };

    fetchBuilds();
  }, []);

  // JS-driven marquee — immune to CSS animation quirks
  useEffect(() => {
    if (!trackRef.current) return;

    const step = () => {
      if (!pausedRef.current && trackRef.current) {
        offsetRef.current -= 1.2; // px per frame — increase for faster scroll
        const halfWidth = trackRef.current.scrollWidth / 2;
        if (Math.abs(offsetRef.current) >= halfWidth) {
          offsetRef.current = 0; // seamless reset to start of second copy
        }
        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [scrollImages]); // restart when images load

  const loopImages = [...scrollImages, ...scrollImages];

  return (
    <main style={{
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#00ff00',
      padding: '0',
      overflowX: 'hidden',
    }}>

      <style>{`
        @keyframes skelPulse {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.35; }
        }
        .skel-card {
          flex-shrink: 0;
          width: 280px;
          height: 190px;
          border: 1px solid #002200;
          background: #0d0d0d;
          position: relative;
          overflow: hidden;
          animation: skelPulse 1.6s ease-in-out infinite;
        }
        .skel-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.04) 2px, rgba(0,255,0,0.04) 4px);
        }
        .skel-label {
          position: absolute;
          bottom: 10px;
          left: 12px;
          width: 60%;
          height: 10px;
          background: #003300;
          border-radius: 2px;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .reel-fade-in { animation: fadeIn 0.6s ease-in forwards; }
        .build-card {
          border: 1px solid #003300;
          background: #0d0d0d;
          padding: 14px 16px;
          display: flex;
          gap: 14px;
          align-items: center;
          cursor: pointer;
          transition: border-color 0.2s;
          text-decoration: none;
        }
        .build-card:hover { border-color: #00ff00; }
        .skel-build {
          border: 1px solid #002200;
          background: #0d0d0d;
          padding: 14px 16px;
          display: flex;
          gap: 14px;
          align-items: center;
          animation: skelPulse 1.6s ease-in-out infinite;
        }
        .skel-thumb { width: 70px; height: 55px; background: #003300; flex-shrink: 0; }
        .skel-line { height: 10px; background: #003300; border-radius: 2px; margin-bottom: 6px; }
      `}</style>

      {/* Navigation */}
      <nav style={{
        backgroundColor: '#111',
        borderBottom: '2px solid #00ff00',
        padding: '10px 20px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px' }}>
            &#9608; GAMER&apos;S CONCLAVE
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '13px', flexWrap: 'wrap' }}>
            <a href="/builds" style={{ color: '#00ff00', textDecoration: 'none' }}>[ BUILDS ]</a>
            <a href="/games" style={{ color: '#00ff00', textDecoration: 'none' }}>[ FLASH GAMES ]</a>
            <a href="/doom" style={{ color: '#ff4444', textDecoration: 'none' }}>[ DOOM ]</a>
            <a href="/vote" style={{ color: '#00ff00', textDecoration: 'none' }}>[ VOTE ]</a>
            <a href="/ideas" style={{ color: '#00ff00', textDecoration: 'none' }}>[ IDEAS ]</a>
            <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none' }}>[ DONATE ]</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ borderBottom: '1px solid #003300' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '12px', color: '#006600', marginBottom: '10px' }}>
            *** WELCOME TO THE INTERNET ***
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 56px)',
            fontWeight: 'bold',
            letterSpacing: '4px',
            margin: '0 0 10px 0',
            textShadow: '0 0 10px #00ff00',
          }}>
            GAMER&apos;S CONCLAVE
          </h1>
          <div style={{ fontSize: '16px', color: '#009900', marginBottom: '30px' }}>
            // share your build. show your rig. join the community. //
          </div>
          <a href="/builds" style={{ textDecoration: 'none' }}>
            <button style={{
              backgroundColor: '#00ff00',
              color: '#000',
              border: 'none',
              padding: '14px 36px',
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
      </div>

      {/* SCROLL REEL */}
      <div style={{
        borderBottom: '1px solid #003300',
        borderTop: '1px solid #003300',
        backgroundColor: '#050505',
        padding: '20px 0',
        width: '100vw',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        boxSizing: 'border-box',
      }}>
        <div style={{ fontSize: '11px', color: '#004400', textAlign: 'center', marginBottom: '14px', letterSpacing: '2px' }}>
          &#9608;&#9608; COMMUNITY RIGS — HOVER TO PAUSE &#9608;&#9608;
        </div>

        <div
          style={{ overflow: 'hidden', width: '100%' }}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {loading && (
            <div style={{ display: 'flex', gap: '12px', padding: '0 12px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skel-card" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="skel-label" />
                </div>
              ))}
            </div>
          )}

          {!loading && scrollImages.length > 0 && (
            <div
              ref={trackRef}
              className="reel-fade-in"
              style={{
                display: 'flex',
                gap: '12px',
                width: 'max-content',
                willChange: 'transform',
              }}
            >
              {loopImages.map((src, i) => (
                <div key={i} style={{
                  flexShrink: 0,
                  width: '320px',
                  height: '210px',
                  border: '1px solid #002200',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <img
                    src={src}
                    alt="community build"
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      display: 'block', filter: 'brightness(0.88)',
                    }}
                    onError={e => { e.currentTarget.parentElement.style.display = 'none'; }}
                  />
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    pointerEvents: 'none',
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
                  }} />
                </div>
              ))}
            </div>
          )}

          {!loading && scrollImages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#004400', fontSize: '13px', padding: '40px', letterSpacing: '1px' }}>
              &gt; NO BUILDS YET — BE THE FIRST TO POST YOUR RIG_
            </div>
          )}
        </div>
      </div>

      {/* PC of the Week */}
      <div style={{ borderBottom: '1px solid #003300' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; FEATURED &#9608;&#9608;</div>
          <h2 style={{ fontSize: '28px', margin: '5px 0 20px', letterSpacing: '2px' }}>PC OF THE WEEK</h2>
          <div style={{ border: '1px solid #00ff00', padding: '24px', maxWidth: '500px', backgroundColor: '#0d0d0d' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
              &gt; SLOT EMPTY — BE THE FIRST!
            </div>
            <div style={{ fontSize: '13px', color: '#009900' }}>
              No builds submitted yet. Post yours and get voted in.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Builds */}
      <div style={{ borderBottom: '1px solid #003300' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; LATEST &#9608;&#9608;</div>
          <h2 style={{ fontSize: '28px', margin: '5px 0 20px', letterSpacing: '2px' }}>RECENT BUILDS</h2>

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '700px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skel-build" style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="skel-thumb" />
                  <div style={{ flex: 1 }}>
                    <div className="skel-line" style={{ width: '50%' }} />
                    <div className="skel-line" style={{ width: '30%' }} />
                    <div className="skel-line" style={{ width: '70%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && recentBuilds.length === 0 && (
            <div style={{ color: '#006600', fontSize: '14px' }}>&gt; No builds yet. Be the first to post._</div>
          )}

          {!loading && recentBuilds.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '700px', animation: 'fadeIn 0.6s ease-in' }}>
              {recentBuilds.map(build => {
                let parts = {};
                try { parts = build.parts ? JSON.parse(build.parts) : {}; } catch (e) {}
                const photo = parts.photos?.[0] || parts.photo || null;
                return (
                  <a key={build.id} href="/builds" className="build-card" style={{ textDecoration: 'none' }}>
                    {photo && (
                      <img src={photo} alt={build.title} style={{
                        width: '80px', height: '60px', objectFit: 'cover',
                        border: '1px solid #003300', flexShrink: 0,
                      }} />
                    )}
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px', color: '#00ff00' }}>
                        &gt; {build.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#006600' }}>
                        by {build.author} · {new Date(build.created_at).toLocaleDateString()}
                      </div>
                      {parts.cpu && (
                        <div style={{ fontSize: '12px', color: '#009900', marginTop: '3px' }}>
                          {parts.cpu}{parts.gpu ? ` · ${parts.gpu}` : ''}
                        </div>
                      )}
                    </div>
                  </a>
                );
              })}
              <a href="/builds" style={{ fontSize: '13px', color: '#009900', textDecoration: 'none', letterSpacing: '1px' }}>
                &gt; VIEW ALL BUILDS →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '2px solid #00ff00', backgroundColor: '#111' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#006600' }}>
          <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
          <span>GAMER&apos;S CONCLAVE &copy; 2025 — BUILT WITH PASSION, NOT PROFIT</span>
        </div>
      </footer>
    </main>
  );
}