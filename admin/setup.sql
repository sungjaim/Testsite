-- LS 관리자·예약 저장소 설정 (Supabase → SQL Editor 에 통째로 붙여 넣고 Run 을 누르세요)
-- 실행하기 전에 맨 아래의 이메일 한 곳만 관리자(누나) 이메일로 바꿔 주세요.

-- 1) 예약 표: 손님 이름·연락처·메모가 들어가므로 관리자만 볼 수 있어요
create table if not exists public.bookings (
  id            bigint generated always as identity primary key,
  dress         text not null,              -- 의상 번호 (예: '61')
  date          date not null,              -- 공연(대회) 날짜
  customer_name text,
  phone         text,
  memo          text,
  created_at    timestamptz not null default now()
);

-- 2) 관리자 명단: 여기에 적힌 이메일로 로그인한 사람만 예약을 보고 고칠 수 있어요
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;      -- 규칙을 하나도 두지 않아서, 밖에서는 아무도 읽을 수 없어요

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

-- 3) 예약 표 잠금: 관리자만 읽기·추가·수정·삭제
alter table public.bookings enable row level security;
drop policy if exists "admins manage bookings" on public.bookings;
create policy "admins manage bookings" on public.bookings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
revoke all on public.bookings from anon;

-- 4) 사이트 손님에게는 '의상 번호'와 '날짜'만 보여 줘요 (이름·연락처·메모는 빠져요)
create or replace view public.public_bookings as select dress, date from public.bookings;
grant select on public.public_bookings to anon, authenticated;

-- 5) 관리자 이메일 등록: 아래 이메일을 누나의 로그인 이메일로 바꿔 주세요
insert into public.admins (email) values ('관리자이메일@example.com') on conflict do nothing;
