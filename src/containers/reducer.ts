import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface IContainerState {
    sidebarShow: 'responsive' | boolean,
    asideShow: boolean,
    darkMode: boolean
}

const initialState: IContainerState = {
    sidebarShow: 'responsive',
    asideShow: false,
    darkMode: false
}
 
const containerSlice = createSlice({
    name: 'containerSlice',
    initialState,
    // initialState,
    reducers: {
        toggleSidebar: (state, { payload }: PayloadAction< 'responsive'| boolean >) => {
            state.sidebarShow = payload;
        },
        toggleAside: (state, { payload }: PayloadAction<boolean>) => {
            state.asideShow = payload;
        },
        toggleDarkMode: (state, { payload }: PayloadAction<boolean>) => {
            state.darkMode = payload;
        },

    },
});

export default containerSlice.reducer;
export const {
    toggleSidebar,
    toggleAside,
    toggleDarkMode
} = containerSlice.actions;

