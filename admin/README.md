# 관리자 로그인 설정 방법

관리자 화면(`admin.html`)에서 로그인해 예약을 추가·삭제할 수 있어요.
로그인과 예약 저장은 **Supabase**라는 무료 서비스가 맡아요. 아래 순서를 한 번만 하면 돼요.

설정하기 전에는 사이트가 지금처럼 구글 시트의 '예약' 탭을 써요. 설정을 마치면 예약은 관리자 화면에서만 관리해요.

## 1. Supabase 프로젝트 만들기 (가게 계정으로)
1. https://supabase.com 에서 **Start your project**를 누르고, 가게 이메일로 가입해요.
2. **New project**를 눌러요.
   - Name: `ls`
   - Database Password: 아무 비밀번호나 만들고 따로 적어 둬요. (로그인 비밀번호와는 달라요)
   - Region: **Northeast Asia (Seoul)**
3. 1~2분 기다리면 프로젝트가 만들어져요.

## 2. 예약 표 만들기
1. 왼쪽 메뉴에서 **SQL Editor**를 열어요.
2. 이 폴더의 `setup.sql` 내용을 통째로 붙여 넣어요.
3. 맨 아래 줄의 `관리자이메일@example.com`을 **로그인할 이메일**로 바꿔요.
4. **Run**을 눌러요. "Success"가 나오면 끝이에요.

## 3. 관리자 계정 만들기
1. 왼쪽 메뉴 **Authentication → Users → Add user → Create new user**
2. 2번에서 적은 것과 **같은 이메일**, 그리고 로그인에 쓸 비밀번호를 넣어요.
3. **Auto Confirm User**를 켜고 만들어요.
4. 다른 사람이 가입하지 못하게 막아요: **Authentication → Sign In / Providers → Allow new users to sign up**을 꺼요.

## 4. 사이트에 연결하기
1. 왼쪽 아래 **Project Settings → API Keys** (또는 Data API)에서 두 가지를 복사해요.
   - **Project URL** (예: `https://abcdefgh.supabase.co`)
   - **Publishable key** (예전 이름: anon public key)
2. `js/config.js` 맨 아래 두 칸에 붙여 넣어요.
   ```js
   window.LS_SUPABASE_URL = 'https://abcdefgh.supabase.co';
   window.LS_SUPABASE_KEY = '복사한 키';
   ```
   이 키는 공개돼도 되는 키예요. **`secret` 또는 `service_role` 키는 절대 넣지 마세요.**
3. HTML 파일들의 `?v=...` 숫자를 올려요. (README.md의 "버전 올리기" 참고)

## 5. 쓰는 법
- 사이트 맨 아래의 **Admin**을 누르거나 주소 끝에 `admin.html`을 붙여서 열어요.
- 로그인하면 **예약 추가**와 **다가오는 예약** 목록이 나와요.
- 예약을 추가하면 사이트의 "예약 가능 날짜"에 바로 반영돼요.
- 손님 이름·연락처·메모는 로그인한 관리자에게만 보여요. 사이트에는 의상 번호와 날짜만 공개돼요.

## 옮기기
구글 시트 '예약' 탭에 적어 둔 예약이 있다면, 설정을 마친 뒤 관리자 화면에서 다시 입력해 주세요.
그 뒤로 시트의 '예약' 탭은 쓰지 않아요. (의상과 대회는 계속 시트에서 관리해요)

## 관리자를 더 추가하려면
SQL Editor에서 아래를 실행하고, 3번처럼 그 이메일로 계정을 만들어요.
```sql
insert into public.admins (email) values ('새이메일@example.com');
```
