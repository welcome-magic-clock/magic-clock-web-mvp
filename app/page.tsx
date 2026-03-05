-- ============================================================
-- MAGIC CLOCK — Migration complète
-- Supabase SQL Editor → New Query → Exécuter
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. Ajouter user_id à magic_clocks
-- ─────────────────────────────────────────────────────────────
ALTER TABLE magic_clocks
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

UPDATE magic_clocks mc
SET user_id = p.id
FROM profiles p
WHERE mc.creator_handle = p.handle
  AND mc.user_id IS NULL;

-- ─────────────────────────────────────────────────────────────
-- 2. Moderniser magic_clock_accesses (user_handle → user_id)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE magic_clock_accesses
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

UPDATE magic_clock_accesses mca
SET user_id = p.id
FROM profiles p
WHERE mca.user_handle = p.handle
  AND mca.user_id IS NULL;

-- Nouvelle contrainte d'unicité sur user_id
ALTER TABLE magic_clock_accesses
DROP CONSTRAINT IF EXISTS magic_clock_accesses_user_handle_magic_clock_id_access_type_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'magic_clock_accesses_user_id_clock_id_type_key'
  ) THEN
    ALTER TABLE magic_clock_accesses
    ADD CONSTRAINT magic_clock_accesses_user_id_clock_id_type_key
    UNIQUE (user_id, magic_clock_id, access_type);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 3. Table payment_logs (logs financiers Stripe)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_logs (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent_id  text UNIQUE,
  magic_clock_id            uuid REFERENCES magic_clocks(id) ON DELETE SET NULL,
  buyer_id                  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  creator_handle            text,
  access_type               text NOT NULL DEFAULT 'PPV',  -- 'PPV' | 'SUB'
  amount_total              integer,     -- en centimes
  amount_creator            integer,
  amount_platform           integer,
  currency                  text DEFAULT 'chf',
  price_tier                text,
  vat_rate                  numeric(5,4),
  buyer_country_code        text,
  status                    text NOT NULL DEFAULT 'succeeded',
  paid_at                   timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 4. Index de performance (1 million d'utilisateurs)
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_magic_clocks_user_id
  ON magic_clocks(user_id);

CREATE INDEX IF NOT EXISTS idx_magic_clocks_published_date
  ON magic_clocks(is_published, created_at DESC)
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_magic_clocks_slug
  ON magic_clocks(slug);

CREATE INDEX IF NOT EXISTS idx_accesses_user_id
  ON magic_clock_accesses(user_id);

CREATE INDEX IF NOT EXISTS idx_accesses_user_clock
  ON magic_clock_accesses(user_id, magic_clock_id);

CREATE INDEX IF NOT EXISTS idx_profiles_handle
  ON profiles(handle);

CREATE INDEX IF NOT EXISTS idx_payment_logs_buyer
  ON payment_logs(buyer_id);

CREATE INDEX IF NOT EXISTS idx_payment_logs_clock
  ON payment_logs(magic_clock_id);

-- ─────────────────────────────────────────────────────────────
-- 5. RLS — chaque user voit uniquement SES données
-- ─────────────────────────────────────────────────────────────

-- magic_clock_accesses
ALTER TABLE magic_clock_accesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user can read own accesses" ON magic_clock_accesses;
CREATE POLICY "user can read own accesses"
  ON magic_clock_accesses FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user can insert own access" ON magic_clock_accesses;
CREATE POLICY "user can insert own access"
  ON magic_clock_accesses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "service role full access on accesses" ON magic_clock_accesses;
CREATE POLICY "service role full access on accesses"
  ON magic_clock_accesses FOR ALL
  USING (auth.role() = 'service_role');

-- payment_logs (lecture seule pour le buyer)
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "buyer can read own logs" ON payment_logs;
CREATE POLICY "buyer can read own logs"
  ON payment_logs FOR SELECT
  USING (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "service role full access on logs" ON payment_logs;
CREATE POLICY "service role full access on logs"
  ON payment_logs FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────────────
-- VÉRIFICATION FINALE
-- ─────────────────────────────────────────────────────────────
SELECT
  'magic_clocks' AS table_name,
  COUNT(*) AS total,
  COUNT(user_id) AS with_user_id,
  COUNT(*) - COUNT(user_id) AS missing_user_id
FROM magic_clocks
UNION ALL
SELECT
  'magic_clock_accesses',
  COUNT(*),
  COUNT(user_id),
  COUNT(*) - COUNT(user_id)
FROM magic_clock_accesses
UNION ALL
SELECT
  'payment_logs',
  COUNT(*),
  COUNT(buyer_id),
  0
FROM payment_logs;
