'use client';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';

export default function Nav() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <nav style={{ backgroundColor:'#111', borderBottom:'2px solid #00ff00', padding:'10px 0', position:'sticky', top:0, zIndex:100 }}>
      <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'0 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
        <a href="/" style={{ fontSize:'22px', fontWeight:'bold', letterSpacing:'2px', color:'#00ff00', textDecoration:'none' }}>&#9608; GAMER&apos;S CONCLAVE</a>
        <div style={{ display:'flex', gap:'12px', fontSize:'13px', flexWrap:'wrap', alignItems:'center' }}>
          <a href="/builds" style={{ color:'#00ff00', textDecoration:'none' }}>[ BUILDS ]</a>
          <a href="/forum"  style={{ color:'#00ff00', textDecoration:'none' }}>[ FORUM ]</a>
          <a href="/games"  style={{ color:'#00ff00', textDecoration:'none' }}>[ FLASH GAMES ]</a>
          <a href="/doom"   style={{ color:'#ff4444', textDecoration:'none' }}>[ DOOM ]</a>
          <a href="/vote"   style={{ color:'#00ff00', textDecoration:'none' }}>[ VOTE ]</a>
          <a href="/ideas"  style={{ color:'#00ff00', textDecoration:'none' }}>[ IDEAS ]</a>
          <a href="/donate" style={{ color:'#ffff00', textDecoration:'none' }}>[ DONATE ]</a>
          {isSignedIn && user
  ? <>
      <a href={`/profile/${user.id}`} style={{ color:'#00ff00', textDecoration:'none' }}>[ MY PROFILE ]</a>
      <button onClick={() => signOut({ redirectUrl: '/' })} style={{ background:'none', border:'1px solid #ff4444', color:'#ff4444', fontFamily:'"Courier New", monospace', fontSize:'13px', cursor:'pointer', padding:'2px 8px' }}>[ SIGN OUT ]</button>
    </>
  : !isSignedIn
    ? <a href="/sign-in" style={{ color:'#00ff00', textDecoration:'none' }}>[ SIGN IN ]</a>
    : null
}
        </div>
      </div>
    </nav>
  );
}