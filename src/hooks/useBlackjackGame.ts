import { useState, useCallback } from 'react';

export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  hidden?: boolean;
}

export interface Hand {
  cards: Card[];
  value: number;
  isBust: boolean;
  isBlackjack: boolean;
  isSoft: boolean;
}

export type GameStatus = 'betting' | 'playing' | 'dealer' | 'ended';
export type GameResult = 'player_blackjack' | 'dealer_blackjack' | 'player_win' | 'dealer_win' | 'push' | 'player_bust' | null;

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getCardValue = (card: Card): number => {
  if (card.rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  return parseInt(card.rank);
};

const calculateHandValue = (cards: Card[]): Hand => {
  let value = 0;
  let aces = 0;
  
  for (const card of cards) {
    if (!card.hidden) {
      value += getCardValue(card);
      if (card.rank === 'A') aces++;
    }
  }
  
  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  const visibleCards = cards.filter(c => !c.hidden);
  
  return {
    cards,
    value,
    isBust: value > 21,
    isBlackjack: visibleCards.length === 2 && value === 21,
    isSoft: aces > 0 && value <= 21
  };
};

export const useBlackjackGame = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('betting');
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [canDouble, setCanDouble] = useState(false);
  const [canSplit, setCanSplit] = useState(false);

  const dealCard = useCallback((fromDeck: Card[], hidden = false): [Card, Card[]] => {
    const newDeck = [...fromDeck];
    const card = newDeck.pop()!;
    if (hidden) card.hidden = true;
    return [card, newDeck];
  }, []);

  const startNewGame = useCallback((betAmount: number) => {
    if (betAmount > balance || betAmount <= 0) return;
    
    let newDeck = shuffleDeck(createDeck());
    const playerCards: Card[] = [];
    const dealerCards: Card[] = [];
    
    // Deal initial cards
    let card: Card;
    [card, newDeck] = dealCard(newDeck);
    playerCards.push(card);
    [card, newDeck] = dealCard(newDeck);
    dealerCards.push(card);
    [card, newDeck] = dealCard(newDeck);
    playerCards.push(card);
    [card, newDeck] = dealCard(newDeck, true); // Dealer's hole card
    dealerCards.push(card);
    
    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setBet(betAmount);
    setBalance(prev => prev - betAmount);
    setGameStatus('playing');
    setGameResult(null);
    
    // Check for initial conditions
    const playerValue = calculateHandValue(playerCards);
    const dealerValue = calculateHandValue(dealerCards);
    
    // Check for blackjacks
    if (playerValue.isBlackjack && dealerValue.isBlackjack) {
      revealDealerCard(dealerCards);
      setGameStatus('ended');
      setGameResult('push');
      setBalance(prev => prev + betAmount); // Return bet
    } else if (playerValue.isBlackjack) {
      revealDealerCard(dealerCards);
      setGameStatus('ended');
      setGameResult('player_blackjack');
      setBalance(prev => prev + betAmount * 2.5); // 3:2 payout
    } else if (dealerValue.isBlackjack) {
      revealDealerCard(dealerCards);
      setGameStatus('ended');
      setGameResult('dealer_blackjack');
    } else {
      // Check if player can double or split
      setCanDouble(betAmount <= balance);
      setCanSplit(playerCards[0].rank === playerCards[1].rank && betAmount <= balance);
    }
  }, [balance, dealCard]);

  const revealDealerCard = (cards: Card[]) => {
    const revealedCards = cards.map(card => ({ ...card, hidden: false }));
    setDealerHand(revealedCards);
  };

  const hit = useCallback(() => {
    if (gameStatus !== 'playing') return;
    
    let newDeck = [...deck];
    const [card, remainingDeck] = dealCard(newDeck);
    const newPlayerHand = [...playerHand, card];
    
    setDeck(remainingDeck);
    setPlayerHand(newPlayerHand);
    setCanDouble(false);
    setCanSplit(false);
    
    const handValue = calculateHandValue(newPlayerHand);
    if (handValue.isBust) {
      setGameStatus('ended');
      setGameResult('player_bust');
    }
  }, [deck, playerHand, gameStatus, dealCard]);

  const stand = useCallback(() => {
    if (gameStatus !== 'playing') return;
    
    setGameStatus('dealer');
    setCanDouble(false);
    setCanSplit(false);
    
    // Reveal dealer's hole card
    let newDealerHand = dealerHand.map(card => ({ ...card, hidden: false }));
    let newDeck = [...deck];
    
    // Dealer draws until 17 or higher
    let dealerValue = calculateHandValue(newDealerHand);
    while (dealerValue.value < 17) {
      const [card, remainingDeck] = dealCard(newDeck);
      newDealerHand.push(card);
      newDeck = remainingDeck;
      dealerValue = calculateHandValue(newDealerHand);
    }
    
    setDealerHand(newDealerHand);
    setDeck(newDeck);
    
    // Determine winner
    const playerValue = calculateHandValue(playerHand);
    
    let result: GameResult;
    let payout = 0;
    
    if (dealerValue.isBust) {
      result = 'player_win';
      payout = bet * 2;
    } else if (playerValue.value > dealerValue.value) {
      result = 'player_win';
      payout = bet * 2;
    } else if (playerValue.value < dealerValue.value) {
      result = 'dealer_win';
      payout = 0;
    } else {
      result = 'push';
      payout = bet;
    }
    
    setGameStatus('ended');
    setGameResult(result);
    if (payout > 0) {
      setBalance(prev => prev + payout);
    }
  }, [deck, playerHand, dealerHand, gameStatus, bet, dealCard]);

  const double = useCallback(() => {
    if (gameStatus !== 'playing' || !canDouble) return;
    
    setBalance(prev => prev - bet);
    setBet(prev => prev * 2);
    
    let newDeck = [...deck];
    const [card, remainingDeck] = dealCard(newDeck);
    const newPlayerHand = [...playerHand, card];
    
    setDeck(remainingDeck);
    setPlayerHand(newPlayerHand);
    
    const handValue = calculateHandValue(newPlayerHand);
    if (handValue.isBust) {
      setGameStatus('ended');
      setGameResult('player_bust');
    } else {
      // Automatically stand after doubling
      setTimeout(() => stand(), 500);
    }
  }, [deck, playerHand, gameStatus, canDouble, bet, dealCard, stand]);

  const reset = useCallback(() => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('betting');
    setGameResult(null);
    setCanDouble(false);
    setCanSplit(false);
  }, []);

  const playerHandValue = calculateHandValue(playerHand);
  const dealerHandValue = calculateHandValue(dealerHand);

  return {
    playerHand: playerHandValue,
    dealerHand: dealerHandValue,
    balance,
    bet,
    gameStatus,
    gameResult,
    canDouble,
    canSplit,
    actions: {
      startNewGame,
      hit,
      stand,
      double,
      reset
    }
  };
};
