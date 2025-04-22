/**
 * Configuration for retry behavior
 */
export interface RetryConfig {
  /**
   * Maximum number of attempts (including the initial attempt)
   */
  maxAttempts: number;

  /**
   * Base delay in milliseconds between retries
   * Each retry will wait for baseDelay * (2 ^ attemptNumber) milliseconds
   */
  baseDelayMs: number;
}

/**
 * Utility class for implementing retry logic with exponential backoff
 */
export class RetryUtil {
  /**
   * Executes an async operation with retry logic
   * @param operation The async operation to execute
   * @param config Retry configuration
   * @param onAttempt Optional callback for each attempt
   * @param onError Optional callback for each error
   * @returns Result of the operation
   */
  public static async withRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig,
    onAttempt?: (attemptNumber: number) => void,
    onError?: (error: unknown, attemptNumber: number) => void
  ): Promise<T> {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        onAttempt?.(attempt);
        return await operation();
      } catch (error) {
        lastError = error;
        onError?.(error, attempt);
        
        if (attempt === config.maxAttempts) {
          break;
        }
        
        const delay = config.baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
} 