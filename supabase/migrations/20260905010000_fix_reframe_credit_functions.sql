-- Keep the renamed Reframe credit functions aligned with the transaction constraint.
CREATE OR REPLACE FUNCTION public.reserve_reframe_credit(target_user_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE current_balance integer;
BEGIN
  PERFORM public.ensure_user_credits(target_user_id);
  UPDATE public.user_credits SET balance = balance - 1, updated_at = now()
  WHERE user_id = target_user_id AND balance > 0
  RETURNING balance INTO current_balance;
  IF current_balance IS NULL THEN RAISE EXCEPTION 'NO_CREDITS'; END IF;
  INSERT INTO public.credit_transactions (user_id, amount, kind)
  VALUES (target_user_id, -1, 'reframe_use');
  RETURN current_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.refund_reframe_credit(target_user_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE current_balance integer;
BEGIN
  UPDATE public.user_credits SET balance = balance + 1, updated_at = now()
  WHERE user_id = target_user_id
  RETURNING balance INTO current_balance;
  IF current_balance IS NULL THEN RAISE EXCEPTION 'CREDITS_NOT_FOUND'; END IF;
  INSERT INTO public.credit_transactions (user_id, amount, kind)
  VALUES (target_user_id, 1, 'refund');
  RETURN current_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_reframe_credit(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.refund_reframe_credit(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reserve_reframe_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_reframe_credit(uuid) TO service_role;
