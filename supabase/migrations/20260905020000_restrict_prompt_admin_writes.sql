-- Only users explicitly marked as admins may mutate the public prompt gallery.
DROP POLICY IF EXISTS "authenticated_insert_prompts" ON public.prompts;
DROP POLICY IF EXISTS "authenticated_update_prompts" ON public.prompts;
DROP POLICY IF EXISTS "authenticated_delete_prompts" ON public.prompts;
DROP POLICY IF EXISTS "authenticated_insert_prompt_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_prompt_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete_prompt_images" ON storage.objects;

CREATE POLICY "admin_insert_prompts" ON public.prompts FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_update_prompts" ON public.prompts FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_delete_prompts" ON public.prompts FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_insert_prompt_images" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'prompt-images' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "admin_update_prompt_images" ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'prompt-images' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    bucket_id = 'prompt-images' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "admin_delete_prompt_images" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'prompt-images' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
