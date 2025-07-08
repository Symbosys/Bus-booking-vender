import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

// Static data for dropdowns
const busTypeOptions = [
  { value: 'Non_AC', label: 'Non-AC' },
  { value: 'AC', label: 'AC' },
];

const seaterTypeOptions = [
  { value: 'SEATER', label: 'Seater' },
  { value: 'SLEEPER', label: 'Sleeper' },
];

const deckTypeOptions = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'DOUBLE', label: 'Double' },
];

const seatLayoutOptions = [
  { value: 'TWO_BY_ONE', label: '2x1' },
  { value: 'TWO_BY_TWO', label: '2x2' },
  { value: 'ONE_BY_ONE', label: '1x1' },
];

const AddBus = ({ vendorId }) => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    description: '',
    type: 'Non_AC',
    seatType: 'SEATER',
    deckType: 'SINGLE',
    seatLayout: 'TWO_BY_ONE',
    seats: '0',
    totalSeaters: '0',
    totalSleeper: '0',
    isActive: true,
    image: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/buses', {
        ...formData,
        vendorId,
        seats: parseInt(formData.seats) || 0,
        totalSeaters: parseInt(formData.totalSeaters) || null,
        totalSleeper: parseInt(formData.totalSleeper) || null,
      });

      setSuccess('Bus added successfully!');
      setFormData({
        name: '',
        number: '',
        description: '',
        type: 'Non_AC',
        seatType: 'SEATER',
        deckType: 'SINGLE',
        seatLayout: 'TWO_BY_ONE',
        seats: '0',
        totalSeaters: '0',
        totalSleeper: '0',
        isActive: true,
        image: '',
      });
    } catch (err) {
      setError('Failed to add bus. Please check your input and try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Bus</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <View style={styles.form}>
        <Text style={styles.label}>Bus Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
          placeholder="Enter bus name"
          required
        />

        <Text style={styles.label}>Bus Number</Text>
        <TextInput
          style={styles.input}
          value={formData.number}
          onChangeText={(text) => handleChange('number', text)}
          placeholder="Enter bus number"
          required
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="Enter description"
          multiline
        />

        <Text style={styles.label}>Bus Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.type}
            style={styles.picker}
            onValueChange={(value) => handleChange('type', value)}
          >
            {busTypeOptions.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Seat Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.seatType}
            style={styles.picker}
            onValueChange={(value) => handleChange('seatType', value)}
          >
            {seaterTypeOptions.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Deck Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.deckType}
            style={styles.picker}
            onValueChange={(value) => handleChange('deckType', value)}
          >
            {deckTypeOptions.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Seat Layout</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.seatLayout}
            style={styles.picker}
            onValueChange={(value) => handleChange('seatLayout', value)}
          >
            {seatLayoutOptions.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Total Seats</Text>
        <TextInput
          style={styles.input}
          value={formData.seats}
          onChangeText={(text) => handleChange('seats', text)}
          placeholder="Enter total seats"
          keyboardType="numeric"
          required
        />

        <Text style={styles.label}>Total Seaters</Text>
        <TextInput
          style={styles.input}
          value={formData.totalSeaters}
          onChangeText={(text) => handleChange('totalSeaters', text)}
          placeholder="Enter total seaters"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Total Sleepers</Text>
        <TextInput
          style={styles.input}
          value={formData.totalSleeper}
          onChangeText={(text) => handleChange('totalSleeper', text)}
          placeholder="Enter total sleepers"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={formData.image}
          onChangeText={(text) => handleChange('image', text)}
          placeholder="Enter image URL"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Is Active</Text>
          <Switch
            value={formData.isActive}
            onValueChange={(value) => handleChange('isActive', value)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Bus</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  success: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 44,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddBus;