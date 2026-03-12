import React, { useState } from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const AddBusinessScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Implement add business logic here
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>Add New Business</Text>
        <Text style={globalStyles.subtitle}>Fill in your service details.</Text>

        <InputField label="Business Name" value={name} onChangeText={setName} />
        <InputField label="Category" value={category} onChangeText={setCategory} />
        <InputField label="Description" value={description} onChangeText={setDescription} />

        <Button title="Submit Listing" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default AddBusinessScreen;
