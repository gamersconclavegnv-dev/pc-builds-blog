'use client';
import { useState, useEffect, useRef } from 'react';

const GAMES = [
  {
    id: 1,
    title: 'SNAKE',
    description: 'Classic snake. Eat food and grow without hitting walls.',
    game: 'snake',
    icon: '🐍',
    preview: ['█░░░░░░░░░', '░░░██░░░░░', '░░░░░░███░', '░░●░░░░░░░', '░░░░░░░░░░'],
  },
  {
    id: 2,
    title: 'BREAKOUT',
    description: 'Break all the blocks. Paddle keeps the ball alive.',
    game: 'breakout',
    icon: '🧱',
    preview: ['▓▓▓▓▓▓▓▓▓▓', '▒▒▒▒▒▒▒▒▒▒', '░░░░░░░░░░', '░░░○░░░░░░', '░░░░░▬▬▬░░'],
  },
  {
    id: 3,
    title: 'PAC-MAN',
    description: 'Eat all the dots and avoid the ghosts.',
    game: 'pacman',
    icon: '👻',
    preview: ['█████████░', '░●░░░░░●░░', '░░░████░░░', '░●░░░░░●░░', '█████████░'],
  },
  {
    id: 4,
    title: 'TETRIS',
    description: 'Stack the falling blocks and clear lines.',
    game: 'tetris',
    icon: '🟦',
    preview: ['░░░░██░░░░', '░░░░██░░░░', '░░████░░░░', '░░░░░░░░░░', '██████████'],
  },
  {
    id: 5,
    title: 'GALAGA',
    description: 'Shoot the alien fleet before they destroy you.',
    game: 'galaga',
    icon: '👾',
    preview: ['░👾░👾░👾░', '░░👾░👾░░░', '░░░░░░░░░░', '░░░░🔥░░░░', '░░░░▲░░░░░'],
  },
  {
    id: 6,
    title: 'FROGGER',
    description: 'Cross the road and river to reach safety.',
    game: 'frogger',
    icon: '🐸',
    preview: ['🏠░🏠░🏠░░', '≈≈≈≈≈≈≈≈≈≈', '████░████░', '░░░░🐸░░░░', '░░░░░░░░░░'],
  },
];

const btnStyle = {
  backgroundColor: '#111',
  border: '2px solid #00ff00',
  color: '#00ff00',
  width: '56px',
  height: '56px',
  fontSize: '22px',
  cursor: 'pointer',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'manipulation',
};

function TouchControls({ onDirection, onRestart }) {
  return (
    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button style={btnStyle}
          onTouchStart={(e) => { e.preventDefault(); onDirection('up'); }}
          onMouseDown={() => onDirection('up')}>▲</button>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button style={btnStyle}
          onTouchStart={(e) => { e.preventDefault(); onDirection('left'); }}
          onMouseDown={() => onDirection('left')}>◄</button>
        <button style={{ ...btnStyle, backgroundColor: '#003300', fontSize: '13px' }}
          onTouchStart={(e) => { e.preventDefault(); onRestart(); }}
          onMouseDown={() => onRestart()}>RST</button>
        <button style={btnStyle}
          onTouchStart={(e) => { e.preventDefault(); onDirection('right'); }}
          onMouseDown={() => onDirection('right')}>►</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button style={btnStyle}
          onTouchStart={(e) => { e.preventDefault(); onDirection('down'); }}
          onMouseDown={() => onDirection('down')}>▼</button>
      </div>
      <div style={{ fontSize: '11px', color: '#006600', marginTop: '4px' }}>TAP TO CONTROL · RST = RESTART</div>
    </div>
  );
}

// ─── SNAKE ───────────────────────────────────────────────────────────────────
function SnakeGame() {
  const canvasRef = useRef(null);
  const gameState = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    score: 0,
    running: true,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 20;
    const cols = canvas.width / size;
    const rows = canvas.height / size;
    const gs = gameState.current;

    const placeFood = () => {
      gs.food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    };

    const draw = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff00';
      gs.snake.forEach(s => ctx.fillRect(s.x * size, s.y * size, size - 2, size - 2));
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(gs.food.x * size, gs.food.y * size, size - 2, size - 2);
      ctx.fillStyle = '#006600';
      ctx.font = '14px Courier New';
      ctx.fillText(`SCORE: ${gs.score}`, 8, 20);
    };

    const reset = () => {
      gs.snake = [{ x: 10, y: 10 }];
      gs.dir = { x: 1, y: 0 };
      gs.score = 0;
      gs.running = true;
      placeFood();
    };

    const update = () => {
      if (!gs.running) return;
      const head = { x: gs.snake[0].x + gs.dir.x, y: gs.snake[0].y + gs.dir.y };
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || gs.snake.some(s => s.x === head.x && s.y === head.y)) {
        gs.running = false;
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 24px Courier New';
        ctx.fillText('GAME OVER', canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = '14px Courier New';
        ctx.fillText(`FINAL SCORE: ${gs.score}`, canvas.width / 2 - 60, canvas.height / 2 + 30);
        ctx.fillText('PRESS R TO RESTART', canvas.width / 2 - 80, canvas.height / 2 + 56);
        clearInterval(interval);
        return;
      }
      gs.snake.unshift(head);
      if (head.x === gs.food.x && head.y === gs.food.y) { gs.score++; placeFood(); }
      else gs.snake.pop();
      draw();
    };

    const handleKey = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowUp' && gs.dir.y === 0) gs.dir = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' && gs.dir.y === 0) gs.dir = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' && gs.dir.x === 0) gs.dir = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' && gs.dir.x === 0) gs.dir = { x: 1, y: 0 };
      if (e.key === 'r' || e.key === 'R') { clearInterval(interval); reset(); interval = setInterval(update, 120); }
    };

    window.addEventListener('keydown', handleKey);
    let interval = setInterval(update, 120);
    draw();

    canvas._snakeControl = (dir) => {
      if (dir === 'up' && gs.dir.y === 0) gs.dir = { x: 0, y: -1 };
      if (dir === 'down' && gs.dir.y === 0) gs.dir = { x: 0, y: 1 };
      if (dir === 'left' && gs.dir.x === 0) gs.dir = { x: -1, y: 0 };
      if (dir === 'right' && gs.dir.x === 0) gs.dir = { x: 1, y: 0 };
    };
    canvas._snakeRestart = () => { clearInterval(interval); reset(); interval = setInterval(update, 120); };

    return () => { clearInterval(interval); window.removeEventListener('keydown', handleKey); };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: '2px solid #00ff00', display: 'block', margin: '0 auto', maxWidth: '100%' }} />
      <TouchControls
        onDirection={(dir) => canvasRef.current?._snakeControl(dir)}
        onRestart={() => canvasRef.current?._snakeRestart()}
      />
    </div>
  );
}

