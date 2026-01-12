// src/lib/neon.ts

import { neon } from '@neondatabase/serverless';

/**
 * Conexión HTTP a Neon PostgreSQL
 * 
 * ¿Por qué HTTP y no conexión tradicional?
 * - Vercel tiene límites de conexiones persistentes
 * - HTTP es stateless (no mantiene conexiones abiertas)
 * - Perfecto para serverless (cada request = nueva conexión)
 * - Neon maneja el pooling automáticamente
 */

if (!process.env.DATABASE_URL) {
  throw new Error(
    '❌ DATABASE_URL no está configurada en .env.local\n' +
    'Asegúrate de tener el archivo .env.local con la variable DATABASE_URL'
  );
}

// Crear cliente SQL con HTTP connection
export const sql = neon(process.env.DATABASE_URL);

/**
 * ¿Cómo usar este archivo?
 * 
 * import { sql } from '@/lib/neon';
 * 
 * const families = await sql`SELECT * FROM families`;
 * const result = await sql`INSERT INTO families (name) VALUES (${'Chair'})`;
 */