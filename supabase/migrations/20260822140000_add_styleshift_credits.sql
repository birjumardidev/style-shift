-- StyleShift credits and payment ledger.
CREATE TABLE IF NOT EXISTS public.user_credits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance integer NOT NULL DEFAULT 5 CHECK (balance >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  kind text NOT NULL CHECK (kind IN ('welcome', 'purchase', 'styleshift_use', 'refund')),
  razorpay_order_id text UNIQUE,
  razorpay_payment_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.credit_orders (
  order_id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits integer NOT NULL CHECK (credits IN (3, 11, 25, 45, 75)),
  amount integer NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_read_own_credits" ON public.user_credits;
CREATE POLICY "users_read_own_credits" ON public.user_credits FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_read_own_credit_transactions" ON public.credit_transactions;
CREATE POLICY "users_read_own_credit_transactions" ON public.credit_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_read_own_credit_orders" ON public.credit_orders;
CREATE POLICY "users_read_own_credit_orders" ON public.credit_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.ensure_user_credits(target_user_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE current_balance integer;
BEGIN
  INSERT INTO public.user_credits (user_id, balance)
  VALUES (target_user_id, 5)
  ON CONFLICT (user_id) DO NOTHING;
  SELECT balance INTO current_balance FROM public.user_credits WHERE user_id = target_user_id;
  RETURN current_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.reserve_styleshift_credit(target_user_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE current_balance integer;
BEGIN
  PERFORM public.ensure_user_credits(target_user_id);
  UPDATE public.user_credits SET balance = balance - 1, updated_at = now()
  WHERE user_id = target_user_id AND balance > 0
  RETURNING balance INTO current_balance;
  IF current_balance IS NULL THEN RAISE EXCEPTION 'NO_CREDITS'; END IF;
  INSERT INTO public.credit_transactions (user_id, amount, kind) VALUES (target_user_id, -1, 'styleshift_use');
  RETURN current_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.refund_styleshift_credit(target_user_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE current_balance integer;
BEGIN
  UPDATE public.user_credits SET balance = balance + 1, updated_at = now()
  WHERE user_id = target_user_id RETURNING balance INTO current_balance;
  IF current_balance IS NULL THEN RAISE EXCEPTION 'CREDITS_NOT_FOUND'; END IF;
  INSERT INTO public.credit_transactions (user_id, amount, kind) VALUES (target_user_id, 1, 'refund');
  RETURN current_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.apply_credit_purchase(target_user_id uuid, credit_amount integer, order_id text, payment_id text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE current_balance integer;
DECLARE inserted_transaction uuid;
BEGIN
  IF credit_amount <= 0 OR credit_amount > 75 THEN RAISE EXCEPTION 'INVALID_CREDITS'; END IF;
  INSERT INTO public.user_credits (user_id, balance) VALUES (target_user_id, 5) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.credit_transactions (user_id, amount, kind, razorpay_order_id, razorpay_payment_id)
  VALUES (target_user_id, credit_amount, 'purchase', order_id, payment_id)
  ON CONFLICT (razorpay_order_id) DO NOTHING
  RETURNING id INTO inserted_transaction;
  IF inserted_transaction IS NULL THEN
    SELECT balance INTO current_balance FROM public.user_credits WHERE user_id = target_user_id;
    RETURN current_balance;
  END IF;
  UPDATE public.user_credits SET balance = balance + credit_amount, updated_at = now()
  WHERE user_id = target_user_id RETURNING balance INTO current_balance;
  RETURN current_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_user_credits(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reserve_styleshift_credit(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.refund_styleshift_credit(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.apply_credit_purchase(uuid, integer, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_user_credits(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.reserve_styleshift_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_styleshift_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.apply_credit_purchase(uuid, integer, text, text) TO service_role;
