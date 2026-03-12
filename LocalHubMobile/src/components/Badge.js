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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
});

export default Badge;
