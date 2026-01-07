import { describe, it } from 'node:test';
import { expect } from 'chai';
import { evaluateHand } from '../../../../src/widgets/poker/hand-evaluator.js';
import type { Card } from '../../../../src/widgets/poker/types.js';
import { HandRank } from '../../../../src/widgets/poker/types.js';

describe('HandEvaluator', () => {
  it('should detect high card (weakest hand)', () => {
    const hole: Card[] = [{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: '9', suit: 'diamonds' },
      { rank: 'J', suit: 'clubs' },
      { rank: '3', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.HighCard);
    expect(result.name).to.equal('High Card');
    expect(result.emoji).to.equal('🃏');
  });

  it('should detect one pair', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'diamonds' },
      { rank: 'J', suit: 'clubs' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.OnePair);
    expect(result.name).to.equal('One Pair');
    expect(result.emoji).to.equal('👍');
  });

  it('should detect two pair', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'diamonds' },
      { rank: 'Q', suit: 'clubs' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.TwoPair);
    expect(result.name).to.equal('Two Pair');
    expect(result.emoji).to.equal('✌️');
  });

  it('should detect three of a kind', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'K', suit: 'diamonds' },
      { rank: 'Q', suit: 'clubs' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.ThreeOfAKind);
    expect(result.name).to.equal('Three of a Kind');
    expect(result.emoji).to.equal('🎯');
  });

  it('should detect straight (five consecutive cards)', () => {
    const hole: Card[] = [{ rank: '10', suit: 'spades' }, { rank: 'J', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'diamonds' },
      { rank: 'K', suit: 'clubs' },
      { rank: 'A', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.Straight);
    expect(result.name).to.equal('Straight');
    expect(result.emoji).to.equal('📈');
  });

  it('should detect flush (five cards same suit)', () => {
    const hole: Card[] = [{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'spades' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'spades' },
      { rank: 'J', suit: 'spades' },
      { rank: '9', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.Flush);
    expect(result.name).to.equal('Flush');
    expect(result.emoji).to.equal('💧');
  });

  it('should detect full house (three of a kind + pair)', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'K', suit: 'diamonds' },
      { rank: 'Q', suit: 'clubs' },
      { rank: 'Q', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.FullHouse);
    expect(result.name).to.equal('Full House');
    expect(result.emoji).to.equal('🏠');
  });

  it('should detect four of a kind', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'K', suit: 'diamonds' },
      { rank: 'K', suit: 'clubs' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.FourOfAKind);
    expect(result.name).to.equal('Four of a Kind');
    expect(result.emoji).to.equal('💎');
  });

  it('should detect straight flush (non-royal)', () => {
    const hole: Card[] = [{ rank: '8', suit: 'hearts' }, { rank: '9', suit: 'hearts' }];
    const board: Card[] = [
      { rank: '10', suit: 'hearts' },
      { rank: '7', suit: 'hearts' },
      { rank: '6', suit: 'hearts' },
      { rank: '2', suit: 'spades' },
      { rank: 'K', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.StraightFlush);
    expect(result.name).to.equal('Straight Flush');
    expect(result.emoji).to.equal('🔥');
  });

  it('should detect royal flush (best hand)', () => {
    const hole: Card[] = [{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'spades' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'spades' },
      { rank: 'J', suit: 'spades' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.RoyalFlush);
    expect(result.name).to.equal('Royal Flush');
    expect(result.emoji).to.equal('🏆');
  });

  describe('Player participation detection', () => {
    describe('One Pair', () => {
      it('should track both hole cards in Pair (pocket pair)', () => {
        const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'Q', suit: 'clubs' },
          { rank: '10', suit: 'spades' },
          { rank: '2', suit: 'hearts' },
          { rank: '7', suit: 'clubs' },
          { rank: '5', suit: 'diamonds' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.OnePair);
        expect(result.participatingCards).to.include(0); // K♠ (hole)
        expect(result.participatingCards).to.include(1); // K♥ (hole)
        expect(result.participatingCards).to.have.lengthOf(2);
      });

      it('should track one hole card in Pair (pair on board)', () => {
        const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'K', suit: 'diamonds' },
          { rank: 'Q', suit: 'clubs' },
          { rank: '10', suit: 'spades' },
          { rank: '2', suit: 'hearts' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.OnePair);
        expect(result.participatingCards).to.include(0); // K♠ (hole)
        expect(result.participatingCards).to.include(2); // K♦ (board)
        expect(result.participatingCards).to.have.lengthOf(2);
      });

      it('should return empty when player has nothing (pair on board only)', () => {
        const hole: Card[] = [{ rank: '2', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'K', suit: 'diamonds' },
          { rank: 'K', suit: 'clubs' },
          { rank: '10', suit: 'spades' },
          { rank: '7', suit: 'hearts' },
          { rank: '5', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.OnePair);
        expect(result.participatingCards).to.not.include(0);
        expect(result.participatingCards).to.not.include(1);
      });
    });

    describe('Two Pair', () => {
      it('should detect both hole cards in Two Pair (pocket pair + board pair)', () => {
        const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'Q', suit: 'diamonds' },
          { rank: 'Q', suit: 'clubs' },
          { rank: '10', suit: 'spades' },
          { rank: '2', suit: 'hearts' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.TwoPair);
        expect(result.participatingCards).to.include(0); // K♠ (hole)
        expect(result.participatingCards).to.include(1); // K♥ (hole)
        expect(result.participatingCards).to.include(2); // Q♦ (board)
        expect(result.participatingCards).to.include(3); // Q♣ (board)
        expect(result.participatingCards).to.have.lengthOf(4);
      });

      it('should detect one hole card in Two Pair', () => {
        const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'K', suit: 'diamonds' },
          { rank: 'Q', suit: 'clubs' },
          { rank: 'Q', suit: 'spades' },
          { rank: '10', suit: 'spades' },
          { rank: '2', suit: 'hearts' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.TwoPair);
        expect(result.participatingCards).to.include(0); // K♠ (hole)
        expect(result.participatingCards).to.include(2); // K♦ (board)
        expect(result.participatingCards).to.include(3); // Q♣ (board)
        expect(result.participatingCards).to.include(4); // Q♠ (board)
        expect(result.participatingCards).to.have.lengthOf(4);
      });

      it('should return empty when player has nothing (two pair on board)', () => {
        const hole: Card[] = [{ rank: '2', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'K', suit: 'diamonds' },
          { rank: 'K', suit: 'clubs' },
          { rank: 'Q', suit: 'spades' },
          { rank: 'Q', suit: 'hearts' },
          { rank: '10', suit: 'spades' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.TwoPair);
        expect(result.participatingCards).to.not.include(0);
        expect(result.participatingCards).to.not.include(1);
      });
    });

    describe('Three of a Kind', () => {
      it('should detect both hole cards in Three of a Kind (pocket pair)', () => {
        const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'K', suit: 'diamonds' },
          { rank: 'Q', suit: 'clubs' },
          { rank: '10', suit: 'spades' },
          { rank: '2', suit: 'hearts' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.ThreeOfAKind);
        expect(result.participatingCards).to.include(0); // K♠ (hole)
        expect(result.participatingCards).to.include(1); // K♥ (hole)
        expect(result.participatingCards).to.include(2); // K♦ (board)
        expect(result.participatingCards).to.have.lengthOf(3);
      });

      it('should detect one hole card in Three of a Kind', () => {
        const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'K', suit: 'diamonds' },
          { rank: 'K', suit: 'clubs' },
          { rank: '10', suit: 'spades' },
          { rank: '2', suit: 'hearts' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.ThreeOfAKind);
        expect(result.participatingCards).to.include(0); // K♠ (hole)
        expect(result.participatingCards).to.include(2); // K♦ (board)
        expect(result.participatingCards).to.include(3); // K♣ (board)
        expect(result.participatingCards).to.have.lengthOf(3);
      });
    });

    describe('Straight', () => {
      it('should detect both hole cards in Straight', () => {
        const hole: Card[] = [{ rank: '10', suit: 'spades' }, { rank: 'J', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'Q', suit: 'diamonds' },
          { rank: 'K', suit: 'clubs' },
          { rank: 'A', suit: 'spades' },
          { rank: '2', suit: 'hearts' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.Straight);
        expect(result.participatingCards).to.include(0); // 10♠ (hole)
        expect(result.participatingCards).to.include(1); // J♥ (hole)
        expect(result.participatingCards).to.have.lengthOf(5);
      });

      it('should return empty when player has nothing (Straight on board)', () => {
        const hole: Card[] = [{ rank: '2', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: '10', suit: 'spades' },
          { rank: 'J', suit: 'clubs' },
          { rank: 'Q', suit: 'diamonds' },
          { rank: 'K', suit: 'spades' },
          { rank: 'A', suit: 'hearts' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.Straight);
        expect(result.participatingCards).to.not.include(0);
        expect(result.participatingCards).to.not.include(1);
      });

      it('should detect one hole card in Straight', () => {
        const hole: Card[] = [{ rank: '10', suit: 'spades' }, { rank: '2', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'J', suit: 'clubs' },
          { rank: 'Q', suit: 'diamonds' },
          { rank: 'K', suit: 'spades' },
          { rank: 'A', suit: 'hearts' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.Straight);
        expect(result.participatingCards).to.include(0); // 10♠ (hole)
        expect(result.participatingCards).to.not.include(1); // 2♥ (hole)
      });
    });

    describe('Flush', () => {
      it('should detect both hole cards in Flush', () => {
        const hole: Card[] = [{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'spades' }];
        const board: Card[] = [
          { rank: 'Q', suit: 'spades' },
          { rank: 'J', suit: 'spades' },
          { rank: '9', suit: 'spades' },
          { rank: '2', suit: 'hearts' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.Flush);
        expect(result.participatingCards).to.include(0); // A♠ (hole)
        expect(result.participatingCards).to.include(1); // K♠ (hole)
        expect(result.participatingCards).to.have.lengthOf(5);
      });

      it('should return empty when player has nothing (Flush on board)', () => {
        const hole: Card[] = [{ rank: '2', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'A', suit: 'clubs' },
          { rank: 'K', suit: 'clubs' },
          { rank: 'Q', suit: 'clubs' },
          { rank: 'J', suit: 'clubs' },
          { rank: '9', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.Flush);
        expect(result.participatingCards).to.not.include(0);
        expect(result.participatingCards).to.not.include(1);
      });

      it('should detect one hole card in Flush', () => {
        const hole: Card[] = [{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'Q', suit: 'spades' },
          { rank: 'J', suit: 'spades' },
          { rank: '9', suit: 'spades' },
          { rank: '8', suit: 'spades' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.Flush);
        expect(result.participatingCards).to.include(0); // A♠ (hole)
        expect(result.participatingCards).to.not.include(1); // K♥ (hole)
      });
    });

    describe('Full House', () => {
      it('should detect both hole cards in Full House (pocket pair)', () => {
        const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'K', suit: 'diamonds' },
          { rank: 'Q', suit: 'clubs' },
          { rank: 'Q', suit: 'spades' },
          { rank: '2', suit: 'hearts' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.FullHouse);
        expect(result.participatingCards).to.include(0); // K♠ (hole)
        expect(result.participatingCards).to.include(1); // K♥ (hole)
        expect(result.participatingCards).to.have.lengthOf(5);
      });

      it('should detect one hole card in Full House', () => {
        const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'K', suit: 'diamonds' },
          { rank: 'K', suit: 'clubs' },
          { rank: 'Q', suit: 'spades' },
          { rank: 'Q', suit: 'hearts' },
          { rank: '10', suit: 'spades' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.FullHouse);
        expect(result.participatingCards).to.include(0); // K♠ (hole)
        expect(result.participatingCards).to.not.include(1); // 3♥ (hole)
        expect(result.participatingCards).to.have.lengthOf(5);
      });
    });

    describe('Four of a Kind', () => {
      it('should detect both hole cards in Four of a Kind (pocket pair)', () => {
        const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'K', suit: 'diamonds' },
          { rank: 'K', suit: 'clubs' },
          { rank: '10', suit: 'spades' },
          { rank: '2', suit: 'hearts' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.FourOfAKind);
        expect(result.participatingCards).to.include(0); // K♠ (hole)
        expect(result.participatingCards).to.include(1); // K♥ (hole)
        expect(result.participatingCards).to.have.lengthOf(4);
      });

      it('should detect one hole card in Four of a Kind', () => {
        const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'K', suit: 'diamonds' },
          { rank: 'K', suit: 'clubs' },
          { rank: 'K', suit: 'hearts' },
          { rank: '10', suit: 'spades' },
          { rank: '2', suit: 'hearts' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.FourOfAKind);
        expect(result.participatingCards).to.include(0); // K♠ (hole)
        expect(result.participatingCards).to.not.include(1); // 3♥ (hole)
        expect(result.participatingCards).to.have.lengthOf(4);
      });
    });

    describe('Straight Flush', () => {
      it('should detect both hole cards in Straight Flush', () => {
        const hole: Card[] = [{ rank: '8', suit: 'hearts' }, { rank: '9', suit: 'hearts' }];
        const board: Card[] = [
          { rank: '10', suit: 'hearts' },
          { rank: '7', suit: 'hearts' },
          { rank: '6', suit: 'hearts' },
          { rank: '2', suit: 'spades' },
          { rank: 'K', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.StraightFlush);
        expect(result.participatingCards).to.include(0); // 8♥ (hole)
        expect(result.participatingCards).to.include(1); // 9♥ (hole)
        expect(result.participatingCards).to.have.lengthOf(5);
      });

      it('should return empty when player has nothing (Straight Flush on board)', () => {
        const hole: Card[] = [{ rank: '2', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: '8', suit: 'hearts' },
          { rank: '9', suit: 'hearts' },
          { rank: '10', suit: 'hearts' },
          { rank: '7', suit: 'hearts' },
          { rank: '6', suit: 'hearts' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.StraightFlush);
        expect(result.participatingCards).to.not.include(0);
        expect(result.participatingCards).to.not.include(1);
      });
    });

    describe('Royal Flush', () => {
      it('should detect both hole cards in Royal Flush', () => {
        const hole: Card[] = [{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'spades' }];
        const board: Card[] = [
          { rank: 'Q', suit: 'spades' },
          { rank: 'J', suit: 'spades' },
          { rank: '10', suit: 'spades' },
          { rank: '2', suit: 'hearts' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.RoyalFlush);
        expect(result.participatingCards).to.include(0); // A♠ (hole)
        expect(result.participatingCards).to.include(1); // K♠ (hole)
        expect(result.participatingCards).to.have.lengthOf(5);
      });

      it('should return empty when player has nothing (Royal Flush on board)', () => {
        const hole: Card[] = [{ rank: '2', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'A', suit: 'clubs' },
          { rank: 'K', suit: 'clubs' },
          { rank: 'Q', suit: 'clubs' },
          { rank: 'J', suit: 'clubs' },
          { rank: '10', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.RoyalFlush);
        expect(result.participatingCards).to.not.include(0);
        expect(result.participatingCards).to.not.include(1);
      });
    });

    describe('High Card', () => {
      it('should track hole card that is the high card', () => {
        const hole: Card[] = [{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
        const board: Card[] = [
          { rank: '9', suit: 'diamonds' },
          { rank: 'J', suit: 'clubs' },
          { rank: '3', suit: 'spades' },
          { rank: '2', suit: 'hearts' },
          { rank: '7', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.HighCard);
        expect(result.participatingCards).to.include(0); // A♠ (hole - high card)
        expect(result.participatingCards).to.have.lengthOf(1);
      });

      it('should return empty when high card is on board', () => {
        const hole: Card[] = [{ rank: '2', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
        const board: Card[] = [
          { rank: 'A', suit: 'diamonds' },
          { rank: 'K', suit: 'clubs' },
          { rank: 'Q', suit: 'spades' },
          { rank: 'J', suit: 'hearts' },
          { rank: '9', suit: 'clubs' }
        ];

        const result = evaluateHand(hole, board);
        expect(result.rank).to.equal(HandRank.HighCard);
        expect(result.participatingCards).to.not.include(0);
        expect(result.participatingCards).to.not.include(1);
        expect(result.participatingCards).to.have.lengthOf(1);
      });
    });
  });
});
