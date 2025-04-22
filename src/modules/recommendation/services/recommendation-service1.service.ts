import { BaseServiceConfig, RecommendationRequest } from "../models";
import { HttpUtil, RetryUtil } from "../utils";
import { RecommendationServiceTemplate } from "./recommendation-service.template";

export interface Service1ServiceConfig extends BaseServiceConfig {
  token: string;
}

interface Service1AuthParams {
  token: string;
}

export interface Service1Recommendation {
  confidence: number;
  recommendation: string;
}

interface Service1Request {
  weight: number;
  height: number;
  token: string;
}

interface Service1Success {
  statusCode: number;
  body: string;
}

interface Service1Error {
  errorCode: number;
  errorMessage: string;
  statusCode: number;
}

type Service1Response = Service1Success | Service1Error;

/**
 * Concrete implementation of RecommendationService1
 */
export class RecommendationService1 extends RecommendationServiceTemplate<Service1ServiceConfig, Service1Request, Service1AuthParams, Service1Recommendation> {
  protected override async getAuthenticationParams(): Promise<Service1AuthParams> {
    return await Promise.resolve({ token: this.serviceInfo.token });
  }

  protected override async getRequestParams(requestParams: RecommendationRequest, authParams: Service1AuthParams): Promise<Service1Request> {
    return await Promise.resolve({
      weight: requestParams.weight,
      height: requestParams.height,
      ...authParams,
    });
  }

  protected override async requestRecommendation(requestParams: Service1Request): Promise<Array<Service1Recommendation>> {
    const startTime = Date.now();

    return RetryUtil.withRetry(
      async () => {
        console.log(`RecommendationService1 request attempt:`, requestParams);

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

        const data = await response.json() as Service1Response;
        console.log('RecommendationService1 response:', data);

        if (this.isSuccessfulResponse(data)) {
          return JSON.parse(data.body) as Array<Service1Recommendation>;
        }

        // If we get here, the response wasn't successful
        throw new Error(`RecommendationService1 returned unsuccessful response: ${JSON.stringify(data)}`);
      },
      this.serviceInfo.retryConfig,
      (attempt) => console.log(`RecommendationService1 attempt ${attempt}/${this.serviceInfo.retryConfig.maxAttempts}`),
      (error, attempt) => console.error(`RecommendationService1 error (attempt ${attempt}/${this.serviceInfo.retryConfig.maxAttempts}):`, error)
    );
  }

  private isSuccessfulResponse(response: Service1Response): response is Service1Success {
    return response.statusCode === 200
  }
}
