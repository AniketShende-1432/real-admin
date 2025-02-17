import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
    role: null,        // Admin role (e.g., "superadmin", "admin")
    permissions: {},   // Stores permissions (e.g., { canEdit: true, canDelete: false })
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setPermissions(state, action) {
            const { role, permissions } = action.payload;
            state.role = role;
            state.permissions = permissions;
        },
        clearPermissions(state) {
            state.role = null;
            state.permissions = {};
        },
    },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
