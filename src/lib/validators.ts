// src/lib/validators.ts
import { z } from 'zod';
import type { FamilyCategory } from '@/types';
import { CATEGORY_LIST } from '@/data/models/family.model';

/* ============================================
   TYPE GUARDS
   ============================================ */

export function isValidCategory(value: string): value is FamilyCategory {
  return CATEGORY_LIST.includes(value as FamilyCategory);
}

/* ============================================
   SCHEMAS
   ============================================ */

export const FamilyIdSchema = z
  .string()
  .min(3)
  .max(100)
  .regex(/^[a-z0-9-]+$/)
  .trim();

export const FamilySlugSchema = FamilyIdSchema;

export const FamilyCategorySchema = z.enum([
  'furniture',
  'doors', 
  'windows',
  'lighting'
]);

export const SearchQuerySchema = z
  .string()
  .min(2)
  .max(100)
  .trim();

/* ============================================
   VALIDATORS (retornan formato simple)
   ============================================ */

export function validateFamilyId(id: unknown): { success: true; data: string } | { success: false; error: string } {
  const result = FamilyIdSchema.safeParse(id);
  if (result.success) {
    return { success: true, data: result.data };
  }
  // ✅ CORREGIDO: issues en vez de errors
  return { success: false, error: result.error.issues[0]?.message || 'Invalid ID' };
}

export function validateCategory(cat: unknown): { success: true; data: FamilyCategory } | { success: false; error: string } {
  const result = FamilyCategorySchema.safeParse(cat);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: 'Invalid category' };
}

export function validateSearch(q: unknown): { success: true; data: string } | { success: false; error: string } {
  const result = SearchQuerySchema.safeParse(q);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: 'Invalid search query' };
}

/* ============================================
   TYPES
   ============================================ */

export type FamilyId = z.infer<typeof FamilyIdSchema>;
export type ValidatedCategory = z.infer<typeof FamilyCategorySchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;