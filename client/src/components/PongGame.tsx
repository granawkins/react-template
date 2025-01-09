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

      // Clear canvas
      context.fillStyle = 'black';
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw center line
      context.setLineDash([5, 15]);
      context.beginPath();
      context.moveTo(CANVAS_WIDTH / 2, 0);
      context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      context.strokeStyle = 'white';
      context.stroke();
      context.setLineDash([]);

      // Draw paddles
      context.fillStyle = 'white';
      context.fillRect(0, gameState.leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      context.fillRect(
        CANVAS_WIDTH - PADDLE_WIDTH,
        gameState.rightPaddle.y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      );

      // Draw ball
      context.fillRect(gameState.ball.x, gameState.ball.y, BALL_SIZE, BALL_SIZE);

      // Draw scores
      context.font = '32px Arial';
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
    <div className="card" style={{ padding: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Pong</h2>
        <p className="info">Use W/S and ↑/↓ to control paddles</p>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ display: 'block', margin: '0 auto' }}
      />
    </div>
  );
};

export default PongGame;