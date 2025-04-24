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

## Deployment Instructions

1. Build and push the Docker image:

```bash
docker build -t ${DOCKER_REGISTRY}/recommendation-service:vX .
docker push ${DOCKER_REGISTRY}/recommendation-service:vX
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

The deployment automatically scales between 2-10 replicas based on CPU utilization.

## Configuration

Update the ConfigMap to change environment variables without redeploying the application.