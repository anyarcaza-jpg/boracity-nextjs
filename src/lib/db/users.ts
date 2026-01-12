// Queries para la tabla users
import { sql } from '../neon';

export interface User {
  id: string;
  email: string;
  password: string; // Hash encriptado
  name: string | null;
  role: 'admin' | 'user';
  created_at: Date;
}

/**
 * Obtener usuario por email
 * Usado para login y validación
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const rows = await sql`
      SELECT id, email, password, name, role, created_at
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      role: row.role as 'admin' | 'user',
      created_at: new Date(row.created_at),
    };
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

/**
 * Obtener usuario por ID
 * Usado para mantener sesión
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const rows = await sql`
      SELECT id, email, password, name, role, created_at
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      role: row.role as 'admin' | 'user',
      created_at: new Date(row.created_at),
    };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}