'use client';
import { useState, useEffect, useRef } from 'react';

const GAMES = [
  {
    id: 1,
    title: 'SNAKE',
    description: 'Classic snake. Use arrow keys to eat and grow.',
    game: 'snake',
    icon: '🐍',
    preview: ['█░░░░░░░░░', '░░░██░░░░░', '░░░░░░███░', '░░●░░░░░░░', '░░░░░░░░░░'],
  },
  {
    id: 2,
    title: 'BREAKOUT',
    description: 'Break all the blocks. Arrow keys to move paddle.',
    game: 'breakout',
    icon: '🧱',
    preview: ['▓▓▓▓▓▓▓▓▓▓', '▒▒▒▒▒▒▒▒▒▒', '░░░░░░░░░░', '░░░○░░░░░░', '░░░░░▬▬▬░░'],
  },
];

function SnakeGame() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 20;
    const cols = canvas.width / size;
    const rows = canvas.height / size;

    let snake = [{ x: 10, y: 10 }];
    let dir = { x: 1, y: 0 };
    let food = { x: 15, y: 15 };
    let score = 0;
    let running = true;
    let interval;

    const placeFood = () => {
      food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    };

    const draw = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff00';
      snake.forEach(s => ctx.fillRect(s.x * size, s.y * size, size - 2, size - 2));
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(food.x * size, food.y * size, size - 2, size - 2);
      ctx.fillStyle = '#006600';
      ctx.font = '14px Courier New';
      ctx.fillText(`SCORE: ${score}`, 8, 20);
    };

    const update = () => {
      if (!running) return;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some(s => s.x === head.x && s.y === head.y)) {
        running = false;
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 24px Courier New';
        ctx.fillText('GAME OVER', canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = '14px Courier New';
        ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 30);
        ctx.fillText('PRESS R TO RESTART', canvas.width / 2 - 80, canvas.height / 2 + 56);
        clearInterval(interval);
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) { score++; placeFood(); }
      else snake.pop();
      draw();
    };

    const handleKey = (e) => {
      if (e.key === 'ArrowUp' && dir.y === 0) dir = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' && dir.y === 0) dir = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' && dir.x === 0) dir = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' && dir.x === 0) dir = { x: 1, y: 0 };
      if (e.key === 'r' || e.key === 'R') {
        clearInterval(interval);
        snake = [{ x: 10, y: 10 }]; dir = { x: 1, y: 0 }; score = 0; running = true;
        placeFood(); interval = setInterval(update, 120);
      }
    };

    window.addEventListener('keydown', handleKey);
    interval = setInterval(update, 120);
    draw();
    return () => { clearInterval(interval); window.removeEventListener('keydown', handleKey); };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: '2px solid #00ff00', display: 'block', margin: '0 auto' }} />
      <div style={{ fontSize: '12px', color: '#006600', marginTop: '8px' }}>ARROW KEYS TO MOVE · R TO RESTART</div>
    </div>
  );
}

