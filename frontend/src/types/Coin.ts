import {Struct} from "@/types/Struct";

export interface Coin {
    struct: Struct;
    symbol: string;
    name: string;
    imageURL: string;
    decimals: number
}