// ─── BREAKOUT ─────────────────────────────────────────────────────────────────
function BreakoutGame() {
  const canvasRef = useRef(null);
  const keysRef = useRef({});

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

    const handleKey = (e) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      keysRef.current[e.key] = e.type === 'keydown';
    };
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
      if (keysRef.current['ArrowLeft'] && paddle.x > 0) paddle.x -= 6;
      if (keysRef.current['ArrowRight'] && paddle.x + paddle.w < W) paddle.x += 6;
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

    canvas._breakoutControl = (dir) => {
      if (dir === 'left') keysRef.current['ArrowLeft'] = true;
      if (dir === 'right') keysRef.current['ArrowRight'] = true;
    };
    canvas._breakoutRelease = (dir) => {
      if (dir === 'left') keysRef.current['ArrowLeft'] = false;
      if (dir === 'right') keysRef.current['ArrowRight'] = false;
    };

    draw(); animId = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey); };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: '2px solid #00ff00', display: 'block', margin: '0 auto', maxWidth: '100%' }} />
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button style={{ ...btnStyle, width: '100px' }}
            onTouchStart={(e) => { e.preventDefault(); canvasRef.current?._breakoutControl('left'); }}
            onTouchEnd={(e) => { e.preventDefault(); canvasRef.current?._breakoutRelease('left'); }}
            onMouseDown={() => canvasRef.current?._breakoutControl('left')}
            onMouseUp={() => canvasRef.current?._breakoutRelease('left')}>◄ LEFT</button>
          <button style={{ ...btnStyle, width: '100px' }}
            onTouchStart={(e) => { e.preventDefault(); canvasRef.current?._breakoutControl('right'); }}
            onTouchEnd={(e) => { e.preventDefault(); canvasRef.current?._breakoutRelease('right'); }}
            onMouseDown={() => canvasRef.current?._breakoutControl('right')}
            onMouseUp={() => canvasRef.current?._breakoutRelease('right')}>RIGHT ►</button>
        </div>
        <div style={{ fontSize: '11px', color: '#006600', marginTop: '4px' }}>HOLD TO MOVE PADDLE</div>
      </div>
    </div>
  );
}

