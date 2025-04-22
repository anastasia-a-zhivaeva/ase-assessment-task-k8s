import { RecommendationDto } from "../models";
import { Service1Recommendation } from "../services/recommendation-service1.service";

/**
 * Maps Service1 recommendations to DTOs
 */
export const service1Mapper = (recommendations: Array<Service1Recommendation>): Array<RecommendationDto> => 
    recommendations.map(recommendation => ({
        priority: recommendation.confidence * 1000,
        title: recommendation.recommendation
    })); 