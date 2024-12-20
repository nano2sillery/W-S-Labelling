import { supabase } from '../supabase';
import { NetworkError, AuthenticationError, ApiError } from './errors';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw new AuthenticationError(error.message);
  if (!session) throw new AuthenticationError();
  return session;
}

async function withRetry<T>(
  operation: () => Promise<T>,
  attempt = 1
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (attempt >= MAX_RETRIES) throw error;
    if (error instanceof AuthenticationError) throw error;

    const isNetworkError = error instanceof NetworkError ||
      (error instanceof TypeError && error.message === 'Failed to fetch');

    if (!isNetworkError) throw error;

    const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
    await delay(delayMs);
    return withRetry(operation, attempt + 1);
  }
}

export async function apiRequest<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  options: { requireAuth?: boolean } = { requireAuth: true }
): Promise<T> {
  try {
    if (options.requireAuth) {
      await checkAuth();
    }

    const response = await withRetry(async () => {
      const result = await operation();
      
      if (result.error) {
        if (result.error.message?.includes('JWT') || result.error.code === 'PGRST301') {
          throw new AuthenticationError();
        }
        throw new ApiError(result.error.message || 'An error occurred', result.error.code);
      }
      
      if (result.data === null) {
        throw new ApiError('No data returned from the API');
      }
      
      return result.data;
    });

    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new NetworkError();
    }
    throw error;
  }
}