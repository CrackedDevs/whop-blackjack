import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../hooks/useBlackjackGame';

interface PlayingCardProps {
  card: Card;
  index?: number;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({ card, index = 0 }) => {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  if (card.hidden) {
    return (
      <View style={[styles.card, styles.cardBack, { marginLeft: index * -40 }]}>
        <View style={styles.cardBackPattern} />
      </View>
    );
  }
  
  return (
    <View style={[styles.card, { marginLeft: index * -40 }]}>
      <Text style={[styles.rank, isRed && styles.redText]}>{card.rank}</Text>
      <Text style={[styles.suit, isRed && styles.redText]}>{card.suit}</Text>
      <Text style={[styles.centerSuit, isRed && styles.redText]}>{card.suit}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 90,
    height: 130,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  cardBack: {
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#334155',
  },
  cardBackPattern: {
    width: '75%',
    height: '75%',
    backgroundColor: '#374151',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  rank: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  suit: {
    fontSize: 16,
    color: '#1f2937',
    position: 'absolute',
    top: 32,
    left: 10,
  },
  centerSuit: {
    fontSize: 36,
    color: '#1f2937',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  redText: {
    color: '#dc2626',
  },
});
