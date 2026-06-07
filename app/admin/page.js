'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '../../lib/supabase';

const containerStyle = { maxWidth:'1400px', margin:'0 auto', padding:'0 20px', width:'100%', boxSizing:'border-box' };
const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_CLERK_USER_ID;

export default function AdminPage() {
  const { user, isLoaded } = useUser();

  const [stats, setStats]             = useState(null);
  const [topThreads, setTopThreads]   = useState([]);
  const [topBuilds, setTopBuilds]     = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [newUsers, setNewUsers]       = useState([]);
  const [loading, setLoading]         = useState(true);

  const isAdmin = isLoaded && user?.id === ADMIN_ID;

  useEffect(() => {
    if (!isLoaded) return;
    if (!isAdmin) return;
    fetchAll();
  }, [isLoaded, isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchTopThreads(),
      fetchTopBuilds(),
      fetchRecentActivity(),
      fetchNewUsers(),
    ]);
    setLoading(false);
  };

  const fetchStats = async () => {
    const [
      { count: totalViews },
      { count: totalBuilds },
      { count: totalPosts },
      { count: totalUsers },
      { count: totalThreads },
    ] = await Promise.all([
      supabase.from('page_views').select('*', { count: 'exact', head: true }),
      supabase.from('builds').select('*', { count: 'exact', head: true }),
      supabase.from('forum_posts').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('forum_threads').select('*', { count: 'exact', head: true }),
    ]);
    setStats({ totalViews, totalBuilds, totalPosts, totalUsers, totalThreads });
  };

  const fetchTopThreads = async () => {
    const { data: views } = await supabase
      .from('page_views')
      .select('page_id')
      .eq('page_type', 'thread');

    if (!views?.length) return;

    const counts = {};
    views.forEach(v => { counts[v.page_id] = (counts[v.page_id] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const threadIds = sorted.map(([id]) => id);

    const { data: threads } = await supabase
      .from('forum_threads')
      .select('id, title, category_id')
      .in('id', threadIds);

    const { data: cats } = await supabase
      .from('forum_categories')
      .select('id, slug');

    const catMap = {};
    (cats || []).forEach(c => { catMap[c.id] = c.slug; });

    const enriched = sorted.map(([id, count]) => {
      const thread = threads?.find(t => t.id === id);
      return { id, count, title: thread?.title || 'Unknown', slug: catMap[thread?.category_id] || '' };
    });

    setTopThreads(enriched);
  };

  const fetchTopBuilds = async () => {
    const { data: views } = await supabase
      .from('page_views')
      .select('page_id')
      .eq('page_type', 'build');

    if (!views?.length) return;

    const counts = {};
    views.forEach(v => { counts[v.page_id] = (counts[v.page_id] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const buildIds = sorted.map(([id]) => id);

    const { data: builds } = await supabase
      .from('builds')
      .select('id, title, author')
      .in('id', buildIds);

    const enriched = sorted.map(([id, count]) => {
      const build = builds?.find(b => b.id === id);
      return { id, count, title: build?.title || 'Unknown', author: build?.author || '' };
    });

    setTopBuilds(enriched);
  };

  const fetchRecentActivity = async () => {
    const [
      { data: posts },
      { data: threads },
      { data: builds },
    ] = await Promise.all([
      supabase.from('forum_posts').select('id, body, created_at, thread_id, user_id').order('created_at', { ascending: false }).limit(5),
      supabase.from('forum_threads').select('id, title, created_at, user_id, category_id').order('created_at', { ascending: false }).limit(5),
      supabase.from('builds').select('id, title, author, created_at').order('created_at', { ascending: false }).limit(5),
    ]);

    const activity = [
      ...(posts || []).map(p => ({ type: 'post', ...p })),
      ...(threads || []).map(t => ({ type: 'thread', ...t })),
      ...(builds || []).map(b => ({ type: 'build', ...b })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 15);

    // get category slugs for threads
    const catIds = [...new Set(activity.filter(a => a.category_id).map(a => a.category_id))];
    if (catIds.length) {
      const { data: cats } = await supabase.from('forum_categories').select('id, slug').in('id', catIds);
      const catMap = {};
      (cats || []).forEach(c => { catMap[c.id] = c.slug; });
      activity.forEach(a => { if (a.category_id) a.slug = catMap[a.category_id]; });
    }

    setRecentActivity(activity);
  };

  const fetchNewUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('user_id, username, created_at, avatar_url')
      .order('created_at', { ascending: false })
      .limit(10);
    setNewUsers(data || []);
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('forum_posts').delete().eq('id', postId);
    fetchRecentActivity();
  };

  const handleDeleteThread = async (threadId) => {
    if (!confirm('Delete this thread and ALL its posts?')) return;
    await supabase.from('forum_posts').delete().eq('thread_id', threadId);
    await supabase.from('forum_threads').delete().eq('id', threadId);
    fetchAll();
  };

  const handleDeleteBuild = async (buildId) => {
    if (!confirm('Delete this build?')) return;
    await supabase.from('builds').delete().eq('id', buildId);
    fetchAll();
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statCard = (label, value, color = '#00ff00') => (
    <div style={{ border: '1px solid #003300', backgroundColor: '#0d0d0d', padding: '20px', textAlign: 'center', minWidth: '140px' }}>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color }}>{value ?? '—'}</div>
      <div style={{ fontSize: '10px', color: '#006600', letterSpacing: '1px', marginTop: '4px' }}>{label}</div>
    </div>
  );

  if (!isLoaded) return null;

  if (!isAdmin) {
    return (
      <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: '"Courier New", monospace', color: '#00ff00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#ff4444', fontSize: '18px' }}>&gt; ACCESS DENIED</div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: '"Courier New", Courier, monospace', color: '#00ff00' }}>

      {/* HEADER */}
      <div style={{ borderBottom: '1px solid #003300' }}>
        <div style={{ ...containerStyle, padding: '40px 20px 20px' }}>
          <div style={{ fontSize: '11px', color: '#006600', marginBottom: '4px' }}>&#9608;&#9608; ADMIN &#9608;&#9608;</div>
          <h1 style={{ fontSize: '28px', margin: '0 0 8px', letterSpacing: '3px' }}>ADMIN DASHBOARD</h1>
          <p style={{ fontSize: '13px', color: '#009900', margin: 0 }}>Site stats, top content, recent activity, and moderation tools.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ ...containerStyle, padding: '40px 20px', color: '#006600' }}>&gt; LOADING DASHBOARD..._</div>
      ) : (
        <div style={{ ...containerStyle, padding: '30px 20px' }}>

          {/* STATS */}
          <div style={{ fontSize: '11px', color: '#006600', marginBottom: '12px', letterSpacing: '1px' }}>&#9608;&#9608; OVERVIEW &#9608;&#9608;</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {statCard('TOTAL VIEWS', stats?.totalViews)}
            {statCard('BUILDS', stats?.totalBuilds, '#ffff00')}
            {statCard('THREADS', stats?.totalThreads, '#009900')}
            {statCard('FORUM POSTS', stats?.totalPosts, '#009900')}
            {statCard('MEMBERS', stats?.totalUsers, '#00aaff')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>

            {/* TOP THREADS */}
            <div>
              <div style={{ fontSize: '11px', color: '#006600', marginBottom: '12px', letterSpacing: '1px' }}>&#9608;&#9608; TOP THREADS BY VIEWS &#9608;&#9608;</div>
              {topThreads.length === 0 ? (
                <div style={{ color: '#004400', fontSize: '13px' }}>&gt; No view data yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {topThreads.map((t, i) => (
                    <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 60px 80px', gap: '10px', padding: '10px 12px', border: '1px solid #002200', backgroundColor: '#0d0d0d', alignItems: 'center' }}>
                      <div style={{ color: '#004400', fontSize: '11px' }}>#{i + 1}</div>
                      <a href={`/forum/${t.slug}/${t.id}`} style={{ color: '#00ff00', textDecoration: 'none', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</a>
                      <div style={{ color: '#009900', fontSize: '12px', textAlign: 'right' }}>👁 {t.count}</div>
                      <button onClick={() => handleDeleteThread(t.id)} style={{ background: 'none', border: '1px solid #ff4444', color: '#ff4444', fontFamily: '"Courier New", monospace', fontSize: '10px', cursor: 'pointer', padding: '2px 6px' }}>DELETE</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TOP BUILDS */}
            <div>
              <div style={{ fontSize: '11px', color: '#006600', marginBottom: '12px', letterSpacing: '1px' }}>&#9608;&#9608; TOP BUILDS BY VIEWS &#9608;&#9608;</div>
              {topBuilds.length === 0 ? (
                <div style={{ color: '#004400', fontSize: '13px' }}>&gt; No view data yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {topBuilds.map((b, i) => (
                    <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 60px 80px', gap: '10px', padding: '10px 12px', border: '1px solid #002200', backgroundColor: '#0d0d0d', alignItems: 'center' }}>
                      <div style={{ color: '#004400', fontSize: '11px' }}>#{i + 1}</div>
                      <div style={{ fontSize: '12px', color: '#00ff00', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title} <span style={{ color: '#006600' }}>by {b.author}</span></div>
                      <div style={{ color: '#009900', fontSize: '12px', textAlign: 'right' }}>👁 {b.count}</div>
                      <button onClick={() => handleDeleteBuild(b.id)} style={{ background: 'none', border: '1px solid #ff4444', color: '#ff4444', fontFamily: '"Courier New", monospace', fontSize: '10px', cursor: 'pointer', padding: '2px 6px' }}>DELETE</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', color: '#006600', marginBottom: '12px', letterSpacing: '1px' }}>&#9608;&#9608; RECENT ACTIVITY &#9608;&#9608;</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {recentActivity.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 100px 80px', gap: '10px', padding: '10px 12px', border: '1px solid #002200', backgroundColor: '#0d0d0d', alignItems: 'center' }}>
                  <div style={{ fontSize: '10px', letterSpacing: '1px', color: item.type === 'build' ? '#ffff00' : item.type === 'thread' ? '#00aaff' : '#009900', border: `1px solid ${item.type === 'build' ? '#666600' : item.type === 'thread' ? '#004488' : '#003300'}`, padding: '2px 5px', textAlign: 'center' }}>
                    {item.type.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#00cc00', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.type === 'post' ? item.body?.slice(0, 80) + '...' : item.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#005500', textAlign: 'right' }}>{formatDate(item.created_at)}</div>
                  <button
                    onClick={() => {
                      if (item.type === 'post') handleDeletePost(item.id);
                      else if (item.type === 'thread') handleDeleteThread(item.id);
                      else handleDeleteBuild(item.id);
                    }}
                    style={{ background: 'none', border: '1px solid #ff4444', color: '#ff4444', fontFamily: '"Courier New", monospace', fontSize: '10px', cursor: 'pointer', padding: '2px 6px' }}>
                    DELETE
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* NEW USERS */}
          <div>
            <div style={{ fontSize: '11px', color: '#006600', marginBottom: '12px', letterSpacing: '1px' }}>&#9608;&#9608; RECENT MEMBERS &#9608;&#9608;</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '600px' }}>
              {newUsers.map(u => (
                <div key={u.user_id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 120px', gap: '12px', padding: '10px 12px', border: '1px solid #002200', backgroundColor: '#0d0d0d', alignItems: 'center' }}>
                  <div style={{ width: '28px', height: '28px', border: '1px solid #003300', backgroundColor: '#111', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    {u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                  </div>
                  <a href={`/profile/${u.user_id}`} style={{ color: '#00ff00', textDecoration: 'none', fontSize: '13px' }}>{u.username || 'Unknown'}</a>
                  <div style={{ fontSize: '11px', color: '#005500', textAlign: 'right' }}>{formatDate(u.created_at)}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      <footer style={{ borderTop: '2px solid #00ff00', padding: '20px 0', textAlign: 'center', fontSize: '12px', color: '#006600', backgroundColor: '#111', marginTop: '40px' }}>
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
        <span>GAMER&apos;S CONCLAVE &copy; 2025 — BUILT FOR PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}