/**
 * User Favorites Database Functions
 * Handles all database operations for user favorites
 * @version 1.1.0
 */

import { sql } from '@/lib/neon';

export async function getUserFavorites(userId: string): Promise<string[]> {
  try {
    const result = await sql`
      SELECT family_id 
      FROM user_favorites 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    
    return result.map(row => row.family_id);
  } catch (error) {
    console.error('Error getting user favorites:', error);
    return [];
  }
}

export async function addFavorite(userId: string, familyId: string): Promise<boolean> {
  try {
    await sql`
      INSERT INTO user_favorites (user_id, family_id)
      VALUES (${userId}, ${familyId})
      ON CONFLICT ON CONSTRAINT unique_user_family DO NOTHING
    `;
    
    return true;
  } catch (error) {
    console.error('Error adding favorite:', error);
    console.error('User ID:', userId);
    console.error('Family ID:', familyId);
    return false;
  }
}

export async function removeFavorite(userId: string, familyId: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM user_favorites
      WHERE user_id = ${userId} AND family_id = ${familyId}
    `;
    
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    console.error('User ID:', userId);
    console.error('Family ID:', familyId);
    return false;
  }
}

export async function isFavorite(userId: string, familyId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT 1 FROM user_favorites
      WHERE user_id = ${userId} AND family_id = ${familyId}
      LIMIT 1
    `;
    
    return result.length > 0;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

export async function getFavoritesCount(userId: string): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*)::int as count
      FROM user_favorites
      WHERE user_id = ${userId}
    `;
    
    return result[0]?.count || 0;
  } catch (error) {
    console.error('Error getting favorites count:', error);
    return 0;
  }
}

export async function migrateFavorites(userId: string, familyIds: string[]): Promise<number> {
  try {
    let migratedCount = 0;
    
    for (const familyId of familyIds) {
      try {
        const success = await addFavorite(userId, familyId);
        if (success) {
          migratedCount++;
        }
      } catch (error) {
        console.error('Error migrating favorite:', familyId, error);
      }
    }
    
    return migratedCount;
  } catch (error) {
    console.error('Error migrating favorites:', error);
    return 0;
  }
}

export async function clearUserFavorites(userId: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM user_favorites
      WHERE user_id = ${userId}
    `;
    
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }
}