-- Enable pgcrypto extension for gen_random_bytes() function
-- This must be run before any migrations that use gen_random_bytes()
CREATE EXTENSION IF NOT EXISTS pgcrypto;
