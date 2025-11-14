-- Row Level Security (RLS) Policies for MINTWAVE
-- Enable RLS and create policies for secure data access

-- Enable Row Level Security
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Tracks policies
-- Anyone can read tracks
CREATE POLICY "Tracks are viewable by everyone"
  ON tracks FOR SELECT
  USING (true);

-- Only track owner can update their tracks
CREATE POLICY "Users can update their own tracks"
  ON tracks FOR UPDATE
  USING (artist_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Only track owner can delete their tracks
CREATE POLICY "Users can delete their own tracks"
  ON tracks FOR DELETE
  USING (artist_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Authenticated users can insert tracks
CREATE POLICY "Authenticated users can upload tracks"
  ON tracks FOR INSERT
  WITH CHECK (true);

-- Marketplace items policies
-- Anyone can view marketplace items
CREATE POLICY "Marketplace items are viewable by everyone"
  ON marketplace_items FOR SELECT
  USING (true);

-- Only seller can update their items
CREATE POLICY "Sellers can update their own items"
  ON marketplace_items FOR UPDATE
  USING (seller_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Only seller can delete their items
CREATE POLICY "Sellers can delete their own items"
  ON marketplace_items FOR DELETE
  USING (seller_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Authenticated users can create marketplace items
CREATE POLICY "Authenticated users can create marketplace items"
  ON marketplace_items FOR INSERT
  WITH CHECK (true);

-- Track plays policies
-- Anyone can view aggregated plays (for analytics)
CREATE POLICY "Track plays are viewable by everyone"
  ON track_plays FOR SELECT
  USING (true);

-- Anyone can record a play
CREATE POLICY "Anyone can record track plays"
  ON track_plays FOR INSERT
  WITH CHECK (true);

-- Orders policies
-- Users can view orders they're involved in (buyer or seller)
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (
    buyer_address = current_setting('request.jwt.claims', true)::json->>'sub'
    OR seller_address = current_setting('request.jwt.claims', true)::json->>'sub'
  );

-- Authenticated users can create orders
CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Users can update their own orders
CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (
    buyer_address = current_setting('request.jwt.claims', true)::json->>'sub'
    OR seller_address = current_setting('request.jwt.claims', true)::json->>'sub'
  );

-- User profiles policies
-- Anyone can view user profiles
CREATE POLICY "User profiles are viewable by everyone"
  ON user_profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can insert their own profile
CREATE POLICY "Users can create their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (address = current_setting('request.jwt.claims', true)::json->>'sub');
