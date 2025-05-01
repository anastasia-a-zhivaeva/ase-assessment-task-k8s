# Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the recommendation service.

## Components

- **namespace.yaml**: Creates a dedicated namespace for the application
- **deployment.yaml**: Defines the application deployment with resource limits and health probes
- **service.yaml**: Exposes the application within the cluster
- **ingress.yaml**: Configures external access to the service
- **configmap.yaml**: Stores configuration parameters
- **hpa.yaml**: Horizontal Pod Autoscaler for dynamic scaling
- **kustomization.yaml**: Kustomize configuration for managing all resources

## Prometheus Monitoring

The service exposes Prometheus metrics at the `/metrics` endpoint. The deployment includes Prometheus annotations for automatic service discovery.

### Prometheus Configuration

Add the following annotations to your Kubernetes deployment to enable Prometheus scraping:

```yaml
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/metrics"
```

### Available Metrics

- `http_request_duration_seconds`: Histogram of HTTP request durations
- `http_requests_total`: Counter of total HTTP requests processed
- `recommendation_api_calls_total`: Counter of recommendation API calls
- `recommendation_cache_hit_total`: Counter of cache hits
- `recommendation_cache_miss_total`: Counter of cache misses
- `nodejs_heap_size_bytes`: Gauge of Node.js heap size 
- `nodejs_eventloop_lag_seconds`: Gauge of event loop lag

## Deployment Instructions

1. Build and push the Docker image:

```bash
docker build -t ${DOCKER_REGISTRY}/recommendation-service:vX -t ${DOCKER_REGISTRY}/recommendation-service:latest .
docker push ${DOCKER_REGISTRY}/recommendation-service:vX
docker push ${DOCKER_REGISTRY}/recommendation-service:latest
```

2. Deploy to Kubernetes with Kustomize:

```bash
kubectl apply -k kubernetes/
```

3. Verify the deployment:

```bash
kubectl get pods -n recommendation-service-ns
kubectl get svc -n recommendation-service-ns
kubectl get ingress -n recommendation-service-ns
```

## Scaling

The deployment automatically scales between 1-10 replicas based on CPU utilization.

## Configuration

Update the ConfigMap to change environment variables without redeploying the application.