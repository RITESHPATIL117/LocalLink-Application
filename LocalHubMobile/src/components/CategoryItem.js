import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
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
      <View style={styles.squareInner}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}10` }]}>
          {renderDynamicIcon(item.icon, 32, iconColor)}
        </View>
        <Text style={styles.label} numberOfLines={2}>{item.name}</Text>
      </View>
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
    width: '100%',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 8,
  },
  squareInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 18,
  },
  wideContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  wideInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  wideIconContainer: {
    marginRight: 10,
  },
  wideLabel: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '700',
    flex: 1,
  },
});

export default CategoryItem;
