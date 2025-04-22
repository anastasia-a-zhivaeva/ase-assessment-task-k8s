import { RecommendationRequest, ServiceRecommendations } from "../models";
import { supportedRecommendationServices } from "../supported-recommendation-services";
import { RecommendationServiceFactory } from "./recommendation-service.factory";

/**
 * Service that aggregates recommendations from multiple services
 */
export class RecommendationAggregatorService {
    private readonly serviceFactory: RecommendationServiceFactory;

    constructor(serviceFactory: RecommendationServiceFactory) {
        this.serviceFactory = serviceFactory;
    }

    /**
     * Gets recommendations from all configured services
     * @param requestParams Parameters for recommendation request
     * @returns Array of service recommendations, each containing service name and its recommendations
     */
    public async getRecommendations(requestParams: RecommendationRequest): Promise<ServiceRecommendations[]> {
        const recommendationsArrays = await Promise.all(
            supportedRecommendationServices.map(async serviceInfo => {
                try {
                    const service = this.serviceFactory.createRecommendationService(serviceInfo.name, serviceInfo);
                    const recommendations = await service.getRecommendation(requestParams);
                    return {
                        serviceName: serviceInfo.name,
                        recommendations
                    };
                } catch(error) {
                    console.log(error);
                    return {
                        serviceName: serviceInfo.name,
                        recommendations: []
                    };
                }
            })
        );

        return recommendationsArrays;
    }
} 