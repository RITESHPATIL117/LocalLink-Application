import React from 'react';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import colors from '../styles/colors';

/**
 * Renders a dynamic icon based on the icon name and common family mappings.
 * Resolves warnings like "wrench" not being in Feather family.
 */
/**
 * Renders a dynamic icon based on the icon name and common family mappings.
 * Robustly handles (name, size, color) or (name, isMaterial, size, color).
 */
export const renderDynamicIcon = (name, isMaterialOrSize, sizeOrColor, colorOnly) => {
  let iconName = name || 'star';
  let size = 24;
  let color = colors.primary || '#000';
  let isMaterial = false;

  // Handle (name, size, color)
  if (typeof isMaterialOrSize === 'number') {
    size = isMaterialOrSize;
    color = sizeOrColor || color;
  } 
  // Handle (name, isMaterial, size, color)
  else {
    isMaterial = !!isMaterialOrSize;
    size = typeof sizeOrColor === 'number' ? sizeOrColor : 24;
    color = colorOnly || color;
  }

  // Ensure size is never 0 or non-positive to prevent native crashes
  const actualSize = Math.max(1, size);

  // Material Icons family
  if (isMaterial) {
    return <MaterialCommunityIcons name={iconName} size={actualSize} color={color} />;
  }

  // Feather mappings
  if (['zap', 'trash-2', 'tool', 'layers', 'user', 'settings', 'help-circle', 'mail', 'phone'].includes(iconName)) {
    return <Feather name={iconName} size={actualSize} color={color} />;
  }
  
  // MaterialCommunityIcons fallback mappings
  const mcoIcons = [
    'wrench', 'flower', 'bug', 'hammer', 'account-group', 'chart-areaspline', 'file-document-outline', 
    'car-wrench', 'content-cut', 'party-popper', 'dumbbell', 'format-paint', 'moped',
    'broom', 'water', 'lightning-bolt', 'car-wash', 'hammer-wrench', 'balloon', 'food',
    'yoga', 'home-city', 'silverware-fork-knife', 'washing-machine', 'hanger', 'iron', 'tshirt-crew',
    'truck', 'box', 'warehouse', 'home-search', 'office-building'
  ];
  
  if (mcoIcons.includes(iconName)) {
    return <MaterialCommunityIcons name={iconName} size={actualSize} color={color} />;
  }
  
  // Default to Ionicons
  return <Ionicons name={iconName} size={actualSize} color={color} />;
};

export default renderDynamicIcon;
