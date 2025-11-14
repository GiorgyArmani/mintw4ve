-- MINTWAVE Database Schema
-- Create tables for tracks, marketplace items, plays, and orders

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_address TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  description TEXT,
  genre TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  duration INTEGER, -- duration in seconds
  nft_token_id BIGINT,
  play_count INTEGER DEFAULT 0,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace items table (beats, cover art, video editing, etc.)
CREATE TABLE IF NOT EXISTS marketplace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_address TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'beat', 'cover-art', 'video-edit', 'mixing', 'mastering'
  price INTEGER NOT NULL, -- price in MINT tokens
  preview_url TEXT,
  image_url TEXT,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track plays table (for analytics)
CREATE TABLE IF NOT EXISTS track_plays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  listener_address TEXT,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tokens_earned INTEGER DEFAULT 10 -- 10 MINT per play
);

-- Orders table (marketplace purchases)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_address TEXT NOT NULL,
  seller_address TEXT NOT NULL,
  item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
  item_title TEXT NOT NULL,
  price INTEGER NOT NULL, -- price in MINT tokens at time of purchase
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  address TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  social_twitter TEXT,
  social_instagram TEXT,
  social_spotify TEXT,
  total_plays INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist_address);
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);
CREATE INDEX IF NOT EXISTS idx_tracks_uploaded_at ON tracks(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_seller ON marketplace_items(seller_address);
CREATE INDEX IF NOT EXISTS idx_track_plays_track_id ON track_plays(track_id);
CREATE INDEX IF NOT EXISTS idx_track_plays_listener ON track_plays(listener_address);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_address);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_address);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_items_updated_at
  BEFORE UPDATE ON marketplace_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
