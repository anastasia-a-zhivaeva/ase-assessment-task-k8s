declare module 'prom-client' {
  export * from 'prom-client';
  const promClient: typeof import('prom-client');
  export default promClient;

  export interface DefaultMetricsCollectorConfiguration<T = any> {}
  export interface HistogramConfiguration<T = any> {}
  export interface SummaryConfiguration<T = any> {}
}