-- MINTWAVE Social Features Migration
-- This script adds social networking features to the platform

-- ============================================================================
-- PROFILES TABLE
-- Stores user profiles for both artists and listeners
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  is_artist BOOLEAN DEFAULT false,
  genres TEXT[],
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_is_artist ON profiles(is_artist);

-- ============================================================================
-- FOLLOWS TABLE
-- Tracks who follows whom (artists and listeners can follow each other)
-- ============================================================================
CREATE TABLE IF NOT EXISTS follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Indexes for efficient follow queries
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- ============================================================================
-- LIKES TABLE
-- Tracks which users liked which tracks
-- ============================================================================
CREATE TABLE IF NOT EXISTS likes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, track_id)
);

-- Indexes for efficient like queries
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_track ON likes(track_id);

-- ============================================================================
-- COMMENTS TABLE
-- Stores comments on tracks
-- ============================================================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient comment queries
CREATE INDEX IF NOT EXISTS idx_comments_track ON comments(track_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- ============================================================================
-- TIPS TABLE
-- Tracks $WAVE tips from listeners to artists
-- ============================================================================
CREATE TABLE IF NOT EXISTS tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_artist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE SET NULL,
  amount DECIMAL(18, 2) NOT NULL CHECK (amount > 0),
  transaction_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for tip queries
CREATE INDEX IF NOT EXISTS idx_tips_from_user ON tips(from_user_id);
CREATE INDEX IF NOT EXISTS idx_tips_to_artist ON tips(to_artist_id);
CREATE INDEX IF NOT EXISTS idx_tips_track ON tips(track_id);

-- ============================================================================
-- UPDATE TRACKS TABLE
-- Add social engagement counters
-- ============================================================================
ALTER TABLE tracks 
  ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tip_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_tips DECIMAL(18, 2) DEFAULT 0;

-- ============================================================================
-- FUNCTIONS FOR UPDATING COUNTS
-- Automatically update denormalized counts when social actions occur
-- ============================================================================

-- Function to update like count
CREATE OR REPLACE FUNCTION update_track_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tracks SET like_count = like_count + 1 WHERE id = NEW.track_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tracks SET like_count = like_count - 1 WHERE id = OLD.track_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update comment count
CREATE OR REPLACE FUNCTION update_track_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tracks SET comment_count = comment_count + 1 WHERE id = NEW.track_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tracks SET comment_count = comment_count - 1 WHERE id = OLD.track_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update tip counts
CREATE OR REPLACE FUNCTION update_track_tip_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tracks 
    SET 
      tip_count = tip_count + 1,
      total_tips = total_tips + NEW.amount
    WHERE id = NEW.track_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- Automatically maintain denormalized counts
-- ============================================================================

DROP TRIGGER IF EXISTS trigger_update_like_count ON likes;
CREATE TRIGGER trigger_update_like_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_track_like_count();

DROP TRIGGER IF EXISTS trigger_update_comment_count ON comments;
CREATE TRIGGER trigger_update_comment_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_track_comment_count();

DROP TRIGGER IF EXISTS trigger_update_tip_stats ON tips;
CREATE TRIGGER trigger_update_tip_stats
  AFTER INSERT ON tips
  FOR EACH ROW EXECUTE FUNCTION update_track_tip_stats();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, users can update their own
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Follows: Public read, users can manage their own follows
CREATE POLICY "Follows are publicly readable"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Likes: Public read, users can manage their own likes
CREATE POLICY "Likes are publicly readable"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like tracks"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike tracks"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- Comments: Public read, users can manage their own comments
CREATE POLICY "Comments are publicly readable"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Tips: Users can read their own tips (sent/received), create tips
CREATE POLICY "Users can view tips they sent"
  ON tips FOR SELECT
  USING (auth.uid() = from_user_id);

CREATE POLICY "Artists can view tips they received"
  ON tips FOR SELECT
  USING (auth.uid() = to_artist_id);

CREATE POLICY "Users can send tips"
  ON tips FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);
