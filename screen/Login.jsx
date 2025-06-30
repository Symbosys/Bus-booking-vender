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

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const resendFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    let timer;
    if (otpRequested && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setResendEnabled(true);
            Animated.timing(resendFadeAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [otpRequested, countdown]);

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };

  const handleGenerateOtp = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }

    setErrorMessage('');
    setOtpRequested(true);
    setCountdown(30);
    setResendEnabled(false);
    Animated.timing(resendFadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

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

    // Simulate OTP generation (replace with API call)
    console.log(`Generating OTP for +91${phoneNumber}`);
    // navigation.navigate('OtpVerification', { phoneNumber }); // Uncomment for navigation
  };

  const handleResendOtp = () => {
    if (!resendEnabled) return;

    setErrorMessage('');
    setCountdown(30);
    setResendEnabled(false);
    Animated.timing(resendFadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Simulate OTP resend (replace with API call)
    console.log(`Resending OTP for +91${phoneNumber}`);
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
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTph_DaiET_EXGKuz2svzCYed8BxPvGh22_ew&s' }}
              style={styles.headerImage}
            />
            <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.formContainer}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Enter your phone number to login</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Phone Number"
                  placeholderTextColor="#A1A1AA"
                  keyboardType="numeric"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text.replace(/[^0-9]/g, ''));
                    setErrorMessage('');
                  }}
                />
              </View>

              {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

              <TouchableOpacity onPress={handleGenerateOtp}>
                <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
                  <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Generate OTP</Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>

              {otpRequested && (
                <Animated.View style={[styles.resendContainer, { opacity: resendFadeAnim }]}>
                  <TouchableOpacity onPress={handleResendOtp} disabled={!resendEnabled}>
                    <Text style={[styles.resendText, { color: resendEnabled ? '#10B981' : '#A1A1AA' }]}>
                      Resend OTP {countdown > 0 ? `(${countdown}s)` : ''}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
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
  countryCode: {
    fontSize: 16,
    color: '#1E3A8A',
    marginRight: 10,
    fontWeight: '600',
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
    marginBottom: 20,
    marginTop:20,
    
  },
  buttonGradient: {
    paddingVertical: 13,
    alignItems: 'center',
    width:200
    
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',

  },
  resendContainer: {
    marginTop: 10,
  },
  resendText: {
    fontSize: 16,
    fontWeight: '500',
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

export default Login;