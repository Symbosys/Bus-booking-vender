import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Image, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorHandler = (err, errorInfo) => {
      console.error('ErrorBoundary caught an error:', err, errorInfo);
      setHasError(true);
      setError(err);
    };
    return () => {};
  }, []);

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong. Please try again.</Text>
        {__DEV__ && <Text style={styles.errorDetail}>{error?.toString()}</Text>}
      </View>
    );
  }

  try {
    return children;
  } catch (err) {
    console.error('ErrorBoundary caught an error during render:', err);
    setHasError(true);
    setError(err);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong. Please try again.</Text>
        {__DEV__ && <Text style={styles.errorDetail}>{err?.toString()}</Text>}
      </View>
    );
  }
};

const Aadhaar = ({ navigation }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatAadhaar = (input) => {
    const digits = input.replace(/[^0-9]/g, '').slice(0, 12);
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += digits[i];
    }
    return formatted;
  };

  const validateAadhaar = (number) => {
    const digits = number.replace(/[^0-9]/g, '');
    return digits.length === 12;
  };

  const handleAadhaarChange = (text) => {
    const formatted = formatAadhaar(text);
    setAadhaarNumber(formatted);
    setErrorMessage('');
  };

  const handleVerifyAadhaar = () => {
    const digits = aadhaarNumber.replace(/[^0-9]/g, '');
    if (!validateAadhaar(aadhaarNumber)) {
      setErrorMessage('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setErrorMessage('');
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate Aadhaar verification (replace with UIDAI API call)
    console.log(`Verifying Aadhaar: ${digits.slice(0, 4)} XXXX ${digits.slice(8)}`);
    // navigation.navigate('AadhaarVerificationSuccess', { aadhaar: digits }); // Uncomment for navigation
  };

  return (
    <SafeAreaView style={styles.container}>
      <ErrorBoundary>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' }}
              style={styles.headerImage}
            />
            <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.formContainer}>
              <Text style={styles.title}>Aadhaar Verification</Text>
              <Text style={styles.subtitle}>Enter your Aadhaar number to proceed</Text>

              <View style={styles.inputContainer}>
                <Icon name="card-outline" size={20} color="#1E3A8A" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="XXXX XXXX XXXX"
                  placeholderTextColor="#A1A1AA"
                  keyboardType="numeric"
                  maxLength={14} // 12 digits + 2 spaces
                  value={aadhaarNumber}
                  onChangeText={handleAadhaarChange}
                />
              </View>

              {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

              <TouchableOpacity onPress={handleVerifyAadhaar}>
                <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
                  <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Verify Aadhaar</Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </KeyboardAvoidingView>
      </ErrorBoundary>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E3A8A',
    paddingVertical: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 15,
    textAlign: 'left',
    width: '100%',
  },
  button: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    marginTop:20,
  },
  buttonGradient: {
    paddingVertical: 13,
    alignItems: 'center',
    width:250,

  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
});

export default Aadhaar;