-- GRU token balances and transaction ledger
create table if not exists public.token_balances (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance numeric(18, 4) not null default 0,
  total_earned numeric(18, 4) not null default 0,
  total_withdrawn numeric(18, 4) not null default 0,
  updated_at timestamptz default now()
);

alter table public.token_balances enable row level security;

create policy "token_balances_select_own" on public.token_balances for select using (auth.uid() = user_id);
create policy "token_balances_insert_own" on public.token_balances for insert with check (auth.uid() = user_id);
create policy "token_balances_update_own" on public.token_balances for update using (auth.uid() = user_id);

-- Allow public reads for leaderboard total earned
create policy "token_balances_select_public" on public.token_balances for select using (true);

-- Transactions ledger for audit trail
create table if not exists public.token_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(18, 4) not null,
  transaction_type text not null check (transaction_type in ('earn', 'withdraw', 'bonus')),
  reference_id uuid,
  tx_hash text,
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz default now()
);

alter table public.token_transactions enable row level security;

create policy "token_transactions_select_own" on public.token_transactions for select using (auth.uid() = user_id);
create policy "token_transactions_insert_own" on public.token_transactions for insert with check (auth.uid() = user_id);

create index if not exists idx_token_transactions_user_id on public.token_transactions(user_id);
create index if not exists idx_token_transactions_created_at on public.token_transactions(created_at desc);
