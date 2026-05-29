'use client';
import { useState } from 'react';

const disclaimer = "⚠ COMMUNITY RULES: Please keep all posts PG. Violent posts or derogatory language will result in immediate post removal. Repeat offenders will be banned.";

const REACTIONS = ['🔥', '💀', '👾', '⚡', '🖥️'];

const sampleBuilds = [
  {
    id: 1,
    title: 'THE BEAST',
    author: 'BuilderOne',
    cpu: 'Intel i9-13900K',
    gpu: 'RTX 4090',
    ram: '64GB DDR5',
    storage: '2TB NVMe SSD',
    description: 'Ultimate gaming and streaming rig. No compromises.',
    partLink: 'https://pcpartpicker.com',
    reactions: { '🔥': 12, '💀': 4, '👾': 7, '⚡': 9, '🖥️': 3 },
  },
  {
    id: 2,
    title: 'BUDGET SLAYER',
    author: 'FrugalFrag',
    cpu: 'AMD Ryzen 5 7600X',
    gpu: 'RX 7600',
    ram: '16GB DDR5',
    storage: '1TB NVMe SSD',
    description: 'Proof you don\'t need to spend a fortune to game at 1080p high.',
    partLink: 'https://pcpartpicker.com',
    reactions: { '🔥': 8, '💀': 1, '👾': 5, '⚡': 6, '🖥️': 2 },
  },
];

export default function BuildsPage() {
  const [builds, setBuilds] = useState(sampleBuilds);
  const [userReactions, setUserReactions] = useState({});

  const handleReaction = (buildId, emoji) => {
    const key = `${buildId}-${emoji}`;
    if (userReactions[key]) return;
    setUserReactions(prev => ({ ...prev, [key]: true }));
    setBuilds(prev => prev.map(build => {
      if (build.id !== buildId) return build;
      return {
        ...build,
        reactions: {
          ...build.reactions,
          [emoji]: (build.reactions[emoji] || 0) + 1,
        },
      };
    }));
  };

  return (
    <main style={{
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#00ff00',
    }}>
      {/* Nav */}
      <nav style={{
        backgroundColor: '#111',
        borderBottom: '2px solid #00ff00',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <a href="/" style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px', color: '#00ff00', textDecoration: 'none' }}>
          &#9608; GAMER'S CONCLAVE
        </a>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
          <a href="/builds" style={{ color: '#00ff00', textDecoration: 'none' }}>[ BUILDS ]</a>
          <a href="/games" style={{ color: '#00ff00', textDecoration: 'none' }}>[ GAMES ]</a>
          <a href="/vote" style={{ color: '#00ff00', textDecoration: 'none' }}>[ VOTE ]</a>
          <a href="/ideas" style={{ color: '#00ff00', textDecoration: 'none' }}>[ IDEAS ]</a>
          <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none' }}>[ DONATE ]</a>
        </div>
      </nav>

      {/* Disclaimer */}
      <div style={{
        backgroundColor: '#1a0000',
        border: '1px solid #ff4444',
        color: '#ff4444',
        padding: '12px 20px',
        fontSize: '12px',
        textAlign: 'center',
        letterSpacing: '1px',
      }}>
        {disclaimer}
      </div>

      {/* Header */}
      <div style={{ padding: '40px 20px 20px', borderBottom: '1px solid #003300' }}>
        <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; COMMUNITY BUILDS &#9608;&#9608;</div>
        <h1 style={{ fontSize: '32px', margin: '5px 0 10px', letterSpacing: '3px' }}>THE BUILDS</h1>
        <p style={{ fontSize: '13px', color: '#009900', margin: '0 0 20px' }}>
          Browse community PC builds. React with an emoji. No comments — keep it clean.
        </p>
        <button style={{
          backgroundColor: '#00ff00',
          color: '#000',
          border: 'none',
          padding: '10px 24px',
          fontSize: '14px',
          fontFamily: '"Courier New", monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          letterSpacing: '2px',
        }}>
          [ + POST YOUR BUILD ]
        </button>
      </div>

      {/* Builds Grid */}
      <div style={{
        padding: '30px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '24px',
      }}>
        {builds.map(build => (
          <div key={build.id} style={{
            border: '1px solid #00ff00',
            backgroundColor: '#0d0d0d',
            padding: '20px',
          }}>
            {/* Build Title */}
            <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '4px' }}>
              &gt; {build.title}
            </div>
            <div style={{ fontSize: '11px', color: '#006600', marginBottom: '14px' }}>
              posted by {build.author}
            </div>

            {/* Specs */}
            <div style={{ fontSize: '12px', color: '#009900', marginBottom: '14px', lineHeight: '1.8' }}>
              <div>CPU: <span style={{ color: '#00ff00' }}>{build.cpu}</span></div>
              <div>GPU: <span style={{ color: '#00ff00' }}>{build.gpu}</span></div>
              <div>RAM: <span style={{ color: '#00ff00' }}>{build.ram}</span></div>
              <div>STORAGE: <span style={{ color: '#00ff00' }}>{build.storage}</span></div>
            </div>

            {/* Description */}
            <div style={{ fontSize: '13px', color: '#009900', marginBottom: '14px', borderLeft: '2px solid #003300', paddingLeft: '10px' }}>
              {build.description}
            </div>

            {/* Part Link */}
            <a href={build.partLink} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block',
              fontSize: '12px',
              color: '#ffff00',
              textDecoration: 'none',
              marginBottom: '16px',
              border: '1px solid #666600',
              padding: '4px 10px',
            }}>
              [ VIEW PARTS LIST ]
            </a>

            {/* Reactions */}
            <div style={{ borderTop: '1px solid #003300', paddingTop: '12px' }}>
              <div style={{ fontSize: '11px', color: '#006600', marginBottom: '8px' }}>REACT:</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {REACTIONS.map(emoji => {
                  const reacted = userReactions[`${build.id}-${emoji}`];
                  return (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(build.id, emoji)}
                      style={{
                        backgroundColor: reacted ? '#003300' : '#111',
                        border: reacted ? '1px solid #00ff00' : '1px solid #003300',
                        color: '#fff',
                        padding: '4px 10px',
                        cursor: reacted ? 'default' : 'pointer',
                        fontSize: '16px',
                        borderRadius: '4px',
                      }}
                    >
                      {emoji} <span style={{ fontSize: '12px', color: '#009900' }}>{build.reactions[emoji] || 0}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
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
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
        <span>GAMER'S CONCLAVE &copy; 2025 — BUILT WITH PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}