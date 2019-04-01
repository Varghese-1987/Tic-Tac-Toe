import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { GameService } from '../app/services/game.service';
import { GameResources } from '../app/resources/game-resources'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [GameService]
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
  }
  title = 'tic-tac-toe';
  lock = false;

  constructor(public gs: GameService, public snackBar: MatSnackBar) {

  }

  newGame() {
    this.gs.freeBlocksRemaining = 9;
    this.gs.initBlocks();
    this.gs.initPlayers();
    this.lock = false;
    this.gs.turn = 0;
  }

  resetGame(event) {
    location.reload();
    event.preventDefault();
  }

  playerClick(i) {
    if (this.gs.blocks[i].free == false || this.lock) { // If Block is already fill, don't Do anything
      return;
    }

    this.gs.freeBlocksRemaining -= 1; // Reduce no. of free blocks after each selection

    if (this.gs.freeBlocksRemaining <= 0) {

      this.gs.draw += 1;
      this.lock = true;
      this.snackBar.open("Game:", "Draw", {
        duration: 4000,
      });
      this.newGame();
      return;
    }


    this.gs.blocks[i].free = false;

    if (this.gs.turn == 0) { // Player1 Turn
      this.gs.blocks[i].setValue(GameResources.player_value);

    } else { // Bot Turn
      this.gs.blocks[i].setValue(GameResources.bot_value);
    }

    var complete = this.gs.blockSetComplete();

    if (complete == false) {
      this.changeTurn();
      return;

    } else {
      this.lock = true;
      this.gs.players[this.gs.turn].score += 1;
      this.snackBar.open("Winner:", "Player " + (this.gs.turn + 1), {
        duration: 4000,
      });

      this.newGame();
      return;
    }

  }


  botTurn() {

    if (this.gs.freeBlocksRemaining <= 0) {
      return;
    }

    var bot_selected = this.gs.figureBotMove() - 1;

    if (this.gs.blocks[bot_selected].free == true) {
      this.playerClick(bot_selected);
    } else {
      this.botTurn();
      return;
    }

  }


  changeTurn() {
    var player = this.gs.changeTurn();
    if (player == 1) { // Bot Turn
      this.botTurn();
    }
  }
  trackByFn(index, item) { 
    return item.id; 
  }
  
}
