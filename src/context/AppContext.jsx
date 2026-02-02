import { createContext, useContext, useState, useCallback, useEffect } from 'react';

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

  // --- Email/Password Login ---
  const loginWithEmail = useCallback(async (email, password) => {
    setAuthLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    // Admin shortcut
    if (email === 'admin@athar.com' && password === 'admin123') {
      const adminUser = { id: '1', name: 'مدير النظام', email, role: 'admin', avatar: 'م' };
      setUser(adminUser);
      setAuthLoading(false);
      return { success: true, user: adminUser, redirect: '/admin' };
    }

    // Regular user
    if (email && password && password.length >= 6) {
      const userData = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role: 'student',
        avatar: email.charAt(0).toUpperCase(),
      };
      setUser(userData);
      setAuthLoading(false);
      return { success: true, user: userData, redirect: '/checkout' };
    }

    setAuthLoading(false);
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }, []);

  // --- Email/Password Signup ---
  const signupWithEmail = useCallback(async ({ name, email, phone, password }) => {
    setAuthLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const userData = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: 'student',
      avatar: name.charAt(0),
    };
    setUser(userData);
    setAuthLoading(false);
    return { success: true, user: userData, redirect: '/checkout' };
  }, []);

  // --- Google OAuth ---
  const loginWithGoogle = useCallback(async () => {
    setAuthLoading(true);
    await new Promise((r) => setTimeout(r, 1800));

    const googleUser = {
      id: Date.now().toString(),
      name: 'مستخدم Google',
      email: 'user@gmail.com',
      role: 'student',
      avatar: 'G',
      provider: 'google',
    };
    setUser(googleUser);
    setAuthLoading(false);
    return { success: true, user: googleUser, redirect: '/checkout' };
  }, []);

  // --- Logout ---
  const logout = useCallback(() => {
    setUser(null);
    persistAuth(null);
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
