describe('Tetris class', () => {
  test('initial grid dimensions', async () => {
    const { Tetris } = await import('../src/tetris.js');
    const game = new Tetris(5, 8);
    expect(game.grid.length).toBe(8);
    expect(game.grid[0].length).toBe(5);
  });
});
