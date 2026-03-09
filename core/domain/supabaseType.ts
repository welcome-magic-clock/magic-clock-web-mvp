// =============================================================================
// MAGIC CLOCK — Types Supabase mis à jour
// Fichier : 03_updated_types.ts
// À intégrer dans core/domain/ ou core/supabase/
// Reflète l'état de la base APRÈS les migrations 01_migrations.sql
// =============================================================================

// ─── payment_logs ─────────────────────────────────────────────────────────────

export type PaymentStatus = "succeeded" | "pending" | "failed" | "refunded";
export type AccessType = "FREE_UNLOCK" | "SUB" | "PPV";

export interface PaymentLogRow {
  id: string;
  // Stripe (remplace Adyen)
  stripe_payment_intent_id:    string | null;  // existait déjà ✅
  stripe_checkout_session_id:  string | null;  // NOUVEAU
  stripe_transfer_id:          string | null;  // NOUVEAU — virement créateur
  subscription_id:             string | null;  // NOUVEAU — paiements récurrents SUB
  // Références
  magic_clock_id:   string | null;
  buyer_id:         string | null;
  creator_handle:   string | null;
  // Type et montants (en centimes CHF)
  access_type:      AccessType;               // 'PPV' | 'SUB' | 'FREE_UNLOCK'
  amount_total:     number | null;
  amount_creator:   number | null;
  amount_platform:  number | null;
  currency:         string;                   // default 'chf'
  price_tier:       string | null;
  // TVA
  vat_rate:             number | null;
  buyer_country_code:   string | null;
  // État
  status:   PaymentStatus;
  paid_at:  string;                           // timestamptz ISO
}


// ─── magic_clocks ──────────────────────────────────────────────────────────────

export type GatingMode = "FREE" | "SUB" | "PPV";

export interface MagicClockRow {
  id:              string;
  slug:            string;
  creator_handle:  string;
  creator_name:    string;
  title:           string;
  subtitle:        string | null;
  gating_mode:     GatingMode;
  ppv_price:       number | null;
  is_published:    boolean;
  thumbnail_url:   string | null;  // NOUVEAU
  work:            unknown;        // jsonb — MagicClockWork
  // Stats (NOUVEAU)
  views_count:     number;
  likes_count:     number;
  saves_count:     number;
  shares_count:    number;
  // Ratings (existaient déjà, mis à jour par trigger)
  rating_avg:      number | null;
  rating_count:    number;
  // Dates
  created_at:      string;
  updated_at:      string;
  // FK vers auth.users
  user_id:         string | null;
}


// ─── profiles ─────────────────────────────────────────────────────────────────

export type StripeAccountStatus = "pending" | "active" | "restricted" | null;

export interface ProfileRow {
  id:            string;  // = auth.users.id
  email:         string | null;
  handle:        string | null;
  display_name:  string | null;
  bio:           string | null;
  avatar_url:    string | null;
  website:       string | null;
  location:      string | null;
  // Rôle (NOUVEAU)
  is_creator:          boolean;          // false par défaut
  subscription_price:  number | null;   // prix abo mensuel CHF
  // Stripe Connect (NOUVEAU — remplace Adyen)
  stripe_account_id:      string | null;
  stripe_account_status:  StripeAccountStatus;
  // Compteurs
  followers_count:      number;
  following_count:      number;
  magic_clocks_count:   number;
  // Méta
  profession:  string | null;
  stars:       number | null;
  status:      string;   // 'idle' par défaut
  created_at:  string | null;
  updated_at:  string | null;
  // Réseaux sociaux (handle + followers + verified)
  social_magic_clock:              string | null;
  social_magic_clock_followers:    number | null;
  social_magic_clock_verified:     boolean;
  social_instagram:                string | null;
  social_instagram_followers:      number | null;
  social_instagram_verified:       boolean;
  social_tiktok:                   string | null;
  social_tiktok_followers:         number | null;
  social_tiktok_verified:          boolean;
  social_youtube:                  string | null;
  social_youtube_followers:        number | null;
  social_youtube_verified:         boolean;
  social_facebook:                 string | null;
  social_facebook_followers:       number | null;
  social_facebook_verified:        boolean;
  social_linkedin:                 string | null;
  social_linkedin_followers:       number | null;
  social_linkedin_verified:        boolean;
  social_snapchat:                 string | null;
  social_snapchat_followers:       number | null;
  social_snapchat_verified:        boolean;
  social_x:                        string | null;
  social_x_followers:              number | null;
  social_x_verified:               boolean;
  social_pinterest:                string | null;
  social_pinterest_followers:      number | null;
  social_pinterest_verified:       boolean;
  social_threads:                  string | null;
  social_threads_followers:        number | null;
  social_threads_verified:         boolean;
  social_bereal:                   string | null;
  social_bereal_followers:         number | null;
  social_bereal_verified:          boolean;
  social_twitch:                   string | null;
  social_twitch_followers:         number | null;
  social_twitch_verified:          boolean;
}
