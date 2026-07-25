import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const pendingRequests = useRef(0);
  const navigationLoading = useRef(false);
  const hideTimer = useRef(null);
  const showTime = useRef(0);

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    const elapsed = Date.now() - showTime.current;
    const remaining = Math.max(0, 800 - elapsed);
    hideTimer.current = setTimeout(() => {
      if (pendingRequests.current === 0 && !navigationLoading.current) {
        setLoading(false);
      }
      hideTimer.current = null;
    }, remaining);
  }, []);

  const showLoading = useCallback(() => {
    clearHideTimer();
    pendingRequests.current += 1;
    showTime.current = Date.now();
    setLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    pendingRequests.current = Math.max(0, pendingRequests.current - 1);
    scheduleHide();
  }, [scheduleHide]);

  const startNavigation = useCallback(() => {
    clearHideTimer();
    navigationLoading.current = true;
    showTime.current = Date.now();
    setLoading(true);
  }, []);

  const stopNavigation = useCallback(() => {
    navigationLoading.current = false;
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
      pendingRequests.current += 1;
      showTime.current = Date.now();
      setLoading(true);

      try {
        const response = await originalFetch.apply(this, args);
        return response;
      } finally {
        pendingRequests.current = Math.max(0, pendingRequests.current - 1);
        scheduleHide();
      }
    };

    return () => {
      window.fetch = originalFetch;
      clearHideTimer();
    };
  }, [scheduleHide]);

  const value = {
    loading,
    showLoading,
    hideLoading,
    startNavigation,
    stopNavigation,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
