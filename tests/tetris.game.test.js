import { Tetris } from '../src/tetris.js';

describe('Tetris gameplay', () => {
  let game;
  beforeEach(() => {
    game = new Tetris(10, 20);
  });

  test('spawn piece at top center', () => {
    game.spawnPiece();
    expect(game.currentPiece).toBeDefined();
    expect(game.currentPiece.x).toBe(Math.floor(game.width / 2));
    expect(game.currentPiece.y).toBe(0);
  });

  test('forced spawn uses given shape', () => {
    game.spawnPiece('I');
    expect(game.currentPiece.shape).toBe('I');
  });

  test('spawned shape is valid type and has color', () => {
    game.spawnPiece();
    expect(['I', 'O', 'T', 'S', 'Z', 'J', 'L']).toContain(
      game.currentPiece.shape
    );
    expect(typeof game.currentPiece.color).toBe('string');
    expect(game.currentPiece.color.length).toBeGreaterThan(0);
  });

  test('move piece left and right', () => {
    game.spawnPiece();
    const startX = game.currentPiece.x;
    game.movePiece(-1);
    expect(game.currentPiece.x).toBe(startX - 1);
    game.movePiece(1);
    expect(game.currentPiece.x).toBe(startX);
  });

  test('tick drops piece by one', () => {
    game.spawnPiece();
    const startY = game.currentPiece.y;
    game.tick();
    expect(game.currentPiece.y).toBe(startY + 1);
  });

  test('rotate piece clockwise and respect bounds', () => {
    game.spawnPiece('J');
    // move down a row so rotation won't immediately collide with top
    game.currentPiece.y = 1;
    const original = game.currentPiece.blocks.map(b => ({ ...b }));
    game.rotatePiece();
    // after one rotation blocks should have changed
    expect(game.currentPiece.blocks).not.toEqual(original);
    // rotate back three times should return to original orientation
    game.rotatePiece();
    game.rotatePiece();
    game.rotatePiece();
    expect(game.currentPiece.blocks).toEqual(original);
  });

  test('piece fixes at bottom and grid is updated', () => {
    game.spawnPiece();
    // move piece to the bottom
    game.currentPiece.y = game.height - 1;
    const x = game.currentPiece.x;
    const color = game.currentPiece.color;
    game.tick();
    // after tick, a new piece should spawn
    expect(game.currentPiece.y).toBe(0);
    // the cell where previous piece landed should be filled with color
    expect(game.grid[game.height - 1][x]).toBe(color);
  });

  test('clears a full line', () => {
    // manually fill the bottom row with a color string
    game.grid[game.height - 1] = Array(game.width).fill('red');
    game.clearLines();
    // bottom row should now be empty (shifted down)
    expect(game.grid[game.height - 1].every((v) => v === 0)).toBe(true);
  });

  test('game over when piece cannot spawn', () => {
    // fill top row so spawn fails
    game.grid[0] = Array(game.width).fill('blue');
    game.spawnPiece();
    expect(game.gameOver).toBe(true);
  });

  test('score increases when lines are cleared', () => {
    expect(game.score).toBe(0);
    game.grid[game.height - 1] = Array(game.width).fill('red');
    const cleared = game.clearLines();
    expect(cleared).toBe(1);
    expect(game.score).toBeGreaterThan(0);
  });

  test('speed multiplier affects interval', () => {
    expect(game.speed).toBe(1);
    expect(game.getInterval()).toBe(1000);
    game.setSpeed(2);
    expect(game.speed).toBe(2);
    expect(game.getInterval()).toBe(500);
    game.setSpeed(0.5);
    expect(game.getInterval()).toBe(2000);
  });

  test('reset clears grid and score and gameOver flag', () => {
    game.score = 500;
    game.gameOver = true;
    game.grid[0] = Array(game.width).fill('x');
    game.reset();
    expect(game.score).toBe(0);
    expect(game.gameOver).toBe(false);
    expect(game.grid.every((row) => row.every((v) => v === 0))).toBe(true);
  });
});
