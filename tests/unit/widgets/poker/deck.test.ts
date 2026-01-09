import { describe, it } from "node:test";
import { expect } from "chai";
import { Deck } from "../../../../src/widgets/poker/deck.js";

describe("Deck", () => {
  it("should create a standard 52-card deck", () => {
    const deck = new Deck();
    expect(deck.remaining()).to.equal(52);
  });

  it("should deal unique cards without replacement", () => {
    const deck = new Deck();
    const cards: string[] = [];

    for (let i = 0; i < 52; i++) {
      const card = deck.deal();
      expect(card).to.exist;
      cards.push(`${card.rank}${card.suit}`);
    }

    // All cards should be unique
    const uniqueCards = new Set(cards);
    expect(uniqueCards.size).to.equal(52);
  });

  it("should throw error when dealing from empty deck", () => {
    const deck = new Deck();

    // Deal all cards
    for (let i = 0; i < 52; i++) {
      deck.deal();
    }

    expect(() => deck.deal()).to.throw("Deck is empty");
  });

  it("should shuffle deck on creation (randomness check)", () => {
    const deck1 = new Deck();
    const deck2 = new Deck();

    // Deal 5 cards from each
    const hand1 = [deck1.deal(), deck1.deal(), deck1.deal(), deck1.deal(), deck1.deal()];
    const hand2 = [deck2.deal(), deck2.deal(), deck2.deal(), deck2.deal(), deck2.deal()];

    // Probability of identical 5-card sequence is extremely low
    const hand1Str = hand1.map((c) => `${c.rank}${c.suit}`).join("");
    const hand2Str = hand2.map((c) => `${c.rank}${c.suit}`).join("");

    expect(hand1Str).to.not.equal(hand2Str);
  });
});
