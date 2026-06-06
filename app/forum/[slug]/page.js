'use client';
import { useState, useEffect } from 'react';
import { useAuth, useUser, useClerk } from '@clerk/nextjs';
import { supabase } from '../../../lib/supabase';
import { checkContent } from '../../../lib/wordFilter';

const containerStyle = { maxWidth:'1400px', margin:'0 auto', padding:'0 20px', width:'100%', boxSizing:'border-box' };

const CATEGORY_ICONS = {
  'introductions':        '👋',
  'general':              '💬',
  'build-discussions':    '🖥️',
  'troubleshooting-help': '🔧',
  'new-tech-hardware':    '⚙️',
};

export default function CategoryPage({ params }) {
  const { slug } = params;
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [category, setCategory]     = useState(null);
  const [threads, setThreads]       = useState([]);
  const [postCounts, setPostCounts] = useState({});
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);

  // new thread form
  const [showForm, setShowForm]     = useState(false);
  const [newTitle, setNewTitle]     = useState('');
  const [newBody, setNewBody]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState('');

  useEffect(() => { fetchCategory(); }, [slug]);

  const fetchCategory = async () => {
    setLoading(true);

    const { data: cat } = await supabase
      .from('forum_categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!cat) { setNotFound(true); setLoading(false); return; }
    setCategory(cat);

    const { data: threadRows } = await supabase
      .from('forum_threads')
      .select('id, title, user_id, pinned, locked, created_at, updated_at')
      .eq('category_id', cat.id)
      .order('pinned', { ascending: false })
      .order('updated_at', { ascending: false });

    const threads = threadRows || [];
    setThreads(threads);

    if (threads.length > 0) {
      const threadIds = threads.map(t => t.id);
      const { data: posts } = await supabase
        .from('forum_posts')
        .select('id, thread_id')
        .in('thread_id', threadIds);

      const counts = {};
      (posts || []).forEach(p => {
        counts[p.thread_id] = (counts[p.thread_id] || 0) + 1;
      });
      setPostCounts(counts);
    }

    setLoading(false);
  };

  const handleSubmitThread = async () => {
    if (!newTitle.trim()) { setFormError('Thread title is required.'); return; }
    if (!newBody.trim())  { setFormError('Opening post body is required.'); return; }

    const titleCheck = checkContent(newTitle, 'Title');
    if (titleCheck) { setFormError(titleCheck); return; }

    const bodyCheck = checkContent(newBody, 'Post');
    if (bodyCheck) { setFormError(bodyCheck); return; }

    setSubmitting(true);
    setFormError('');

    const { data: thread, error: threadErr } = await supabase
      .from('forum_threads')
      .insert({ category_id: category.id, user_id: user.id, title: newTitle.trim(), pinned: false, locked: false })
      .select()
      .single();

    if (threadErr || !thread) {
      setFormError('Failed to create thread. Try again.');
      setSubmitting(false);
      return;
    }

    const { error: postErr } = await supabase
      .from('forum_posts')
      .insert({ thread_id: thread.id, user_id: user.id, body: newBody.trim() });

    if (postErr) {
      setFormError('Thread created but failed to save post.');
      setSubmitting(false);
      return;
    }

    setNewTitle('');
    setNewBody('');
    setShowForm(false);
    setSubmitting(false);
    fetchCategory();
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  };

  const icon = CATEGORY_ICONS[slug] || '📁';

  return (
    <main style={{ backgroundColor:'#0a0a0a', minHeight:'100vh', fontFamily:'"Courier New", Courier, monospace', color:'#00ff00' }}>

      

      {/* BREADCRUMB + HEADER */}
      <div style={{ borderBottom:'1px solid #003300' }}>
        <div style={{ ...containerStyle, padding:'40px 20px 20px' }}>
          <div style={{ fontSize:'11px', color:'#006600', marginBottom:'8px' }}>
            <a href="/forum" style={{ color:'#006600', textDecoration:'none' }}>FORUM</a>
            <span style={{ margin:'0 8px' }}>&gt;</span>
            <span style={{ color:'#009900' }}>{category ? category.name.toUpperCase() : slug.toUpperCase()}</span>
          </div>
          {category && (
            <>
              <h1 style={{ fontSize:'28px', margin:'0 0 8px', letterSpacing:'3px', display:'flex', alignItems:'center', gap:'12px' }}>
                <span>{icon}</span> {category.name.toUpperCase()}
              </h1>
              <p style={{ fontSize:'13px', color:'#009900', margin:0 }}>{category.description}</p>
            </>
          )}
        </div>
      </div>

      <div style={{ ...containerStyle, padding:'30px 20px' }}>

        {/* NEW THREAD BUTTON / FORM */}
        {isSignedIn && !loading && !notFound && (
          <div style={{ marginBottom:'24px' }}>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                style={{ background:'none', border:'1px solid #00ff00', color:'#00ff00', fontFamily:'"Courier New", monospace', fontSize:'13px', cursor:'pointer', padding:'8px 20px', letterSpacing:'1px' }}>
                [ + NEW THREAD ]
              </button>
            ) : (
              <div style={{ border:'1px solid #00ff00', backgroundColor:'#0d0d0d', padding:'20px', maxWidth:'700px' }}>
                <div style={{ fontSize:'12px', color:'#006600', marginBottom:'14px', letterSpacing:'1px' }}>&gt; CREATE NEW THREAD</div>

                <div style={{ marginBottom:'12px' }}>
                  <div style={{ fontSize:'11px', color:'#006600', marginBottom:'4px' }}>TITLE</div>
                  <input
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    maxLength={200}
                    placeholder="Thread title..."
                    style={{ width:'100%', backgroundColor:'#0a0a0a', border:'1px solid #003300', color:'#00ff00', fontFamily:'"Courier New", monospace', fontSize:'14px', padding:'8px 10px', boxSizing:'border-box', outline:'none' }}
                    onFocus={e  => e.target.style.borderColor = '#00ff00'}
                    onBlur={e   => e.target.style.borderColor = '#003300'}
                  />
                </div>

                <div style={{ marginBottom:'14px' }}>
                  <div style={{ fontSize:'11px', color:'#006600', marginBottom:'4px' }}>OPENING POST</div>
                  <textarea
                    value={newBody}
                    onChange={e => setNewBody(e.target.value)}
                    placeholder="Write your post..."
                    rows={6}
                    style={{ width:'100%', backgroundColor:'#0a0a0a', border:'1px solid #003300', color:'#00ff00', fontFamily:'"Courier New", monospace', fontSize:'13px', padding:'8px 10px', boxSizing:'border-box', resize:'vertical', outline:'none' }}
                    onFocus={e => e.target.style.borderColor = '#00ff00'}
                    onBlur={e  => e.target.style.borderColor = '#003300'}
                  />
                </div>

                {formError && (
                  <div style={{ fontSize:'12px', color:'#ff4444', marginBottom:'12px' }}>&gt; ERROR: {formError}</div>
                )}

                <div style={{ display:'flex', gap:'10px' }}>
                  <button
                    onClick={handleSubmitThread}
                    disabled={submitting}
                    style={{ background:'none', border:'1px solid #00ff00', color:'#00ff00', fontFamily:'"Courier New", monospace', fontSize:'13px', cursor: submitting ? 'not-allowed' : 'pointer', padding:'8px 20px', opacity: submitting ? 0.5 : 1 }}>
                    {submitting ? '[ POSTING... ]' : '[ POST THREAD ]'}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setFormError(''); setNewTitle(''); setNewBody(''); }}
                    style={{ background:'none', border:'1px solid #444', color:'#666', fontFamily:'"Courier New", monospace', fontSize:'13px', cursor:'pointer', padding:'8px 20px' }}>
                    [ CANCEL ]
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STATES */}
        {loading && <div style={{ color:'#006600', fontSize:'14px' }}>&gt; LOADING THREADS..._</div>}

        {notFound && (
          <div style={{ color:'#ff4444', fontSize:'14px' }}>
            &gt; CATEGORY NOT FOUND. <a href="/forum" style={{ color:'#00ff00' }}>BACK TO FORUM</a>
          </div>
        )}

        {/* THREAD LIST */}
        {!loading && !notFound && (
          <>
            {threads.length === 0 ? (
              <div style={{ border:'1px solid #002200', padding:'30px', color:'#006600', fontSize:'13px', textAlign:'center' }}>
                &gt; NO THREADS YET. {isSignedIn ? 'BE THE FIRST TO POST.' : <><a href="/sign-in" style={{ color:'#00ff00' }}>SIGN IN</a> TO START A THREAD.</>}
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>

                {/* TABLE HEADER */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 70px 90px', gap:'10px', padding:'8px 16px', fontSize:'10px', color:'#004400', letterSpacing:'1px', borderBottom:'1px solid #002200' }}>
                  <div>THREAD</div>
                  <div style={{ textAlign:'center' }}>REPLIES</div>
                  <div style={{ textAlign:'right' }}>LAST ACTIVITY</div>
                </div>

                {threads.map(thread => {
                  const replies = (postCounts[thread.id] || 1) - 1;
                  return (
                    <a key={thread.id} href={`/forum/${slug}/${thread.id}`} style={{ textDecoration:'none' }}>
                      <div
                        style={{ display:'grid', gridTemplateColumns:'1fr 70px 90px', gap:'10px', padding:'14px 16px', border:'1px solid #002200', backgroundColor:'#0d0d0d', alignItems:'center', cursor:'pointer', transition:'border-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#00ff00'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#002200'}>

                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                            {thread.pinned && <span style={{ fontSize:'10px', color:'#ffff00', border:'1px solid #ffff00', padding:'1px 5px', letterSpacing:'1px' }}>📌 PINNED</span>}
                            {thread.locked && <span style={{ fontSize:'10px', color:'#ff4444', border:'1px solid #ff4444', padding:'1px 5px', letterSpacing:'1px' }}>🔒 LOCKED</span>}
                            <span style={{ fontSize:'15px', fontWeight:'bold', color:'#00ff00', letterSpacing:'0.5px' }}>{thread.title}</span>
                          </div>
                          <div style={{ fontSize:'11px', color:'#005500' }}>
                            by {thread.user_id.slice(0, 8)}... &nbsp;·&nbsp; {formatDate(thread.created_at)}
                          </div>
                        </div>

                        <div style={{ textAlign:'center', fontSize:'16px', fontWeight:'bold', color:'#009900' }}>
                          {replies < 0 ? 0 : replies}
                        </div>
                        <div style={{ textAlign:'right', fontSize:'11px', color:'#006600' }}>
                          {formatDate(thread.updated_at)}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* SIGN IN PROMPT */}
        {!isSignedIn && !loading && !notFound && (
          <div style={{ marginTop:'24px', border:'1px solid #003300', padding:'20px', backgroundColor:'#0d0d0d', maxWidth:'500px' }}>
            <div style={{ fontSize:'13px', color:'#009900', marginBottom:'12px' }}>
              &gt; Sign in to create threads and reply to posts.
            </div>
            <a href="/sign-in" style={{ color:'#00ff00', fontSize:'13px', textDecoration:'none', border:'1px solid #00ff00', padding:'8px 20px', display:'inline-block', letterSpacing:'1px' }}>
              [ SIGN IN ]
            </a>
          </div>
        )}
      </div>

      <footer style={{ borderTop:'2px solid #00ff00', padding:'20px 0', textAlign:'center', fontSize:'12px', color:'#006600', backgroundColor:'#111' }}>
        <a href="/donate" style={{ color:'#ffff00', textDecoration:'none', marginRight:'20px' }}>[ DONATE ]</a>
        <span>GAMER&apos;S CONCLAVE &copy; 2025 — BUILT FOR PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}