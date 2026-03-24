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
  if (['wrench', 'flower', 'bug', 'hammer', 'account-group', 'chart-areaspline', 'file-document-outline'].includes(iconName)) {
    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
  }
  
  // Default to Ionicons (most versatile)
  return <Ionicons name={iconName} size={size} color={color} />;
};

export default renderDynamicIcon;
