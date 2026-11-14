/* 사이트 설정. 구글 시트 연결 주소는 여기에 한 번만 붙여 넣으면 돼요.
   자세한 방법은 sheet/README.md 를 보세요.

   - 비워 두면(''): data/dresses.js 에 적힌 드레스를 그대로 써요.
   - 주소를 넣으면: 구글 시트에서 드레스를 읽어 와요. 시트를 못 읽으면 data/dresses.js 로 대신 보여 줘요. */
window.LS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUzFJCPV8A99g_QRFROpx0nSURtp5EJaZ_7aBxDk0coJnL1bhxIN50lkjhm-2XCOmvf1c_j0Sc_yGa/pub?output=csv';

/* 예약 탭과 대회 탭의 게시 주소. 비워 두면 data/dresses.js 의 LS_BOOKINGS, LS_EVENTS 를 써요.
   (시트를 연결했는데 예약 탭을 못 읽으면, 사이트는 날짜별 예약 가능 여부를 "확인 불가"로 보여 줘요.) */
window.LS_BOOKINGS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUzFJCPV8A99g_QRFROpx0nSURtp5EJaZ_7aBxDk0coJnL1bhxIN50lkjhm-2XCOmvf1c_j0Sc_yGa/pub?gid=1001&single=true&output=csv';
window.LS_EVENTS_URL = '';   // '다가오는 대회' 버튼을 없애서 지금은 쓰지 않아요

/* 예약 규칙: 공연일 기준 앞뒤로 막는 날 수.
   앞 8일 = 대회일 일주일 전 택배 발송 + 하루 여유, 뒤 5일 = 반납 택배·상태 확인·정리 */
window.LS_BLOCK_BEFORE = 8;
window.LS_BLOCK_AFTER = 5;

/* 관리자 로그인과 예약 저장소 (Supabase). 설정 방법은 admin/README.md 를 보세요.
   두 칸을 채우면: 예약은 구글 시트의 '예약' 탭 대신 여기서 읽고, admin.html 에서 로그인해 예약을 관리해요.
   비워 두면: 지금처럼 구글 시트의 '예약' 탭을 써요.
   (이 키는 공개돼도 되는 '공개용 키'예요. 손님 정보는 로그인한 관리자만 볼 수 있게 잠겨 있어요.) */
window.LS_SUPABASE_URL = '';
window.LS_SUPABASE_KEY = '';
