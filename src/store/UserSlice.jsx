import { createSlice } from '@reduxjs/toolkit';



let details=JSON.parse(localStorage.getItem("blogsAuth"));

const initialState = {
    login:details?details.login: false,
    user:details?details.user: "",
    token:details?details.token: ""
};

export const UserSlice = createSlice({
  name: 'user', 
  initialState: initialState,
  reducers: {
    setState: (state, action) => {
        console.log(action.payload);
        localStorage.setItem('blogsAuth', JSON.stringify({login: true, token: action.payload.token,user:""}));
        state.login = true;
        state.token = action.payload.token;
    },
    updateUser: (state, action) => {
        localStorage.setItem('blogsAuth', JSON.stringify({login: true, token: state.token,user:action.payload.user}));
        state.user = action.payload.user;
    },
    logout: (state,action) => {
        localStorage.removeItem('blogsAuth');
        state.login = false;
        state.token = "";
        state.user = "";
    },
    login1: (state, action) => {
      <Link to="/login">Login</Link>
    },
    signup: (state, action) => {
      <Link to="/signup">SignUp</Link>
    }
  },
});

export const { setState,updateUser,logout,login1,signup } = UserSlice.actions;
export default UserSlice.reducer;