function BreakoutGame() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    let paddle = { x: W / 2 - 40, y: H - 30, w: 80, h: 10 };
    let ball = { x: W / 2, y: H - 50, dx: 3, dy: -3, r: 8 };
    let score = 0, running = true, animId;

    const brickRows = 5, brickCols = 8, brickW = 44, brickH = 16, brickPad = 4;
    const colors = ['#ff4444', '#ff8800', '#ffff00', '#00ff00', '#00ffff'];
    const bricks = Array.from({ length: brickRows }, (_, r) =>
      Array.from({ length: brickCols }, (_, c) => ({
        x: c * (brickW + brickPad) + 10, y: r * (brickH + brickPad) + 40, alive: true, color: colors[r]
      }))
    );

    const keys = {};
    const handleKey = (e) => { keys[e.key] = e.type === 'keydown'; };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);

    const draw = () => {
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, W, H);
      bricks.forEach(row => row.forEach(b => { if (!b.alive) return; ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, brickW, brickH); }));
      ctx.fillStyle = '#00ff00'; ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fillStyle = '#ffff00'; ctx.fill();
      ctx.fillStyle = '#006600'; ctx.font = '14px Courier New'; ctx.fillText(`SCORE: ${score}`, 8, 20);
    };

    const update = () => {
      if (!running) return;
      if (keys['ArrowLeft'] && paddle.x > 0) paddle.x -= 6;
      if (keys['ArrowRight'] && paddle.x + paddle.w < W) paddle.x += 6;
      ball.x += ball.dx; ball.y += ball.dy;
      if (ball.x - ball.r < 0 || ball.x + ball.r > W) ball.dx *= -1;
      if (ball.y - ball.r < 0) ball.dy *= -1;
      if (ball.y + ball.r > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) ball.dy = -Math.abs(ball.dy);
      if (ball.y + ball.r > H) {
        running = false;
        ctx.fillStyle = '#ff4444'; ctx.font = 'bold 24px Courier New'; ctx.fillText('GAME OVER', W / 2 - 70, H / 2);
        ctx.font = '14px Courier New'; ctx.fillText('PRESS R TO RESTART', W / 2 - 80, H / 2 + 30);
        return;
      }
      bricks.forEach(row => row.forEach(b => {
        if (!b.alive) return;
        if (ball.x > b.x && ball.x < b.x + brickW && ball.y > b.y && ball.y < b.y + brickH) { b.alive = false; ball.dy *= -1; score++; }
      }));
      draw(); animId = requestAnimationFrame(update);
    };

    draw(); animId = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey); };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: '2px solid #00ff00', display: 'block', margin: '0 auto' }} />
      <div style={{ fontSize: '12px', color: '#006600', marginTop: '8px' }}>ARROW KEYS TO MOVE PADDLE · R TO RESTART</div>
    </div>
  );
}

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: '"Courier New", Courier, monospace', color: '#00ff00' }}>
      <nav style={{ backgroundColor: '#111', borderBottom: '2px solid #00ff00', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px', color: '#00ff00', textDecoration: 'none' }}>
          &#9608; GAMER'S CONCLAVE
        </a>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
          <a href="/builds" style={{ color: '#00ff00', textDecoration: 'none' }}>[ BUILDS ]</a>
          <a href="/games" style={{ color: '#00ff00', textDecoration: 'none' }}>[ FLASH GAMES ]</a>
          <a href="/doom" style={{ color: '#ff4444', textDecoration: 'none' }}>[ DOOM ]</a>
          <a href="/vote" style={{ color: '#00ff00', textDecoration: 'none' }}>[ VOTE ]</a>
          <a href="/ideas" style={{ color: '#00ff00', textDecoration: 'none' }}>[ IDEAS ]</a>
          <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none' }}>[ DONATE ]</a>
        </div>
      </nav>

      <div style={{ padding: '40px 20px 20px', borderBottom: '1px solid #003300' }}>
        <div style={{ fontSize: '11px', color: '#006600' }}>&#9608;&#9608; ARCADE &#9608;&#9608;</div>
        <h1 style={{ fontSize: '32px', margin: '5px 0 10px', letterSpacing: '3px' }}>FLASH GAMES</h1>
        <p style={{ fontSize: '13px', color: '#009900', margin: 0 }}>Classic games. Arrow keys to play. No installs needed.</p>
      </div>

      {activeGame && (
        <div style={{ padding: '30px 20px', borderBottom: '1px solid #003300' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>&gt; NOW PLAYING: {activeGame.title}</div>
            <button onClick={() => setActiveGame(null)} style={{ backgroundColor: '#111', color: '#ff4444', border: '1px solid #ff4444', padding: '6px 16px', cursor: 'pointer', fontFamily: '"Courier New", monospace', fontSize: '12px' }}>[ EXIT GAME ]</button>
          </div>
          {activeGame.game === 'snake' && <SnakeGame key={activeGame.id} />}
          {activeGame.game === 'breakout' && <BreakoutGame key={activeGame.id} />}
        </div>
      )}

      <div style={{ padding: '30px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {GAMES.map(game => (
          <div key={game.id} style={{ border: '1px solid #00ff00', backgroundColor: '#0d0d0d', padding: '20px' }}>

            {/* Retro ASCII-style preview panel — no external images needed */}
            <div style={{
              width: '100%',
              height: '140px',
              marginBottom: '12px',
              border: '1px solid #003300',
              backgroundColor: '#050505',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              overflow: 'hidden',
            }}>
              <div style={{ fontSize: '32px', lineHeight: 1 }}>{game.icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                {game.preview.map((row, i) => (
                  <div key={i} style={{ fontSize: '11px', color: '#004400', letterSpacing: '2px', fontFamily: '"Courier New", monospace' }}>
                    {row}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '8px' }}>&gt; {game.title}</div>
            <div style={{ fontSize: '13px', color: '#009900', marginBottom: '16px' }}>{game.description}</div>
            <button
              onClick={() => setActiveGame(game)}
              style={{ backgroundColor: '#00ff00', color: '#000', border: 'none', padding: '8px 20px', fontSize: '13px', fontFamily: '"Courier New", monospace', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px' }}
            >
              [ PLAY ]
            </button>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '2px solid #00ff00', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#006600', backgroundColor: '#111' }}>
        <a href="/donate" style={{ color: '#ffff00', textDecoration: 'none', marginRight: '20px' }}>[ DONATE ]</a>
        <span>GAMER'S CONCLAVE &copy; 2025 — BUILT WITH PASSION, NOT PROFIT</span>
      </footer>
    </main>
  );
}