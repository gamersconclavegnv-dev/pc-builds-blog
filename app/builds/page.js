'use client';
import { useState } from 'react';

const disclaimer = "⚠ COMMUNITY RULES: Please keep all posts PG. Violent posts or derogatory language will result in immediate post removal. Repeat offenders will be banned.";

const REACTIONS = ['🔥', '💀', '👾', '⚡', '🖥️'];

const initialBuilds = [
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
    photo: null,
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
    photo: null,
    reactions: { '🔥': 8, '💀': 1, '👾': 5, '⚡': 6, '🖥️': 2 },
  },
];

const inputStyle = {
  backgroundColor: '#0d0d0d',
  border: '1px solid #00ff00',
  color: '#00ff00',
  padding: '8px 12px',
  fontSize: '13px',
  fontFamily: '"Courier New", monospace',
  width: '100%',
  boxSizing: 'border-box',
  marginTop: '4px',
};

const labelStyle = {
  fontSize: '11px',
  color: '#006600',
  letterSpacing: '1px',
  display: 'block',
  marginTop: '12px',
};

export default function BuildsPage() {
  const [builds, setBuilds] = useState(initialBuilds);
  const [userReactions, setUserReactions] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    title: '', author: '', cpu: '', gpu: '', ram: '', storage: '', description: '', partLink: '', photo: null, photoPreview: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleReaction = (buildId, emoji) => {
    const key = `${buildId}-${emoji}`;
    if (userReactions[key]) return;
    setUserReactions(prev => ({ ...prev, [key]: true }));
    setBuilds(prev => prev.map(build => {
      if (build.id !== buildId) return build;
      return { ...build, reactions: { ...build.reactions, [emoji]: (build.reactions[emoji] || 0) + 1 } };
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, photo: file, photoPreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.title || !form.author || !form.cpu || !form.gpu) {
      alert('Please fill in at least: Build Name, Your Name, CPU, and GPU.');
      return;
    }
    const newBuild = {
      id: Date.now(),
      title: form.title.toUpperCase(),
      author: form.author,
      cpu: form.cpu,
      gpu: form.gpu,
      ram: form.ram,
      storage: form.storage,
      description: form.description,
      partLink: form.partLink,
      photo: form.photoPreview,
      reactions: { '🔥': 0, '💀': 0, '👾': 0, '⚡': 0, '🖥️': 0 },
    };
    setBuilds(prev => [newBuild, ...prev]);
    setForm({ title: '', author: '', cpu: '', gpu: '', ram: '', storage: '', description: '', partLink: '', photo: null, photoPreview: null });
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const filteredBuilds = builds
    .filter(b => {
      const q = search.toLowerCase();
      return b.title.toLowerCase().includes(q) || b.cpu.toLowerCase().includes(q) || b.gpu.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'hottest') {
        const aTotal = Object.values(a.reactions).reduce((x, y) => x + y, 0);
        const bTotal = Object.values(b.reactions).reduce((x, y) => x + y, 0);
        return bTotal - aTotal;
      }
      return 0;
    });

  return (
    <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: '"Courier New", Courier, monospace', color: '#00ff00' }}>
      {/* Nav */}
      <nav style={{ backgroundColor: '#111', borderBottom: '2px solid #00ff00', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      <div style={{ backgroundColor: '#1a0000', border: '1px solid #ff4444', color: '#ff4444', padding: '12px 20px', fontSize: '12px', textAlign: 'center', letterSpacing: '1px' }}>
        {disclaimer}
      </div>

      {/* Success message */}
      {submitted && (
        <div style={{ backgroundColor: '#003300', border: '1px solid #00ff00', color: '#00ff00', padding: '12px 20px', fontSize: '13px', textAlign: 'center' }}>
          ✓ BUILD POSTED SUCCESSFULLY! WELCOME TO THE CONCLAVE.
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '40px 20px 20px', borderBottom: '1px solid #003300' }}>
        <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; COMMUNITY BUILDS &#9608;&#9608;</div>
        <h1 style={{ fontSize: '32px', margin: '5px 0 10px', letterSpacing: '3px' }}>THE BUILDS</h1>
        <p style={{ fontSize: '13px', color: '#009900', margin: '0 0 20px' }}>
          Browse community PC builds. React with an emoji. No comments — keep it clean.
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: '#00ff00', color: '#000', border: 'none', padding: '10px 24px', fontSize: '14px', fontFamily: '"Courier New", monospace', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px' }}>
          {showForm ? '[ - CANCEL ]' : '[ + POST YOUR BUILD ]'}
        </button>
      </div>

      {/* Post Form */}
      {showForm && (
        <div style={{ margin: '20px', border: '1px solid #00ff00', padding: '24px', backgroundColor: '#0d0d0d', maxWidth: '600px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '2px' }}>&gt; SUBMIT YOUR BUILD</div>

          <label style={labelStyle}>BUILD NAME *</label>
          <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. THE DESTROYER" />

          <label style={labelStyle}>YOUR USERNAME *</label>
          <input style={inputStyle} value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} placeholder="e.g. RigMaster3000" />

          <label style={labelStyle}>CPU *</label>
          <input style={inputStyle} value={form.cpu} onChange={e => setForm(p => ({ ...p, cpu: e.target.value }))} placeholder="e.g. Intel i7-13700K" />

          <label style={labelStyle}>GPU *</label>
          <input style={inputStyle} value={form.gpu} onChange={e => setForm(p => ({ ...p, gpu: e.target.value }))} placeholder="e.g. RTX 4070 Ti" />

          <label style={labelStyle}>RAM</label>
          <input style={inputStyle} value={form.ram} onChange={e => setForm(p => ({ ...p, ram: e.target.value }))} placeholder="e.g. 32GB DDR5" />

          <label style={labelStyle}>STORAGE</label>
          <input style={inputStyle} value={form.storage} onChange={e => setForm(p => ({ ...p, storage: e.target.value }))} placeholder="e.g. 1TB NVMe SSD" />

          <label style={labelStyle}>DESCRIPTION</label>
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Tell us about your build..." />

          <label style={labelStyle}>PARTS LIST URL (PCPartPicker, etc.)</label>
          <input style={inputStyle} value={form.partLink} onChange={e => setForm(p => ({ ...p, partLink: e.target.value }))} placeholder="https://pcpartpicker.com/list/..." />

          <label style={labelStyle}>PHOTO OF YOUR RIG</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ ...inputStyle, padding: '6px' }} />
          {form.photoPreview && (
            <img src={form.photoPreview} alt="preview" style={{ marginTop: '10px', maxWidth: '100%', maxHeight: '200px', border: '1px solid #003300' }} />
          )}

          <button
            onClick={handleSubmit}
            style={{ marginTop: '20px', backgroundColor: '#00ff00', color: '#000', border: 'none', padding: '10px 24px', fontSize: '14px', fontFamily: '"Courier New", monospace', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px', width: '100%' }}>
            [ SUBMIT BUILD ]
          </button>
        </div>
      )}

      {/* Search + Sort */}
      <div style={{ padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', borderBottom: '1px solid #003300' }}>
        <input
          style={{ ...inputStyle, maxWidth: '300px', marginTop: '0' }}
          placeholder="Search builds, CPUs, GPUs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#006600' }}>SORT:</span>
          <button onClick={() => setSortBy('newest')} style={{ backgroundColor: sortBy === 'newest' ? '#00ff00' : '#111', color: sortBy === 'newest' ? '#000' : '#00ff00', border: '1px solid #00ff00', padding: '6px 14px', cursor: 'pointer', fontFamily: '"Courier New", monospace', fontSize: '12px' }}>NEWEST</button>
          <button onClick={() => setSortBy('hottest')} style={{ backgroundColor: sortBy === 'hottest' ? '#00ff00' : '#111', color: sortBy === 'hottest' ? '#000' : '#00ff00', border: '1px solid #00ff00', padding: '6px 14px', cursor: 'pointer', fontFamily: '"Courier New", monospace', fontSize: '12px' }}>HOTTEST</button>
        </div>
      </div>

      {/* Builds Grid */}
      <div style={{ padding: '30px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredBuilds.length === 0 && (
          <div style={{ color: '#006600', fontSize: '14px' }}>&gt; No builds match your search._</div>
        )}
        {filteredBuilds.map(build => (
          <div key={build.id} style={{ border: '1px solid #00ff00', backgroundColor: '#0d0d0d', padding: '20px' }}>
            {build.photo && (
              <img src={build.photo} alt={build.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '14px', border: '1px solid #003300' }} />
            )}
            <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '4px' }}>&gt; {build.title}</div>
            <div style={{ fontSize: '11px', color: '#006600', marginBottom: '14px' }}>posted by {build.author}</div>
            <div style={{ fontSize: '12px', color: '#009900', marginBottom: '14px', lineHeight: '1.8' }}>
              <div>CPU: <span style={{ color: '#00ff00' }}>{build.cpu}</span></div>
              <div>GPU: <span style={{ color: '#00ff00' }}>{build.gpu}</span></div>
              {build.ram && <div>RAM: <span style={{ color: '#00ff00' }}>{build.ram}</span></div>}
              {build.storage && <div>STORAGE: <span style={{ color: '#00ff00' }}>{build.storage}</span></div>}
            </div>
            {build.description && (
              <div style={{ fontSize: '13px', color: '#009900', marginBottom: '14px', borderLeft: '2px solid #003300', paddingLeft: '10px' }}>{build.description}</div>
            )}
            {build.partLink && (
              <a href={build.partLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: '12px', color: '#ffff00', textDecoration: 'none', marginBottom: '16px', border: '1px solid #666600', padding: '4px 10px' }}>
                [ VIEW PARTS LIST ]
              </a>
            )}
            <div style={{ borderTop: '1px solid #003300', paddingTop: '12px' }}>
              <div style={{ fontSize: '11px', color: '#006600', marginBottom: '8px' }}>REACT:</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {REACTIONS.map(emoji => {
                  const reacted = userReactions[`${build.id}-${emoji}`];
                  return (
                    <button key={emoji} onClick={() => handleReaction(build.id, emoji)} style={{ backgroundColor: reacted ? '#003300' : '#111', border: reacted ? '1px solid #00ff00' : '1px solid #003300', color: '#fff', padding: '4px 10px', cursor: reacted ? 'default' : 'pointer', fontSize: '16px', borderRadius: '4px' }}>
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
      <footer style={{ borderTop: '2px solid #00ff00', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#006600', backgroundColor: '#111' }}>
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
        <span>GAMER'S CONCLAVE &copy; 2025 — BUILT WITH PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}