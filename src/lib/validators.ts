// src/lib/validators.ts

/**
 * TYPE GUARDS - Validación segura de tipos en runtime
 * Estas funciones validan datos Y le dicen a TypeScript el tipo correcto
 */

import type { FamilyCategory } from '@/types';
import { CATEGORY_LIST } from '@/data/models/family.model';

/**
 * Valida si un string es una categoría válida
 * @param value - Valor a validar (típicamente viene de URL params)
 * @returns true si es una categoría válida
 */
export function isValidCategory(value: string): value is FamilyCategory {
  return CATEGORY_LIST.includes(value as FamilyCategory);
}