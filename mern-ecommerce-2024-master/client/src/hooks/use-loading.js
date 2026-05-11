import { useState, useCallback } from "react";

export function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState);

  const withLoading = useCallback(async (asyncFn) => {
    if (loading) return;
    setLoading(true);
    try {
      return await asyncFn();
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  return { loading, setLoading, startLoading, stopLoading, withLoading };
}
