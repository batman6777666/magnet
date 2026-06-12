import { useState, useCallback } from 'react';
import apiClient from '../api/client';
import type { ExtractPayload, ExtractResponse, RegisterResponse, HealthResponse } from '../types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useExtract() {
  const [state, setState] = useState<UseApiState<ExtractResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const extract = useCallback(async (apiKey: string, payload: ExtractPayload) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.extract(apiKey, payload);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState({ data: null, loading: false, error: message });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, extract, reset };
}

export function useRegister() {
  const [state, setState] = useState<UseApiState<RegisterResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const register = useCallback(async (name: string, email?: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.register(name, email);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState({ data: null, loading: false, error: message });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, register, reset };
}

export function useHealth() {
  const [state, setState] = useState<UseApiState<HealthResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const check = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.health();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState({ data: null, loading: false, error: message });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, check, reset };
}
