import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

const Badge = ({ tier, style }) => {
  let backgroundColor = '#E5E7EB';
  let textColor = '#374151';
  let icon = 'shield-checkmark';

  switch (tier?.toLowerCase()) {
    case 'diamond':
      backgroundColor = colors.quaternary; // #CCEEFF
      textColor = colors.primary; // #0066FF
      icon = 'diamond';
      break;
    case 'gold':
      backgroundColor = '#FEF3C7';
      textColor = '#D97706';
      icon = 'star';
      break;
    case 'silver':
      backgroundColor = '#F3F4F6';
      textColor = '#4B5563';
      icon = 'medal';
      break;
    default:
      return null;
  }

  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Ionicons name={icon} size={12} color={textColor} />
      <Text style={[styles.text, { color: textColor }]}>{tier}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

});

export default Badge;
