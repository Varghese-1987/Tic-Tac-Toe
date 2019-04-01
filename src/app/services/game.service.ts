import { Injectable } from '@angular/core';
import { Player } from '../models/player';
import { Block } from '../models/block';
import { GameResources } from '../resources/game-resources';
@Injectable({
  providedIn: 'root'
})
export class GameService {
  players = []
  turn: number = 0;
  draw: number = 0;

  blocks = [];
  freeBlocksRemaining = 9;
  constructor() {
    this.initBlocks();
    this.initPlayers();
  }


  initBlocks() {
    this.blocks = [];
    for (var i = 1; i <= 9; ++i) {
      var block = new Block();
      this.blocks.push(block);
    }
  }

  initPlayers() {
    // Player1
    var player1 = new Player();
    player1.bot = false;

    // Bot
    var player2 = new Player();
    this.players.push(player1);
    this.players.push(player2);
  }

  changeTurn() {

    if (this.turn == 1) {
      this.turn = 0;
    } else {
      this.turn = 1;
    }

    return this.turn;
  }

  blockSetComplete() {
    var block1 = this.blocks[0];
    var block2 = this.blocks[1];
    var block3 = this.blocks[2];

    var block4 = this.blocks[3];
    var block5 = this.blocks[4];
    var block6 = this.blocks[5];

    var block7 = this.blocks[6];
    var block8 = this.blocks[7];
    var block9 = this.blocks[8];

    if (
      (block1.free == false && block2.free == false && block3.free == false && (block1.value == block2.value) && (block1.value == block3.value)) ||
      (block1.free == false && block4.free == false && block7.free == false && (block1.value == block4.value) && (block1.value == block7.value)) ||
      (block1.free == false && block5.free == false && block9.free == false && (block1.value == block5.value) && (block1.value == block9.value)) ||
      (block2.free == false && block5.free == false && block8.free == false && (block2.value == block5.value) && (block2.value == block8.value)) ||
      (block3.free == false && block6.free == false && block9.free == false && (block3.value == block6.value) && (block3.value == block9.value)) ||
      (block3.free == false && block5.free == false && block7.free == false && (block3.value == block5.value) && (block3.value == block7.value)) ||
      (block4.free == false && block5.free == false && block6.free == false && (block4.value == block5.value) && (block4.value == block6.value)) ||
      (block7.free == false && block8.free == false && block9.free == false && (block7.value == block8.value) && (block7.value == block9.value))
    ) {
      return true;
    }


    return false;
  }


  figureBotMove() {
    var bot_move = 0;

    // Early Game Strategies
    bot_move = this.IsMiddleBlockTakenByBot() ? this.GetStrategyMiddleBlockTakenByBot() : this.GetStrategyMiddleBlockTakenByPlayer();
    if (bot_move > 0) {
      return bot_move;
    }



    // Priortize by checking block that is completing
    bot_move = this.GetBotCompletingSet();
    if (bot_move > 0) {
      return bot_move;
    }

    // 2nd Priority Block enemy from completing Set
    bot_move = this.blockPlayerAttemptCompleteSet();

    if (bot_move > 0) {
      return bot_move;
    }



    //3rd Priority Check If Middle Block Free
    bot_move = this.GetMiddleBlock();
    if (bot_move > 0) {
      return bot_move;
    }

    //4th Priority Check If Middle Block Taken By Enemy And If this is Bots First Move,Always Take Corner
    if (this.freeBlocksRemaining == 8 && this.IsMiddleBlockTakenByBot() == false) {
      return this.GetFreeCornerBlocks();
    }
    return Math.floor(Math.random() * 8) + 1;
  }

  GetStrategyMiddleBlockTakenByBot() {
    if (this.freeBlocksRemaining == 6 && this.CheckCornerBlocksTakenByPlayer()) {
      return this.GetFreeCenterAdjacentBlocks();
    }
    return 0;
  }

  GetStrategyMiddleBlockTakenByPlayer() {
    if (this.freeBlocksRemaining == 6 && this.CheckAnyCornerBlocksTakenByPlayer()) {
      return this.GetFreeCornerBlocks();
    }
    return 0;
  }
  CheckCornerBlocksTakenByPlayer() {
    return ((this.blocks[0].free == false && this.blocks[8].free == false && this.blocks[0].value == GameResources.player_value && this.blocks[0].value == this.blocks[8].value)
      || (this.blocks[2].free == false && this.blocks[6].free == false && this.blocks[2].value == GameResources.player_value && this.blocks[2].value == this.blocks[6].value)
    );
  }
  CheckAnyCornerBlocksTakenByPlayer() {
    if ((this.blocks[0].free == false && this.blocks[0].value == GameResources.player_value) ||
      (this.blocks[2].free == false && this.blocks[2].value == GameResources.player_value) ||
      (this.blocks[6].free == false && this.blocks[6].value == GameResources.player_value) ||
      (this.blocks[8].free == false && this.blocks[8].value == GameResources.player_value)) {
      return true;
    }
    return false;
  }

