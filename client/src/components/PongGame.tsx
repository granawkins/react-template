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

const drawNouveauElement = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  isAccent = false
) => {
  // Create gradient for art nouveau style
  const gradient = context.createLinearGradient(x, y, x + width, y + height);
  if (isAccent) {
    gradient.addColorStop(0, '#8B4513');   // Saddle brown
    gradient.addColorStop(0.5, '#CD853F'); // Peru
    gradient.addColorStop(1, '#8B4513');   // Saddle brown
  } else {
    gradient.addColorStop(0, '#F5DEB3');   // Wheat
    gradient.addColorStop(0.5, '#DEB887'); // Burlywood
    gradient.addColorStop(1, '#F5DEB3');   // Wheat
  }
  
  context.fillStyle = gradient;
  context.shadowBlur = 8;
  context.shadowColor = isAccent ? 'rgba(139, 69, 19, 0.4)' : 'rgba(245, 222, 179, 0.4)';
  
  // Draw with curved corners
  context.beginPath();
  context.moveTo(x + 5, y);
  context.lineTo(x + width - 5, y);
  context.quadraticCurveTo(x + width, y, x + width, y + 5);
  context.lineTo(x + width, y + height - 5);
  context.quadraticCurveTo(x + width, y + height, x + width - 5, y + height);
  context.lineTo(x + 5, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - 5);
  context.lineTo(x, y + 5);
  context.quadraticCurveTo(x, y, x + 5, y);
  context.fill();
  context.shadowBlur = 0;
};

const drawNouveauPattern = (context: CanvasRenderingContext2D) => {
  // Draw art nouveau floral border pattern
  context.strokeStyle = '#8B4513';
  context.lineWidth = 2;
  
  const drawCurve = (startX: number, startY: number, controlX: number, controlY: number, endX: number, endY: number) => {
    context.beginPath();
    context.moveTo(startX, startY);
    context.quadraticCurveTo(controlX, controlY, endX, endY);
    context.stroke();
  };

  // Draw flowing vine patterns
  for (let x = 20; x < CANVAS_WIDTH - 20; x += 80) {
    // Top border vine
    drawCurve(x, 10, x + 20, 5, x + 40, 10);
    drawCurve(x + 40, 10, x + 60, 15, x + 80, 10);
    
    // Bottom border vine
    drawCurve(x, CANVAS_HEIGHT - 10, x + 20, CANVAS_HEIGHT - 15, x + 40, CANVAS_HEIGHT - 10);
    drawCurve(x + 40, CANVAS_HEIGHT - 10, x + 60, CANVAS_HEIGHT - 5, x + 80, CANVAS_HEIGHT - 10);
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

      // Clear canvas with art nouveau background
      const bgGradient = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      bgGradient.addColorStop(0, '#2F4F4F');  // Dark slate gray
      bgGradient.addColorStop(1, '#1a332f');  // Darker green
      context.fillStyle = bgGradient;
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw decorative patterns
      drawNouveauPattern(context);

      // Draw center line with flowing vine pattern
      context.strokeStyle = '#8B4513';
      context.lineWidth = 2;
      let prevX = CANVAS_WIDTH / 2;
      let prevY = 0;
      for (let y = 20; y < CANVAS_HEIGHT; y += 40) {
        const offsetX = Math.sin(y * 0.05) * 5;
        context.beginPath();
        context.moveTo(prevX, prevY);
        context.quadraticCurveTo(
          CANVAS_WIDTH / 2 + offsetX,
          (prevY + y) / 2,
          CANVAS_WIDTH / 2,
          y
        );
        context.stroke();
        prevX = CANVAS_WIDTH / 2;
        prevY = y;
      }

      // Draw paddles with art nouveau style
      drawNouveauElement(context, 0, gameState.leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, true);
      drawNouveauElement(
        context,
        CANVAS_WIDTH - PADDLE_WIDTH,
        gameState.rightPaddle.y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        true
      );

      // Draw ball with art nouveau style
      drawNouveauElement(context, gameState.ball.x, gameState.ball.y, BALL_SIZE, BALL_SIZE);

      // Draw scores with art nouveau style
      context.font = '32px "Cinzel Decorative", serif';
      context.fillStyle = '#CD853F';
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
        background: 'linear-gradient(145deg, #2F4F4F, #1a332f)',
        border: '2px solid #8B4513',
        boxShadow: '0 0 30px rgba(139, 69, 19, 0.2)',
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
          color: '#CD853F',
          textTransform: 'capitalize',
          letterSpacing: '4px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          fontFamily: '"Cinzel Decorative", serif',
          fontSize: '42px',
          fontWeight: 'bold'
        }}>Pong</h2>
        <p style={{
          color: '#DEB887',
          margin: '15px 0 0',
          fontSize: '16px',
          fontFamily: '"Cormorant Garamond", serif',
          letterSpacing: '1px',
          fontStyle: 'italic'
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
            radial-gradient(circle at 50% 50%, #8B4513 2px, transparent 2px),
            radial-gradient(circle at 0% 50%, #8B4513 1px, transparent 1px),
            radial-gradient(circle at 100% 50%, #8B4513 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px',
          pointerEvents: 'none',
          opacity: 0.1,
        }} />
      </div>
    </div>
  );
};

export default PongGame;