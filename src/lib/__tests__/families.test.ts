// Importar función a probar
import { 
  getAllFamilies, 
  getFamilyById, 
  searchFamilies, 
  getFamiliesByCategory 
} from '../families';

// Suite de tests
describe('getAllFamilies', () => {
  
  // Test 1: Verifica que devuelve un array
  test('devuelve un array', async () => {
    const families = await getAllFamilies();
    expect(Array.isArray(families)).toBe(true);
  });
  
  // Test 2: Verifica que el array no está vacío
  test('devuelve al menos 1 familia', async () => {
    const families = await getAllFamilies();
    expect(families.length).toBeGreaterThan(0);
  });
});

describe('getFamilyById', () => {
  
  // Test 1: ID válido que existe
  test('devuelve familia para ID válido', async () => {
    const family = await getFamilyById('fam_001');
    
    // Verificar que NO es null
    expect(family).not.toBeNull();
    
    // Verificar que tiene las propiedades correctas
    expect(family?.id).toBe('fam_001');
    expect(family?.name).toBeTruthy(); // Tiene un nombre
  });
  
  // Test 2: ID que no existe
  test('devuelve null para ID inválido', async () => {
    const family = await getFamilyById('invalid-id-123');
    expect(family).toBeNull();
  });
  
  // Test 3: ID vacío
  test('devuelve null para ID vacío', async () => {
    const family = await getFamilyById('');
    expect(family).toBeNull();
  });
  
  // Test 4: ID muy corto
  test('devuelve null para ID muy corto', async () => {
    const family = await getFamilyById('ab');
    expect(family).toBeNull();
  });
});

describe('searchFamilies', () => {
  
  // Test 1: Búsqueda exitosa
  test('encuentra familias por nombre', async () => {
    const results = await searchFamilies('chair');
    
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    
    // Verificar que los resultados contienen 'chair' en el nombre
    results.forEach(family => {
      expect(family.name.toLowerCase()).toContain('chair');
    });
  });
  
  // Test 2: Case-insensitive (mayúsculas/minúsculas)
  test('búsqueda es case-insensitive', async () => {
    const results1 = await searchFamilies('CHAIR');
    const results2 = await searchFamilies('chair');
    const results3 = await searchFamilies('ChAiR');
    
    // Todos deben dar el mismo resultado
    expect(results1.length).toBe(results2.length);
    expect(results2.length).toBe(results3.length);
  });
  
  // Test 3: Sin resultados
  test('devuelve array vacío para query sin resultados', async () => {
    const results = await searchFamilies('xyznonexistent123');
    expect(results).toEqual([]);
  });
  
  // Test 4: Query muy corta
  test('devuelve array vacío para query muy corta', async () => {
    const results = await searchFamilies('a');
    expect(results).toEqual([]);
  });
});

describe('getFamiliesByCategory', () => {
  
  // Test 1: Obtener familias de una categoría
  test('devuelve familias de la categoría correcta', async () => {
    const families = await getFamiliesByCategory('furniture');
    
    expect(Array.isArray(families)).toBe(true);
    expect(families.length).toBeGreaterThan(0);
    
    // TODAS deben ser de la categoría 'furniture'
    families.forEach(family => {
      expect(family.category).toBe('furniture');
    });
  });
  
  // Test 2: Probar todas las categorías
  test('funciona con todas las categorías', async () => {
    const categories = ['furniture', 'doors', 'windows', 'lighting'];
    
    for (const category of categories) {
      const families = await getFamiliesByCategory(category as any);
      expect(Array.isArray(families)).toBe(true);
      
      // Si hay familias, verificar categoría
      families.forEach(family => {
        expect(family.category).toBe(category);
      });
    }
  });
});