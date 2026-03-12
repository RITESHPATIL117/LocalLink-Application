import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';

const ReviewsScreen = () => {
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>Customer Reviews</Text>
        <Text style={globalStyles.subtitle}>Respond to feedback.</Text>
      </View>
    </View>
  );
};

export default ReviewsScreen;
