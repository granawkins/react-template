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

const drawDecoElement = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  isGold = false
) => {
  // Create gradient for art deco style
  const gradient = context.createLinearGradient(x, y, x + width, y + height);
  if (isGold) {
    gradient.addColorStop(0, '#D4AF37');
    gradient.addColorStop(0.5, '#FFD700');
    gradient.addColorStop(1, '#D4AF37');
  } else {
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(0.5, '#f0f0f0');
    gradient.addColorStop(1, '#fff');
  }
  
  context.fillStyle = gradient;
  context.shadowBlur = 10;
  context.shadowColor = isGold ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
  context.fillRect(x, y, width, height);
  context.shadowBlur = 0;
};

const drawDecoPattern = (context: CanvasRenderingContext2D) => {
  // Draw art deco border pattern
  context.strokeStyle = '#D4AF37';
  context.lineWidth = 2;
  
  // Top and bottom borders
  for (let x = 20; x < CANVAS_WIDTH - 20; x += 40) {
    context.beginPath();
    context.moveTo(x, 10);
    context.lineTo(x + 20, 10);
    context.stroke();
    
    context.beginPath();
    context.moveTo(x, CANVAS_HEIGHT - 10);
    context.lineTo(x + 20, CANVAS_HEIGHT - 10);
    context.stroke();
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

      // Clear canvas with art deco background
      const bgGradient = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      bgGradient.addColorStop(0, '#1a1a1a');
      bgGradient.addColorStop(1, '#000000');
      context.fillStyle = bgGradient;
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw decorative patterns
      drawDecoPattern(context);

      // Draw center line with art deco style
      context.strokeStyle = '#D4AF37';
      context.lineWidth = 2;
      for (let y = 10; y < CANVAS_HEIGHT - 10; y += 30) {
        context.beginPath();
        context.moveTo(CANVAS_WIDTH / 2, y);
        context.lineTo(CANVAS_WIDTH / 2, y + 15);
        context.stroke();
      }

      // Draw paddles with art deco style
      drawDecoElement(context, 0, gameState.leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, true);
      drawDecoElement(
        context,
        CANVAS_WIDTH - PADDLE_WIDTH,
        gameState.rightPaddle.y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        true
      );

      // Draw ball with art deco style
      drawDecoElement(context, gameState.ball.x, gameState.ball.y, BALL_SIZE, BALL_SIZE);

      // Draw scores with art deco style
      context.font = '32px "Playfair Display", serif';
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
        background: 'linear-gradient(145deg, #2C2C2C, #1a1a1a)',
        border: '2px solid #D4AF37',
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.1)',
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
          color: '#D4AF37',
          textTransform: 'uppercase',
          letterSpacing: '8px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          fontFamily: '"Poiret One", cursive',
          fontSize: '36px',
          fontWeight: 'bold'
        }}>Pong</h2>
        <p style={{
          color: '#D4AF37',
          margin: '15px 0 0',
          fontSize: '14px',
          fontFamily: '"Playfair Display", serif',
          letterSpacing: '2px'
        }}>Use W/S and ↑/↓ to control paddles</p>
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
            linear-gradient(45deg, transparent 45%, #D4AF37 45%, #D4AF37 55%, transparent 55%),
            linear-gradient(-45deg, transparent 45%, #D4AF37 45%, #D4AF37 55%, transparent 55%)
          `,
          backgroundSize: '30px 30px',
          pointerEvents: 'none',
          opacity: 0.1,
        }} />
      </div>
    </div>
  );
};

export default PongGame;