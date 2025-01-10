import { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const BALL_SIZE = 10;
const PADDLE_SPEED = 5;
const BALL_SPEED = 5;

interface GameState {
  ball: { x: number; y: number; dx: number; dy: number };
  leftPaddle: { y: number };
  rightPaddle: { y: number };
  leftScore: number;
  rightScore: number;
}

const drawSciFiElement = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  isNeon = false
) => {
  // Create gradient for sci-fi style
  const gradient = context.createLinearGradient(x, y, x + width, y + height);
  if (isNeon) {
    gradient.addColorStop(0, '#00ff9f');   // Neon green
    gradient.addColorStop(0.5, '#00ffdd'); // Cyan
    gradient.addColorStop(1, '#00ff9f');   // Neon green
  } else {
    gradient.addColorStop(0, '#4df0ff');   // Bright cyan
    gradient.addColorStop(0.5, '#0099ff'); // Blue
    gradient.addColorStop(1, '#4df0ff');   // Bright cyan
  }
  
  // Draw main shape
  context.fillStyle = gradient;
  context.fillRect(x, y, width, height);
  
  // Add neon glow effect
  context.shadowBlur = 15;
  context.shadowColor = isNeon ? '#00ff9f' : '#4df0ff';
  context.strokeStyle = isNeon ? '#00ffdd' : '#0099ff';
  context.lineWidth = 1;
  context.strokeRect(x, y, width, height);
  
  // Add highlight
  context.fillStyle = 'rgba(255, 255, 255, 0.3)';
  context.fillRect(x, y, width, 2);
  
  context.shadowBlur = 0;
};

const drawSciFiGrid = (context: CanvasRenderingContext2D) => {
  // Draw futuristic grid pattern
  context.strokeStyle = 'rgba(0, 255, 255, 0.1)';
  context.lineWidth = 1;
  
  // Draw horizontal lines
  for (let y = 20; y < CANVAS_HEIGHT; y += 40) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(CANVAS_WIDTH, y);
    context.stroke();
  }
  
  // Draw vertical lines
  for (let x = 20; x < CANVAS_WIDTH; x += 40) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, CANVAS_HEIGHT);
    context.stroke();
  }
  
  // Add some random "data points"
  context.fillStyle = '#00ff9f';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * CANVAS_WIDTH;
    const y = Math.random() * CANVAS_HEIGHT;
    context.fillRect(x, y, 2, 2);
    context.shadowBlur = 5;
    context.shadowColor = '#00ff9f';
    context.fillRect(x, y, 2, 2);
    context.shadowBlur = 0;
  }
};

const PongGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    ball: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: BALL_SPEED,
      dy: BALL_SPEED,
    },
    leftPaddle: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    rightPaddle: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    leftScore: 0,
    rightScore: 0,
  });
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId: number;

    const update = () => {
      setGameState(prevState => {
        const newState = { ...prevState };

        // Update paddle positions based on key presses
        if (keysPressed.current.has('w') && newState.leftPaddle.y > 0) {
          newState.leftPaddle.y -= PADDLE_SPEED;
        }
        if (keysPressed.current.has('s') && newState.leftPaddle.y < CANVAS_HEIGHT - PADDLE_HEIGHT) {
          newState.leftPaddle.y += PADDLE_SPEED;
        }
        if (keysPressed.current.has('ArrowUp') && newState.rightPaddle.y > 0) {
          newState.rightPaddle.y -= PADDLE_SPEED;
        }
        if (keysPressed.current.has('ArrowDown') && newState.rightPaddle.y < CANVAS_HEIGHT - PADDLE_HEIGHT) {
          newState.rightPaddle.y += PADDLE_SPEED;
        }

        // Update ball position
        newState.ball.x += newState.ball.dx;
        newState.ball.y += newState.ball.dy;

        // Ball collision with top and bottom walls
        if (newState.ball.y <= 0 || newState.ball.y >= CANVAS_HEIGHT - BALL_SIZE) {
          newState.ball.dy *= -1;
        }

        // Ball collision with paddles
        const ballInLeftPaddleRange =
          newState.ball.x <= PADDLE_WIDTH &&
          newState.ball.y >= newState.leftPaddle.y &&
          newState.ball.y <= newState.leftPaddle.y + PADDLE_HEIGHT;

        const ballInRightPaddleRange =
          newState.ball.x >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
          newState.ball.y >= newState.rightPaddle.y &&
          newState.ball.y <= newState.rightPaddle.y + PADDLE_HEIGHT;

        if (ballInLeftPaddleRange || ballInRightPaddleRange) {
          newState.ball.dx *= -1;
        }

        // Score points and reset ball
        if (newState.ball.x <= 0) {
          newState.rightScore += 1;
          newState.ball = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            dx: BALL_SPEED,
            dy: BALL_SPEED,
          };
        } else if (newState.ball.x >= CANVAS_WIDTH) {
          newState.leftScore += 1;
          newState.ball = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            dx: -BALL_SPEED,
            dy: BALL_SPEED,
          };
        }

        return newState;
      });
    };

    const render = () => {
      if (!context) return;

      // Clear canvas with sci-fi background
      const bgGradient = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      bgGradient.addColorStop(0, '#000033');  // Deep space blue
      bgGradient.addColorStop(1, '#000066');  // Slightly lighter space blue
      context.fillStyle = bgGradient;
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw grid pattern
      drawSciFiGrid(context);

      // Draw center line with digital effect
      context.strokeStyle = '#00ffdd';
      context.lineWidth = 2;
      context.shadowBlur = 10;
      context.shadowColor = '#00ffdd';
      
      for (let y = 10; y < CANVAS_HEIGHT; y += 20) {
        context.beginPath();
        context.moveTo(CANVAS_WIDTH / 2, y);
        context.lineTo(CANVAS_WIDTH / 2, y + 10);
        context.stroke();
      }
      context.shadowBlur = 0;

      // Draw paddles with sci-fi style
      drawSciFiElement(context, 0, gameState.leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, true);
      drawSciFiElement(
        context,
        CANVAS_WIDTH - PADDLE_WIDTH,
        gameState.rightPaddle.y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        true
      );

      // Draw ball with sci-fi style
      drawSciFiElement(context, gameState.ball.x, gameState.ball.y, BALL_SIZE, BALL_SIZE);

      // Draw scores with sci-fi style
      context.font = '32px "Share Tech Mono", monospace';
      context.fillStyle = '#00ffdd';
      context.shadowBlur = 10;
      context.shadowColor = '#00ffdd';
      context.textAlign = 'center';
      context.fillText(gameState.leftScore.toString(), CANVAS_WIDTH / 4, 50);
      context.fillText(gameState.rightScore.toString(), (CANVAS_WIDTH * 3) / 4, 50);
    };

    const gameLoop = () => {
      update();
      render();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState]);

  return (
    <div 
      className="card" 
      style={{ 
        padding: '2rem',
        background: 'linear-gradient(145deg, #000033, #000066)',
        border: '2px solid #00ffdd',
        boxShadow: '0 0 30px rgba(0, 255, 221, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '1.5rem',
        position: 'relative',
        zIndex: 2
      }}>
        <h2 style={{ 
          margin: 0,
          color: '#00ffdd',
          textTransform: 'uppercase',
          letterSpacing: '6px',
          textShadow: '0 0 10px rgba(0, 255, 221, 0.5)',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: '36px',
          fontWeight: 'bold'
        }}>P.O.N.G</h2>
        <p style={{
          color: '#4df0ff',
          margin: '15px 0 0',
          fontSize: '14px',
          fontFamily: '"Share Tech Mono", monospace',
          letterSpacing: '2px'
        }}>SYSTEM: USE W/S AND ↑/↓ TO CONTROL PADDLES</p>
      </div>
      <div style={{
        position: 'relative',
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        margin: '0 auto',
      }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ 
            display: 'block',
            background: '#000',
            borderRadius: '4px',
            border: '2px solid #333'
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, transparent 50%, rgba(0, 255, 221, 0.05) 50%),
            linear-gradient(rgba(0, 255, 221, 0.05) 50%, transparent 50%)
          `,
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
          opacity: 0.1,
        }} />
      </div>
    </div>
  );
};

export default PongGame;