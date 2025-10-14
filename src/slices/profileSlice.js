import {createSlice} from "@reduxjs/toolkit"

// Initial state

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
};

// Created profile slice

const profileSlice = createSlice({
    name:"profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
          },
    },
});

// Action creators are generated for each case reducer function

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;