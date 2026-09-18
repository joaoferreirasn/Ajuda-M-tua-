-- Ajuda Mútua — app schema (profiles, queue, credits, helps, reports, audit)

create table if not exists app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

insert into app_settings (key, value) values
  ('welcome_credits', '3'),
  ('help_credit_reward', '1'),
  ('receive_credit_cost', '1'),
  ('referral_bonus_credits', '2'),
  ('referral_bonus_reputation', '5'),
  ('help_reputation_delta', '1'),
  ('cycle_size', '10'),
  ('max_helps_per_hour', '8'),
  ('min_help_seconds', '8'),
  ('max_reports_per_day', '3'),
  ('max_link_updates_per_day', '4'),
  ('assignment_ttl_minutes', '30'),
  ('auto_block_confirmed_reports', '3'),
  ('fast_complete_flag_seconds', '8'),
  ('disclaimer', 'Aviso: O Ajuda Mútua apenas organiza a participação e a ajuda entre usuários. O aplicativo não garante prêmios, dinheiro, ganhos financeiros ou resultados em promoções externas.')
on conflict (key) do nothing;

create table if not exists profiles (
  user_id text primary key,
  username text not null unique,
  public_id text not null unique,
  email text,
  invite_code text not null unique,
  referred_by_user_id text,
  reputation integer not null default 50,
  credits_balance integer not null default 0,
  credits_earned integer not null default 0,
  credits_spent integer not null default 0,
  helps_given integer not null default 0,
  helps_received integer not null default 0,
  link text unique,
  link_description text,
  link_updated_at timestamptz,
  status text not null default 'active',
  is_admin boolean not null default false,
  is_seed boolean not null default false,
  queue_joined_at timestamptz,
  last_helped_at timestamptz,
  last_help_given_at timestamptz,
  blocked_until timestamptz,
  block_reason text,
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  constraint profiles_status_chk check (status in ('active', 'suspicious', 'suspended', 'blocked')),
  constraint profiles_credits_chk check (credits_balance >= 0)
);

create index if not exists profiles_status_idx on profiles (status);
create index if not exists profiles_queue_idx on profiles (status, helps_received, last_helped_at);
create index if not exists profiles_invite_idx on profiles (invite_code);
create index if not exists profiles_referred_idx on profiles (referred_by_user_id);

create table if not exists helps (
  id serial primary key,
  helper_user_id text not null,
  helped_user_id text not null,
  link text not null,
  status text not null default 'assigned',
  assigned_at timestamptz not null default now(),
  opened_at timestamptz,
  completed_at timestamptz,
  constraint helps_status_chk check (status in ('assigned', 'opened', 'completed', 'expired', 'cancelled')),
  constraint helps_once_chk unique (helper_user_id, helped_user_id)
);

create index if not exists helps_helper_idx on helps (helper_user_id, status);
create index if not exists helps_helped_idx on helps (helped_user_id, status);

create table if not exists credit_transactions (
  id serial primary key,
  user_id text not null,
  amount integer not null,
  balance_after integer not null,
  kind text not null,
  reason text not null,
  related_help_id integer,
  admin_user_id text,
  created_at timestamptz not null default now()
);

create index if not exists credit_tx_user_idx on credit_transactions (user_id, created_at desc);

create table if not exists history_events (
  id serial primary key,
  user_id text not null,
  action text not null,
  details text,
  created_at timestamptz not null default now()
);

create index if not exists history_user_idx on history_events (user_id, created_at desc);

create table if not exists reports (
  id serial primary key,
  reporter_user_id text not null,
  reported_user_id text not null,
  reason text not null,
  description text,
  status text not null default 'pending',
  admin_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint reports_status_chk check (status in ('pending', 'reviewing', 'confirmed', 'rejected'))
);

create index if not exists reports_status_idx on reports (status, created_at desc);

create table if not exists invites (
  id serial primary key,
  inviter_user_id text not null,
  invitee_user_id text not null unique,
  code text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  rewarded_at timestamptz,
  constraint invites_status_chk check (status in ('pending', 'rewarded'))
);

create table if not exists session_logs (
  id serial primary key,
  user_id text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists session_logs_user_idx on session_logs (user_id, created_at desc);

create table if not exists rate_events (
  id serial primary key,
  user_id text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_events_idx on rate_events (user_id, action, created_at desc);

create table if not exists admin_logs (
  id serial primary key,
  admin_user_id text not null,
  action text not null,
  target_user_id text,
  details text,
  created_at timestamptz not null default now()
);

create table if not exists support_tickets (
  id serial primary key,
  user_id text not null,
  subject text not null,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists blocks (
  id serial primary key,
  user_id text not null,
  kind text not null,
  reason text not null,
  admin_user_id text,
  created_at timestamptz not null default now(),
  ends_at timestamptz
);

-- Bootstrap community slots so the first real member can already help someone.
-- These rows are clearly labeled community placeholders (is_seed = true),
-- never mixed into ranking of real members.
insert into profiles (
  user_id, username, public_id, email, invite_code,
  reputation, credits_balance, credits_earned,
  helps_given, helps_received, link, link_description,
  status, is_admin, is_seed, queue_joined_at
) values
  (
    'seed-comunidade-01', 'circulo_norte', 'AM-NORTE1', null, 'SEEDNT01',
    62, 40, 40, 12, 4,
    'https://www.tiktok.com/explore', 'Participação comunitária — Explore',
    'active', false, true, now() - interval '4 days'
  ),
  (
    'seed-comunidade-02', 'circulo_sul', 'AM-SUL002', null, 'SEEDSUL2',
    58, 40, 40, 9, 6,
    'https://www.tiktok.com/live', 'Participação comunitária — Live',
    'active', false, true, now() - interval '3 days'
  ),
  (
    'seed-comunidade-03', 'circulo_leste', 'AM-LESTE3', null, 'SEEDLST3',
    55, 40, 40, 7, 8,
    'https://www.tiktok.com/@tiktok', 'Participação comunitária — Perfil',
    'active', false, true, now() - interval '2 days'
  )
on conflict (user_id) do nothing;