// ─── PAC-MAN ──────────────────────────────────────────────────────────────────
function PacmanGame() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const CELL = 20;
    const COLS = 20, ROWS = 20;

    // Simple maze: 1=wall, 0=dot, 2=empty, 3=power pellet
    const baseMaze = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
      [1,3,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,3,1],
      [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
      [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
      [1,1,1,1,0,1,1,1,2,1,1,2,1,1,1,0,1,1,1,1],
      [1,1,1,1,0,1,2,2,2,2,2,2,2,2,1,0,1,1,1,1],
      [1,1,1,1,0,1,2,1,1,2,2,1,1,2,1,0,1,1,1,1],
      [2,2,2,2,0,2,2,1,2,2,2,2,1,2,2,0,2,2,2,2],
      [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
      [1,1,1,1,0,1,2,2,2,2,2,2,2,2,1,0,1,1,1,1],
      [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
      [1,3,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,3,1],
      [1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1],
      [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    let maze, pacman, ghosts, score, lives, running, powered, powerTimer, animId;

    const ghostColors = ['#ff0000', '#ffb8ff', '#00ffff', '#ffb852'];

    const reset = () => {
      maze = baseMaze.map(r => [...r]);
      pacman = { x: 10, y: 15, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 }, mouth: 0, mouthDir: 1 };
      ghosts = ghostColors.map((color, i) => ({
        x: 8 + (i % 4), y: 9, dx: i % 2 === 0 ? 1 : -1, dy: 0, color, timer: i * 20
      }));
      score = 0; lives = 3; running = true; powered = false; powerTimer = 0;
    };

    reset();

    const canMove = (x, y) => x >= 0 && x < COLS && y >= 0 && y < ROWS && maze[y][x] !== 1;

    const drawMaze = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const v = maze[r][c];
          if (v === 1) {
            ctx.fillStyle = '#0000cc';
            ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
            ctx.strokeStyle = '#4444ff';
            ctx.strokeRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          } else if (v === 0) {
            ctx.fillStyle = '#ffff99';
            ctx.beginPath();
            ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (v === 3) {
            ctx.fillStyle = powered ? '#ffffff' : '#ffaa00';
            ctx.beginPath();
            ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    const drawPacman = () => {
      const cx = pacman.x * CELL + CELL / 2;
      const cy = pacman.y * CELL + CELL / 2;
      pacman.mouth += 0.15 * pacman.mouthDir;
      if (pacman.mouth > 0.25 || pacman.mouth < 0) pacman.mouthDir *= -1;
      const angle = Math.atan2(pacman.dir.y, pacman.dir.x) || 0;
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, CELL / 2 - 2, angle + pacman.mouth, angle + Math.PI * 2 - pacman.mouth);
      ctx.closePath();
      ctx.fill();
    };

    const drawGhosts = () => {
      ghosts.forEach(g => {
        const cx = g.x * CELL + CELL / 2;
        const cy = g.y * CELL + CELL / 2;
        ctx.fillStyle = powered ? '#2222cc' : g.color;
        ctx.beginPath();
        ctx.arc(cx, cy - 2, CELL / 2 - 2, Math.PI, 0);
        ctx.lineTo(cx + CELL / 2 - 2, cy + CELL / 2 - 2);
        for (let i = 3; i >= 0; i--) {
          ctx.arc(cx - CELL / 2 + 2 + (i * (CELL - 4) / 3), cy + CELL / 2 - 4, (CELL - 4) / 6, 0, Math.PI);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx - 4, cy - 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 4, cy - 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#00f';
        ctx.beginPath(); ctx.arc(cx - 4, cy - 1, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 4, cy - 1, 1.5, 0, Math.PI * 2); ctx.fill();
      });
    };

    let frame = 0;
    const update = () => {
      if (!running) return;
      frame++;
      if (powered) { powerTimer--; if (powerTimer <= 0) powered = false; }

      // Move pacman every 8 frames
      if (frame % 8 === 0) {
        const nd = pacman.nextDir;
        if (canMove(pacman.x + nd.x, pacman.y + nd.y)) pacman.dir = { ...nd };
        const nx = pacman.x + pacman.dir.x, ny = pacman.y + pacman.dir.y;
        if (canMove(nx, ny)) {
          pacman.x = nx; pacman.y = ny;
          const cell = maze[pacman.y][pacman.x];
          if (cell === 0) { maze[pacman.y][pacman.x] = 2; score += 10; }
          if (cell === 3) { maze[pacman.y][pacman.x] = 2; score += 50; powered = true; powerTimer = 200; }
        }
        // Wrap tunnel
        if (pacman.x < 0) pacman.x = COLS - 1;
        if (pacman.x >= COLS) pacman.x = 0;
      }

      // Move ghosts every 12 frames
      if (frame % 12 === 0) {
        ghosts.forEach(g => {
          g.timer--;
          if (g.timer > 0) return;
          const dirs = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
          const valid = dirs.filter(d => canMove(g.x + d.x, g.y + d.y) && !(d.x === -g.dx && d.y === -g.dy));
          if (valid.length === 0) { g.dx *= -1; g.dy *= -1; return; }
          const chosen = valid[Math.floor(Math.random() * valid.length)];
          g.x += chosen.x; g.y += chosen.y; g.dx = chosen.x; g.dy = chosen.y;
        });
      }

      // Collision
      ghosts.forEach(g => {
        if (Math.abs(g.x - pacman.x) < 1 && Math.abs(g.y - pacman.y) < 1) {
          if (powered) { g.x = 9; g.y = 9; score += 200; }
          else { lives--; pacman.x = 10; pacman.y = 15; if (lives <= 0) { running = false; } }
        }
      });

      drawMaze();
      drawPacman();
      drawGhosts();

      ctx.fillStyle = '#00ff00'; ctx.font = '14px Courier New';
      ctx.fillText(`SCORE: ${score}`, 4, 14);
      ctx.fillText(`LIVES: ${'♥'.repeat(lives)}`, 280, 14);

      if (!running) {
        ctx.fillStyle = '#ff4444'; ctx.font = 'bold 24px Courier New';
        ctx.fillText('GAME OVER', canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = '14px Courier New'; ctx.fillText('PRESS R TO RESTART', canvas.width / 2 - 80, canvas.height / 2 + 30);
        return;
      }
      animId = requestAnimationFrame(update);
    };

    const handleKey = (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowUp') pacman.nextDir = { x: 0, y: -1 };
      if (e.key === 'ArrowDown') pacman.nextDir = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft') pacman.nextDir = { x: -1, y: 0 };
      if (e.key === 'ArrowRight') pacman.nextDir = { x: 1, y: 0 };
      if (e.key === 'r' || e.key === 'R') { cancelAnimationFrame(animId); reset(); animId = requestAnimationFrame(update); }
    };
    window.addEventListener('keydown', handleKey);
    animId = requestAnimationFrame(update);

    canvas._pacmanControl = (dir) => {
      if (dir === 'up') pacman.nextDir = { x: 0, y: -1 };
      if (dir === 'down') pacman.nextDir = { x: 0, y: 1 };
      if (dir === 'left') pacman.nextDir = { x: -1, y: 0 };
      if (dir === 'right') pacman.nextDir = { x: 1, y: 0 };
    };
    canvas._pacmanRestart = () => { cancelAnimationFrame(animId); reset(); animId = requestAnimationFrame(update); };

    return () => { cancelAnimationFrame(animId); window.removeEventListener('keydown', handleKey); };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: '2px solid #00ff00', display: 'block', margin: '0 auto', maxWidth: '100%' }} />
      <TouchControls
        onDirection={(dir) => canvasRef.current?._pacmanControl(dir)}
        onRestart={() => canvasRef.current?._pacmanRestart()}
      />
    </div>
  );
}

// ─── TETRIS ───────────────────────────────────────────────────────────────────
function TetrisGame() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const CELL = 20, COLS = 10, ROWS = 20;
    const W = COLS * CELL, H = ROWS * CELL;

    const PIECES = [
      { shape: [[1,1,1,1]], color: '#00ffff' },
      { shape: [[1,1],[1,1]], color: '#ffff00' },
      { shape: [[0,1,0],[1,1,1]], color: '#aa00ff' },
      { shape: [[1,0],[1,0],[1,1]], color: '#ff8800' },
      { shape: [[0,1],[0,1],[1,1]], color: '#0000ff' },
      { shape: [[0,1,1],[1,1,0]], color: '#00ff00' },
      { shape: [[1,1,0],[0,1,1]], color: '#ff0000' },
    ];

    let board, piece, score, lines, level, running, dropTimer, animId;

    const newPiece = () => {
      const p = PIECES[Math.floor(Math.random() * PIECES.length)];
      return { shape: p.shape.map(r => [...r]), color: p.color, x: Math.floor(COLS / 2) - 1, y: 0 };
    };

    const reset = () => {
      board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      score = 0; lines = 0; level = 1; running = true; dropTimer = 0;
      piece = newPiece();
    };
    reset();

    const fits = (shape, ox, oy) => shape.every((row, r) => row.every((v, c) =>
      !v || (ox + c >= 0 && ox + c < COLS && oy + r < ROWS && !board[oy + r]?.[ox + c])
    ));

    const lock = () => {
      piece.shape.forEach((row, r) => row.forEach((v, c) => { if (v) board[piece.y + r][piece.x + c] = piece.color; }));
      let cleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(v => v)) { board.splice(r, 1); board.unshift(Array(COLS).fill(0)); cleared++; r++; }
      }
      if (cleared) { lines += cleared; score += [0, 100, 300, 500, 800][cleared] * level; level = Math.floor(lines / 10) + 1; }
      piece = newPiece();
      if (!fits(piece.shape, piece.x, piece.y)) running = false;
    };

    const rotate = (shape) => shape[0].map((_, i) => shape.map(r => r[i]).reverse());

    const draw = () => {
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Board
      board.forEach((row, r) => row.forEach((v, c) => {
        if (v) { ctx.fillStyle = v; ctx.fillRect(c * CELL, r * CELL, CELL - 1, CELL - 1); }
        else { ctx.strokeStyle = '#111'; ctx.strokeRect(c * CELL, r * CELL, CELL, CELL); }
      }));
      // Active piece
      piece.shape.forEach((row, r) => row.forEach((v, c) => {
        if (v) { ctx.fillStyle = piece.color; ctx.fillRect((piece.x + c) * CELL, (piece.y + r) * CELL, CELL - 1, CELL - 1); }
      }));
      // Ghost piece
      let ghostY = piece.y;
      while (fits(piece.shape, piece.x, ghostY + 1)) ghostY++;
      piece.shape.forEach((row, r) => row.forEach((v, c) => {
        if (v && ghostY !== piece.y) {
          ctx.strokeStyle = piece.color + '55';
          ctx.strokeRect((piece.x + c) * CELL, (ghostY + r) * CELL, CELL - 1, CELL - 1);
        }
      }));
      // Side panel
      ctx.fillStyle = '#006600'; ctx.font = '12px Courier New';
      ctx.fillText(`SCORE`, W + 8, 20); ctx.fillStyle = '#00ff00'; ctx.fillText(`${score}`, W + 8, 36);
      ctx.fillStyle = '#006600'; ctx.fillText(`LINES`, W + 8, 60); ctx.fillStyle = '#00ff00'; ctx.fillText(`${lines}`, W + 8, 76);
      ctx.fillStyle = '#006600'; ctx.fillText(`LEVEL`, W + 8, 100); ctx.fillStyle = '#00ff00'; ctx.fillText(`${level}`, W + 8, 116);

      if (!running) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ff4444'; ctx.font = 'bold 20px Courier New'; ctx.fillText('GAME OVER', 20, H / 2);
        ctx.font = '12px Courier New'; ctx.fillText('RST TO RESTART', 24, H / 2 + 24);
      }
    };

    let lastTime = 0;
    const update = (ts) => {
      if (!running) { draw(); return; }
      const dt = ts - lastTime; lastTime = ts;
      dropTimer += dt;
      const dropInterval = Math.max(100, 800 - (level - 1) * 70);
      if (dropTimer > dropInterval) {
        dropTimer = 0;
        if (fits(piece.shape, piece.x, piece.y + 1)) piece.y++;
        else lock();
      }
      draw();
      animId = requestAnimationFrame(update);
    };

    const handleKey = (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
      if (!running) { if (e.key === 'r' || e.key === 'R') { cancelAnimationFrame(animId); reset(); animId = requestAnimationFrame(update); } return; }
      if (e.key === 'ArrowLeft' && fits(piece.shape, piece.x - 1, piece.y)) piece.x--;
      if (e.key === 'ArrowRight' && fits(piece.shape, piece.x + 1, piece.y)) piece.x++;
      if (e.key === 'ArrowDown') { if (fits(piece.shape, piece.x, piece.y + 1)) piece.y++; else lock(); }
      if (e.key === 'ArrowUp' || e.key === 'z' || e.key === 'Z') {
        const r = rotate(piece.shape);
        if (fits(r, piece.x, piece.y)) piece.shape = r;
      }
      if (e.key === ' ') { while (fits(piece.shape, piece.x, piece.y + 1)) piece.y++; lock(); }
      if (e.key === 'r' || e.key === 'R') { cancelAnimationFrame(animId); reset(); animId = requestAnimationFrame(update); }
    };
    window.addEventListener('keydown', handleKey);
    animId = requestAnimationFrame(update);

    canvas._tetrisControl = (dir) => {
      if (!running) return;
      if (dir === 'left' && fits(piece.shape, piece.x - 1, piece.y)) piece.x--;
      if (dir === 'right' && fits(piece.shape, piece.x + 1, piece.y)) piece.x++;
      if (dir === 'down') { if (fits(piece.shape, piece.x, piece.y + 1)) piece.y++; else lock(); }
      if (dir === 'up') { const r = rotate(piece.shape); if (fits(r, piece.x, piece.y)) piece.shape = r; }
    };
    canvas._tetrisRestart = () => { cancelAnimationFrame(animId); reset(); animId = requestAnimationFrame(update); };

    return () => { cancelAnimationFrame(animId); window.removeEventListener('keydown', handleKey); };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={520} height={400} style={{ border: '2px solid #00ff00', display: 'block', margin: '0 auto', maxWidth: '100%' }} />
      <div style={{ marginTop: '8px', fontSize: '11px', color: '#006600' }}>↑ = ROTATE · ↓ = DROP · SPACE = HARD DROP</div>
      <TouchControls
        onDirection={(dir) => canvasRef.current?._tetrisControl(dir)}
        onRestart={() => canvasRef.current?._tetrisRestart()}
      />
    </div>
  );
}

