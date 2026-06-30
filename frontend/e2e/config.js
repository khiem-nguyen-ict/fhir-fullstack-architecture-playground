// Configuration for E2E tests - URLs can be overridden via environment variables
export const config = {
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  bffUrl: process.env.BFF_URL || 'http://localhost:4000',
  patientServiceUrl: process.env.PATIENT_SERVICE_URL || 'http://localhost:8081',
};
