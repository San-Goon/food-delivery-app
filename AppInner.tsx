import {NavigationContainer} from '@react-navigation/native';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import Settings from './src/pages/Settings';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import {useEffect} from 'react';
import useSocket from './src/hooks/useSocket';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useAppDispatch} from './src/store';
import userSlice from './src/slices/user';
import {Alert} from 'react-native';
import {OrderReturnType} from './types';
import orderSlice from './src/slices/order';
import usePermissions from './src/hooks/usePermissions';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

function AppInner() {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator<RootStackParamList>();

  const [socket, disconnect] = useSocket();

  const dispatch = useAppDispatch();

  usePermissions();

  useEffect(() => {
    axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response.status === 419) {
          if (error.response.data.code === 'expired') {
            const refreshToken = await EncryptedStorage.getItem('refreshToken');
            const {data} = await axios.post(
              `${Config.API_URL}/refreshToken`,
              {},
              {
                headers: {
                  authorization: `Bearer ${refreshToken}`,
                },
              },
            );
            dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
            originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return;
        }
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        const errorResponse = (error as AxiosError<{code: string}>).response;
        if (errorResponse?.data.code === 'expired') {
          Alert.alert('알림', '세션이 만료되었습니다. 다시 로그인 해 주세요.');
        } else {
          console.error(error);
        }
      }
    };
    if (isLoggedIn) {
      getTokenAndRefresh();
    }
  }, [dispatch]);

  useEffect(() => {
    const callback = (data: OrderReturnType) => {
      dispatch(orderSlice.actions.addOrder(data));
    };
    if (socket && isLoggedIn) {
      socket.emit('acceptOrder', 'hello');
      socket.on('order', callback);

      return () => {
        if (socket) {
          socket.off('order', callback);
        }
      };
    }
  }, [dispatch, isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{title: '오더 목록'}}
          />
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{title: '내 정보'}}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppInner;
