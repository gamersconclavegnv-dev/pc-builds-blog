import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main style={{
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      fontFamily: '"Courier New", Courier, monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
    }}>
      <div style={{ fontSize: '24px', color: '#00ff00', letterSpacing: '3px', fontWeight: 'bold' }}>
        &#9608; GAMER'S CONCLAVE
      </div>
      <SignUp />
    </main>
  );
}