  GetFreeCenterAdjacentBlocks() {
    if (this.blocks[1].free) {
      return 2;
    }
    if (this.blocks[3].free) {
      return 4;
    }
    if (this.blocks[5].free) {
      return 6;
    }
    if (this.blocks[7].free) {
      return 8;
    }
    return 0;
  }


  GetFreeCornerBlocks() {
    if (this.blocks[0].free) {
      return 1;
    }
    if (this.blocks[2].free) {
      return 3;
    }
    if (this.blocks[6].free) {
      return 7;
    }
    if (this.blocks[8].free) {
      return 9;
    }
    return 0;
  }
  IsMiddleBlockTakenByBot() {
    if (this.blocks[4].value == GameResources.bot_value) {
      return true;
    }
    return false;
  }
  GetMiddleBlock() {
    var middleBlock = this.blocks[4];
    if (middleBlock.free) {
      return 5;
    }
    return 0;
  }

	/* 
		Check if any Block Set is completing
	*/
  GetBotCompletingSet() {
    return this.getCompleteSet(GameResources.bot_value);
  }


	/* 
		Block Enemy Attempt to Complete Set
	*/
  blockPlayerAttemptCompleteSet() {
    return this.getCompleteSet(GameResources.player_value);
  }

  getCompleteSet(blockValue: string) {
    var block1 = this.blocks[0];
    var block2 = this.blocks[1];
    var block3 = this.blocks[2];

    var block4 = this.blocks[3];
    var block5 = this.blocks[4];
    var block6 = this.blocks[5];

    var block7 = this.blocks[6];
    var block8 = this.blocks[7];
    var block9 = this.blocks[8];

    // Block#1
    if (block1.free == false && block2.free == true && block3.free == false && (block1.value == blockValue && block1.value == block3.value)) {
      return 2;

    } else if (block1.free == false && block2.free == false && block3.free == true && (block1.value == blockValue && block1.value == block2.value)) {
      return 3;

    } else if (block1.free == false && block4.free == true && block7.free == false && (block1.value == blockValue && block1.value == block7.value)) {
      return 4;

    } else if (block1.free == false && block4.free == false && block7.free == true && (block1.value == blockValue && block1.value == block4.value)) {
      return 7;

    } else if (block1.free == false && block5.free == true && block9.free == false && (block1.value == blockValue && block1.value == block9.value)) {
      return 5;

    } else if (block1.free == false && block5.free == false && block9.free == true && (block1.value == blockValue && block1.value == block5.value)) {
      return 9;

      // Block#2
    } else if (block2.free == false && block3.free == false && block1.free == true && (block2.value == blockValue && block2.value == block3.value)) {
      return 1;

    } else if (block2.free == false && block3.free == true && block1.free == false && (block2.value == blockValue && block2.value == block1.value)) {
      return 3;

    } else if (block2.free == false && block8.free == false && block5.free == true && (block2.value == blockValue && block2.value == block8.value)) {
      return 5;

    } else if (block2.free == false && block8.free == true && block5.free == false && (block2.value == blockValue && block2.value == block5.value)) {
      return 8;

      // Block#3
    } else if (block3.free == false && block6.free == true && block9.free == false && (block3.value == blockValue && block3.value == block9.value)) {
      return 6;

    } else if (block3.free == false && block9.free == true && block6.free == false && (block3.value == blockValue && block3.value == block6.value)) {
      return 9;

    } else if (block3.free == false && block5.free == true && block7.free == false && (block3.value == blockValue && block3.value == block7.value)) {
      return 5;

    } else if (block3.free == false && block7.free == true && block5.free == false && (block3.value == blockValue && block3.value == block5.value)) {
      return 7;

      // Block#4
    } else if (block4.free == false && block5.free == true && block6.free == false && (block4.value == blockValue && block4.value == block6.value)) {
      return 5;

    } else if (block4.free == false && block6.free == true && block5.free == false && (block4.value == blockValue && block4.value == block5.value)) {
      return 6;
    }
    else if (block4.free == false && block1.free == true && block7.free == false && (block4.value == blockValue && block4.value == block7.value)) {
      return 1;
    }

    // Block#5
    else if (block5.free == false && block4.free == true && block6.free == false && (block5.value == blockValue && block5.value == block6.value)) {
      return 4;
    }
    // Block#7
    else if (block7.free == false && block8.free == true && block9.free == false && (block7.value == blockValue && block7.value == block9.value)) {
      return 8;
    }
    else if (block7.free == false && block5.free == false && block3.free == true && (block7.value == blockValue && block7.value == block5.value)) {
      return 3;
    }
    else if (block7.free == false && block9.free == true && block8.free == false && (block7.value == blockValue && block7.value == block8.value)) {
      return 9;
    }
    // Block#8
    else if (block8.free == false && block7.free == true && block9.free == false && (block8.value == blockValue && block8.value == block9.value)) {
      return 7;
    }
    else if (block8.free == false && block5.free == false && block2.free == true && (block8.value == blockValue && block8.value == block5.value)) {
      return 2;
    }
    //Block#9
    else if (block9.free == false && block5.free == false && block1.free == true && (block9.value == blockValue && block9.value == block5.value)) {
      return 1;
    }
    else { // If none is applicable
      return 0;
    }
  }

}

