import { randomUUID } from "crypto";

import { BaseServiceConfig, RecommendationRequest } from "../models";
import { HttpUtil, RetryUtil } from "../utils";
import { RecommendationServiceTemplate } from "./recommendation-service.template";

export interface Service2ServiceConfig extends BaseServiceConfig {
  // No additional fields needed
}

interface Service2AuthParams {
  session_token: string;
}

export interface Service2Recommendation {
  priority: number;
  title: string;
  details: string;
}

interface Service2Request {
  measurements: {
    height: number;
    mass: number;
  }
  birth_date: number;
  session_token: string;
}

interface Service2Response {
  statusCode: number;
  body: string;
}

/**
 * Concrete implementation of RecommendationService2
 */
export class RecommendationService2 extends RecommendationServiceTemplate<Service2ServiceConfig, Service2Request, Service2AuthParams, Service2Recommendation> {
  protected override async getAuthenticationParams(): Promise<Service2AuthParams> {
    return await Promise.resolve({ session_token: randomUUID() });
  }

  protected override async getRequestParams(requestParams: RecommendationRequest, authParams: Service2AuthParams): Promise<Service2Request> {
    return await Promise.resolve({
      measurements: {
        height: +(requestParams.height / 30.48).toFixed(2),
        mass: +(requestParams.weight * 2.2).toFixed(1),
      },
      birth_date: new Date(requestParams.dateOfBirth).getTime(),
      ...authParams,
    });
  }

  protected override async requestRecommendation(requestParams: Service2Request): Promise<Array<Service2Recommendation>> {
    const startTime = Date.now();

    return RetryUtil.withRetry(
      async () => {
        console.log(`RecommendationService2 request attempt:`, requestParams);

        const response = await HttpUtil.fetchWithTotalTimeout(
          this.serviceInfo.url,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestParams),
          },
          startTime,
          this.serviceInfo.timeoutMs
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as Service2Response;
        console.log('RecommendationService2 response:', data);

        if (this.isSuccessfulResponse(data)) {
          return JSON.parse(data.body) as Array<Service2Recommendation>;
        }

        // If we get here, the response wasn't successful
        throw new Error(`RecommendationService2 returned unsuccessful response: ${JSON.stringify(data)}`);
      },
      this.serviceInfo.retryConfig,
      (attempt) => console.log(`RecommendationService2 attempt ${attempt}/${this.serviceInfo.retryConfig.maxAttempts}`),
      (error, attempt) => console.error(`RecommendationService2 error (attempt ${attempt}/${this.serviceInfo.retryConfig.maxAttempts}):`, error)
    );
  }

  private isSuccessfulResponse(response: Service2Response): boolean {
    return response.statusCode === 200;
  }
}
