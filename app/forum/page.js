'use client';
import { useState, useEffect } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { supabase } from '../../lib/supabase';

const containerStyle = { maxWidth:'1400px', margin:'0 auto', padding:'0 20px', width:'100%', boxSizing:'border-box' };

const CATEGORY_ICONS = {
  'introductions':       '👋',
  'general':             '💬',
  'build-discussions':   '🖥️',
  'troubleshooting-help':'🔧',
  'new-tech-hardware':   '⚙️',
};

export default function ForumPage() {
  const { isSignedIn } = useAuth();
  const { signOut }    = useClerk();
  const [categories, setCategories] = useState([]);
  const [stats, setStats]           = useState({});
  const [loading, setLoading]       = useState(true);
  const [randomLoading, setRandomLoading] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const { data: cats } = await supabase
      .from('forum_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!cats) { setLoading(false); return; }
    setCategories(cats);

    const { data: threads } = await supabase
      .from('forum_threads')
      .select('id, category_id');

    const { data: posts } = await supabase
      .from('forum_posts')
      .select('id, thread_id');

    const threadMap = {};
    (threads || []).forEach(t => { threadMap[t.id] = t.category_id; });

    const s = {};
    cats.forEach(c => { s[c.id] = { threads: 0, posts: 0 }; });
    (threads || []).forEach(t => { if (s[t.category_id]) s[t.category_id].threads++; });
    (posts || []).forEach(p => {
      const catId = threadMap[p.thread_id];
      if (catId && s[catId]) s[catId].posts++;
    });

    setStats(s);
    setLoading(false);
  };

  const handleRandom = async () => {
    setRandomLoading(true);
    window.location.href = '/api/forum/random';
  };

  return (
    <main style={{ backgroundColor:'#0a0a0a', minHeight:'100vh', fontFamily:'"Courier New", Courier, monospace', color:'#00ff00' }}>


      {/* HEADER */}
      <div style={{ borderBottom:'1px solid #003300' }}>
        <div style={{ ...containerStyle, padding:'40px 20px 20px' }}>
          <div style={{ fontSize:'11px', color:'#006600', marginBottom:'4px' }}>&#9608;&#9608; COMMUNITY &#9608;&#9608;</div>
          <h1 style={{ fontSize:'32px', margin:'0 0 10px', letterSpacing:'3px' }}>THE FORUM</h1>
          <p style={{ fontSize:'13px', color:'#009900', margin:0 }}>
            Talk builds, hardware, and anything gaming. Sign in to post.
          </p>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ ...containerStyle, padding:'30px 20px' }}>
        {loading ? (
          <div style={{ color:'#006600', fontSize:'14px' }}>&gt; LOADING FORUM..._</div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>

            {/* TABLE HEADER */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px', gap:'10px', padding:'8px 16px', fontSize:'10px', color:'#004400', letterSpacing:'1px', borderBottom:'1px solid #002200' }}>
              <div>CATEGORY</div>
              <div style={{ textAlign:'center' }}>THREADS</div>
              <div style={{ textAlign:'center' }}>POSTS</div>
            </div>

            {/* CATEGORY ROWS */}
            {categories.map(cat => {
              const icon    = CATEGORY_ICONS[cat.slug] || '📁';
              const threads = stats[cat.id]?.threads || 0;
              const posts   = stats[cat.id]?.posts   || 0;
              return (
                <a key={cat.id} href={`/forum/${cat.slug}`} style={{ textDecoration:'none' }}>
                  <div
                    style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px', gap:'10px', padding:'16px', border:'1px solid #002200', backgroundColor:'#0d0d0d', alignItems:'center', cursor:'pointer', transition:'border-color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#00ff00'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#002200'}>
                    <div style={{ display:'flex', gap:'14px', alignItems:'center' }}>
                      <div style={{ fontSize:'28px', flexShrink:0, width:'36px', textAlign:'center' }}>{icon}</div>
                      <div>
                        <div style={{ fontSize:'16px', fontWeight:'bold', letterSpacing:'1px', color:'#00ff00', marginBottom:'3px' }}>
                          {cat.name.toUpperCase()}
                        </div>
                        <div style={{ fontSize:'12px', color:'#006600' }}>{cat.description}</div>
                      </div>
                    </div>
                    <div style={{ textAlign:'center', fontSize:'18px', fontWeight:'bold', color:'#009900' }}>{threads}</div>
                    <div style={{ textAlign:'center', fontSize:'18px', fontWeight:'bold', color:'#009900' }}>{posts}</div>
                  </div>
                </a>
              );
            })}

            {/* RANDOM ROW */}
            <div
              onClick={handleRandom}
              style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px', gap:'10px', padding:'16px', border:'1px solid #002200', backgroundColor:'#0d0d0d', alignItems:'center', cursor: randomLoading ? 'wait' : 'pointer', transition:'border-color 0.15s', opacity: randomLoading ? 0.6 : 1 }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#ffff00'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#002200'}>
              <div style={{ display:'flex', gap:'14px', alignItems:'center' }}>
                <div style={{ fontSize:'28px', flexShrink:0, width:'36px', textAlign:'center' }}>🎲</div>
                <div>
                  <div style={{ fontSize:'16px', fontWeight:'bold', letterSpacing:'1px', color:'#ffff00', marginBottom:'3px' }}>
                    {randomLoading ? 'FINDING A THREAD...' : 'RANDOM THREAD'}
                  </div>
                  <div style={{ fontSize:'12px', color:'#666600' }}>Feeling lucky? Drop into a random thread.</div>
                </div>
              </div>
              <div style={{ textAlign:'center', fontSize:'18px', color:'#444' }}>—</div>
              <div style={{ textAlign:'center', fontSize:'18px', color:'#444' }}>—</div>
            </div>

          </div>
        )}

        {/* SIGN IN PROMPT */}
        {!isSignedIn && !loading && (
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