/**
 * Interface for service configuration
 */
interface ServiceConfig {
  name: string;
  url: string;
  token?: string;
  timeoutMs: number;
  retryConfig: {
    maxAttempts: number;
    baseDelayMs: number;
  };
}

/**
 * In real implementation, they should be in the database
 * But for simplicity, I store them in file
 */
export const supportedRecommendationServices: ServiceConfig[] = [{
  name: "service1",
  url: "https://a2da22tugdqsame4ckd3oohkmu0tnbne.lambda-url.eu-central-1.on.aws/services/service1",
  token: "service1-dev", // imitates permanent API Key that is stored in DB (encrypted)
  timeoutMs: 10000, // 10 seconds
  retryConfig: {
    maxAttempts: 3,
    baseDelayMs: 1000, // 1s, 2s, 4s
  },
}, {
  name: "service2",
  url: "https://a2da22tugdqsame4ckd3oohkmu0tnbne.lambda-url.eu-central-1.on.aws/services/service2",
  timeoutMs: 15000, // 15 seconds
  retryConfig: {
    maxAttempts: 3,
    baseDelayMs: 1000, // 1s, 2s, 4s
  },
}];
