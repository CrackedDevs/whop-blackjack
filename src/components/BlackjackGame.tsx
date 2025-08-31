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
    backgroundColor: '#27ae60',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#fff',
    marginRight: 10,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1c40f',
  },
  handSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  handTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  cardsContainer: {
    flexDirection: 'row',
    minHeight: 120,
    marginBottom: 10,
  },
  handValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  bettingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  betLabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  betInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  betInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
    marginRight: 10,
  },
  betButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  quickBets: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickBetButton: {
    backgroundColor: '#34495e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  quickBetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    margin: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  hitButton: {
    backgroundColor: '#3498db',
  },
  standButton: {
    backgroundColor: '#e67e22',
  },
  doubleButton: {
    backgroundColor: '#9b59b6',
  },
  newGameButton: {
    backgroundColor: '#e74c3c',
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentBetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },
  currentBetLabel: {
    fontSize: 16,
    color: '#fff',
  },
  currentBet: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1c40f',
  },
});
