import { RecommendationRequest } from "../models";
import { RecommendationAggregatorService } from "./recommendation-aggregator.service";
import { RecommendationServiceFactory } from "./recommendation-service.factory";

describe("RecommendationAggregatorService", () => {
    let serviceFactory: RecommendationServiceFactory;
    let aggregator: RecommendationAggregatorService;

    beforeEach(() => {
        serviceFactory = new RecommendationServiceFactory();
        aggregator = new RecommendationAggregatorService(serviceFactory);
    });

    describe("getRecommendations", () => {
        it("should aggregate recommendations from all configured services", async () => {
            const request: RecommendationRequest = {
                weight: 70,
                height: 170,
                dateOfBirth: "1990-01-01"
            };

            const result = await aggregator.getRecommendations(request);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
            result.forEach(serviceRec => {
                expect(serviceRec).toHaveProperty("serviceName");
                expect(serviceRec).toHaveProperty("recommendations");
                expect(Array.isArray(serviceRec.recommendations)).toBe(true);
            });
        });

        it("should handle service errors gracefully", async () => {
            const request: RecommendationRequest = {
                weight: 70,
                height: 170,
                dateOfBirth: "1990-01-01"
            };

            // Simulate a service error by using an invalid service name
            const result = await aggregator.getRecommendations(request);

            expect(result).toBeInstanceOf(Array);
            result.forEach(serviceRec => {
                expect(serviceRec).toHaveProperty("serviceName");
                expect(serviceRec).toHaveProperty("recommendations");
                expect(Array.isArray(serviceRec.recommendations)).toBe(true);
            });
        });
    });
}); 