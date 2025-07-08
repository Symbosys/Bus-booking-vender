import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../screen/Login';
import OtpScreen from '../../screen/Otp';
import Aadhaar from '../../screen/Aadhar';
import PanCard from '../../screen/Pancard';
import PanOtp from '../../screen/PanOtp';
import AddBus from '../../screen/Addbus';


const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name='Aadhar' component={Aadhaar} />
      <Stack.Screen name="AadhaarOtp" component={Aadhaar} />
      <Stack.Screen name="Pancard" component={PanCard} />
      <Stack.Screen name="PandOtp" component={PanOtp} />
      <Stack.Screen name='Addbus' component={AddBus} />
      <Stack.Screen name="AllBus" component={Allbus} />

    </Stack.Navigator>
  );
}