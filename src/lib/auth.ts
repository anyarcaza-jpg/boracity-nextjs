// Configuración de NextAuth v5
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './db/users';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validar que existan credenciales
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Buscar usuario en base de datos
        const user = await getUserByEmail(email);
        
        if (!user) {
          console.log('Usuario no encontrado:', email);
          return null;
        }

        // Verificar password con bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          console.log('Password incorrecto para:', email);
          return null;
        }

        // Login exitoso - retornar datos del usuario
        return {
          id: user.id,
          email: user.email,
          name: user.name || 'Usuario',
          role: user.role,
        };
      },
    }),
  ],
  
  callbacks: {
    // Agregar role a la sesión JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    // Agregar role a la sesión
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  
  pages: {
    signIn: '/login', // Redirigir a nuestra página custom
  },
  
  session: {
    strategy: 'jwt', // Usar JWT en lugar de database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  
  secret: process.env.AUTH_SECRET,
});