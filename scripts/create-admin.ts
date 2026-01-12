// Script para crear el primer usuario administrador
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Cargar variables de entorno
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function createAdmin() {
  try {
    // Obtener credenciales del .env.local
    const email = process.env.ADMIN_EMAIL || 'admin@boracity.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin123!Change';
    
    console.log('🔐 Creando usuario administrador...');
    console.log('📧 Email:', email);
    
    // Encriptar password con bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password encriptado exitosamente');
    
    // Insertar usuario admin en la base de datos
    await sql`
      INSERT INTO users (email, password, name, role)
      VALUES (${email}, ${hashedPassword}, 'Administrador', 'admin')
      ON CONFLICT (email) 
      DO UPDATE SET password = EXCLUDED.password
    `;
    
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('\n📝 Credenciales para login:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('\n⚠️  IMPORTANTE: Cambia el password después del primer login');
    
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    process.exit(1);
  }
}

// Ejecutar
createAdmin();