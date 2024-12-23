import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice'; // Import the reducer directly

export const store = configureStore({
  reducer: {
    user: userReducer, // Use the reducer here
  },
});
