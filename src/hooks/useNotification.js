import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing notifications with auto-hide
 * @param {number} duration - auto-hide duration in ms (default: 4000)
 * @returns {{ notification: { message: string, type: string } | null, showNotification: Function, hideNotification: Function }}
 */
export default function useNotification(duration = 4000) {
  const [notification, setNotification] = useState(null);
  const timerRef = useRef(null);

  const hideNotification = useCallback(() => {
    setNotification(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showNotification = useCallback(
    (message, type = 'success') => {
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setNotification({ message, type });

      // Auto-hide after duration
      timerRef.current = setTimeout(() => {
        setNotification(null);
        timerRef.current = null;
      }, duration);
    },
    [duration]
  );

  return { notification, showNotification, hideNotification };
}
