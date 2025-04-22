import { RetryConfig } from "../utils";

/**
 * Base interface for service configuration that includes common settings
 */
export interface BaseServiceConfig {
    /**
     * The endpoint URL of the recommendation service
     * This should be a fully qualified URL including protocol and path
     */
    url: string;

    /**
     * Maximum time in milliseconds to wait for a response from the service
     * This timeout applies to the entire operation including all retries
     */
    timeoutMs: number;

    /**
     * Configuration for retry behavior
     * Specifies the number of attempts and delay between retries
     */
    retryConfig: RetryConfig;
} 