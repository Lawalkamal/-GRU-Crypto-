-- Create leaderboard view for efficient queries
create or replace view public.leaderboard as
select
  p.id as user_id,
  p.username,
  p.avatar_url,
  coalesce(max(gs.score), 0) as high_score,
  coalesce(tb.total_earned, 0) as total_gru_earned,
  count(gs.id) as games_played
from public.profiles p
left join public.game_sessions gs on gs.user_id = p.id
left join public.token_balances tb on tb.user_id = p.id
group by p.id, p.username, p.avatar_url, tb.total_earned
order by high_score desc;

-- Auto-create token balance on profile creation
create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.token_balances (user_id, balance, total_earned, total_withdrawn)
  values (new.id, 0, 0, 0)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;

create trigger on_profile_created
  after insert on public.profiles
  for each row
  execute function public.handle_new_profile();
