import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { v4 as uuid } from 'uuid'

export enum NotificationType {
  DEFAULT = 'default',
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export type Notification = {
  type: NotificationType,
  message: string,
}
type NotificationWithKey = {
  key: string | undefined
  message: string,
  variant: "default" | "error" | "success" | "warning" | "info" | undefined,
}

interface AppState {
  notifications: NotificationWithKey[],
}

const initialState: AppState = {
  notifications: [],
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications = [...state.notifications, {
        key: uuid(),
        message: action.payload.message,
        variant: action.payload.type
      }];
    },
    removeNotification: (state, action: PayloadAction<string|undefined>) => {
      const key = action.payload;
      if (key) {
        state.notifications = state.notifications.filter(
          notification => notification.key !== key
        )
      }
    },
  },
});

export const { addNotification, removeNotification } = appSlice.actions;

export const getNotifications = (state: RootState) => state.app.notifications;

export default appSlice.reducer;
