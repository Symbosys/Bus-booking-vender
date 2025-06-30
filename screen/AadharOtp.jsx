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

const AadhaarOtp = ({ navigation, route }) => {
  const { aadhaar } = route?.params || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEnabled, setResendEnabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const resendFadeAnim = useRef(new Animated.Value(0)).current;
  const inputRefs = useRef([]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    let timer;
    if (countdown > 0) {
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
  }, [countdown]);

  const handleOtpChange = (text, index) => {
    if (text.length > 1) text = text.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = text.replace(/[^0-9]/g, '');
    setOtp(newOtp);
    setErrorMessage('');

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (!text && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const validateOtp = () => {
    const otpString = otp.join('');
    return otpString.length === 6 && /^\d{6}$/.test(otpString);
  };

  const handleVerifyOtp = () => {
    if (!validateOtp()) {
      setErrorMessage('Please enter a valid 6-digit OTP');
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

    const otpString = otp.join('');
    // Simulate OTP verification (replace with UIDAI API call)
    console.log(`Verifying OTP ${otpString} for Aadhaar: ${aadhaar?.slice(0, 4)} XXXX ${aadhaar?.slice(8)}`);
    // navigation.navigate('AadhaarVerificationSuccess', { aadhaar, otp: otpString }); // Uncomment for navigation
  };

  const handleResendOtp = () => {
    if (!resendEnabled) return;

    setErrorMessage('');
    setCountdown(30);
    setResendEnabled(false);
    setOtp(['', '', '', '', '', '']);
    Animated.timing(resendFadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Simulate OTP resend (replace with UIDAI API call)
    console.log(`Resending OTP for Aadhaar: ${aadhaar?.slice(0, 4)} XXXX ${aadhaar?.slice(8)}`);
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
              <Text style={styles.title}>Aadhaar OTP Verification</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit OTP sent to your registered mobile number
              </Text>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => inputRefs.current[index] = ref}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={text => handleOtpChange(text, index)}
                    textAlign="center"
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

              <TouchableOpacity onPress={handleVerifyOtp}>
                <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
                  <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>

              <Animated.View style={[styles.resendContainer, { opacity: resendFadeAnim }]}>
                <TouchableOpacity onPress={handleResendOtp} disabled={!resendEnabled}>
                  <Text style={[styles.resendText, { color: resendEnabled ? '#10B981' : '#A1A1AA' }]}>
                    Resend OTP {countdown > 0 ? `(${countdown}s)` : ''}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
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
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 15,
    gap:8
    
  },
  otpInput: {
    width: 45,
    height: 45,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    color: '#1E3A8A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,

  },
  errorMessage: {
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 15,
    textAlign: 'center',
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
    paddingVertical: 10,
    alignItems: 'center',
    paddingLeft:80,
    
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    width:200,
    
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

export default AadhaarOtp;