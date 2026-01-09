import { test, expect } from '@playwright/test';

// Test 1: Homepage carga correctamente
test('homepage carga y muestra elementos clave', async ({ page }) => {
  // 1. Ir a homepage
  await page.goto('/');
  
  // 2. Verificar título de la página
  await expect(page).toHaveTitle(/Boracity/i);
  
  // 3. Verificar que hay un heading con "Free Revit Families"
  const heading = page.getByRole('heading', { name: /free revit families/i });
  await expect(heading).toBeVisible();
  
  // 4. Verificar que las stats están visibles
  await expect(page.getByText(/revit families/i)).toBeVisible();
});

// Test 2: Navegación a página de detalle
test('puede navegar a página de detalle desde homepage', async ({ page }) => {
  // 1. Ir a homepage
  await page.goto('/');
  
  // 2. Esperar a que las familias carguen
  await page.waitForSelector('a[href*="/revit/"][href*="/"]', { timeout: 10000 });
  
  // 3. Buscar un link que tenga el patrón /revit/categoria/slug
  // (debe tener al menos 3 slashes)
  const familyLinks = await page.locator('a[href*="/revit/"]').all();
  
  let detailLink = null;
  for (const link of familyLinks) {
    const href = await link.getAttribute('href');
    // Verificar que tiene formato: /revit/categoria/slug
    if (href && href.split('/').length >= 4) {
      detailLink = link;
      break;
    }
  }
  
  // 4. Hacer click en el link de familia
  if (detailLink) {
    await detailLink.click();
    
    // 5. Esperar navegación
    await page.waitForURL(/\/revit\/.+\/.+/, { timeout: 10000 });
    
    // 6. Verificar que estamos en página de detalle
    await expect(page.getByRole('button', { name: /download family/i })).toBeVisible();
  } else {
    throw new Error('No se encontró ningún link de familia en la homepage');
  }
});

// Test 3: Página 404
test('muestra página 404 para familia inexistente', async ({ page }) => {
  // 1. Intentar ir a una familia que no existe
  await page.goto('/revit/furniture/familia-que-no-existe-123');
  
  // 2. Verificar que muestra 404
  await expect(page.getByText(/404/i)).toBeVisible();
  await expect(page.getByText(/not found/i)).toBeVisible();
  
  // 3. Verificar que hay link de regreso
  const homeLink = page.getByRole('link', { name: /go to homepage/i });
await expect(homeLink).toBeVisible();
  
  // 4. Click en el link
  await homeLink.click();
  
  // 5. Verificar que volvió a homepage
  await page.waitForURL('/');
  await expect(page.getByRole('heading', { name: /free revit families/i })).toBeVisible();
});