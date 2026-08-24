-- Keep the gallery public, but require authentication for all content changes.

DROP POLICY IF EXISTS "anon_insert_prompts" ON prompts;
CREATE POLICY "authenticated_insert_prompts" ON prompts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_prompts" ON prompts;
CREATE POLICY "authenticated_update_prompts" ON prompts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_prompts" ON prompts;
CREATE POLICY "authenticated_delete_prompts" ON prompts FOR DELETE
  TO authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_prompt_images" ON storage.objects;
CREATE POLICY "authenticated_insert_prompt_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'prompt-images');

DROP POLICY IF EXISTS "anon_update_prompt_images" ON storage.objects;
CREATE POLICY "authenticated_update_prompt_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'prompt-images')
  WITH CHECK (bucket_id = 'prompt-images');

DROP POLICY IF EXISTS "anon_delete_prompt_images" ON storage.objects;
CREATE POLICY "authenticated_delete_prompt_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'prompt-images');