-- Game sessions table to store each game played
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null default 0,
  gru_earned numeric(18, 4) not null default 0,
  duration_seconds integer not null default 0,
  started_at timestamptz default now(),
  ended_at timestamptz,
  is_verified boolean default false,
  game_hash text
);

alter table public.game_sessions enable row level security;

create policy "game_sessions_select_own" on public.game_sessions for select using (auth.uid() = user_id);
create policy "game_sessions_insert_own" on public.game_sessions for insert with check (auth.uid() = user_id);

-- Allow public reads for leaderboard
create policy "game_sessions_select_public" on public.game_sessions for select using (true);

-- Indexes for leaderboard queries
create index if not exists idx_game_sessions_score on public.game_sessions(score desc);
create index if not exists idx_game_sessions_user_id on public.game_sessions(user_id);
