import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * 사용자의 고유 notification token을 expo로부터 받아오고 DB에 저장하는 함수
 */
export const getPushNotificationsPermission = createAsyncThunk(
    "notification/getPermission",
    async (isFirst) => {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();

            if (isFirst) {
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== 'granted') {
                    alert('권한이 없어서 알림을 받을 수 없어요. 알림을 받으려면 권한 설정을 해주세요.');
                }
            }

            try {
                if (existingStatus !== 'granted') return;

                const deviceToken = await Notifications.getDevicePushTokenAsync();
                const getTokenOptions = {
                    experienceId: '@suechoii/frontend',
                    devicePushToken: deviceToken,
                };
                const token = (await Notifications.getExpoPushTokenAsync(getTokenOptions)).data;

                await SecureStore.setItemAsync('pushToken', token);

            } catch (e) {
                console.log(e);
            }
        } else {
            alert('실기기에서 이용해주세요.');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }
);

/**
 * 사용자의 고유 notification token을 DB에 저장하는 api
 */
export const registerNotificationToken = createAsyncThunk(
    "notification/registerToken",
    async (token, thunkAPI) => {
        try {
            const user_id = await SecureStore.getItemAsync("user_id");
            const response = await axios.post(
                `${API_URL}/notification/token`, { token: token },
                { user_id: user_id }
            );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.detail);
        }
    }
);

/**
 * Notification에 띄울 알림 리스트를 서버에서 불러오는 함수
 */
export const getNotificationList = createAsyncThunk(
    "notification/",
    async (thunkAPI) => {
        try {
            const username = await SecureStore.getItemAsync("userName")

            const response = await axios.get(
                `${API_URL}/notification`,
                { username: username }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.detail);
        }
    }
);

/**
 * Borrower에게 Notification을 보내는 함수
 */
export const notifyBorrower = createAsyncThunk(
    "notification/notifyBorrower",
    async (record_id, thunkAPI) => {
        try {
            const response = await axios.post(
                `${API_URL}/notification/notify-borrower`,
                { record_id: record_id }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.detail);
        }
    }
);
