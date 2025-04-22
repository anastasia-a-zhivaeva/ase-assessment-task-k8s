/* eslint-disable @typescript-eslint/require-await */
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { RecommendationServiceFactory } from './recommendation-service.factory';
import { RecommendationAggregatorService } from './recommendation-aggregator.service';
import { RecommendationDtoMapper, service1Mapper, service2Mapper } from '../mappers';

export interface RecommendationPluginOptions {
  // Add any plugin options if needed
}

const recommendationPlugin: FastifyPluginAsync<RecommendationPluginOptions> = async (
  fastify,
  _opts
) => {
  const factory = new RecommendationServiceFactory();
  const aggregator = new RecommendationAggregatorService(factory);
  const dtoMapper = new RecommendationDtoMapper();
  
  // Register service mappers
  dtoMapper.registerMapper("service1", service1Mapper);
  dtoMapper.registerMapper("service2", service2Mapper);
  
  fastify.decorate('recommendationServiceFactory', factory);
  fastify.decorate('recommendationAggregator', aggregator);
  fastify.decorate('recommendationDtoMapper', dtoMapper);
};

export default fp(recommendationPlugin, {
  name: 'recommendation-service'
});

// Add type declaration for fastify instance
declare module 'fastify' {
  interface FastifyInstance {
    recommendationDtoMapper: RecommendationDtoMapper;
    recommendationAggregator: RecommendationAggregatorService;
    recommendationServiceFactory: RecommendationServiceFactory;
  }
}