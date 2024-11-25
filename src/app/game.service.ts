import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Player = 'red' | 'yellow';
export type Cell = Player | null;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly ROWS = 6;
  private readonly COLS = 7;
  private currentPlayer: Player = 'red';
  private board: Cell[][] = [];
  private gameOver = false;

  boardSubject = new BehaviorSubject<Cell[][]>([]);
  currentPlayerSubject = new BehaviorSubject<Player>('red');
  winnerSubject = new BehaviorSubject<Player | null>(null);

  constructor() {
    this.initializeBoard();
  }

  initializeBoard() {
    this.board = Array(this.ROWS).fill(null)
      .map(() => Array(this.COLS).fill(null));
    this.currentPlayer = 'red';
    this.gameOver = false;
    this.boardSubject.next(this.board);
    this.currentPlayerSubject.next(this.currentPlayer);
    this.winnerSubject.next(null);
  }

  makeMove(row: number, col: number): boolean {
    if (this.gameOver || this.board[row][col] !== null) {
      return false;
    }

    this.board[row][col] = this.currentPlayer;
    this.boardSubject.next(this.board);

    if (this.checkWin(row, col)) {
      this.gameOver = true;
      this.winnerSubject.next(this.currentPlayer);
      return true;
    }

    this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
    this.currentPlayerSubject.next(this.currentPlayer);
    return true;
  }

  private checkWin(row: number, col: number): boolean {
    const directions = [
      [[0, 1], [0, -1]],  // Horizontal
      [[1, 0], [-1, 0]],  // Vertical
      [[1, 1], [-1, -1]], // Diagonal
      [[1, -1], [-1, 1]]  // Anti-diagonal
    ];

    return directions.some(direction => {
      const count = 1 + this.countDirection(row, col, direction[0][0], direction[0][1]) +
                    this.countDirection(row, col, direction[1][0], direction[1][1]);
      return count >= 4;
    });
  }

  private countDirection(row: number, col: number, dRow: number, dCol: number): number {
    let count = 0;
    let currentRow = row + dRow;
    let currentCol = col + dCol;
    const player = this.board[row][col];

    while (
      currentRow >= 0 && currentRow < this.ROWS &&
      currentCol >= 0 && currentCol < this.COLS &&
      this.board[currentRow][currentCol] === player
    ) {
      count++;
      currentRow += dRow;
      currentCol += dCol;
    }

    return count;
  }
}