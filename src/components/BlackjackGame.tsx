import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useBlackjackGame } from '../hooks/useBlackjackGame';
import { PlayingCard } from './PlayingCard';

export const BlackjackGame: React.FC = () => {
  const {
    playerHand,
    dealerHand,
    balance,
    bet,
    gameStatus,
    gameResult,
    canDouble,
    actions
  } = useBlackjackGame();
  
  const [betInput, setBetInput] = useState('50');
  const [showResult, setShowResult] = useState(false);
  const [animatedDealerValue, setAnimatedDealerValue] = useState(0);
  const [animatedPlayerValue, setAnimatedPlayerValue] = useState(0);
  
  const dealerValueAnim = useRef(new Animated.Value(0)).current;
  const playerValueAnim = useRef(new Animated.Value(0)).current;

  // Calculate animation delay based on number of cards
  const getAnimationDelay = (hand: any) => {
    return hand.cards.length * 150 + 600; // Card stagger delay + card animation duration
  };

  // Animate hand values counting up
  useEffect(() => {
    if (playerHand.cards.length > 0) {
      const currentValue = playerValueAnim._value;
      playerValueAnim.setValue(currentValue);
      
      Animated.timing(playerValueAnim, {
        toValue: playerHand.value,
        duration: 300,
        useNativeDriver: false,
      }).start();

      // Listen to animation values
      const listener = playerValueAnim.addListener(({ value }) => {
        setAnimatedPlayerValue(Math.floor(value));
      });

      return () => playerValueAnim.removeListener(listener);
    }
  }, [playerHand.value]);

  useEffect(() => {
    if (dealerHand.cards.length > 0 && !dealerHand.cards.some(c => c.hidden)) {
      const currentValue = dealerValueAnim._value;
      dealerValueAnim.setValue(currentValue);
      
      Animated.timing(dealerValueAnim, {
        toValue: dealerHand.value,
        duration: 300,
        useNativeDriver: false,
      }).start();

      const listener = dealerValueAnim.addListener(({ value }) => {
        setAnimatedDealerValue(Math.floor(value));
      });

      return () => dealerValueAnim.removeListener(listener);
    }
  }, [dealerHand.value, dealerHand.cards.some(c => c.hidden)]);

  // Handle result display timing
  useEffect(() => {
    if (gameResult) {
      setShowResult(false);
      // Show result after a brief delay to let value animations finish
      setTimeout(() => {
        setShowResult(true);
      }, 800);
    } else {
      setShowResult(false);
    }
  }, [gameResult]);

  // Reset animations when game resets
  useEffect(() => {
    if (gameStatus === 'betting') {
      playerValueAnim.setValue(0);
      dealerValueAnim.setValue(0);
      setAnimatedPlayerValue(0);
      setAnimatedDealerValue(0);
    }
  }, [gameStatus]);

  const handleBet = () => {
    const amount = parseInt(betInput);
    if (!isNaN(amount) && amount > 0 && amount <= balance) {
      actions.startNewGame(amount);
    }
  };

  const getResultMessage = () => {
    switch (gameResult) {
      case 'player_blackjack':
        return '🎉 BLACKJACK! You win!';
      case 'dealer_blackjack':
        return '😔 Dealer has Blackjack';
      case 'player_win':
        return '🎉 You win!';
      case 'dealer_win':
        return '😔 Dealer wins';
      case 'push':
        return '🤝 Push - It\'s a tie!';
      case 'player_bust':
        return '💥 Bust! Dealer wins';
      default:
        return '';
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      overScrollMode="never"
      bounces={false}
    >
      {/* Dealer's Hand */}
      <View style={styles.dealerSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dealer</Text>
          {!dealerHand.cards.some(c => c.hidden) && dealerHand.cards.length > 0 && (
            <View style={styles.valueBadge}>
              <Text style={styles.valueBadgeText}>
                {animatedDealerValue || dealerHand.value}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.cardsContainer}>
          {dealerHand.cards.map((card, index) => (
            <PlayingCard key={index} card={card} index={index} />
          ))}
        </View>
      </View>


      {/* Game Result */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          {showResult ? getResultMessage() : ''}
        </Text>
      </View>

      {/* Fixed Controls Container */}
      <View style={styles.fixedControlsContainer}>
        <View style={styles.controlsWrapper}>
          {gameStatus === 'betting' && (
            <TouchableOpacity
              onPress={() => actions.startNewGame(50)}
              style={[styles.actionButton, styles.hitButton]}
            >
              <Text style={styles.actionButtonText}>Start Game</Text>
            </TouchableOpacity>
          )}

          {gameStatus === 'playing' && (
            <>
              <TouchableOpacity
                onPress={actions.hit}
                style={[styles.actionButton, styles.hitButton]}
              >
                <Text style={styles.actionButtonText}>HIT</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={actions.stand}
                style={[styles.actionButton, styles.standButton]}
              >
                <Text style={styles.actionButtonText}>STAND</Text>
              </TouchableOpacity>
            </>
          )}

          {gameStatus === 'ended' && (
            <TouchableOpacity
              onPress={() => {
                // Reset animations immediately
                setShowResult(false);
                playerValueAnim.setValue(0);
                dealerValueAnim.setValue(0);
                setAnimatedPlayerValue(0);
                setAnimatedDealerValue(0);
                // Start new game
                actions.startNewGame(50);
              }}
              style={[styles.actionButton, styles.hitButton]}
            >
              <Text style={styles.actionButtonText}>New Game</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Player's Hand */}
      <View style={styles.playerSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Player</Text>
          {playerHand.cards.length > 0 && (
            <View style={styles.valueBadge}>
              <Text style={styles.valueBadgeText}>
                {animatedPlayerValue || playerHand.value}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.cardsContainer}>
          {playerHand.cards.map((card, index) => (
            <PlayingCard key={index} card={card} index={index} />
          ))}
        </View>
      </View>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    height: '100vh',
  },
  contentContainer: {
    padding: 40,
    paddingBottom: 60,
    alignSelf: 'stretch',
    width: '100%',
    justifyContent: 'center',
    minHeight: '100vh',
    position: 'relative',
    flexGrow: 1,
  },
  dealerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  playerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginRight: 12,
  },
  valueBadge: {
    backgroundColor: '#4a5568',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  betDisplay: {
    alignItems: 'center',
    marginVertical: 30,
  },
  betAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  resultContainer: {
    alignItems: 'center',
    marginVertical: 20,
    height: 30,
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  bettingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  quickBets: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  fixedControlsContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  controlsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    height: 50,
    alignItems: 'center',
  },
  quickBetButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  quickBetText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  hitButton: {
    backgroundColor: '#3b82f6',
  },
  standButton: {
    backgroundColor: '#3b82f6',
  },
  doubleButton: {
    backgroundColor: '#64748b',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  newGameButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
  },
  newGameButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
