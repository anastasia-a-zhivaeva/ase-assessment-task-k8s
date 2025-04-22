import { RecommendationDto } from "../models";
import { Service2Recommendation } from "../services/recommendation-service2.service";

/**
 * Maps Service2 recommendations to DTOs
 */
export const service2Mapper = (recommendations: Array<Service2Recommendation>): Array<RecommendationDto> => 
    recommendations.map(recommendation => ({
        priority: recommendation.priority,
        title: recommendation.title,
        description: recommendation.details,
    })); 