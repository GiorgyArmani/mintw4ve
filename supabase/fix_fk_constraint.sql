-- Remove Foreign Key Constraint on profiles.id
-- This is necessary because we are using Wallet Auth, so profiles won't always match auth.users

ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey;
