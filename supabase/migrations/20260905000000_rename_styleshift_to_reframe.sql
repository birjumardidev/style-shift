-- Rename the Reframe credit operation without rewriting deployed migration history.
ALTER TABLE public.credit_transactions
  DROP CONSTRAINT IF EXISTS credit_transactions_kind_check;

UPDATE public.credit_transactions
SET kind = 'reframe_use'
WHERE kind = 'styleshift_use';

ALTER TABLE public.credit_transactions
  ADD CONSTRAINT credit_transactions_kind_check
  CHECK (kind IN ('welcome', 'purchase', 'reframe_use', 'refund'));

ALTER FUNCTION public.reserve_styleshift_credit(uuid)
  RENAME TO reserve_reframe_credit;

ALTER FUNCTION public.refund_styleshift_credit(uuid)
  RENAME TO refund_reframe_credit;

REVOKE ALL ON FUNCTION public.reserve_reframe_credit(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.refund_reframe_credit(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reserve_reframe_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_reframe_credit(uuid) TO service_role;