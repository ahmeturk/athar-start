import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../api/auth.js';
import apiClient from '../api/client.js';

const AppContext = createContext(null);

const AUTH_STORAGE_KEY = 'athar_auth';

function loadPersistedAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

function persistAuth(data) {
  if (data) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => loadPersistedAuth());
  const [notification, setNotification] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Persist user on change
  useEffect(() => {
    persistAuth(user);
  }, [user]);

  // On mount, verify token is still valid
  useEffect(() => {
    const token = localStorage.getItem('athar_token');
    if (token && user) {
      authAPI.getMe()
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          // Token expired or invalid
          setUser(null);
          apiClient.setToken(null);
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Email/Password Login ---
  const loginWithEmail = useCallback(async (email, password) => {
    setAuthLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      apiClient.setToken(data.token);
      setUser(data.user);
      setAuthLoading(false);
      const redirect = data.user.role === 'admin' ? '/admin' : '/checkout';
      return { success: true, user: data.user, redirect };
    } catch (error) {
      setAuthLoading(false);
      return { success: false, error: error.message };
    }
  }, []);

  // --- Email/Password Signup ---
  const signupWithEmail = useCallback(async ({ name, email, phone, password }) => {
    setAuthLoading(true);
    try {
      const data = await authAPI.signup({ name, email, phone, password });
      apiClient.setToken(data.token);
      setUser(data.user);
      setAuthLoading(false);
      return { success: true, user: data.user, redirect: '/checkout' };
    } catch (error) {
      setAuthLoading(false);
      return { success: false, error: error.message };
    }
  }, []);

  // --- Google OAuth ---
  const loginWithGoogle = useCallback(async (credential) => {
    setAuthLoading(true);
    try {
      // If no credential provided (old simulated flow), create a dev credential
      const cred = credential || JSON.stringify({
        sub: 'google_' + Date.now(),
        email: 'user@gmail.com',
        name: 'مستخدم Google',
        picture: null,
      });
      const data = await authAPI.googleAuth(cred);
      apiClient.setToken(data.token);
      setUser(data.user);
      setAuthLoading(false);
      const redirect = data.user.role === 'admin' ? '/admin' : '/checkout';
      return { success: true, user: data.user, redirect };
    } catch (error) {
      setAuthLoading(false);
      return { success: false, error: error.message };
    }
  }, []);

  // --- Logout ---
  const logout = useCallback(() => {
    authAPI.logout().catch(() => {}); // fire and forget
    setUser(null);
    persistAuth(null);
    apiClient.setToken(null);
  }, []);

  // --- Notifications ---
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        authLoading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
        notification,
        showNotification,
        login: (userData) => setUser(userData),
      }}
    >
      {children}
      {/* Global notification toast */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-fadeInUp">
          <div className={`px-6 py-3 rounded-xl shadow-lg font-medium text-sm flex items-center gap-2 ${
            notification.type === 'error'
              ? 'bg-red-500 text-white'
              : notification.type === 'warning'
              ? 'bg-yellow-500 text-white'
              : 'bg-green-500 text-white'
          }`}>
            {notification.message}
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export default AppContext;