// ─── GALAGA ───────────────────────────────────────────────────────────────────
function GalagaGame() {
  const canvasRef = useRef(null);
  const keysRef = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    let player, bullets, enemies, enemyBullets, score, lives, running, animId, frame;
    let stars = Array.from({ length: 60 }, () => ({ x: Math.random() * W, y: Math.random() * H, speed: Math.random() * 1.5 + 0.5, size: Math.random() * 2 + 0.5 }));

    const reset = () => {
      player = { x: W / 2, y: H - 40, w: 28, h: 20 };
      bullets = []; enemyBullets = [];
      score = 0; lives = 3; running = true; frame = 0;
      enemies = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
          enemies.push({
            x: 60 + c * 42, y: 40 + r * 36,
            baseX: 60 + c * 42, baseY: 40 + r * 36,
            alive: true,
            color: r < 2 ? '#ff4444' : r < 3 ? '#ff8800' : '#ffff00',
            type: r < 2 ? 'B' : r < 3 ? 'A' : 'C',
            offset: c * 0.3,
          });
        }
      }
    };
    reset();

    const drawPlayer = () => {
      const { x, y, w, h } = player;
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - w / 2, y + h);
      ctx.lineTo(x - w / 4, y + h * 0.7);
      ctx.lineTo(x, y + h * 0.4);
      ctx.lineTo(x + w / 4, y + h * 0.7);
      ctx.lineTo(x + w / 2, y + h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#88ff88';
      ctx.fillRect(x - 3, y + h * 0.4, 6, h * 0.3);
    };

    const drawEnemy = (e) => {
      ctx.fillStyle = e.color;
      const { x, y } = e;
      if (e.type === 'B') {
        ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(x - 3, y - 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 3, y - 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = e.color;
        ctx.fillRect(x - 8, y + 6, 5, 5); ctx.fillRect(x + 3, y + 6, 5, 5);
      } else if (e.type === 'A') {
        ctx.fillRect(x - 10, y - 8, 20, 16);
        ctx.fillStyle = '#000'; ctx.fillRect(x - 6, y - 4, 5, 6); ctx.fillRect(x + 1, y - 4, 5, 6);
        ctx.fillStyle = e.color;
        ctx.fillRect(x - 13, y - 2, 5, 8); ctx.fillRect(x + 8, y - 2, 5, 8);
      } else {
        ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x + 10, y + 8); ctx.lineTo(x - 10, y + 8); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      }
    };

    const update = () => {
      if (!running) return;
      frame++;

      // Stars
      stars.forEach(s => { s.y += s.speed; if (s.y > H) { s.y = 0; s.x = Math.random() * W; } });

      // Player movement
      if (keysRef.current['ArrowLeft'] && player.x - player.w / 2 > 0) player.x -= 5;
      if (keysRef.current['ArrowRight'] && player.x + player.w / 2 < W) player.x += 5;

      // Auto-fire
      if (frame % 15 === 0) bullets.push({ x: player.x, y: player.y, speed: 8 });

      // Move bullets
      bullets = bullets.filter(b => { b.y -= b.speed; return b.y > 0; });
      enemyBullets = enemyBullets.filter(b => { b.y += b.speed; return b.y < H; });

      // Enemy movement & shooting
      const alive = enemies.filter(e => e.alive);
      const t = frame * 0.02;
      enemies.forEach(e => {
        if (!e.alive) return;
        e.x = e.baseX + Math.sin(t + e.offset) * 20;
        e.y = e.baseY + Math.sin(t * 0.5 + e.offset) * 8;
      });

      if (frame % 60 === 0 && alive.length > 0) {
        const shooter = alive[Math.floor(Math.random() * alive.length)];
        enemyBullets.push({ x: shooter.x, y: shooter.y, speed: 4 });
      }

      // Bullet-enemy collision
      bullets.forEach(b => {
        enemies.forEach(e => {
          if (!e.alive) return;
          if (Math.abs(b.x - e.x) < 14 && Math.abs(b.y - e.y) < 14) {
            e.alive = false; b.y = -99;
            score += e.type === 'C' ? 100 : e.type === 'A' ? 150 : 200;
          }
        });
      });

      // Enemy bullet hit player
      enemyBullets.forEach(b => {
        if (Math.abs(b.x - player.x) < 15 && Math.abs(b.y - player.y) < 15) {
          lives--; b.y = H + 99;
          if (lives <= 0) running = false;
        }
      });

      // Win
      if (alive.length === 0) {
        enemies.forEach(e => { e.alive = true; e.baseY += 10; });
      }

      // Draw
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
      stars.forEach(s => { ctx.fillStyle = `rgba(255,255,255,${s.size / 3})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.size / 2, 0, Math.PI * 2); ctx.fill(); });
      enemies.forEach(e => { if (e.alive) drawEnemy(e); });
      drawPlayer();
      bullets.forEach(b => { ctx.fillStyle = '#ffff00'; ctx.fillRect(b.x - 2, b.y - 6, 4, 10); });
      enemyBullets.forEach(b => { ctx.fillStyle = '#ff4444'; ctx.fillRect(b.x - 2, b.y - 6, 4, 10); });

      ctx.fillStyle = '#006600'; ctx.font = '14px Courier New';
      ctx.fillText(`SCORE: ${score}`, 8, 20);
      ctx.fillText(`LIVES: ${'♥'.repeat(lives)}`, W - 100, 20);

      if (!running) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ff4444'; ctx.font = 'bold 24px Courier New'; ctx.fillText('GAME OVER', W / 2 - 70, H / 2);
        ctx.font = '14px Courier New'; ctx.fillText('PRESS R TO RESTART', W / 2 - 80, H / 2 + 30);
        return;
      }

      animId = requestAnimationFrame(update);
    };

    const handleKey = (e) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      keysRef.current[e.key] = e.type === 'keydown';
      if (e.type === 'keydown' && (e.key === 'r' || e.key === 'R')) { cancelAnimationFrame(animId); reset(); animId = requestAnimationFrame(update); }
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    animId = requestAnimationFrame(update);

    canvas._galagaControl = (dir) => {
      if (dir === 'left') keysRef.current['ArrowLeft'] = true;
      if (dir === 'right') keysRef.current['ArrowRight'] = true;
    };
    canvas._galagaRelease = (dir) => {
      if (dir === 'left') keysRef.current['ArrowLeft'] = false;
      if (dir === 'right') keysRef.current['ArrowRight'] = false;
    };
    canvas._galagaRestart = () => { cancelAnimationFrame(animId); reset(); animId = requestAnimationFrame(update); };

    return () => { cancelAnimationFrame(animId); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey); };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: '2px solid #00ff00', display: 'block', margin: '0 auto', maxWidth: '100%' }} />
      <div style={{ marginTop: '8px', fontSize: '11px', color: '#006600' }}>AUTO-FIRES · MOVE LEFT/RIGHT TO AIM</div>
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button style={{ ...btnStyle, width: '100px' }}
            onTouchStart={(e) => { e.preventDefault(); canvasRef.current?._galagaControl('left'); }}
            onTouchEnd={(e) => { e.preventDefault(); canvasRef.current?._galagaRelease('left'); }}
            onMouseDown={() => canvasRef.current?._galagaControl('left')}
            onMouseUp={() => canvasRef.current?._galagaRelease('left')}>◄ LEFT</button>
          <button style={{ ...btnStyle, backgroundColor: '#003300', fontSize: '13px' }}
            onTouchStart={(e) => { e.preventDefault(); canvasRef.current?._galagaRestart(); }}
            onMouseDown={() => canvasRef.current?._galagaRestart()}>RST</button>
          <button style={{ ...btnStyle, width: '100px' }}
            onTouchStart={(e) => { e.preventDefault(); canvasRef.current?._galagaControl('right'); }}
            onTouchEnd={(e) => { e.preventDefault(); canvasRef.current?._galagaRelease('right'); }}
            onMouseDown={() => canvasRef.current?._galagaControl('right')}
            onMouseUp={() => canvasRef.current?._galagaRelease('right')}>RIGHT ►</button>
        </div>
        <div style={{ fontSize: '11px', color: '#006600', marginTop: '4px' }}>HOLD TO MOVE · AUTO-FIRES</div>
      </div>
    </div>
  );
}

// ─── FROGGER ─────────────────────────────────────────────────────────────────
function FroggerGame() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const CELL = 40;
    const COLS = 10, ROWS = 10;

    const LANE_CONFIG = [
      { type: 'safe', color: '#1a1a00' },         // row 9 - start
      { type: 'road', color: '#1a1a1a', dir: -1, speed: 2.5, carColor: '#ff4444', carW: 70, carH: 24, count: 3 },
      { type: 'road', color: '#1a1a1a', dir: 1,  speed: 2.0, carColor: '#ff8800', carW: 50, carH: 24, count: 4 },
      { type: 'road', color: '#1a1a1a', dir: -1, speed: 3.0, carColor: '#ffff00', carW: 90, carH: 24, count: 2 },
      { type: 'road', color: '#1a1a1a', dir: 1,  speed: 1.5, carColor: '#cc44ff', carW: 60, carH: 24, count: 3 },
      { type: 'safe', color: '#002200' },         // row 4 - median
      { type: 'water', color: '#000055', dir: 1,  speed: 1.5, logColor: '#553300', logW: 80, logH: 28, count: 3 },
      { type: 'water', color: '#000055', dir: -1, speed: 2.0, logColor: '#664400', logW: 100, logH: 28, count: 2 },
      { type: 'water', color: '#000055', dir: 1,  speed: 2.5, logColor: '#442200', logW: 70, logH: 28, count: 3 },
      { type: 'goal', color: '#004400' },         // row 0 - top
    ];

    let frog, obstacles, score, lives, running, animId;

    const initObstacles = () => {
      obstacles = LANE_CONFIG.map((lane, row) => {
        if (lane.type !== 'road' && lane.type !== 'water') return [];
        const count = lane.count || 3;
        return Array.from({ length: count }, (_, i) => ({
          x: (i / count) * W * 1.2,
          y: row * CELL + CELL / 2,
          w: lane.logW || lane.carW,
          h: lane.logH || lane.carH,
          speed: lane.speed * lane.dir,
          color: lane.logColor || lane.carColor,
          type: lane.type,
        }));
      }).flat();
    };

    const reset = () => {
      frog = { x: W / 2, y: H - CELL / 2, onLog: null };
      score = 0; lives = 3; running = true;
      initObstacles();
    };
    reset();

    const drawFrog = () => {
      const { x, y } = frog;
      ctx.fillStyle = '#00ff00';
      ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#00cc00';
      ctx.beginPath(); ctx.arc(x - 8, y - 8, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 8, y - 8, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffff00';
      ctx.beginPath(); ctx.arc(x - 8, y - 8, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 8, y - 8, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#00aa00';
      ctx.fillRect(x - 16, y + 4, 8, 12); ctx.fillRect(x + 8, y + 4, 8, 12);
      ctx.fillRect(x - 20, y - 6, 8, 10); ctx.fillRect(x + 12, y - 6, 8, 10);
    };

    let frame = 0;
    const update = () => {
      if (!running) return;
      frame++;

      // Move obstacles
      obstacles.forEach(o => {
        o.x += o.speed;
        if (o.speed > 0 && o.x - o.w / 2 > W + 20) o.x = -o.w / 2 - 20;
        if (o.speed < 0 && o.x + o.w / 2 < -20) o.x = W + o.w / 2 + 20;
      });

      // Check frog on log
      const frogRow = Math.round((frog.y - CELL / 2) / CELL);
      const lane = LANE_CONFIG[frogRow];
      frog.onLog = null;

      if (lane && lane.type === 'water') {
        let onSomething = false;
        obstacles.filter(o => o.type === 'water').forEach(o => {
          if (Math.abs(o.y - frog.y) < CELL / 2 && frog.x > o.x - o.w / 2 && frog.x < o.x + o.w / 2) {
            frog.onLog = o; onSomething = true;
          }
        });
        if (!onSomething) {
          lives--; frog.x = W / 2; frog.y = H - CELL / 2;
          if (lives <= 0) running = false;
        }
      }

      // Move frog with log
      if (frog.onLog) frog.x += frog.onLog.speed;

      // Check road collision
      if (lane && lane.type === 'road') {
        obstacles.filter(o => o.type === 'road').forEach(o => {
          if (Math.abs(o.y - frog.y) < CELL / 2 && frog.x > o.x - o.w / 2 + 4 && frog.x < o.x + o.w / 2 - 4) {
            lives--; frog.x = W / 2; frog.y = H - CELL / 2;
            if (lives <= 0) running = false;
          }
        });
      }

      // Reached top
      if (frog.y < CELL) { score += 100; frog.x = W / 2; frog.y = H - CELL / 2; }

      // Off screen
      if (frog.x < 0 || frog.x > W) { lives--; frog.x = W / 2; frog.y = H - CELL / 2; if (lives <= 0) running = false; }

      // Draw
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, W, H);
      LANE_CONFIG.forEach((lane, i) => {
        ctx.fillStyle = lane.color;
        ctx.fillRect(0, i * CELL, W, CELL);
        if (i === 0) { ctx.fillStyle = '#003300'; ctx.font = '11px Courier New'; ctx.fillText('HOME', W / 2 - 20, i * CELL + 26); }
        if (i === 5) { ctx.fillStyle = '#004400'; ctx.font = '11px Courier New'; ctx.fillText('SAFE ZONE', W / 2 - 35, i * CELL + 26); }
        // Lane markers for road
        if (lane.type === 'road') {
          ctx.fillStyle = '#333';
          for (let x = 0; x < W; x += 40) ctx.fillRect(x, i * CELL + CELL / 2 - 2, 20, 4);
        }
        if (lane.type === 'water') {
          ctx.fillStyle = '#000088';
          for (let x = 0; x < W; x += 8) {
            ctx.fillStyle = `rgba(0,0,${100 + Math.sin((frame * 0.05) + x * 0.1) * 30},0.3)`;
            ctx.fillRect(x, i * CELL, 4, CELL);
          }
        }
      });
      obstacles.forEach(o => {
        ctx.fillStyle = o.color;
        ctx.beginPath();
        if (o.type === 'water') {
          ctx.roundRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h, 6);
          ctx.fill();
          ctx.fillStyle = '#664422';
          ctx.fillRect(o.x - o.w / 2 + 5, o.y - 3, o.w - 10, 6);
        } else {
          ctx.roundRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h, 4);
          ctx.fill();
          ctx.fillStyle = '#88aaff';
          const winW = Math.min(20, o.w * 0.25);
          ctx.fillRect(o.x - o.w / 2 + 6, o.y - o.h / 2 + 4, winW, o.h - 8);
          ctx.fillRect(o.x + o.w / 2 - 6 - winW, o.y - o.h / 2 + 4, winW, o.h - 8);
        }
      });
      drawFrog();

      ctx.fillStyle = '#006600'; ctx.font = '13px Courier New';
      ctx.fillText(`SCORE: ${score}  LIVES: ${'♥'.repeat(lives)}`, 8, 16);

      if (!running) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ff4444'; ctx.font = 'bold 24px Courier New'; ctx.fillText('GAME OVER', W / 2 - 70, H / 2);
        ctx.font = '14px Courier New'; ctx.fillText('PRESS R TO RESTART', W / 2 - 80, H / 2 + 30);
        return;
      }

      animId = requestAnimationFrame(update);
    };

    const handleKey = (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowUp') frog.y -= CELL;
      if (e.key === 'ArrowDown') frog.y = Math.min(H - CELL / 2, frog.y + CELL);
      if (e.key === 'ArrowLeft') frog.x -= CELL;
      if (e.key === 'ArrowRight') frog.x += CELL;
      if (e.key === 'r' || e.key === 'R') { cancelAnimationFrame(animId); reset(); animId = requestAnimationFrame(update); }
    };
    window.addEventListener('keydown', handleKey);
    animId = requestAnimationFrame(update);

    canvas._froggerControl = (dir) => {
      if (dir === 'up') frog.y -= CELL;
      if (dir === 'down') frog.y = Math.min(H - CELL / 2, frog.y + CELL);
      if (dir === 'left') frog.x -= CELL;
      if (dir === 'right') frog.x += CELL;
    };
    canvas._froggerRestart = () => { cancelAnimationFrame(animId); reset(); animId = requestAnimationFrame(update); };

    return () => { cancelAnimationFrame(animId); window.removeEventListener('keydown', handleKey); };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: '2px solid #00ff00', display: 'block', margin: '0 auto', maxWidth: '100%' }} />
      <TouchControls
        onDirection={(dir) => canvasRef.current?._froggerControl(dir)}
        onRestart={() => canvasRef.current?._froggerRestart()}
      />
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null);

  const renderGame = (game) => {
    if (game.game === 'snake') return <SnakeGame key={game.id} />;
    if (game.game === 'breakout') return <BreakoutGame key={game.id} />;
    if (game.game === 'pacman') return <PacmanGame key={game.id} />;
    if (game.game === 'tetris') return <TetrisGame key={game.id} />;
    if (game.game === 'galaga') return <GalagaGame key={game.id} />;
    if (game.game === 'frogger') return <FroggerGame key={game.id} />;
    return null;
  };

  return (
    <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: '"Courier New", Courier, monospace', color: '#00ff00' }}>
      <nav style={{ backgroundColor: '#111', borderBottom: '2px solid #00ff00', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <a href="/" style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px', color: '#00ff00', textDecoration: 'none' }}>
          &#9608; GAMER'S CONCLAVE
        </a>
        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', flexWrap: 'wrap' }}>
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
        <p style={{ fontSize: '13px', color: '#009900', margin: 0 }}>Classic games. Arrow keys or tap controls to play. No installs needed.</p>
      </div>

      {activeGame && (
        <div style={{ padding: '30px 20px', borderBottom: '1px solid #003300' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>&gt; NOW PLAYING: {activeGame.title}</div>
            <button onClick={() => setActiveGame(null)} style={{ backgroundColor: '#111', color: '#ff4444', border: '1px solid #ff4444', padding: '6px 16px', cursor: 'pointer', fontFamily: '"Courier New", monospace', fontSize: '12px' }}>[ EXIT GAME ]</button>
          </div>
          {renderGame(activeGame)}
        </div>
      )}

      <div style={{ padding: '30px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {GAMES.map(game => (
          <div key={game.id} style={{ border: activeGame?.id === game.id ? '1px solid #ffff00' : '1px solid #00ff00', backgroundColor: '#0d0d0d', padding: '20px' }}>
            <div style={{ width: '100%', height: '140px', marginBottom: '12px', border: '1px solid #003300', backgroundColor: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', overflow: 'hidden' }}>
              <div style={{ fontSize: '32px', lineHeight: 1 }}>{game.icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                {game.preview.map((row, i) => (
                  <div key={i} style={{ fontSize: '11px', color: '#004400', letterSpacing: '2px', fontFamily: '"Courier New", monospace' }}>{row}</div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '8px' }}>&gt; {game.title}</div>
            <div style={{ fontSize: '13px', color: '#009900', marginBottom: '16px' }}>{game.description}</div>
            <button
              onClick={() => { setActiveGame(game); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50); }}
              style={{ backgroundColor: activeGame?.id === game.id ? '#ffff00' : '#00ff00', color: '#000', border: 'none', padding: '8px 20px', fontSize: '13px', fontFamily: '"Courier New", monospace', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px' }}>
              {activeGame?.id === game.id ? '[ PLAYING ]' : '[ PLAY ]'}
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