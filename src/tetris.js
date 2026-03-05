// Basic Tetris game logic with minimal pieces, collision, and line clearing

const SHAPES = {
  I: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
  O: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
  T: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }],
  S: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }],
  Z: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
  J: [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
  L: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
};

const COLORS = {
  I: '#00f',
  O: '#ff0',
  T: '#a0f',
  S: '#0f0',
  Z: '#f00',
  J: '#00a',
  L: '#fa0',
};

export class Tetris {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid();
    this.currentPiece = null;
    this.gameOver = false;
    this.score = 0;
    this.speed = 1; // multiplier, 1=normal
  }

  createGrid() {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => 0)
    );
  }

  spawnPiece(forcedShape) {
    const types = Object.keys(SHAPES);
    const shape = forcedShape || types[Math.floor(Math.random() * types.length)];
    const blocks = SHAPES[shape].map(({x,y})=>({x,y})); // copy
    const color = COLORS[shape] || '#000';
    // start at horizontal center, top
    const candidate = {
      shape,
      blocks,
      color,
      x: Math.floor(this.width / 2),
      y: 0,
    };
    // if new piece doesn't fit, game over
    this.currentPiece = candidate;
    if (!this._pieceFits(candidate.x, candidate.y)) {
      this.gameOver = true;
    }
  }

  movePiece(dx) {
    if (!this.currentPiece) return;
    const newX = this.currentPiece.x + dx;
    if (this._pieceFits(newX, this.currentPiece.y)) {
      this.currentPiece.x = newX;
    }
  }

  setSpeed(multiplier) {
    this.speed = multiplier;
  }

  getInterval() {
    // base 1000ms per drop at speed 1
    return 1000 / this.speed;
  }

  rotatePiece() {
    if (!this.currentPiece) return;
    // perform clockwise rotation: (x,y) -> (-y,x)
    const rotated = this.currentPiece.blocks.map(b => ({ x: -b.y, y: b.x }));
    // check bounds/collision at current position
    const original = this.currentPiece.blocks;
    this.currentPiece.blocks = rotated;
    if (!this._pieceFits(this.currentPiece.x, this.currentPiece.y)) {
      // revert if invalid
      this.currentPiece.blocks = original;
    }
  }

  tick() {
    if (!this.currentPiece) return;
    const newY = this.currentPiece.y + 1;
    if (this._pieceFits(this.currentPiece.x, newY)) {
      this.currentPiece.y = newY;
    } else {
      // cannot move down -> fix piece
      this._fixPiece();
      this.clearLines();
      this.spawnPiece();
    }
  }

  _pieceFits(x, y) {
    // check if all blocks of currentPiece would be in bounds and not colliding
    for (const b of this.currentPiece.blocks) {
      const px = x + b.x;
      const py = y + b.y;
      if (px < 0 || px >= this.width || py < 0 || py >= this.height) {
        return false;
      }
      if (this.grid[py][px] !== 0) {
        return false;
      }
    }
    return true;
  }

  _fixPiece() {
    if (!this.currentPiece) return;
    for (const b of this.currentPiece.blocks) {
      const px = this.currentPiece.x + b.x;
      const py = this.currentPiece.y + b.y;
      if (py >= 0 && py < this.height && px >= 0 && px < this.width) {
        this.grid[py][px] = this.currentPiece.color;
      }
    }
    this.currentPiece = null;
  }

  clearLines() {
    const newGrid = [];
    let cleared = 0;
    for (const row of this.grid) {
      if (row.every((v) => v !== 0)) {
        cleared += 1;
      } else {
        newGrid.push(row);
      }
    }
    while (newGrid.length < this.height) {
      newGrid.unshift(Array(this.width).fill(0));
    }
    this.grid = newGrid;
    if (cleared > 0) {
      // simple scoring: 100 points per line
      this.score += cleared * 100;
    }
    return cleared;
  }

  // additional game logic (rotation) will follow

  reset() {
    this.grid = this.createGrid();
    this.currentPiece = null;
    this.gameOver = false;
    this.score = 0;
  }
}
