import { FastifyInstance } from "fastify";
import { RecommendationRequest, RecommendationResponse } from "./models";

export function routes(fastify: FastifyInstance): void {
    fastify.post<{ Body: RecommendationRequest }>("/recommendation", async (request) => {
        const serviceRecommendations = await fastify.recommendationAggregator.getRecommendations(request.body);
        const recommendations = fastify.recommendationDtoMapper.toDtos(serviceRecommendations);
        
        return <RecommendationResponse>{
            recommendations
        };
    });
}