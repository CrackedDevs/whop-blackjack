import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>♠️ BLACKJACK ♥️</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Balance:</Text>
          <Text style={styles.balance}>${balance}</Text>
        </View>
      </View>

      {/* Dealer's Hand */}
      <View style={styles.handSection}>
        <Text style={styles.handTitle}>Dealer</Text>
        <View style={styles.cardsContainer}>
          {dealerHand.cards.map((card, index) => (
            <PlayingCard key={index} card={card} index={index} />
          ))}
        </View>
        {!dealerHand.cards.some(c => c.hidden) && dealerHand.cards.length > 0 && (
          <Text style={styles.handValue}>
            {dealerHand.value}{dealerHand.isSoft ? ' (soft)' : ''}
            {dealerHand.isBust && ' - BUST!'}
          </Text>
        )}
      </View>

      {/* Game Result */}
      {gameResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{getResultMessage()}</Text>
        </View>
      )}

      {/* Player's Hand */}
      <View style={styles.handSection}>
        <Text style={styles.handTitle}>Your Hand</Text>
        <View style={styles.cardsContainer}>
          {playerHand.cards.map((card, index) => (
            <PlayingCard key={index} card={card} index={index} />
          ))}
        </View>
        {playerHand.cards.length > 0 && (
          <Text style={styles.handValue}>
            {playerHand.value}{playerHand.isSoft ? ' (soft)' : ''}
            {playerHand.isBust && ' - BUST!'}
          </Text>
        )}
      </View>

      {/* Betting Controls */}
      {gameStatus === 'betting' && (
        <View style={styles.bettingContainer}>
          <Text style={styles.betLabel}>Place your bet:</Text>
          <View style={styles.betInputContainer}>
            <TextInput
              style={styles.betInput}
              value={betInput}
              onChangeText={setBetInput}
              keyboardType="numeric"
              placeholder="Enter bet amount"
            />
            <TouchableOpacity 
              style={styles.betButton}
              onPress={handleBet}
            >
              <Text style={styles.buttonText}>Deal</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.quickBets}>
            {[10, 25, 50, 100].map(amount => (
              <TouchableOpacity
                key={amount}
                style={styles.quickBetButton}
                onPress={() => setBetInput(amount.toString())}
              >
                <Text style={styles.quickBetText}>${amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Game Controls */}
      {gameStatus === 'playing' && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.hitButton]}
            onPress={actions.hit}
          >
            <Text style={styles.buttonText}>Hit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.standButton]}
            onPress={actions.stand}
          >
            <Text style={styles.buttonText}>Stand</Text>
          </TouchableOpacity>
          
          {canDouble && (
            <TouchableOpacity
              style={[styles.actionButton, styles.doubleButton]}
              onPress={actions.double}
            >
              <Text style={styles.buttonText}>Double</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* New Game Button */}
      {gameStatus === 'ended' && (
        <TouchableOpacity
          style={[styles.actionButton, styles.newGameButton]}
          onPress={actions.reset}
        >
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>
      )}

      {/* Current Bet Display */}
      {bet > 0 && gameStatus !== 'betting' && (
        <View style={styles.currentBetContainer}>
          <Text style={styles.currentBetLabel}>Current Bet: </Text>
          <Text style={styles.currentBet}>${bet}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#94a3b8',
    marginRight: 8,
  },
  balance: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fbbf24',
  },
  handSection: {
    marginVertical: 24,
    alignItems: 'center',
  },
  handTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  cardsContainer: {
    flexDirection: 'row',
    minHeight: 120,
    marginBottom: 16,
    justifyContent: 'center',
  },
  handValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  resultContainer: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    marginVertical: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  resultText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
  },
  bettingContainer: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  betLabel: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  betInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  betInput: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  betButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: 80,
  },
  quickBets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickBetButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  quickBetText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
  },
  hitButton: {
    backgroundColor: '#059669',
    borderColor: '#10b981',
  },
  standButton: {
    backgroundColor: '#dc2626',
    borderColor: '#ef4444',
  },
  doubleButton: {
    backgroundColor: '#7c3aed',
    borderColor: '#8b5cf6',
  },
  newGameButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#60a5fa',
    marginTop: 24,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  currentBetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  currentBetLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  currentBet: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
  },
});
