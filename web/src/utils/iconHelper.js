import React from 'react';
import * as Fi from 'react-icons/fi';
import * as Md from 'react-icons/md';

/**
 * Mappings for mobile icon names to React Icons (Web)
 */
const ICON_MAP = {
  // Common Feather/Fi Mappings
  'zap': <Fi.FiZap />,
  'trash-2': <Fi.FiTrash2 />,
  'tool': <Fi.FiTool />,
  'layers': <Fi.FiLayers />,
  'user': <Fi.FiUser />,
  'settings': <Fi.FiSettings />,
  'help-circle': <Fi.FiHelpCircle />,
  'mail': <Fi.FiMail />,
  'phone': <Fi.FiPhone />,
  'star': <Fi.FiStar />,
  'search': <Fi.FiSearch />,
  'map-pin': <Fi.FiMapPin />,
  'calendar': <Fi.FiCalendar />,
  'briefcase': <Fi.FiBriefcase />,
  'file-text': <Fi.FiFileText />,
  'headphones': <Fi.FiHeadphones />,
  
  // Custom MCO/Material Mappings
  'wrench': <Fi.FiTool />,
  'hammer': <Fi.FiTool />,
  'hammer-wrench': <Fi.FiTool />,
  'tools': <Fi.FiTool />,
  'broom': <Md.MdOutlineCleaningServices />,
  'cleaning': <Md.MdOutlineCleaningServices />,
  'water': <Fi.FiDroplet />,
  'droplet': <Fi.FiDroplet />,
  'lightning-bolt': <Fi.FiZap />,
  'electric': <Fi.FiZap />,
  'car-wash': <Fi.FiTruck />,
  'car-wrench': <Fi.FiTruck />,
  'truck': <Fi.FiTruck />,
  'home-city': <Fi.FiHome />,
  'home': <Fi.FiHome />,
  'scissors': <Fi.FiScissors />,
  'cut': <Fi.FiScissors />,
  'content-cut': <Fi.FiScissors />,
  'paint': <Fi.FiEdit3 />,
  'format-paint': <Fi.FiEdit3 />,
  'dumbbell': <Md.MdFitnessCenter />,
  'yoga': <Md.MdSelfImprovement />,
  'food': <Fi.FiCoffee />,
  'silverware-fork-knife': <Fi.FiShoppingBag />,
  'air-conditioner': <Fi.FiWind />,
  'ac': <Fi.FiWind />,
  'snowflake': <Fi.FiWind />,
};

/**
 * Renders a dynamic icon based on the icon name string.
 * Defaults to a fallback icon if not found.
 */
export const renderDynamicIcon = (iconName, size = 24, color = 'inherit') => {
  if (!iconName) return <Fi.FiBox size={size} color={color} />;
  
  // Lowercase to handle variations
  const lowerName = iconName.toLowerCase();
  const icon = ICON_MAP[lowerName];
  
  if (icon) {
    return React.cloneElement(icon, { size, color });
  }

  // Final fallback (maybe it's an emoji)
  if (iconName.length < 3) {
    return <span style={{ fontSize: size, color }}>{iconName}</span>;
  }

  return <Fi.FiBox size={size} color={color} />;
};

export default renderDynamicIcon;
