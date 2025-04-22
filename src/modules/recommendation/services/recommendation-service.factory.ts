import { BaseServiceConfig } from "../models";
import { RecommendationServiceTemplate } from "./recommendation-service.template";
import { RecommendationService1, Service1ServiceConfig } from "./recommendation-service1.service";
import { RecommendationService2, Service2ServiceConfig } from "./recommendation-service2.service";

type RecommendationService<T extends BaseServiceConfig> = RecommendationServiceTemplate<T, unknown, unknown, unknown>;

/**
 * RecommendationServiceFactory creates RecommendationService depending on provided type (Abstract Factory Pattern)
 */
export class RecommendationServiceFactory {
    public createRecommendationService<T extends BaseServiceConfig>(serviceName: string, serviceInfo: T): RecommendationService<T> {
        switch (serviceName) {
            case "service1": {
                return new RecommendationService1(serviceInfo as unknown as Service1ServiceConfig) as unknown as RecommendationService<T>;
            }
            case "service2": {
                return new RecommendationService2(serviceInfo as unknown as Service2ServiceConfig) as unknown as RecommendationService<T>;
            }
            default:
                throw new Error(`Unsupported recommendation service: ${serviceName}`);
        }
    }
}
