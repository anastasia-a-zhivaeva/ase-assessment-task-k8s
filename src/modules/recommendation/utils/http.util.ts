/**
 * Utility class for making HTTP requests with timeout support
 */
export class HttpUtil {
  /**
   * Makes a fetch request with timeout support
   * @param url The URL to fetch from
   * @param options Fetch options
   * @param timeoutMs Maximum time in milliseconds to wait for the response
   * @returns Response from the server
   * @throws Error if the request times out
   */
  public static async fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Makes a fetch request with a total timeout that applies across retries
   * @param url The URL to fetch from
   * @param options Fetch options
   * @param startTime Timestamp when the request started
   * @param totalTimeoutMs Total time in milliseconds allowed for all attempts
   * @returns Response from the server
   * @throws Error if the total timeout is exceeded
   */
  public static async fetchWithTotalTimeout(
    url: string, 
    options: RequestInit, 
    startTime: number,
    totalTimeoutMs: number
  ): Promise<Response> {
    const remainingTime = totalTimeoutMs - (Date.now() - startTime);
    if (remainingTime <= 0) {
      throw new Error('Total timeout exceeded');
    }

    return this.fetchWithTimeout(url, options, remainingTime);
  }
} 