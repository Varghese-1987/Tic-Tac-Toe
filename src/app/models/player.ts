export class Player {
    bot: boolean;
    score: number;
    constructor() {
        this.bot = true;
        this.score = 0;
    }
    updateScore(total: number) {
        this.score += total;
        return this.score;
    }
}
