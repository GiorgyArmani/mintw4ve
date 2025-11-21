import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Server-side only

interface UploadResult {
  metadataUri: string;
  audioUrl: string;
  coverUrl?: string;
}

/**
 * Upload track assets to Supabase Storage
 * Uses two buckets:
 * - mintwave-audio: for audio files (mp3, wav)
 * - mintwave-images: for cover art (jpg, png, webp)
 */
export async function uploadTrackAssets(
  formData: FormData
): Promise<UploadResult> {
  const audio = formData.get('audio') as File | null;
  const cover = formData.get('cover') as File | null;
  const title = formData.get('title') as string;
  const artist = formData.get('artist') as string || 'unknown';

  if (!audio) {
    throw new Error('Audio file is required');
  }

  // Check if Supabase is configured
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase not configured, using mock storage');
    return mockUpload(audio, cover, title);
  }

  // Create Supabase client with service role key (server-side only)
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Upload audio file
    const audioFileName = `${Date.now()}-${sanitizeFileName(audio.name)}`;
    const audioPath = `tracks/${artist}/${audioFileName}`;

    const audioBuffer = await audio.arrayBuffer();
    const { data: audioData, error: audioError } = await supabase.storage
      .from('mintwave-audio')
      .upload(audioPath, audioBuffer, {
        contentType: audio.type,
        upsert: false,
      });

    if (audioError) {
      console.error('Audio upload error:', audioError);
      throw new Error(`Failed to upload audio: ${audioError.message}`);
    }

    // Get public URL for audio
    const { data: audioUrlData } = supabase.storage
      .from('mintwave-audio')
      .getPublicUrl(audioPath);

    let coverUrl: string | undefined;

    // Upload cover image if provided
    if (cover) {
      const coverFileName = `${Date.now()}-${sanitizeFileName(cover.name)}`;
      const coverPath = `covers/${artist}/${coverFileName}`;

      const coverBuffer = await cover.arrayBuffer();
      const { data: coverData, error: coverError } = await supabase.storage
        .from('mintwave-images')
        .upload(coverPath, coverBuffer, {
          contentType: cover.type,
          upsert: false,
        });

      if (coverError) {
        console.warn('Cover upload error:', coverError);
        // Don't fail if cover upload fails, just log it
      } else {
        const { data: coverUrlData } = supabase.storage
          .from('mintwave-images')
          .getPublicUrl(coverPath);

        coverUrl = coverUrlData.publicUrl;
      }
    }

    // Create metadata URI (in production, this would be IPFS)
    const metadataUri = `supabase://mintwave/${audioData.path}`;

    return {
      metadataUri,
      audioUrl: audioUrlData.publicUrl,
      coverUrl,
    };
  } catch (error) {
    console.error('Storage upload error:', error);
    throw error;
  }
}

/**
 * Delete track assets from Supabase Storage
 */
export async function deleteTrackAssets(
  audioPath: string,
  coverPath?: string
): Promise<void> {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase not configured, skipping delete');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Delete audio
    const { error: audioError } = await supabase.storage
      .from('mintwave-audio')
      .remove([audioPath]);

    if (audioError) {
      console.error('Failed to delete audio:', audioError);
    }

    // Delete cover if exists
    if (coverPath) {
      const { error: coverError } = await supabase.storage
        .from('mintwave-images')
        .remove([coverPath]);

      if (coverError) {
        console.error('Failed to delete cover:', coverError);
      }
    }
  } catch (error) {
    console.error('Delete error:', error);
  }
}

/**
 * Get signed URL for private audio streaming
 * (optional, if you want to make audio private)
 */
export async function getSignedAudioUrl(
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase not configured');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase.storage
    .from('mintwave-audio')
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Mock upload for development without Supabase
 */
function mockUpload(
  audio: File,
  cover: File | null,
  title: string
): UploadResult {
  const mockHash = Math.random().toString(36).substring(7);

  return {
    metadataUri: `ipfs://Qm${mockHash}/metadata.json`,
    audioUrl: `/mock/audio/${audio.name}`,
    coverUrl: cover ? `/mock/covers/${cover.name}` : undefined,
  };
}

/**
 * Sanitize filename for safe storage
 */
function sanitizeFileName(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get bucket size and file count for analytics
 */
export async function getBucketStats(): Promise<{
  audioFiles: number;
  imageFiles: number;
  totalSize: number;
}> {
  if (!supabaseUrl || !supabaseServiceKey) {
    return { audioFiles: 0, imageFiles: 0, totalSize: 0 };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data: audioFiles } = await supabase.storage
      .from('mintwave-audio')
      .list();

    const { data: imageFiles } = await supabase.storage
      .from('mintwave-images')
      .list();

    const audioCount = audioFiles?.length || 0;
    const imageCount = imageFiles?.length || 0;

    // Calculate total size (would need to iterate through files)
    // For now, return 0
    const totalSize = 0;

    return {
      audioFiles: audioCount,
      imageFiles: imageCount,
      totalSize,
    };
  } catch (error) {
    console.error('Failed to get bucket stats:', error);
    return { audioFiles: 0, imageFiles: 0, totalSize: 0 };
  }
}