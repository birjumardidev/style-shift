/*
# Create prompts table and prompt-images storage bucket

1. New Tables
- `prompts`
  - `id` (uuid, primary key, defaults to gen_random_uuid())
  - `title` (text, not null) — short display name of the prompt
  - `prompt_text` (text, not null) — the full AI image-editing prompt body
  - `category` (text, not null) — one of: Y2K Flash, Cinematic, Vinyl Toy, Golden Hour, A24 Poster
  - `image_url` (text) — public URL of the uploaded preview image in Supabase Storage
  - `created_at` (timestamptz, defaults to now())
2. New Storage
- Public bucket `prompt-images` for storing prompt preview images (public read, authenticated upload).
3. Security
- Enable RLS on `prompts`.
- This is a single-tenant public gallery (no sign-in screen), so CRUD is allowed for both `anon` and `authenticated` roles. The admin panel uses the anon-key client to insert rows and upload images.
- Four separate policies (select/insert/update/delete), each `TO anon, authenticated`, with `USING (true)` / `WITH CHECK (true)` because the data is intentionally public/shared.
- Storage policies: public read on the `prompt-images` bucket; authenticated + anon can upload/update/delete their own objects (single-tenant, so open).
4. Important Notes
- Idempotent: uses `IF NOT EXISTS` and `DROP POLICY IF EXISTS` so re-running is safe.
- No user_id / auth.users foreign key — this app has no sign-in flow.
- Category is stored as plain text (not an enum) to keep the admin dropdown flexible; valid values are enforced by the app.
*/

CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  prompt_text text NOT NULL,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_prompts" ON prompts;
CREATE POLICY "anon_select_prompts" ON prompts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_prompts" ON prompts;
CREATE POLICY "anon_insert_prompts" ON prompts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_prompts" ON prompts;
CREATE POLICY "anon_update_prompts" ON prompts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_prompts" ON prompts;
CREATE POLICY "anon_delete_prompts" ON prompts FOR DELETE
  TO anon, authenticated USING (true);

-- Storage bucket for prompt preview images (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('prompt-images', 'prompt-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: open CRUD for anon + authenticated (single-tenant public gallery)
DROP POLICY IF EXISTS "anon_read_prompt_images" ON storage.objects;
CREATE POLICY "anon_read_prompt_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'prompt-images');

DROP POLICY IF EXISTS "anon_insert_prompt_images" ON storage.objects;
CREATE POLICY "anon_insert_prompt_images" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'prompt-images');

DROP POLICY IF EXISTS "anon_update_prompt_images" ON storage.objects;
CREATE POLICY "anon_update_prompt_images" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'prompt-images') WITH CHECK (bucket_id = 'prompt-images');

DROP POLICY IF EXISTS "anon_delete_prompt_images" ON storage.objects;
CREATE POLICY "anon_delete_prompt_images" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'prompt-images');
