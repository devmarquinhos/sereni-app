import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Easing } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function BreathingScreen() {
  const router = useRouter();

  // config da animacao
  const innerScale = useRef(new Animated.Value(1)).current;
  const outerScale = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  
  const [phase, setPhase] = useState('Preparando...');

  useEffect(() => {
    let isMounted = true;

    // animação de respiração
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear, 
        useNativeDriver: true,
      })
    ).start();

    const startBreathingCycle = () => {
      if (!isMounted) return;

      // inspirar
      setPhase('Inspire...');
      Animated.parallel([
        Animated.timing(innerScale, { toValue: 1.6, duration: 4000, useNativeDriver: true }),
        Animated.timing(outerScale, { toValue: 1.4, duration: 3500, delay: 500, useNativeDriver: true })
      ]).start(({ finished }) => {
        if (!finished || !isMounted) return;

        // segurar
        setPhase('Segure...');
        setTimeout(() => {
          if (!isMounted) return;

          // expirar
          setPhase('Expire lentamente...');
          Animated.parallel([
            Animated.timing(innerScale, { toValue: 1, duration: 4000, useNativeDriver: true }),
            Animated.timing(outerScale, { toValue: 1, duration: 3500, delay: 500, useNativeDriver: true })
          ]).start(({ finished }) => {
            if (!finished || !isMounted) return;

            // pulmao vazio, relaxar
            setPhase('Relaxe...');
            setTimeout(() => {
              if (isMounted) startBreathingCycle();
            }, 4000);
          });
        }, 4000);
      });
    };

    startBreathingCycle();

    return () => {
      isMounted = false;
      innerScale.stopAnimation();
      outerScale.stopAnimation();
      spinAnim.stopAnimation();
    };
  }, [innerScale, outerScale, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const reverseSpin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg']
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        
        <View style={styles.blobContainer}>
          {/* Blob Externo: Gira no sentido horário */}
          <Animated.View style={[
            styles.outerBlob, 
            { transform: [{ scale: outerScale }, { rotate: spin }] }
          ]} />
          
          {/* Blob Interno: Gira no sentido anti-horário */}
          <Animated.View style={[
            styles.innerBlob, 
            { transform: [{ scale: innerScale }, { rotate: reverseSpin }] }
          ]} />
        </View>

        <Text style={styles.instruction}>{phase}</Text>
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Interromper Prática</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  blobContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  
  outerBlob: {
    position: 'absolute',
    width: 180,
    height: 180,
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    borderTopLeftRadius: 85,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 75,
    borderBottomLeftRadius: 95,
  },
  innerBlob: {
    position: 'absolute',
    width: 110,
    height: 110,
    backgroundColor: 'rgba(79, 70, 229, 0.85)',
    borderTopLeftRadius: 55,
    borderTopRightRadius: 45,
    borderBottomRightRadius: 60,
    borderBottomLeftRadius: 40,
  },
  instruction: {
    fontSize: 24,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});