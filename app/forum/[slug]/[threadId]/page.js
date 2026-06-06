'use client';
import { checkContent } from '../../../../lib/wordFilter';
import { useState, useEffect, useRef } from 'react';
import { useAuth, useUser, useClerk } from '@clerk/nextjs';
import { supabase } from '../../../../lib/supabase';

const containerStyle = { maxWidth:'1400px', margin:'0 auto', padding:'0 20px', width:'100%', boxSizing:'border-box' };

export default function ThreadPage({ params }) {
  const { slug, threadId } = params;
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [category, setCategory]   = useState(null);
  const [thread, setThread]       = useState(null);
  const [posts, setPosts]         = useState([]);
  const [profiles, setProfiles]   = useState({}); // { user_id: { username, avatar_url } }
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);

  // reply form
  const [replyBody, setReplyBody]     = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [replyError, setReplyError]   = useState('');

  // edit state
  const [editingPostId, setEditingPostId] = useState(null);
  const [editBody, setEditBody]           = useState('');
  const [editError, setEditError]         = useState('');

  const bottomRef = useRef(null);

  useEffect(() => { fetchThread(); }, [threadId, slug]);

  const fetchThread = async () => {
    setLoading(true);

    // get category
    const { data: cat } = await supabase
      .from('forum_categories')
      .select('id, name, slug')
      .eq('slug', slug)
      .single();

    if (!cat) { setNotFound(true); setLoading(false); return; }
    setCategory(cat);

    // get thread
    const { data: th } = await supabase
      .from('forum_threads')
      .select('*')
      .eq('id', threadId)
      .eq('category_id', cat.id)
      .single();

    if (!th) { setNotFound(true); setLoading(false); return; }
    setThread(th);

    // get posts
    const { data: postRows } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    const posts = postRows || [];
    setPosts(posts);

    // fetch profiles for all unique user_ids
    const userIds = [...new Set([th.user_id, ...posts.map(p => p.user_id)])];
    const { data: profileRows } = await supabase
      .from('profiles')
      .select('user_id, username, avatar_url')
      .in('user_id', userIds);

    const profileMap = {};
    (profileRows || []).forEach(p => { profileMap[p.user_id] = p; });
    setProfiles(profileMap);

    setLoading(false);
  };

  const getUsername = (userId) => {
    const p = profiles[userId];
    if (p?.username) return p.username;
    return userId.slice(0, 10) + '...';
  };

  const handleReply = async () => {
  if (!replyBody.trim()) { setReplyError('Reply cannot be empty.'); return; }

  const bodyCheck = checkContent(replyBody, 'Reply');
  if (bodyCheck) { setReplyError(bodyCheck); return; }

  setSubmitting(true);
  setReplyError('');

  const { error } = await supabase
    .from('forum_posts')
    .insert({ thread_id: threadId, user_id: user.id, body: replyBody.trim() });

  if (error) {
    setReplyError('Failed to post reply. Try again.');
    setSubmitting(false);
    return;
  }

  await supabase
    .from('forum_threads')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', threadId);

  setReplyBody('');
  setSubmitting(false);
  await fetchThread();
  setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
};

  const handleStartEdit = (post) => {
    setEditingPostId(post.id);
    setEditBody(post.body);
    setEditError('');
  };

 const handleSaveEdit = async (postId) => {
  if (!editBody.trim()) { setEditError('Post cannot be empty.'); return; }

  const bodyCheck = checkContent(editBody, 'Post');
  if (bodyCheck) { setEditError(bodyCheck); return; }

  const { error } = await supabase
    .from('forum_posts')
    .update({ body: editBody.trim(), updated_at: new Date().toISOString() })
    .eq('id', postId)
    .eq('user_id', user.id);

  if (error) { setEditError('Failed to save edit.'); return; }
  setEditingPostId(null);
  fetchThread();
};

  const handleDeletePost = async (postId) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('forum_posts').delete().eq('id', postId).eq('user_id', user.id);
    fetchThread();
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) + ' ' +
           d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
  };

  const isLocked = thread?.locked;

  return (
    <main style={{ backgroundColor:'#0a0a0a', minHeight:'100vh', fontFamily:'"Courier New", Courier, monospace', color:'#00ff00' }}>

      {/* NAV */}
      <nav style={{ backgroundColor:'#111', borderBottom:'2px solid #00ff00', padding:'10px 0', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ ...containerStyle, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
          <a href="/" style={{ fontSize:'22px', fontWeight:'bold', letterSpacing:'2px', color:'#00ff00', textDecoration:'none' }}>&#9608; GAMER&apos;S CONCLAVE</a>
          <div style={{ display:'flex', gap:'12px', fontSize:'13px', flexWrap:'wrap', alignItems:'center' }}>
            <a href="/builds"  style={{ color:'#00ff00', textDecoration:'none' }}>[ BUILDS ]</a>
            <a href="/forum"   style={{ color:'#00ff00', textDecoration:'none' }}>[ FORUM ]</a>
            <a href="/games"   style={{ color:'#00ff00', textDecoration:'none' }}>[ FLASH GAMES ]</a>
            <a href="/doom"    style={{ color:'#ff4444', textDecoration:'none' }}>[ DOOM ]</a>
            <a href="/vote"    style={{ color:'#00ff00', textDecoration:'none' }}>[ VOTE ]</a>
            <a href="/ideas"   style={{ color:'#00ff00', textDecoration:'none' }}>[ IDEAS ]</a>
            <a href="/donate"  style={{ color:'#ffff00', textDecoration:'none' }}>[ DONATE ]</a>
            {isSignedIn
              ? <button onClick={() => signOut({ redirectUrl: '/' })} style={{ background:'none', border:'1px solid #ff4444', color:'#ff4444', fontFamily:'"Courier New", monospace', fontSize:'13px', cursor:'pointer', padding:'2px 8px' }}>[ SIGN OUT ]</button>
              : <a href="/sign-in" style={{ color:'#00ff00', textDecoration:'none' }}>[ SIGN IN ]</a>
            }
          </div>
        </div>
      </nav>

      {/* BREADCRUMB + HEADER */}
      <div style={{ borderBottom:'1px solid #003300' }}>
        <div style={{ ...containerStyle, padding:'30px 20px 20px' }}>
          <div style={{ fontSize:'11px', color:'#006600', marginBottom:'10px' }}>
            <a href="/forum"           style={{ color:'#006600', textDecoration:'none' }}>FORUM</a>
            <span style={{ margin:'0 8px' }}>&gt;</span>
            <a href={`/forum/${slug}`} style={{ color:'#006600', textDecoration:'none' }}>{category?.name?.toUpperCase() || slug.toUpperCase()}</a>
            <span style={{ margin:'0 8px' }}>&gt;</span>
            <span style={{ color:'#009900' }}>{thread ? thread.title.toUpperCase() : '...'}</span>
          </div>

          {thread && (
            <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
              <h1 style={{ fontSize:'22px', margin:0, letterSpacing:'2px', color:'#00ff00' }}>{thread.title}</h1>
              {thread.pinned && <span style={{ fontSize:'10px', color:'#ffff00', border:'1px solid #ffff00', padding:'2px 7px', letterSpacing:'1px' }}>📌 PINNED</span>}
              {thread.locked && <span style={{ fontSize:'10px', color:'#ff4444', border:'1px solid #ff4444', padding:'2px 7px', letterSpacing:'1px' }}>🔒 LOCKED</span>}
            </div>
          )}
        </div>
      </div>

      <div style={{ ...containerStyle, padding:'30px 20px' }}>

        {/* STATES */}
        {loading && <div style={{ color:'#006600', fontSize:'14px' }}>&gt; LOADING THREAD..._</div>}

        {notFound && (
          <div style={{ color:'#ff4444', fontSize:'14px' }}>
            &gt; THREAD NOT FOUND. <a href={`/forum/${slug}`} style={{ color:'#00ff00' }}>BACK TO CATEGORY</a>
          </div>
        )}

        {/* POSTS */}
        {!loading && !notFound && (
          <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>

            {posts.map((post, index) => {
              const isOp        = index === 0;
              const isOwner     = isSignedIn && user?.id === post.user_id;
              const isEditing   = editingPostId === post.id;
              const wasEdited   = post.updated_at && post.updated_at !== post.created_at;

              return (
                <div key={post.id} style={{ border:`1px solid ${isOp ? '#005500' : '#002200'}`, backgroundColor: isOp ? '#0c0f0c' : '#0d0d0d', padding:'20px' }}>

                  {/* POST HEADER */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px', flexWrap:'wrap', gap:'8px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      {/* avatar placeholder */}
                      <div style={{ width:'32px', height:'32px', border:`1px solid ${isOp ? '#00ff00' : '#003300'}`, backgroundColor:'#111', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>
                        {profiles[post.user_id]?.avatar_url
                          ? <img src={profiles[post.user_id].avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                          : '👤'
                        }
                      </div>
                      <div>
                        <a href={`/profile/${post.user_id}`} style={{ color: isOp ? '#00ff00' : '#009900', textDecoration:'none', fontSize:'13px', fontWeight:'bold', letterSpacing:'0.5px' }}>
                          {getUsername(post.user_id)}
                        </a>
                        {isOp && <span style={{ marginLeft:'8px', fontSize:'10px', color:'#006600', border:'1px solid #004400', padding:'1px 5px' }}>OP</span>}
                      </div>
                    </div>
                    <div style={{ fontSize:'11px', color:'#005500', textAlign:'right' }}>
                      <div>#{index + 1} &nbsp;·&nbsp; {formatDate(post.created_at)}</div>
                      {wasEdited && <div style={{ color:'#004400' }}>edited {formatDate(post.updated_at)}</div>}
                    </div>
                  </div>

                  {/* POST BODY */}
                  {isEditing ? (
                    <div>
                      <textarea
                        value={editBody}
                        onChange={e => setEditBody(e.target.value)}
                        rows={5}
                        style={{ width:'100%', backgroundColor:'#0a0a0a', border:'1px solid #00ff00', color:'#00ff00', fontFamily:'"Courier New", monospace', fontSize:'13px', padding:'8px 10px', boxSizing:'border-box', resize:'vertical', outline:'none' }}
                      />
                      {editError && <div style={{ fontSize:'12px', color:'#ff4444', margin:'6px 0' }}>&gt; {editError}</div>}
                      <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
                        <button onClick={() => handleSaveEdit(post.id)} style={{ background:'none', border:'1px solid #00ff00', color:'#00ff00', fontFamily:'"Courier New", monospace', fontSize:'12px', cursor:'pointer', padding:'5px 14px' }}>[ SAVE ]</button>
                        <button onClick={() => { setEditingPostId(null); setEditError(''); }} style={{ background:'none', border:'1px solid #444', color:'#666', fontFamily:'"Courier New", monospace', fontSize:'12px', cursor:'pointer', padding:'5px 14px' }}>[ CANCEL ]</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize:'14px', color:'#00dd00', lineHeight:'1.7', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
                      {post.body}
                    </div>
                  )}

                  {/* OWNER ACTIONS */}
                  {isOwner && !isEditing && !isLocked && (
                    <div style={{ display:'flex', gap:'10px', marginTop:'12px', paddingTop:'10px', borderTop:'1px solid #002200' }}>
                      <button onClick={() => handleStartEdit(post)} style={{ background:'none', border:'none', color:'#006600', fontFamily:'"Courier New", monospace', fontSize:'11px', cursor:'pointer', padding:0 }}>[ EDIT ]</button>
                      {!isOp && (
                        <button onClick={() => handleDeletePost(post.id)} style={{ background:'none', border:'none', color:'#550000', fontFamily:'"Courier New", monospace', fontSize:'11px', cursor:'pointer', padding:0 }}>[ DELETE ]</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>
        )}

        {/* REPLY BOX */}
        {!loading && !notFound && (
          <div style={{ marginTop:'30px' }}>
            {isLocked ? (
              <div style={{ border:'1px solid #330000', padding:'16px', color:'#660000', fontSize:'13px' }}>
                🔒 This thread is locked. No new replies.
              </div>
            ) : isSignedIn ? (
              <div style={{ border:'1px solid #003300', backgroundColor:'#0d0d0d', padding:'20px', maxWidth:'700px' }}>
                <div style={{ fontSize:'12px', color:'#006600', marginBottom:'12px', letterSpacing:'1px' }}>&gt; POST A REPLY</div>
                <textarea
                  value={replyBody}
                  onChange={e => setReplyBody(e.target.value)}
                  placeholder="Write your reply..."
                  rows={5}
                  style={{ width:'100%', backgroundColor:'#0a0a0a', border:'1px solid #003300', color:'#00ff00', fontFamily:'"Courier New", monospace', fontSize:'13px', padding:'8px 10px', boxSizing:'border-box', resize:'vertical', outline:'none' }}
                  onFocus={e => e.target.style.borderColor = '#00ff00'}
                  onBlur={e  => e.target.style.borderColor = '#003300'}
                />
                {replyError && (
                  <div style={{ fontSize:'12px', color:'#ff4444', margin:'8px 0 0' }}>&gt; ERROR: {replyError}</div>
                )}
                <button
                  onClick={handleReply}
                  disabled={submitting}
                  style={{ marginTop:'12px', background:'none', border:'1px solid #00ff00', color:'#00ff00', fontFamily:'"Courier New", monospace', fontSize:'13px', cursor: submitting ? 'not-allowed' : 'pointer', padding:'8px 20px', opacity: submitting ? 0.5 : 1, letterSpacing:'1px' }}>
                  {submitting ? '[ POSTING... ]' : '[ POST REPLY ]'}
                </button>
              </div>
            ) : (
              <div style={{ border:'1px solid #003300', padding:'20px', backgroundColor:'#0d0d0d', maxWidth:'500px' }}>
                <div style={{ fontSize:'13px', color:'#009900', marginBottom:'12px' }}>
                  &gt; Sign in to reply to this thread.
                </div>
                <a href="/sign-in" style={{ color:'#00ff00', fontSize:'13px', textDecoration:'none', border:'1px solid #00ff00', padding:'8px 20px', display:'inline-block', letterSpacing:'1px' }}>
                  [ SIGN IN ]
                </a>
              </div>
            )}
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