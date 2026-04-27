-- Transactions table definition
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wallet_id text not null,
  wallet_address text not null,
  amount numeric(18, 8) not null check (amount > 0),
  currency text not null,
  total_ngn numeric(18, 2) not null check (total_ngn > 0),
  method text not null default 'bank',
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profiles table for additional user data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  role text default 'user',
  updated_at timestamptz not null default now()
);

-- Index for fast lookups
create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_status_idx on public.transactions(status);
create index if not exists transactions_currency_idx on public.transactions(currency);

-- Auto-update updated_at on row changes
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_updated_at_transactions
before update on public.transactions
for each row execute function update_updated_at_column();

create or replace trigger set_updated_at_profiles
before update on public.profiles
for each row execute function update_updated_at_column();

-- Enable Realtime
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'transactions') then
    alter publication supabase_realtime add table transactions;
  end if;
end $$;

-- Enable Row Level Security
alter table public.transactions enable row level security;
alter table public.profiles enable row level security;

-- Admin can update any transaction
create policy "Admin can update transactions"
  on public.transactions for update
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Users can view own transactions, admins can view all
create policy "Users and admins can view transactions"
  on public.transactions for select
  using (
    auth.uid() = user_id
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Users can only insert their own transactions
create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- Profile policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to sync role and metadata
create or replace function public.handle_user_sync()
returns trigger as $$
begin
  -- 1. Sync to app_metadata for JWT/RLS
  if (new.raw_user_meta_data->>'role') is not null then
    new.raw_app_meta_data = coalesce(new.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', new.raw_user_meta_data->>'role');
  else
    new.raw_app_meta_data = coalesce(new.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'user');
  end if;

  -- 2. Sync to public.profiles table
  insert into public.profiles (id, username, role)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do update
  set
    username = excluded.username,
    role = excluded.role,
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new and updated users
create or replace trigger on_auth_user_sync
before insert or update on auth.users
for each row execute function public.handle_user_sync();

-- Set specific user as admin
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}',
    raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'
where email = 'hezekiahhastings14@gmail.com';
