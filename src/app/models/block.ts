import {GameResources} from '../resources/game-resources'

export class Block {
    free: boolean ;
	value: string ; 
    symbol: string;
    
    constructor(){
        this.free= true;
        this.value = ""; 
        this.symbol = "";
    }

	setValue(value) {
		this.value = value

		if( this.value == GameResources.tick_value ) {
			this.symbol = GameResources.tick_symbol;
		} else {
			this.symbol = GameResources.cross_symbol;
		}
	}   
}
