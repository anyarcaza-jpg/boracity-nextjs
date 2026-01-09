// Importamos la función que vamos a probar
import { 
  isValidCategory, 
  validateFamilyId,
  validateCategory,
  validateSearch
} from '../validators';

// Grupo de tests relacionados (suite)
describe('isValidCategory', () => {
  
  // Test 1: Probar categorías válidas
  test('acepta categorías válidas', () => {
    // Probar cada categoría válida
    expect(isValidCategory('furniture')).toBe(true);
    expect(isValidCategory('doors')).toBe(true);
    expect(isValidCategory('windows')).toBe(true);
    expect(isValidCategory('lighting')).toBe(true);
  });
  
  // Test 2: Probar categorías inválidas
  test('rechaza categorías inválidas', () => {
    expect(isValidCategory('invalid')).toBe(false);
    expect(isValidCategory('')).toBe(false);
    expect(isValidCategory('FURNITURE')).toBe(false); // Case-sensitive
  });
});

// Nueva suite de tests
  test('acepta IDs válidos', () => {
    const result = validateFamilyId('modern-office-chair');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('modern-office-chair');
    }
  });
  
  test('rechaza IDs muy cortos', () => {
    const result = validateFamilyId('ab'); // Solo 2 caracteres
    expect(result.success).toBe(false);
  });
  
  test('rechaza caracteres especiales', () => {
    const result = validateFamilyId('chair@123');
    expect(result.success).toBe(false);
  });
  
  test('previene path traversal', () => {
    const result = validateFamilyId('../../etc/passwd');
    expect(result.success).toBe(false);
  });
  
  test('hace trim de espacios', () => {
    const result = validateFamilyId('  modern-chair  ');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('modern-chair');
    }
  });
// Nueva suite 1
describe('validateCategory', () => {
  
  test('acepta categorías válidas', () => {
    const result = validateCategory('furniture');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('furniture');
    }
  });
  
  test('rechaza categorías inválidas', () => {
    const result = validateCategory('invalid-category');
    expect(result.success).toBe(false);
  });
  
  test('rechaza tipos incorrectos', () => {
    const result1 = validateCategory(123);
    expect(result1.success).toBe(false);
    
    const result2 = validateCategory(null);
    expect(result2.success).toBe(false);
    
    const result3 = validateCategory(undefined);
    expect(result3.success).toBe(false);
  });
});

// Nueva suite 2
describe('validateSearch', () => {
  
  test('acepta queries válidas', () => {
    const result = validateSearch('modern chair');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('modern chair');
    }
  });
  
  test('rechaza queries muy cortas', () => {
    const result = validateSearch('a'); // Solo 1 caracter
    expect(result.success).toBe(false);
  });
  
  test('hace trim de espacios', () => {
    const result = validateSearch('  modern  ');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('modern');
    }
  });
});
