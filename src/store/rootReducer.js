import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import clubsSlice from './slices/clubsSlice';
import eventsSlice from './slices/eventsSlice';
import gamificationSlice from './slices/gamificationSlice';
import notificationsSlice from './slices/notificationsSlice';
import messagingSlice from './slices/messagingSlice';
import uiSlice from './slices/uiSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  clubs: clubsSlice,
  events: eventsSlice,
  gamification: gamificationSlice,
  notifications: notificationsSlice,
  messaging: messagingSlice,
  ui: uiSlice,
});

export default rootReducer;
