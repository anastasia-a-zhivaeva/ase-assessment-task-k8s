import { RecommendationRequest, BaseServiceConfig } from "../models";

/**
 * RecommendationService provides a skeleton of the getRecommendation algorithm (Template Method Pattern)
 * Subclasses should override specific steps of the algorithm (abstract methods)
 */
export abstract class RecommendationServiceTemplate<ServiceConfig extends BaseServiceConfig, RequestParams, AuthParams, Recommendation> {
  protected serviceInfo: ServiceConfig;

  constructor(serviceInfo: ServiceConfig) {
    this.serviceInfo = serviceInfo;
  }

  /**
   * Return recommendations in service-specific format
   * @param requestParams 
   * @returns Array of service-specific recommendations
   */
  public async getRecommendation(requestParams: RecommendationRequest): Promise<Array<Recommendation>> {
    const authParams = await this.getAuthenticationParams();
    const request = await this.getRequestParams(requestParams, authParams);
    return this.requestRecommendation(request);
  }

  /**
   * Return authentication params required for making request to recommendation service
   */
  protected abstract getAuthenticationParams(): Promise<AuthParams>;

  /**
   * Return request params required for making request to recommendation service
   * Format params and does necessary calculations
   */
  protected abstract getRequestParams(requestParams: RecommendationRequest, authParams: AuthParams): Promise<RequestParams>;

  /**
   * Send request to recommendation service and returns recommendations in service specified format
   * Implements retry mechanism specific for the service (exponential-backoff, compliance with rate limiter)
   */
  protected abstract requestRecommendation(requestParams: RequestParams): Promise<Array<Recommendation>>;
}
