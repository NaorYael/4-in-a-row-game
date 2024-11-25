import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService, Cell } from '../game.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-board',
  standalone: true, 
  imports: [CommonModule],
  template: `
<div class="container">
    <div class="game-info">
      <h1>4 in a Row</h1>
        <div class="current-player" *ngIf="!winner" [@fadeInOut]>
          Current Player: <span [style.color]="currentPlayer === 'red' ? '#f44336' : '#ffd700'">{{currentPlayer}}</span>
        </div>
      <div class="winner-announcement" *ngIf="winner" [@bounceIn]>
          Winner: {{winner}}!
        </div>
    </div>
    <div class="board">
      <div class="board-row" *ngFor="let row of board; let i = index">
        <div
          *ngFor="let cell of row; let j = index"
          class="cell"
          [class.red]="cell === 'red'"
          [class.yellow]="cell === 'yellow'"
[class.animated]="isNewMove(i, j)"
          (click)="makeMove(i, j)"
[@cellState]="cell || 'empty'"
        ></div>
      </div>
</div>
      <button class="reset-button" (click)="resetGame()" [@buttonPop]>Reset Game</button>
    </div>
    `,
  animations: [
    trigger('cellState', [
      state(
        'empty',
        style({
          transform: 'scale(1)',
        })
      ),
      state(
        'red',
        style({
          transform: 'scale(1)',
        })
      ),
      state(
        'yellow',
        style({
          transform: 'scale(1)',
        })
      ),
      transition('empty => *', [
        style({ transform: 'scale(0)' }),
      ]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('bounceIn', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate(
          '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ transform: 'scale(1)' })
        ),
      ]),
    ]),
    trigger('buttonPop', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate(
          '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ transform: 'scale(1)' })
        ),
      ]),
    ]),
  ],
})
export class BoardComponent {
  board: Cell[][] = [];
  currentPlayer: string = '';
  winner: string | null = null;
  lastMove: { row: number; col: number } | null = null;

  constructor(private gameService: GameService) {
    this.gameService.boardSubject.subscribe((board) => (this.board = board));
    this.gameService.currentPlayerSubject.subscribe(
      (player) => (this.currentPlayer = player)
    );
    this.gameService.winnerSubject.subscribe(
      (winner) => (this.winner = winner)
    );
  }

  makeMove(row: number, col: number): void {
    if (this.gameService.makeMove(row, col)) {
      this.lastMove = { row, col };
      setTimeout(() => (this.lastMove = null), 500); // Reset animation after it completes
    }
  }

  resetGame(): void {
this.lastMove = null;
    this.gameService.initializeBoard();
  }

  isNewMove(row: number, col: number): boolean {
    return this.lastMove?.row === row && this.lastMove?.col === col;
  }
}
