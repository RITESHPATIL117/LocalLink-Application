import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../styles/colors';
import { renderDynamicIcon } from '../utils/iconHelper';

import AnimatedFadeIn from './AnimatedFadeIn';

const CategoryItem = ({ item, onPress, type = 'square', index = 0 }) => {
  const iconColor = item.color || colors.primary;
  
  const renderContent = () => {
    if (type === 'wide') {
      return (
        <View style={styles.wideInner}>
          <View style={[styles.wideIconContainer, { backgroundColor: `${iconColor}10` }]}>
            {renderDynamicIcon(item.icon, 24, iconColor)}
          </View>
          <Text style={styles.wideLabel} numberOfLines={1}>{item.name}</Text>
        </View>
      );
    }

    return (
      <ImageBackground 
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1581094488221-757774cc1e5b?q=80&w=400' }} 
        style={styles.squareInner}
        imageStyle={{ borderRadius: 20, backgroundColor: '#EEE' }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <View style={styles.topRow}>
          <View style={[styles.iconBadge, { backgroundColor: `${iconColor}20` }]}>
            {renderDynamicIcon(item.icon, 20, '#FFF')}
          </View>
        </View>
        <Text style={styles.label} numberOfLines={2}>{item.name}</Text>
      </ImageBackground>
    );
  };

  return (
    <AnimatedFadeIn delay={index * 40} duration={400} yOffset={15} style={type === 'wide' ? { flex: 1, minWidth: '45%' } : {}}>
      <TouchableOpacity 
        style={[type === 'wide' ? styles.wideContainer : styles.squareContainer]} 
        onPress={onPress} 
        activeOpacity={0.8}
      >
        {renderContent()}
      </TouchableOpacity>
    </AnimatedFadeIn>
  );
};

const styles = StyleSheet.create({
  squareContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 150,
    height: 180,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  squareInner: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  topRow: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)',
  },
  label: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '900',
    lineHeight: 20,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  wideContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  wideInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  wideIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  wideLabel: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '900',
    flex: 1,
    letterSpacing: -0.3,
  },

});

export default React.memo(CategoryItem);
