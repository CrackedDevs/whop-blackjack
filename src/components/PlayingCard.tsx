import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Card } from '../hooks/useBlackjackGame';

interface PlayingCardProps {
  card: Card;
  index?: number;
  animationTrigger?: number;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({ card, index = 0, animationTrigger = 0 }) => {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Track if this card has been initially animated
  const hasAnimated = useRef(false);
  
  // Animate card entrance
  useEffect(() => {
    if (animationTrigger > 0) {
      // Reset for new game
      hasAnimated.current = false;
      slideAnim.setValue(-200);
      scaleAnim.setValue(0.8);
      rotateAnim.setValue(0);
      opacityAnim.setValue(0);
    }
    
    if (!hasAnimated.current) {
      // First time animation for this card
      const delay = animationTrigger > 0 ? index * 150 : 0; // Stagger for new game, immediate for new cards
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: index * -40,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
      
      Animated.timing(rotateAnim, {
        toValue: (index - 1) * 2,
        duration: 600,
        delay,
        useNativeDriver: true,
      }).start();
      
      hasAnimated.current = true;
    } else {
      // Repositioning animation for existing cards
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: index * -40,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: (index - 1) * 2,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [index, animationTrigger]);
  
  // Animate card flip when revealed
  useEffect(() => {
    if (!card.hidden) {
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [card.hidden]);
  
  const animatedStyle = {
    transform: [
      { translateX: slideAnim },
      { scale: scaleAnim },
      { rotateZ: rotateAnim.interpolate({
        inputRange: [-10, 10],
        outputRange: ['-10deg', '10deg'],
      }) },
    ],
    opacity: opacityAnim,
  };
  
  if (card.hidden) {
    return (
      <Animated.View style={[styles.card, styles.cardBack, animatedStyle]}>
        <View style={styles.cardBackPattern} />
      </Animated.View>
    );
  }
  
  return (
    <Animated.View style={[styles.card, animatedStyle, {
      transform: [
        ...animatedStyle.transform,
        { 
          rotateY: flipAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '0deg'],
          })
        }
      ]
    }]}>
      <Text style={[styles.rank, isRed && styles.redText]}>{card.rank}</Text>
      <Text style={[styles.suit, isRed && styles.redText]}>{card.suit}</Text>
      <Text style={[styles.centerSuit, isRed && styles.redText]}>{card.suit}</Text>
    </Animated.View>
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
    transform: [{ translateX: -18 }, { translateY: -24 }],
    textAlign: 'center',
  },
  redText: {
    color: '#dc2626',
  },
});
