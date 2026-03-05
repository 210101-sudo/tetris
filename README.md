# tetris

This repository contains a **Tetris** game project built with a **Test-Driven Development (TDD)** workflow. The game runs in the browser and is deployed to GitHub Pages via GitHub Actions.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the test suite:
   ```bash
   npm test
   ```
   Tests are written before the corresponding functionality (TDD).
3. Run the development server with Vite:
   ```bash
   npm run dev
   ```
   This serves the files under `src/` and automatically opens the browser.
   You can also use `npm start` as an alias.
4. When you're ready to push to `main`, the CI pipeline will run the tests and publish the contents of `src/` to GitHub Pages automatically.

## Project structure

- `src/` – application source code (ES modules) and the Vite root
- `tests/` – Jest tests exercising the logic
- `dist/` – generated production build (deployed to GitHub Pages)
- `.github/workflows/deploy.yml` – GitHub Actions workflow for testing, building, and deployment

Feel free to continue developing the game by adding classes, functions, and matching tests!

## Gameplay so far

- Pieces are selected randomly from the classic seven Tetris shapes (`I`, `O`, `T`, `S`, `Z`, `J`, `L`).
- Each shape has its own color.
- A piece appears at the top center and slowly falls one row per second.
- Use the **arrow keys** to move and rotate:
  - ← and → shift left/right
  - ↓ pushes the piece down one step
  - ↑ rotates the current piece clockwise (if there is room)
- When a piece can no longer move downward it becomes fixed in place, and a new piece spawns.
- Completely filled rows are cleared automatically and the above rows shift down; you earn 100 points per line cleared.
- A score counter and controls are displayed in a panel to the left of the playfield.
- The board is now rendered at 80 % of the previous size (320×640 canvas), with controls beside it.
- The page includes **Start** and **Restart** buttons; after a game over the `Restart` button appears to run a fresh game.
- If a new piece cannot be spawned (stack reaches the top), the game ends and a "Game Over" message is displayed.

Continue expanding functionality via tests: rotation, collision with other pieces, scoring, preview of next piece, etc.
