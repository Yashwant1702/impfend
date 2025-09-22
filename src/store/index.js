import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import clubsSlice from './slices/clubsSlice';
import eventsSlice from './slices/eventsSlice';
import gamificationSlice from './slices/gamificationSlice';
import notificationsSlice from './slices/notificationsSlice';
import messagingSlice from './slices/messagingSlice';
import uiSlice from './slices/uiSlice';
import apiMiddleware from './middleware/api';

// Root reducer combining all slices
const rootReducer = combineReducers({
  auth: authSlice,
  clubs: clubsSlice,
  events: eventsSlice,
  gamification: gamificationSlice,
  notifications: notificationsSlice,
  messaging: messagingSlice,
  ui: uiSlice,
});

// Configure store with middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['_persist'],
      },
    }).concat(apiMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
