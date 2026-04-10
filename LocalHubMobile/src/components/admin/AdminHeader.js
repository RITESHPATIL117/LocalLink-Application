import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';

const AdminHeader = ({ title, status, profilePic, onProfilePress, onSettingsPress }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.left}>
        <View style={styles.statusRow}>
          <Animated.View style={[styles.statusDot, { opacity: pulseAnim }]} />
          <Text style={styles.statusText}>{status || 'System Live'}</Text>
        </View>
        <Text style={styles.title}>{title || 'Dashboard'}</Text>
      </View>
      
      <View style={styles.right}>
        <TouchableOpacity style={styles.iconBtn} onPress={onSettingsPress}>
          <Ionicons name="options-outline" size={20} color="#FFF" />
          <View style={styles.activeIndicator} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onProfilePress} style={styles.profileBtn}>
          <Image source={{ uri: profilePic }} style={styles.profileImg} />
          <View style={styles.onlineBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
    zIndex: 100,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  left: {
    gap: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -1.2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activeIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileBtn: {
    width: 46,
    height: 46,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 3,
  },
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: colors.primary,
  }
});

export default AdminHeader;
