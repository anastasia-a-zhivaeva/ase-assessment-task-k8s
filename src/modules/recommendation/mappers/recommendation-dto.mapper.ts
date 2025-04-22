import { RecommendationDto, ServiceRecommendations } from "../models";

type ServiceMapper<T> = (recommendations: Array<T>) => Array<RecommendationDto>;

/**
 * RecommendationDtoMapper transforms service-specific recommendation models into DTOs
 * Uses a registry pattern to map different service recommendations to DTOs
 */
export class RecommendationDtoMapper {
    private readonly mapperRegistry: Map<string, ServiceMapper<unknown>> = new Map();

    /**
     * Maps service-specific recommendations to DTOs
     */
    public toDto(serviceName: string, recommendations: unknown): Array<RecommendationDto> {
        if (!Array.isArray(recommendations)) {
            return [];
        }

        const mapper = this.mapperRegistry.get(serviceName);
        if (!mapper) {
            return [];
        }

        return mapper(recommendations);
    }

    /**
     * Maps and sorts recommendations from multiple services
     * @param serviceRecommendations Array of recommendations from different services
     * @returns Sorted array of recommendation DTOs
     */
    public toDtos(serviceRecommendations: ServiceRecommendations[]): RecommendationDto[] {
        const mappedRecommendations = serviceRecommendations.flatMap(serviceRecommendation => 
            this.toDto(serviceRecommendation.serviceName, serviceRecommendation.recommendations)
        );

        return [...mappedRecommendations].sort((a, b) => a.priority < b.priority ? 1 : -1);
    }

    /**
     * Registers a new service mapper
     * @param serviceName The name of the service
     * @param mapper The mapper function for the service
     */
    public registerMapper<T>(serviceName: string, mapper: ServiceMapper<T>): void {
        this.mapperRegistry.set(serviceName, mapper as ServiceMapper<unknown>);
    }
} 