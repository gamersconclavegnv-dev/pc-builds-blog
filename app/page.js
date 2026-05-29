export default function Home() {
  return (
    <main style={{
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#00ff00',
      padding: '0',
    }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#111',
        borderBottom: '2px solid #00ff00',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px' }}>
          &#9608; GAMER'S CONCLAVE
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
          <a href="#" style={{ color: '#00ff00', textDecoration: 'none' }}>[ BUILDS ]</a>
          <a href="#" style={{ color: '#00ff00', textDecoration: 'none' }}>[ GAMES ]</a>
          <a href="#" style={{ color: '#00ff00', textDecoration: 'none' }}>[ VOTE ]</a>
          <a href="#" style={{ color: '#00ff00', textDecoration: 'none' }}>[ IDEAS ]</a>
          <a href="#" style={{ color: '#ffff00', textDecoration: 'none' }}>[ DONATE ]</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        borderBottom: '1px solid #003300',
      }}>
        <div style={{ fontSize: '12px', color: '#006600', marginBottom: '10px' }}>
          *** WELCOME TO THE INTERNET ***
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          letterSpacing: '4px',
          margin: '0 0 10px 0',
          textShadow: '0 0 10px #00ff00',
        }}>
          GAMER'S CONCLAVE
        </h1>
        <div style={{ fontSize: '14px', color: '#009900', marginBottom: '30px' }}>
          // share your build. show your rig. join the community. //
        </div>
        <button style={{
          backgroundColor: '#00ff00',
          color: '#000',
          border: 'none',
          padding: '12px 30px',
          fontSize: '16px',
          fontFamily: '"Courier New", monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          letterSpacing: '2px',
        }}>
          [ POST YOUR BUILD ]
        </button>
      </div>

      {/* PC of the Week */}
      <div style={{ padding: '40px 20px', borderBottom: '1px solid #003300' }}>
        <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; FEATURED &#9608;&#9608;</div>
        <h2 style={{ fontSize: '24px', margin: '5px 0 20px', letterSpacing: '2px' }}>
          PC OF THE WEEK
        </h2>
        <div style={{
          border: '1px solid #00ff00',
          padding: '20px',
          maxWidth: '500px',
          backgroundColor: '#0d0d0d',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            &gt; SLOT EMPTY — BE THE FIRST!
          </div>
          <div style={{ fontSize: '13px', color: '#009900' }}>
            No builds submitted yet. Post yours and get voted in.
          </div>
        </div>
      </div>

      {/* Recent Builds */}
      <div style={{ padding: '40px 20px' }}>
        <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; LATEST &#9608;&#9608;</div>
        <h2 style={{ fontSize: '24px', margin: '5px 0 20px', letterSpacing: '2px' }}>
          RECENT BUILDS
        </h2>
        <div style={{ color: '#006600', fontSize: '14px' }}>
          &gt; No builds yet. Be the first to post._
        </div>
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
        <a href="#" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>
          [ DONATE ]
        </a>
        <span>GAMER'S CONCLAVE &copy; 2025 — BUILT WITH PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}