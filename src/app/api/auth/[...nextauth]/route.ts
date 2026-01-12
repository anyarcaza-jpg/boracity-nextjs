// API Route para NextAuth
import { handlers } from '@/lib/auth';

// Exportar handlers directamente
export const GET = handlers.GET;
export const POST = handlers.POST;