'use client';
import { useState, useEffect } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/nextjs';
import { supabase } from '../../../lib/supabase';

const containerStyle = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 20px',
  width: '100%',
  boxSizing: 'border-box',
};

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

export default function ProfilePage({ params }) {
  const { userId } = params;
  const { user: currentUser } = useUser();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const [profile, setProfile]                 = useState(null);
  const [builds, setBuilds]                   = useState([]);
  const [forumPosts, setForumPosts]           = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [isOwner, setIsOwner]                 = useState(false);
  const [editing, setEditing]                 = useState(false);
  const [saving, setSaving]                   = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saved, setSaved]                     = useState(false);
  const [editForm, setEditForm]               = useState({ username: '', bio: '', avatar_url: '' });
  const [expandedPhotos, setExpandedPhotos]   = useState({});

  useEffect(() => { fetchProfile(); fetchBuilds(); fetchForumPosts(); }, [userId]);
  useEffect(() => {
    if (currentUser && userId === currentUser.id) setIsOwner(true);
  }, [currentUser, userId]);

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    if (data) {
      setProfile(data);
      setEditForm({ username: data.username || '', bio: data.bio || '', avatar_url: data.avatar_url || '' });
    } else {
      setProfile({ user_id: userId, username: 'Unknown User', bio: '', avatar_url: '' });
    }
    setLoading(false);
  };

  const fetchBuilds = async () => {
    const { data } = await supabase.from('builds').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setBuilds(data || []);
  };

  const fetchForumPosts = async () => {
    // get all posts by this user
    const { data: posts } = await supabase
      .from('forum_posts')
      .select('id, body, created_at, thread_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!posts || posts.length === 0) { setForumPosts([]); return; }

    // get thread info for each post
    const threadIds = [...new Set(posts.map(p => p.thread_id))];
    const { data: threads } = await supabase
      .from('forum_threads')
      .select('id, title, category_id')
      .in('id', threadIds);

    // get category slugs
    const categoryIds = [...new Set((threads || []).map(t => t.category_id))];
    const { data: categories } = await supabase
      .from('forum_categories')
      .select('id, slug')
      .in('id', categoryIds);

    const catMap = {};
    (categories || []).forEach(c => { catMap[c.id] = c.slug; });

    const threadMap = {};
    (threads || []).forEach(t => { threadMap[t.id] = { ...t, slug: catMap[t.category_id] }; });

    const enriched = posts.map(p => ({
      ...p,
      thread: threadMap[p.thread_id] || null,
    }));

    setForumPosts(enriched);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/gif','image/webp'].includes(file.type)) { alert('Images only.'); return; }
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setEditForm(p => ({ ...p, avatar_url: url }));
    } catch { alert('Upload failed.'); }
    setUploadingAvatar(false);
  };

  const handleSave = async () => {
    if (!editForm.username.trim()) { alert('Username cannot be empty.'); return; }
    setSaving(true);
    const { error } = await supabase.from('profiles').upsert(
      { user_id: userId, username: editForm.username.trim(), bio: editForm.bio.trim(), avatar_url: editForm.avatar_url },
      { onConflict: 'user_id' }
    );
    if (!error) {
      setProfile(p => ({ ...p, ...editForm }));
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else { alert('Failed to save.'); }
    setSaving(false);
  };

  const totalReactions = builds.reduce((sum, b) =>
    sum + Object.values(b.reactions || {}).reduce((a, v) => a + v, 0), 0);

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: '"Courier New", Courier, monospace', color: '#00ff00' }}>

      {loading ? (
        <div style={{ ...containerStyle, padding: '60px 20px', color: '#006600' }}>&gt; LOADING PROFILE..._</div>
      ) : (
        <>
          {/* HEADER */}
          <div style={{ borderBottom: '1px solid #003300' }}>
            <div style={{ ...containerStyle, padding: '40px 20px' }}>
              <div style={{ fontSize: '11px', color: '#006600', marginBottom: '6px' }}>&#9608;&#9608; MEMBER PROFILE &#9608;&#9608;</div>

              {saved && (
                <div style={{ backgroundColor: '#003300', border: '1px solid #00ff00', color: '#00ff00', padding: '10px 16px', fontSize: '12px', marginBottom: '16px' }}>
                  ✓ PROFILE SAVED SUCCESSFULLY
                </div>
              )}

              <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* AVATAR */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: '120px', height: '120px', border: '2px solid #00ff00', backgroundColor: '#0d0d0d', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {(editing ? editForm.avatar_url : profile?.avatar_url)
                      ? <img src={editing ? editForm.avatar_url : profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ fontSize: '48px', color: '#003300' }}>&#9608;</div>
                    }
                    {uploadingAvatar && (
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#00ff00' }}>
                        UPLOADING...
                      </div>
                    )}
                  </div>
                  {isOwner && editing && (
                    <label style={{ display: 'block', marginTop: '8px', fontSize: '11px', color: '#006600', cursor: 'pointer', border: '1px solid #003300', padding: '4px 8px', textAlign: 'center' }}>
                      [ CHANGE PHOTO ]
                      <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>

                {/* INFO */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  {editing ? (
                    <div style={{ maxWidth: '500px' }}>
                      <label style={labelStyle}>USERNAME</label>
                      <input style={inputStyle} value={editForm.username} onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))} placeholder="Your display name" maxLength={40} />
                      <label style={labelStyle}>BIO</label>
                      <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={editForm.bio} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell the conclave about yourself..." maxLength={300} />
                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        <button onClick={handleSave} disabled={saving || uploadingAvatar}
                          style={{ backgroundColor: saving ? '#006600' : '#00ff00', color: '#000', border: 'none', padding: '8px 20px', fontSize: '13px', fontFamily: '"Courier New", monospace', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: '1px' }}>
                          {saving ? '[ SAVING... ]' : '[ SAVE PROFILE ]'}
                        </button>
                        <button onClick={() => { setEditing(false); setEditForm({ username: profile.username||'', bio: profile.bio||'', avatar_url: profile.avatar_url||'' }); }}
                          style={{ backgroundColor: '#111', color: '#ff4444', border: '1px solid #ff4444', padding: '8px 16px', fontSize: '13px', fontFamily: '"Courier New", monospace', cursor: 'pointer' }}>
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 style={{ fontSize: '28px', margin: '0 0 6px', letterSpacing: '2px' }}>&gt; {profile?.username || 'UNKNOWN USER'}</h1>
                      <div style={{ fontSize: '11px', color: '#006600', marginBottom: '14px', letterSpacing: '1px' }}>
                        MEMBER SINCE {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                      </div>
                      {profile?.bio
                        ? <div style={{ fontSize: '13px', color: '#009900', borderLeft: '2px solid #003300', paddingLeft: '12px', marginBottom: '16px', maxWidth: '500px', lineHeight: '1.6' }}>{profile.bio}</div>
                        : <div style={{ fontSize: '13px', color: '#004400', marginBottom: '16px' }}>{isOwner ? '> Add a bio to let the conclave know who you are._' : 'No bio yet.'}</div>
                      }
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {[
                          { label: 'BUILDS', value: builds.length },
                          { label: 'REACTIONS RECEIVED', value: totalReactions },
                          { label: 'FORUM POSTS', value: forumPosts.length },
                        ].map(s => (
                          <div key={s.label} style={{ border: '1px solid #003300', padding: '10px 20px', backgroundColor: '#0d0d0d', textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{s.value}</div>
                            <div style={{ fontSize: '10px', color: '#006600', letterSpacing: '1px' }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                      {isOwner && (
                        <button onClick={() => setEditing(true)}
                          style={{ backgroundColor: '#111', color: '#00ff00', border: '1px solid #00ff00', padding: '7px 18px', fontSize: '12px', fontFamily: '"Courier New", monospace', cursor: 'pointer', letterSpacing: '1px' }}>
                          [ EDIT PROFILE ]
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* BUILDS */}
          <div style={{ borderBottom: '1px solid #003300' }}>
            <div style={{ ...containerStyle, padding: '40px 20px' }}>
              <div style={{ fontSize: '11px', color: '#006600', marginBottom: '4px' }}>&#9608;&#9608; SUBMITTED BUILDS &#9608;&#9608;</div>
              <h2 style={{ fontSize: '24px', margin: '0 0 24px', letterSpacing: '2px' }}>
                {isOwner ? 'MY BUILDS' : `${(profile?.username || 'THEIR').toUpperCase()} BUILDS`}
              </h2>

              {builds.length === 0 ? (
                <div style={{ border: '1px solid #003300', padding: '30px', backgroundColor: '#0d0d0d', maxWidth: '420px' }}>
                  <div style={{ color: '#006600', fontSize: '14px', marginBottom: isOwner ? '16px' : '0' }}>&gt; NO BUILDS POSTED YET_</div>
                  {isOwner && (
                    <a href="/builds" style={{ color: '#00ff00', fontSize: '13px', textDecoration: 'none', border: '1px solid #00ff00', padding: '8px 20px', display: 'inline-block', letterSpacing: '1px' }}>
                      [ POST YOUR FIRST BUILD ]
                    </a>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {builds.map(build => {
                    const parts = build.parts ? JSON.parse(build.parts) : {};
                    const photos = parts.photos || (parts.photo ? [parts.photo] : []);
                    const activePhoto = expandedPhotos[build.id] || 0;
                    const totalR = Object.values(build.reactions || {}).reduce((a, b) => a + b, 0);
                    return (
                      <div key={build.id} style={{ border: '1px solid #00ff00', backgroundColor: '#0d0d0d', padding: '18px' }}>
                        {photos.length > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <img src={photos[activePhoto]} alt={build.title} style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', border: '1px solid #003300', display: 'block' }} />
                            {photos.length > 1 && (
                              <div style={{ display: 'flex', gap: '4px', marginTop: '5px' }}>
                                {photos.map((src, i) => (
                                  <img key={i} src={src} alt="" onClick={() => setExpandedPhotos(p => ({ ...p, [build.id]: i }))}
                                    style={{ width: '40px', height: '30px', objectFit: 'cover', cursor: 'pointer', border: `1px solid ${activePhoto === i ? '#00ff00' : '#003300'}`, opacity: activePhoto === i ? 1 : 0.5 }} />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        <div style={{ fontSize: '17px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>&gt; {build.title}</div>
                        <div style={{ fontSize: '11px', color: '#006600', marginBottom: '10px' }}>
                          {new Date(build.created_at).toLocaleDateString()} · {totalR} reaction{totalR !== 1 ? 's' : ''}
                        </div>
                        <div style={{ fontSize: '12px', color: '#009900', lineHeight: '1.8', marginBottom: '10px' }}>
                          {parts.cpu && <div>CPU: <span style={{ color: '#00ff00' }}>{parts.cpu}</span></div>}
                          {parts.gpu && <div>GPU: <span style={{ color: '#00ff00' }}>{parts.gpu}</span></div>}
                          {parts.ram && <div>RAM: <span style={{ color: '#00ff00' }}>{parts.ram}</span></div>}
                        </div>
                        {build.description && (
                          <div style={{ fontSize: '12px', color: '#009900', borderLeft: '2px solid #003300', paddingLeft: '8px', marginBottom: '12px', lineHeight: '1.5' }}>
                            {build.description.length > 120 ? build.description.slice(0, 120) + '…' : build.description}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <a href="/builds" style={{ fontSize: '12px', color: '#ffff00', textDecoration: 'none', border: '1px solid #666600', padding: '4px 10px' }}>[ VIEW IN BUILDS ]</a>
                          {parts.partLink && (
                            <a href={parts.partLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#009900', textDecoration: 'none', border: '1px solid #003300', padding: '4px 10px' }}>[ PARTS LIST ]</a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* FORUM POSTS */}
          <div style={{ borderBottom: '1px solid #003300' }}>
            <div style={{ ...containerStyle, padding: '40px 20px' }}>
              <div style={{ fontSize: '11px', color: '#006600', marginBottom: '4px' }}>&#9608;&#9608; FORUM ACTIVITY &#9608;&#9608;</div>
              <h2 style={{ fontSize: '24px', margin: '0 0 16px', letterSpacing: '2px' }}>FORUM POSTS</h2>

              {forumPosts.length === 0 ? (
                <div style={{ border: '1px solid #003300', padding: '24px', backgroundColor: '#0d0d0d', maxWidth: '500px', color: '#006600', fontSize: '13px' }}>
                  &gt; NO FORUM POSTS YET_
                  {isOwner && (
                    <div style={{ marginTop: '12px' }}>
                      <a href="/forum" style={{ color: '#00ff00', textDecoration: 'none', border: '1px solid #00ff00', padding: '6px 16px', display: 'inline-block', letterSpacing: '1px', fontSize: '12px' }}>
                        [ GO TO FORUM ]
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '800px' }}>
                  {forumPosts.map(post => (
                    <a
                      key={post.id}
                      href={post.thread?.slug ? `/forum/${post.thread.slug}/${post.thread_id}` : '/forum'}
                      style={{ textDecoration: 'none' }}>
                      <div
                        style={{ border: '1px solid #002200', backgroundColor: '#0d0d0d', padding: '14px 16px', transition: 'border-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#00ff00'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#002200'}>
                        <div style={{ fontSize: '12px', color: '#006600', marginBottom: '6px', letterSpacing: '0.5px' }}>
                          THREAD: <span style={{ color: '#009900' }}>{post.thread?.title || 'Unknown Thread'}</span>
                          <span style={{ margin: '0 8px', color: '#003300' }}>·</span>
                          <span style={{ color: '#005500' }}>{formatDate(post.created_at)}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#00cc00', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {post.body.length > 200 ? post.body.slice(0, 200) + '…' : post.body}
                        </div>
                      </div>
                    </a>
                  ))}
                  <a href="/forum" style={{ fontSize: '12px', color: '#006600', textDecoration: 'none', letterSpacing: '1px', marginTop: '8px' }}>&gt; GO TO FORUM →</a>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <footer style={{ borderTop: '2px solid #00ff00', padding: '20px 0', textAlign: 'center', fontSize: '12px', color: '#006600', backgroundColor: '#111' }}>
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
        <span>GAMER&apos;S CONCLAVE &copy; 2025 — BUILT FOR PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}