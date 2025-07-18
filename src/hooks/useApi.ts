import { useState, useCallback } from 'react';
import { AxiosError } from 'axios'; 
import { ApiErrorResponse } from '../types'; 

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError<ApiErrorResponse> | null;  
}

interface ApiResult<T> extends ApiState<T> {
  callApi: (...args: any[]) => Promise<T | null>;
}

function useApi<T>(apiFunction: (...args: any[]) => Promise<T>): ApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError<ApiErrorResponse> | null>(null);  

  const callApi = useCallback(async (...args: any[]): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...args);  
      setData(response);
      return response;
    } catch (err: any) {
      
      setError(err as AxiosError<ApiErrorResponse>);  
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, callApi };
}

export default useApi;