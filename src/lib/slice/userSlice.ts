import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  role?: string;
  phoneNumber?: string;
  lastActive?: Date;
  acceptedDate?: Date;
  accessToken?: string;
  [key: string]: any;
}
export interface UserState {
  user: UserPayload | null;
  users: UserPayload[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  users: [],
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signUpStart(state) {
      state.loading = true;
      state.error = null;
    },
    signUpSuccess(state, action: PayloadAction<{ user: UserPayload }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.error = null;
    },
    signUpFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    signInStart(state) {
      state.loading = true;
      state.error = null;
    },
    signInSuccess(state, action: PayloadAction<{ user: UserPayload }>) {
      state.user = action.payload.user;
      state.error = null;
    },
    signInFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    loadUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    loadUserSuccess(state, action: PayloadAction<{ user: UserPayload }>) {
      state.user = action.payload.user;
      state.loading = false;
    },
    loadUserFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess(state, action: PayloadAction<{ user: UserPayload }>) {
      state.user = action.payload.user;
      state.users = state.users.map((user) =>
        user.id === action.payload.user.id ? action.payload.user : user,
      );
      state.loading = false;
    },
    updateUserFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    createUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    createUserSuccess(state, action: PayloadAction<{ user: UserPayload }>) {
      state.users.push(action.payload.user);
      state.loading = false;
    },
    createUserFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    loadAllUsersStart(state) {
      state.loading = true;
      state.error = null;
    },
    loadAllUsersSuccess(
      state,
      action: PayloadAction<{ users: UserPayload[] }>,
    ) {
      state.users = action.payload.users;
      state.loading = false;
    },
    loadAllUsersFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    signOut(state) {
      state.user = null;
      state.error = null;
    },
    deleteUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess(state, action: PayloadAction<{ id: string }>) {
      state.users = state.users.filter((user) => user.id !== action.payload.id);
      state.loading = false;
    },
    deleteUserFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signUpStart,
  signUpSuccess,
  signUpFailure,
  signInStart,
  signInSuccess,
  signInFailure,
  signOut,
  loadUserStart,
  loadUserSuccess,
  loadUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  loadAllUsersStart,
  loadAllUsersSuccess,
  loadAllUsersFailure,
  createUserStart,
  createUserSuccess,
  createUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
