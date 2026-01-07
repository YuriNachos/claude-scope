import { describe, it } from 'node:test';
import { expect } from 'chai';
import {
  Suit,
  Rank,
  Card,
  HandRank,
  PokerHand,
  getSuitSymbol,
  isRedSuit,
  getRankValue,
  formatCard,
} from '../../../../src/widgets/poker/types.js';

describe('Suit', () => {
  it('should have four valid suits with correct symbols', () => {
    expect(Suit.Spades).to.equal('spades');
    expect(Suit.Hearts).to.equal('hearts');
    expect(Suit.Diamonds).to.equal('diamonds');
    expect(Suit.Clubs).to.equal('clubs');
  });

  it('should get correct suit symbol', () => {
    expect(getSuitSymbol('spades')).to.equal('♠');
    expect(getSuitSymbol('hearts')).to.equal('♥');
    expect(getSuitSymbol('diamonds')).to.equal('♦');
    expect(getSuitSymbol('clubs')).to.equal('♣');
  });

  it('should identify red suits correctly', () => {
    expect(isRedSuit('hearts')).to.be.true;
    expect(isRedSuit('diamonds')).to.be.true;
    expect(isRedSuit('spades')).to.be.false;
    expect(isRedSuit('clubs')).to.be.false;
  });
});

describe('Rank', () => {
  it('should have all 13 ranks', () => {
    expect(Rank.Two).to.equal('2');
    expect(Rank.Three).to.equal('3');
    expect(Rank.Four).to.equal('4');
    expect(Rank.Five).to.equal('5');
    expect(Rank.Six).to.equal('6');
    expect(Rank.Seven).to.equal('7');
    expect(Rank.Eight).to.equal('8');
    expect(Rank.Nine).to.equal('9');
    expect(Rank.Ten).to.equal('10');
    expect(Rank.Jack).to.equal('J');
    expect(Rank.Queen).to.equal('Q');
    expect(Rank.King).to.equal('K');
    expect(Rank.Ace).to.equal('A');
  });

  it('should get rank value for comparison', () => {
    expect(getRankValue('A')).to.equal(14);
    expect(getRankValue('K')).to.equal(13);
    expect(getRankValue('Q')).to.equal(12);
    expect(getRankValue('J')).to.equal(11);
    expect(getRankValue('10')).to.equal(10);
    expect(getRankValue('2')).to.equal(2);
  });
});

describe('Card', () => {
  it('should create valid card', () => {
    const card: Card = { rank: 'A', suit: 'spades' };
    expect(card.rank).to.equal('A');
    expect(card.suit).to.equal('spades');
  });

  it('should format card as string', () => {
    const card: Card = { rank: 'A', suit: 'spades' };
    expect(formatCard(card)).to.equal('A♠');
  });
});

describe('HandRank', () => {
  it('should have all 10 hand rankings', () => {
    expect(HandRank.HighCard).to.equal(1);
    expect(HandRank.OnePair).to.equal(2);
    expect(HandRank.TwoPair).to.equal(3);
    expect(HandRank.ThreeOfAKind).to.equal(4);
    expect(HandRank.Straight).to.equal(5);
    expect(HandRank.Flush).to.equal(6);
    expect(HandRank.FullHouse).to.equal(7);
    expect(HandRank.FourOfAKind).to.equal(8);
    expect(HandRank.StraightFlush).to.equal(9);
    expect(HandRank.RoyalFlush).to.equal(10);
  });
});

describe('PokerHand', () => {
  it('should create poker hand with rank', () => {
    const hand: PokerHand = { rank: HandRank.OnePair, name: 'One Pair', emoji: '👍' };
    expect(hand.rank).to.equal(2);
    expect(hand.name).to.equal('One Pair');
    expect(hand.emoji).to.equal('👍');
  });
});
