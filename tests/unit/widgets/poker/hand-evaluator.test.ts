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

  it('should detect straight flush', () => {
    const hole: Card[] = [{ rank: '10', suit: 'spades' }, { rank: 'J', suit: 'spades' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'spades' },
      { rank: 'K', suit: 'spades' },
      { rank: 'A', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.RoyalFlush);
    expect(result.name).to.equal('Royal Flush');
    expect(result.emoji).to.equal('🏆');
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
});
