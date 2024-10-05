import {Coin} from "@/types/Coin";

export interface LPCoin extends Coin {
    coinX: Coin;
    coinY: Coin;

}