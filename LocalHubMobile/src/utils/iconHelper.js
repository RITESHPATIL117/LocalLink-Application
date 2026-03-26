import React from 'react';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import colors from '../styles/colors';

/**
 * Renders a dynamic icon based on the icon name and common family mappings.
 * Resolves warnings like "wrench" not being in Feather family.
 */
export const renderDynamicIcon = (name, size, color) => {
  const iconName = name || 'star';
  
  // Feather mappings
  if (['zap', 'trash-2', 'tool', 'layers', 'user', 'settings', 'help-circle', 'mail', 'phone'].includes(iconName)) {
    return <Feather name={iconName} size={size} color={color} />;
  }
  
  // MaterialCommunityIcons mappings (for those not in Feather/Ionicons)
  const mcoIcons = [
    'wrench', 'flower', 'bug', 'hammer', 'account-group', 'chart-areaspline', 'file-document-outline', 
    'car-wrench', 'content-cut', 'party-popper', 'dumbbell', 'format-paint', 'moped',
    'broom', 'water', 'lightning-bolt', 'car-wash', 'hammer-wrench', 'balloon', 'food',
    'yoga', 'home-city', 'silverware-fork-knife', 'washing-machine', 'hanger', 'iron', 'tshirt-crew',
    'truck', 'box', 'warehouse', 'home-search', 'office-building'
  ];
  
  if (mcoIcons.includes(iconName)) {
    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
  }
  
  // Default to Ionicons (most versatile)
  return <Ionicons name={iconName} size={size} color={color} />;
};

export default renderDynamicIcon;
