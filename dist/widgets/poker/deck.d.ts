import type { Card } from "./types.js";
/**
 * Standard 52-card deck with shuffling and dealing
 */
export declare class Deck {
    private cards;
    constructor();
    /**
     * Create a standard 52-card deck
     */
    private initialize;
    /**
     * Shuffle deck using Fisher-Yates algorithm with crypto.random
     */
    private shuffle;
    /**
     * Deal one card from the top of the deck
     * @throws Error if deck is empty
     */
    deal(): Card;
    /**
     * Get number of remaining cards in deck
     */
    remaining(): number;
}
//# sourceMappingURL=deck.d.ts.map