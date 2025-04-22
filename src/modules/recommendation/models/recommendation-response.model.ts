import { RecommendationDto } from "./recommendation-dto.model";

/**
 * Response model containing an array of recommendations
 */
export interface RecommendationResponse {
    /**
     * Array of recommendations from various services
     */
    recommendations: RecommendationDto[];
} 