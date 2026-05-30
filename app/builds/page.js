'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const disclaimer = "⚠ COMMUNITY RULES: Please keep all posts PG. Violent posts or derogatory language will result in immediate post removal. Repeat offenders will be banned.";

const REACTIONS = ['🔥', '💀', '👾', '⚡', '🖥️'];

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
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReactions, setUserReactions] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '', author: '', cpu: '', gpu: '', ram: '', storage: '', psu: '', case: '', description: '', partLink: '', photoPreview: null,
  });

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('builds')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching builds:', error);
      setError('Failed to load builds. Please refresh.');
    } else {
      setBuilds(data || []);
    }
    setLoading(false);
  };

  const handleReaction = async (buildId, emoji) => {
    const key = `${buildId}-${emoji}`;
    if (userReactions[key]) return;

    setUserReactions(prev => ({ ...prev, [key]: true }));
    setBuilds(prev => prev.map(build => {
      if (build.id !== buildId) return build;
      const current = build.reactions || {};
      return { ...build, reactions: { ...current, [emoji]: (current[emoji] || 0) + 1 } };
    }));

    const { data: current } = await supabase
      .from('builds')
      .select('reactions')
      .eq('id', buildId)
      .single();

    const updatedReactions = {
      ...(current?.reactions || {}),
      [emoji]: ((current?.reactions?.[emoji]) || 0) + 1,
    };

    await supabase
      .from('builds')
      .update({ reactions: updatedReactions })
      .eq('id', buildId);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, photoPreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.author || !form.cpu || !form.gpu) {
      alert('Please fill in at least: Build Name, Your Name, CPU, and GPU.');
      return;
    }

    const newBuild = {
      title: form.title.toUpperCase(),
      author: form.author,
      parts: JSON.stringify({
        cpu: form.cpu,
        gpu: form.gpu,
        ram: form.ram,
        storage: form.storage,
        psu: form.psu,
        case: form.case,
        partLink: form.partLink,
        photo: form.photoPreview,
      }),
      description: form.description,
      reactions: { '🔥': 0, '💀': 0, '👾': 0, '⚡': 0, '🖥️': 0 },
    };

    const { error } = await supabase.from('builds').insert([newBuild]);

    if (error) {
      console.error('Error posting build:', error);
      alert('Failed to post build. Please try again.');
      return;
    }

    setForm({ title: '', author: '', cpu: '', gpu: '', ram: '', storage: '', psu: '', case: '', description: '', partLink: '', photoPreview: null });
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    fetchBuilds();
  };

  const filteredBuilds = builds
    .filter(b => {
      const q = search.toLowerCase();
      const parts = b.parts ? JSON.parse(b.parts) : {};
      return (
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        parts.cpu?.toLowerCase().includes(q) ||
        parts.gpu?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'hottest') {
        const aTotal = Object.values(a.reactions || {}).reduce((x, y) => x + y, 0);
        const bTotal = Object.values(b.reactions || {}).reduce((x, y) => x + y, 0);
        return bTotal - aTotal;
      }
      return 0;
    });

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

      {/* DISCLAIMER */}
      <div style={{ backgroundColor: '#1a0000', border: '1px solid #ff4444', color: '#ff4444', padding: '12px 20px', fontSize: '12px', textAlign: 'center', letterSpacing: '1px' }}>
        {disclaimer}
      </div>

      {/* SUCCESS */}
      {submitted && (
        <div style={{ backgroundColor: '#003300', border: '1px solid #00ff00', color: '#00ff00', padding: '12px 20px', fontSize: '13px', textAlign: 'center' }}>
          ✓ BUILD POSTED SUCCESSFULLY! WELCOME TO THE CONCLAVE.
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div style={{ backgroundColor: '#1a0000', border: '1px solid #ff4444', color: '#ff4444', padding: '12px 20px', fontSize: '13px', textAlign: 'center' }}>
          ⚠ {error}
        </div>
      )}

      {/* HEADER */}
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

      {/* POST FORM */}
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

          <label style={labelStyle}>PSU</label>
          <input style={inputStyle} value={form.psu} onChange={e => setForm(p => ({ ...p, psu: e.target.value }))} placeholder="e.g. Corsair RM850x 850W" />

          <label style={labelStyle}>CASE</label>
          <input style={inputStyle} value={form.case} onChange={e => setForm(p => ({ ...p, case: e.target.value }))} placeholder="e.g. Lian Li O11 Dynamic" />

          <label style={labelStyle}>PERIPHERALS / WHAT MAKES YOUR BUILD SPECIAL</label>
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Custom water loop, RGB setup, ultrawide monitor, mechanical keyboard..." />

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

      {/* SEARCH + SORT */}
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

      {/* BUILDS GRID */}
      <div style={{ padding: '30px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {loading && (
          <div style={{ color: '#006600', fontSize: '14px' }}>&gt; LOADING BUILDS FROM DATABASE..._</div>
        )}
        {!loading && filteredBuilds.length === 0 && (
          <div style={{ color: '#006600', fontSize: '14px' }}>&gt; No builds found. Be the first to post!_</div>
        )}
        {filteredBuilds.map(build => {
          const parts = build.parts ? JSON.parse(build.parts) : {};
          return (
            <div key={build.id} style={{ border: '1px solid #00ff00', backgroundColor: '#0d0d0d', padding: '20px' }}>
              {parts.photo && (
                <img src={parts.photo} alt={build.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '14px', border: '1px solid #003300' }} />
              )}
              <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '4px' }}>&gt; {build.title}</div>
              <div style={{ fontSize: '11px', color: '#006600', marginBottom: '14px' }}>
                posted by {build.author} · {new Date(build.created_at).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '12px', color: '#009900', marginBottom: '14px', lineHeight: '1.8' }}>
                {parts.cpu && <div>CPU: <span style={{ color: '#00ff00' }}>{parts.cpu}</span></div>}
                {parts.gpu && <div>GPU: <span style={{ color: '#00ff00' }}>{parts.gpu}</span></div>}
                {parts.ram && <div>RAM: <span style={{ color: '#00ff00' }}>{parts.ram}</span></div>}
                {parts.storage && <div>STORAGE: <span style={{ color: '#00ff00' }}>{parts.storage}</span></div>}
                {parts.psu && <div>PSU: <span style={{ color: '#00ff00' }}>{parts.psu}</span></div>}
                {parts.case && <div>CASE: <span style={{ color: '#00ff00' }}>{parts.case}</span></div>}
              </div>
              {build.description && (
                <div style={{ fontSize: '13px', color: '#009900', marginBottom: '14px', borderLeft: '2px solid #003300', paddingLeft: '10px' }}>{build.description}</div>
              )}
              {parts.partLink && (
                <a href={parts.partLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: '12px', color: '#ffff00', textDecoration: 'none', marginBottom: '16px', border: '1px solid #666600', padding: '4px 10px' }}>
                  [ VIEW PARTS LIST ]
                </a>
              )}
              <div style={{ borderTop: '1px solid #003300', paddingTop: '12px' }}>
                <div style={{ fontSize: '11px', color: '#006600', marginBottom: '8px' }}>REACT:</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {REACTIONS.map(emoji => {
                    const reacted = userReactions[`${build.id}-${emoji}`];
                    return (
                      <button key={emoji} onClick={() => handleReaction(build.id, emoji)}
                        style={{ backgroundColor: reacted ? '#003300' : '#111', border: reacted ? '1px solid #00ff00' : '1px solid #003300', color: '#fff', padding: '4px 10px', cursor: reacted ? 'default' : 'pointer', fontSize: '16px', borderRadius: '4px' }}>
                        {emoji} <span style={{ fontSize: '12px', color: '#009900' }}>{(build.reactions?.[emoji]) || 0}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '2px solid #00ff00', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#006600', backgroundColor: '#111' }}>
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
        <span>GAMER'S CONCLAVE &copy; 2025 — BUILT WITH PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}