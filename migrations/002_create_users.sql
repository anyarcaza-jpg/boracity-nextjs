-- ================================================
-- MIGRATION 002: Create Users Table
-- Purpose: Authentication and user management
-- Date: January 12, 2026
-- ================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for fast email lookups (login)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index for role filtering
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Add comment to table
COMMENT ON TABLE users IS 'User accounts for authentication and authorization';