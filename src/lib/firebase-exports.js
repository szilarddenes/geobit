// Re-export everything from firebase/index.js
export {
    app,
    auth,
    db,
    functions,
    database,
    isUsingEmulators,
    onAuthStateChange,
    logoutUser,
    checkIsAdmin,
    getAdminUsers,
    addAdminUser,
    useAuth
} from './firebase/index.js'; 