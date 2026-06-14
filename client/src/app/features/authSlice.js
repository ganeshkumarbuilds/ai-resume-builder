import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user: null,
        loading: false
    },
    reducers:{
        login: (state, action)=>{
            state.token = action.payload.token
            state.user = action.payload.user
        },
        logout: (state)=>{
            state.token = null
            state.user = null
            state.loading = false
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
        setLoading: (state, action)=>{
            state.loading = action.payload
        }
    }
})

export const {login, logout, setLoading} = authSlice.actions

export default authSlice.reducer