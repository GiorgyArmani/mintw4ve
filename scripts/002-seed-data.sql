-- Seed data for MINTWAVE
-- Add sample tracks and marketplace items

-- Insert sample tracks
INSERT INTO tracks (title, artist_address, artist_name, description, genre, audio_url, cover_url, duration, play_count) VALUES
('Midnight Dreams', '0x1234567890123456789012345678901234567890', 'Neon Pulse', 'A hypnotic journey through late-night vibes and dreamy soundscapes', 'Electronic', '/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400', 245, 1247),
('Urban Flow', '0x2345678901234567890123456789012345678901', 'MC Rhythm', 'Hard-hitting bars over smooth jazz-infused beats', 'Hip Hop', '/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400', 198, 892),
('Summer Waves', '0x3456789012345678901234567890123456789012', 'Sunset Melody', 'Chill tropical house with ocean sounds and warm synths', 'House', '/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400', 302, 2156),
('Bass Rebellion', '0x4567890123456789012345678901234567890123', 'SubFreq', 'Heavy dubstep drops with industrial undertones', 'Dubstep', '/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400', 267, 743),
('Cosmic Love', '0x5678901234567890123456789012345678901234', 'Luna Star', 'Ethereal vocals layered over ambient pads and gentle piano', 'Ambient', '/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400', 412, 1523);

-- Insert sample marketplace items
INSERT INTO marketplace_items (seller_address, seller_name, title, description, category, price, preview_url, image_url, rating, reviews_count, sales_count) VALUES
('0x6789012345678901234567890123456789012345', 'BeatMaker Pro', 'Dark Trap Beat Pack', '5 hard-hitting trap beats with 808s and dark melodies', 'beat', 500, '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=400&width=400', 4.8, 24, 67),
('0x7890123456789012345678901234567890123456', 'Visual Dreams', 'Album Cover Design', 'Professional album artwork with your concept', 'cover-art', 300, '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=400&width=400', 4.9, 42, 128),
('0x8901234567890123456789012345678901234567', 'Edit Master', 'Music Video Production', 'Full music video editing with effects and color grading', 'video-edit', 1200, '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=400&width=400', 5.0, 18, 35),
('0x9012345678901234567890123456789012345678', 'Sound Engineer', 'Professional Mixing', 'Radio-ready mix with clarity and punch', 'mixing', 800, '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=400&width=400', 4.7, 31, 89),
('0x0123456789012345678901234567890123456789', 'Master Audio', 'Mastering Service', 'Final polish to make your track compete with industry standards', 'mastering', 600, '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=400&width=400', 4.9, 28, 76),
('0x1234567890123456789012345678901234567891', 'Lo-Fi Beats', 'Chill Study Beats', 'Relaxing lo-fi beats perfect for studying or working', 'beat', 250, '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=400&width=400', 4.6, 15, 94),
('0x2345678901234567890123456789012345678902', 'Design Studio', 'Social Media Kit', 'Complete social media graphics package for artists', 'cover-art', 400, '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=400&width=400', 4.8, 22, 56),
('0x3456789012345678901234567890123456789013', 'Synth Wave', 'Retro Synth Pack', '10 nostalgic 80s-inspired synthwave instrumentals', 'beat', 750, '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=400&width=400', 4.9, 19, 43);

-- Insert sample user profiles
INSERT INTO user_profiles (address, username, bio, avatar_url, total_plays, total_earnings) VALUES
('0x1234567890123456789012345678901234567890', 'neonpulse', 'Electronic music producer | Creating sounds for the future', '/placeholder.svg?height=200&width=200', 1247, 12470),
('0x2345678901234567890123456789012345678901', 'mcrhythm', 'Hip hop artist | Telling stories through beats and rhymes', '/placeholder.svg?height=200&width=200', 892, 8920),
('0x3456789012345678901234567890123456789012', 'sunsetmelody', 'House music DJ | Bringing summer vibes all year round', '/placeholder.svg?height=200&width=200', 2156, 21560);

-- Insert sample plays (for analytics)
INSERT INTO track_plays (track_id, listener_address, played_at, tokens_earned)
SELECT 
  (SELECT id FROM tracks WHERE title = 'Midnight Dreams'),
  '0x' || substr(md5(random()::text), 1, 40),
  NOW() - (random() * interval '30 days'),
  10
FROM generate_series(1, 50);

INSERT INTO track_plays (track_id, listener_address, played_at, tokens_earned)
SELECT 
  (SELECT id FROM tracks WHERE title = 'Summer Waves'),
  '0x' || substr(md5(random()::text), 1, 40),
  NOW() - (random() * interval '30 days'),
  10
FROM generate_series(1, 80);
