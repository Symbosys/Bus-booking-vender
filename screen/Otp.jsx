import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, StyleSheet, Alert } from 'react-native';


const OtpScreen = ({ route }) => {
  const { phoneNumber } = route?.params || { phoneNumber: 'Not provided' };
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (text, index) => {
    if (/^[0-9]$/.test(text) || text === '') {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input if a digit is entered
      if (text && index < 5) {
        inputRefs.current[index + 1].focus();
      }
      // Move to previous input if backspace is pressed
      if (!text && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerifyOtp = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6 || otp.some(digit => !/^[0-9]$/.test(digit))) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
    Alert.alert('Success', `OTP ${otpValue} verified for ${phoneNumber}`);
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0].focus();
    Alert.alert('Success', `New OTP sent to ${phoneNumber}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Image */}
      <Image
                   source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTph_DaiET_EXGKuz2svzCYed8BxPvGh22_ew&s' }}
                   style={styles.headerImage}
                 
        resizeMode="cover"
      />

      {/* Title */}
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit OTP sent to <Text style={styles.phoneText}>{phoneNumber}</Text>
      </Text>

      {/* OTP Input Boxes */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.otpInput, digit ? styles.otpInputFilled : styles.otpInputEmpty]}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => (inputRefs.current[index] = ref)}
            textAlign="center"
            placeholder="-"
            placeholderTextColor="#888"
          />
        ))}
      </View>

      {/* Verify OTP Button */}
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      {/* Resend OTP Button */}
      <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp}>
        <Text style={styles.resendButtonText}>Resend OTP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E3A8A',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5EAA',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  phoneText: {
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    color: '#1E3A8A',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  otpInputFilled: {
    borderColor: '#1E3A8A',
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  otpInputEmpty: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
  },
  verifyButton: {
    backgroundColor: '#1E3A8A',
    width: '90%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  resendButton: {
    width: '90%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E3A8A',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resendButtonText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OtpScreen;