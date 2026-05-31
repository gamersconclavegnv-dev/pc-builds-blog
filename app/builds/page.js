'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from '@clerk/nextjs';

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

const emptyForm = {
  title: '', author: '', cpu: '', gpu: '', motherboard: '', ram: '',
  storage: '', psu: '', case: '', description: '', partLink: '', photos: [],
};

// Compress image to max 800px wide, 0.7 quality JPEG — keeps base64 small
const compressImage = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    const img = new Image();
    img.onload = () => {
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

export default function BuildsPage() {
  const { user } = useUser();
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReactions, setUserReactions] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [expandedPhotos, setExpandedPhotos] = useState({});
  const submitLockRef = useRef(false);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        author: prev.author || user.username || user.firstName || user.emailAddresses?.[0]?.emailAddress?.split('@')[0] || '',
      }));
    }
  }, [user]);

  useEffect(() => { fetchBuilds(); }, []);

  const fetchBuilds = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('builds')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error(error); setError('Failed to load builds. Please refresh.'); }
    else setBuilds(data || []);
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
    const { data: current } = await supabase.from('builds').select('reactions').eq('id', buildId).single();
    const updatedReactions = { ...(current?.reactions || {}), [emoji]: ((current?.reactions?.[emoji]) || 0) + 1 };
    await supabase.from('builds').update({ reactions: updatedReactions }).eq('id', buildId);
  };

  const handlePhotosChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const MAX = 5;
    const remaining = MAX - form.photos.length;
    if (remaining <= 0) { alert('Maximum 5 photos allowed.'); return; }
    const toProcess = files.slice(0, remaining);
    e.target.value = '';

    setUploadingPhotos(true);
    try {
      const compressed = await Promise.all(toProcess.map(f => compressImage(f)));
      setForm(prev => ({ ...prev, photos: [...prev.photos, ...compressed] }));
    } catch (err) {
      alert('Failed to process photos. Please try again.');
    }
    setUploadingPhotos(false);
  };

  const removePhoto = (index) => {
    setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const openEditForm = (build) => {
    const parts = build.parts ? JSON.parse(build.parts) : {};
    setForm({
      title: build.title || '',
      author: build.author || '',
      cpu: parts.cpu || '',
      gpu: parts.gpu || '',
      motherboard: parts.motherboard || '',
      ram: parts.ram || '',
      storage: parts.storage || '',
      psu: parts.psu || '',
      case: parts.case || '',
      description: build.description || '',
      partLink: parts.partLink || '',
      photos: parts.photos || (parts.photo ? [parts.photo] : []),
    });
    setEditingId(build.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    submitLockRef.current = false; // always reset lock on cancel
    setForm({
      ...emptyForm,
      author: user?.username || user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || '',
    });
  };

  const handleSubmit = async () => {
    if (submitLockRef.current || submitting) return;
    if (!form.title || !form.author || !form.cpu || !form.gpu) {
      alert('Please fill in at least: Build Name, Your Name, CPU, and GPU.');
      return;
    }
    submitLockRef.current = true;
    setSubmitting(true);

    const partsPayload = JSON.stringify({
      cpu: form.cpu,
      gpu: form.gpu,
      motherboard: form.motherboard,
      ram: form.ram,
      storage: form.storage,
      psu: form.psu,
      case: form.case,
      partLink: form.partLink,
      photos: form.photos,
    });

    // Warn if payload is very large
    const payloadSizeKB = Math.round(new Blob([partsPayload]).size / 1024);
    if (payloadSizeKB > 900) {
      alert(`Your photos are too large (${payloadSizeKB}KB). Please use fewer or smaller photos.`);
      submitLockRef.current = false;
      setSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase.from('builds').update({
          title: form.title.toUpperCase(),
          author: form.author,
          parts: partsPayload,
          description: form.description,
        }).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('builds').insert([{
          title: form.title.toUpperCase(),
          author: form.author,
          parts: partsPayload,
          description: form.description,
          reactions: { '🔥': 0, '💀': 0, '👾': 0, '⚡': 0, '🖥️': 0 },
          user_id: user?.id || null,
        }]);
        if (error) throw error;
      }

      cancelForm();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      await fetchBuilds();
    } catch (err) {
      console.error('Error saving build:', err);
      alert(`Failed to save build: ${err.message || 'Unknown error'}. Please try again.`);
      submitLockRef.current = false; // reset lock on error so user can retry
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (buildId) => {
    if (!confirm('Delete this build? This cannot be undone.')) return;
    const { error } = await supabase.from('builds').delete().eq('id', buildId);
    if (error) { alert('Failed to delete. Try again.'); return; }
    setBuilds(prev => prev.filter(b => b.id !== buildId));
  };

  const isOwner = (build) => {
    if (!user) return false;
    if (build.user_id && build.user_id === user.id) return true;
    const myName = user.username || user.firstName || user.emailAddresses?.[0]?.emailAddress?.split('@')[0] || '';
    return build.author === myName;
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
        parts.gpu?.toLowerCase().includes(q) ||
        parts.motherboard?.toLowerCase().includes(q)
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

      <nav style={{ backgroundColor: '#111', borderBottom: '2px solid #00ff00', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <a href="/" style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px', color: '#00ff00', textDecoration: 'none' }}>
          &#9608; GAMER&apos;S CONCLAVE
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

      <div style={{ backgroundColor: '#1a0000', border: '1px solid #ff4444', color: '#ff4444', padding: '12px 20px', fontSize: '12px', textAlign: 'center', letterSpacing: '1px' }}>
        {disclaimer}
      </div>

      {submitted && (
        <div style={{ backgroundColor: '#003300', border: '1px solid #00ff00', color: '#00ff00', padding: '12px 20px', fontSize: '13px', textAlign: 'center' }}>
          ✓ BUILD {editingId ? 'UPDATED' : 'POSTED'} SUCCESSFULLY! WELCOME TO THE CONCLAVE.
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#1a0000', border: '1px solid #ff4444', color: '#ff4444', padding: '12px 20px', fontSize: '13px', textAlign: 'center' }}>
          ⚠ {error}
        </div>
      )}

      <div style={{ padding: '40px 20px 20px', borderBottom: '1px solid #003300' }}>
        <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; COMMUNITY BUILDS &#9608;&#9608;</div>
        <h1 style={{ fontSize: '32px', margin: '5px 0 10px', letterSpacing: '3px' }}>THE BUILDS</h1>
        <p style={{ fontSize: '13px', color: '#009900', margin: '0 0 20px' }}>
          Browse community PC builds. React with an emoji. No comments — keep it clean.
        </p>
        <button
          onClick={() => { if (showForm && !editingId) { cancelForm(); } else { setShowForm(!showForm); setEditingId(null); } }}
          style={{ backgroundColor: '#00ff00', color: '#000', border: 'none', padding: '10px 24px', fontSize: '14px', fontFamily: '"Courier New", monospace', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px' }}>
          {showForm ? '[ - CANCEL ]' : '[ + POST YOUR BUILD ]'}
        </button>
      </div>

      {showForm && (
        <div style={{ margin: '20px', border: `1px solid ${editingId ? '#ffff00' : '#00ff00'}`, padding: '24px', backgroundColor: '#0d0d0d', maxWidth: '600px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '2px', color: editingId ? '#ffff00' : '#00ff00' }}>
            &gt; {editingId ? 'EDIT YOUR BUILD' : 'SUBMIT YOUR BUILD'}
          </div>

          <label style={labelStyle}>BUILD NAME *</label>
          <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. THE DESTROYER" />

          <label style={labelStyle}>YOUR USERNAME *</label>
          <input style={inputStyle} value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} placeholder="e.g. RigMaster3000" />

          <label style={labelStyle}>CPU *</label>
          <input style={inputStyle} value={form.cpu} onChange={e => setForm(p => ({ ...p, cpu: e.target.value }))} placeholder="e.g. Intel i7-13700K" />

          <label style={labelStyle}>GPU *</label>
          <input style={inputStyle} value={form.gpu} onChange={e => setForm(p => ({ ...p, gpu: e.target.value }))} placeholder="e.g. RTX 4070 Ti" />

          <label style={labelStyle}>MOTHERBOARD</label>
          <input style={inputStyle} value={form.motherboard} onChange={e => setForm(p => ({ ...p, motherboard: e.target.value }))} placeholder="e.g. ASUS ROG Strix Z790-E" />

          <label style={labelStyle}>RAM</label>
          <input style={inputStyle} value={form.ram} onChange={e => setForm(p => ({ ...p, ram: e.target.value }))} placeholder="e.g. 32GB DDR5" />

          <label style={labelStyle}>STORAGE</label>
          <input style={inputStyle} value={form.storage} onChange={e => setForm(p => ({ ...p, storage: e.target.value }))} placeholder="e.g. 1TB NVMe SSD" />

          <label style={labelStyle}>PSU</label>
          <input style={inputStyle} value={form.psu} onChange={e => setForm(p => ({ ...p, psu: e.target.value }))} placeholder="e.g. Corsair RM850x 850W" />

          <label style={labelStyle}>CASE</label>
          <input style={inputStyle} value={form.case} onChange={e => setForm(p => ({ ...p, case: e.target.value }))} placeholder="e.g. Lian Li O11 Dynamic" />

          <label style={labelStyle}>PERIPHERALS / WHAT MAKES YOUR BUILD SPECIAL</label>
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Custom water loop, RGB setup, ultrawide monitor..." />

          <label style={labelStyle}>PARTS LIST URL (PCPartPicker, etc.)</label>
          <input style={inputStyle} value={form.partLink} onChange={e => setForm(p => ({ ...p, partLink: e.target.value }))} placeholder="https://pcpartpicker.com/list/..." />

          <label style={labelStyle}>PHOTOS OF YOUR RIG (UP TO 5)</label>
          <input
            type="file" accept="image/*" multiple
            onChange={handlePhotosChange}
            disabled={form.photos.length >= 5 || uploadingPhotos}
            style={{ ...inputStyle, padding: '6px', opacity: (form.photos.length >= 5 || uploadingPhotos) ? 0.4 : 1 }}
          />
          <div style={{ fontSize: '11px', color: '#004400', marginTop: '4px' }}>
            {uploadingPhotos ? '⏳ COMPRESSING PHOTOS...' : `${form.photos.length}/5 photos added`}
          </div>

          {form.photos.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              {form.photos.map((src, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={src} alt={`preview-${i}`} style={{ width: '90px', height: '70px', objectFit: 'cover', border: '1px solid #003300' }} />
                  <button
                    onClick={() => removePhoto(i)}
                    style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#ff4444', color: '#fff', border: 'none', width: '18px', height: '18px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={handleSubmit}
              disabled={submitting || uploadingPhotos}
              style={{
                flex: 1,
                backgroundColor: submitting ? '#006600' : (editingId ? '#ffff00' : '#00ff00'),
                color: '#000', border: 'none', padding: '10px 24px', fontSize: '14px',
                fontFamily: '"Courier New", monospace', fontWeight: 'bold',
                cursor: (submitting || uploadingPhotos) ? 'not-allowed' : 'pointer', letterSpacing: '2px',
                opacity: (submitting || uploadingPhotos) ? 0.7 : 1,
              }}>
              {submitting ? '[ POSTING... ]' : uploadingPhotos ? '[ PROCESSING PHOTOS... ]' : editingId ? '[ SAVE CHANGES ]' : '[ SUBMIT BUILD ]'}
            </button>
            <button
              onClick={cancelForm}
              style={{ backgroundColor: '#111', color: '#ff4444', border: '1px solid #ff4444', padding: '10px 18px', fontSize: '13px', fontFamily: '"Courier New", monospace', cursor: 'pointer' }}>
              CANCEL
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', borderBottom: '1px solid #003300' }}>
        <input
          style={{ ...inputStyle, maxWidth: '300px', marginTop: '0' }}
          placeholder="Search builds, CPUs, GPUs, motherboards..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#006600' }}>SORT:</span>
          <button onClick={() => setSortBy('newest')} style={{ backgroundColor: sortBy === 'newest' ? '#00ff00' : '#111', color: sortBy === 'newest' ? '#000' : '#00ff00', border: '1px solid #00ff00', padding: '6px 14px', cursor: 'pointer', fontFamily: '"Courier New", monospace', fontSize: '12px' }}>NEWEST</button>
          <button onClick={() => setSortBy('hottest')} style={{ backgroundColor: sortBy === 'hottest' ? '#00ff00' : '#111', color: sortBy === 'hottest' ? '#000' : '#00ff00', border: '1px solid #00ff00', padding: '6px 14px', cursor: 'pointer', fontFamily: '"Courier New", monospace', fontSize: '12px' }}>HOTTEST</button>
        </div>
      </div>

      <div style={{ padding: '30px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {loading && <div style={{ color: '#006600', fontSize: '14px' }}>&gt; LOADING BUILDS FROM DATABASE..._</div>}
        {!loading && filteredBuilds.length === 0 && <div style={{ color: '#006600', fontSize: '14px' }}>&gt; No builds found. Be the first to post!_</div>}

        {filteredBuilds.map(build => {
          const parts = build.parts ? JSON.parse(build.parts) : {};
          const photos = parts.photos || (parts.photo ? [parts.photo] : []);
          const activePhoto = expandedPhotos[build.id] || 0;
          const owner = isOwner(build);

          return (
            <div key={build.id} style={{ border: '1px solid #00ff00', backgroundColor: '#0d0d0d', padding: '20px' }}>
              {photos.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <img src={photos[activePhoto]} alt={build.title}
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', border: '1px solid #003300', display: 'block' }} />
                  {photos.length > 1 && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {photos.map((src, i) => (
                        <img key={i} src={src} alt={`thumb-${i}`}
                          onClick={() => setExpandedPhotos(prev => ({ ...prev, [build.id]: i }))}
                          style={{ width: '48px', height: '36px', objectFit: 'cover', cursor: 'pointer',
                            border: `1px solid ${activePhoto === i ? '#00ff00' : '#003300'}`,
                            opacity: activePhoto === i ? 1 : 0.6 }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>&gt; {build.title}</div>
                {owner && (
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '10px' }}>
                    <button onClick={() => openEditForm(build)}
                      style={{ backgroundColor: '#111', color: '#ffff00', border: '1px solid #666600', padding: '3px 8px', fontSize: '11px', cursor: 'pointer', fontFamily: '"Courier New", monospace' }}>
                      EDIT
                    </button>
                    <button onClick={() => handleDelete(build.id)}
                      style={{ backgroundColor: '#111', color: '#ff4444', border: '1px solid #ff4444', padding: '3px 8px', fontSize: '11px', cursor: 'pointer', fontFamily: '"Courier New", monospace' }}>
                      DEL
                    </button>
                  </div>
                )}
              </div>

              <div style={{ fontSize: '11px', color: '#006600', marginBottom: '14px' }}>
                posted by {build.author} · {new Date(build.created_at).toLocaleDateString()}
              </div>

              <div style={{ fontSize: '12px', color: '#009900', marginBottom: '14px', lineHeight: '1.8' }}>
                {parts.cpu && <div>CPU: <span style={{ color: '#00ff00' }}>{parts.cpu}</span></div>}
                {parts.gpu && <div>GPU: <span style={{ color: '#00ff00' }}>{parts.gpu}</span></div>}
                {parts.motherboard && <div>MOBO: <span style={{ color: '#00ff00' }}>{parts.motherboard}</span></div>}
                {parts.ram && <div>RAM: <span style={{ color: '#00ff00' }}>{parts.ram}</span></div>}
                {parts.storage && <div>STORAGE: <span style={{ color: '#00ff00' }}>{parts.storage}</span></div>}
                {parts.psu && <div>PSU: <span style={{ color: '#00ff00' }}>{parts.psu}</span></div>}
                {parts.case && <div>CASE: <span style={{ color: '#00ff00' }}>{parts.case}</span></div>}
              </div>

              {build.description && (
                <div style={{ fontSize: '13px', color: '#009900', marginBottom: '14px', borderLeft: '2px solid #003300', paddingLeft: '10px' }}>
                  {build.description}
                </div>
              )}

              {parts.partLink && (
                <a href={parts.partLink} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', fontSize: '12px', color: '#ffff00', textDecoration: 'none', marginBottom: '16px', border: '1px solid #666600', padding: '4px 10px' }}>
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

      <footer style={{ borderTop: '2px solid #00ff00', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#006600', backgroundColor: '#111' }}>
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
        <span>GAMER&apos;S CONCLAVE &copy; 2025 — BUILT WITH PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}