-- Transactions table definition
create table public.transactions (
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

-- Index for fast lookups by user
create index transactions_user_id_idx on public.transactions(user_id);

-- Index for filtering by status
create index transactions_status_idx on public.transactions(status);

-- Index for filtering by currency
create index transactions_currency_idx on public.transactions(currency);

-- Auto-update updated_at on row changes
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on public.transactions
for each row execute function update_updated_at_column();

-- Enable Realtime
ALTER publication supabase_realtime ADD TABLE transactions;

-- Enable Row Level Security
alter table public.transactions enable row level security;

-- Admin can update any transaction
create policy "Admin can update transactions"
  on public.transactions for update
  using (
    (auth.jwt() ->> 'role') = 'admin'
  )
  with check (
    (auth.jwt() ->> 'role') = 'admin'
  );

-- Users can view own transactions, admins can view all
create policy "Users and admins can view transactions"
  on public.transactions for select
  using (
    auth.uid() = user_id
    OR (auth.jwt() ->> 'role') = 'admin'
  );

-- Users can only insert their own transactions
create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- Trigger to sync role from user_metadata to app_metadata
-- This is needed because client-side signUp can only set user_metadata,
-- but RLS and auth.jwt() look at app_metadata.
create or replace function public.handle_user_role_sync()
returns trigger as $$
begin
  if (new.raw_user_meta_data->>'role') is not null then
    new.raw_app_meta_data = coalesce(new.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', new.raw_user_meta_data->>'role');
  else
    -- Default role to 'user' if not specified
    new.raw_app_meta_data = coalesce(new.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'user');
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new users
create trigger on_auth_user_created_sync_role
before insert on auth.users
for each row execute function public.handle_user_role_sync();

-- Trigger for updated users
create trigger on_auth_user_updated_sync_role
before update on auth.users
for each row when (old.raw_user_meta_data->>'role' is distinct from new.raw_user_meta_data->>'role')
execute function public.handle_user_role_sync();

-- Set specific user as admin
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'
where email = 'hezekiahhastings14@gmail.com';
