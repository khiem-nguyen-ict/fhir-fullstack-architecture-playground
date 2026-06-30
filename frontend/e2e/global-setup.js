import { request } from '@playwright/test';
import { config } from './config.js';

async function waitForService(url, timeout = 60000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const apiRequest = await request.newContext();
      const response = await apiRequest.get(url);
      if (response.status() >= 200 && response.status() < 500) {
        return true;
      }
    } catch (e) {
      // Service not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error(`Service at ${url} did not become ready within ${timeout}ms`);
}

export default async function globalSetup() {
  console.log('Waiting for services to be ready...');
  
  await waitForService(`${config.patientServiceUrl}/actuator/health`);
  console.log('✓ patient-service ready');
  
  await waitForService(`${config.bffUrl}/graphql`);
  console.log('✓ bff ready');
  
  await waitForService(config.frontendUrl);
  console.log('✓ frontend ready');
  
  console.log('All services are ready for E2E tests!');
}
