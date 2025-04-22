/**
 * Represents recommendations from a specific service
 */
export interface ServiceRecommendations {
    /**
     * Name of the service that provided the recommendations
     */
    serviceName: string;

    /**
     * Recommendations from the service in service-specific format
     */
    recommendations: unknown[];
} 