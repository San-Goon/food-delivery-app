import {
  Keyboard,
  StyleProp,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

const DismissKeyboardView: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({children, ...props}) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView {...props} style={props.style}>
      {children}
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
