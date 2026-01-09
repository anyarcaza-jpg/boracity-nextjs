import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Carpeta donde están los tests E2E
  testDir: './e2e',
  
  // Timeout por test (30 segundos)
  timeout: 30000,
  
  // Reintentos si falla
  retries: 1,
  
  // Número de tests en paralelo
  workers: 1,
  
  // Reporter (formato de salida)
  reporter: 'list',
  
  // Configuración general
  use: {
    // URL base
    baseURL: 'http://localhost:3000',
    
    // Screenshot solo si falla
    screenshot: 'only-on-failure',
    
    // Video solo si falla
    video: 'retain-on-failure',
  },
  
  // Navegadores a probar
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // Servidor web (inicia tu app automáticamente)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    timeout: 120000,
    reuseExistingServer: true,
  },
});