import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

function validateEnv() {
  try {
    const env = envSchema.parse({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
      NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      NODE_ENV: process.env.NODE_ENV,
    });
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Error de configuracion: Variables invalidas');
      error.issues.forEach((err: any) => {
        console.error(`- ${err.path.join('.')}: ${err.message}`);
      });
    }
    return {
      NEXT_PUBLIC_API_URL: 'http://localhost:3000',
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
      NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: '',
      NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: '',
      NODE_ENV: 'development' as const,
    };
  }
}

const env = validateEnv();

export const config = {
  apiUrl: env.NEXT_PUBLIC_API_URL,
  siteUrl: env.NEXT_PUBLIC_SITE_URL,
  siteName: 'Boracity',
  imageKit: {
    urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
    publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  },
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  environment: env.NODE_ENV,
} as const;

export type Config = typeof config;