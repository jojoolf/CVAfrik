-- Reçus de paiement CVAfrik : durée achetée et suivi de l’e-mail envoyé.
-- À exécuter une seule fois dans Supabase > SQL Editor.

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT,
  ADD COLUMN IF NOT EXISTS duration_id TEXT,
  ADD COLUMN IF NOT EXISTS duration_label TEXT,
  ADD COLUMN IF NOT EXISTS receipt_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS payments_receipt_pending_idx
  ON public.payments (statut, receipt_sent_at)
  WHERE statut = 'accepte' AND receipt_sent_at IS NULL;
