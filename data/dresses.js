/*
  ─────────────────────────────────────────────────────────────
  드레스 데이터: 드레스를 추가·수정할 때는 이 파일만 고치면 됩니다.
  ─────────────────────────────────────────────────────────────
  새 드레스 추가하는 법
    1) 아래 { ... } 한 덩어리를 통째로 복사해서 목록 끝에 붙여 넣고 값만 바꿉니다.
       (덩어리와 덩어리 사이에는 쉼표 , 가 있어야 해요)
    2) 사진을 images/dresses/<id>/1.jpg, 2.jpg ... 로 올립니다. (1번이 대표 사진)

  항목 설명
    id       영어 소문자·숫자·하이픈만. 사진 폴더 이름과 같아야 해요. 예: 'ls-07'
    number   화면에 보이는 번호. 예: '07'
    name     드레스 이름 (영어)
    size     사이즈 표기. 아직 모르면 null  → 화면에 "확인 필요"로 표시
    color    아래 LS_COLORS 에 있는 키 하나. 예: 'black'
    status   드레스 전체 상태. 아래 둘 중 하나만 적어요.
               'available'  대여 가능
               'servicing'  준비 중 (세탁·점검·수선 등으로 잠시 대여 불가)
    booked   예약이 잡힌 대회 이름 목록. 아래 LS_EVENTS 의 name 과 똑같이 적어요.
             예: booked: ['예시 대회 A']  → 그 대회에는 "예약 마감"으로 보여요
    price    대여료(숫자, 원 단위). 예: 80000. 아직 모르면 null
    photos   사진 경로 목록. 비어 있으면 연회색 자리표시가 나와요
    featured true 이면 홈 슬라이드쇼에 나와요 (4벌 정도 추천)
*/

// 색상 이름 (필터와 상세 페이지에 쓰여요). 새 색은 여기에 한 줄 추가하세요.
window.LS_COLORS = {
  black:  { ko: '블랙',   en: 'Black' },
  white:  { ko: '화이트', en: 'White' },
  pink:   { ko: '핑크',   en: 'Pink' },
  red:    { ko: '레드',   en: 'Red' },
  blue:   { ko: '블루',   en: 'Blue' },
  purple: { ko: '퍼플',   en: 'Purple' },
  orange: { ko: '오렌지', en: 'Orange' },
  coral:  { ko: '코랄',   en: 'Coral' },
  yellow: { ko: '옐로',   en: 'Yellow' }
};

// 상태 이름 (화면에 보이는 글자). 순서는 필터 버튼 순서예요.
window.LS_STATUS = {
  available: { ko: '대여 가능', en: 'Available' },
  servicing: { ko: '준비 중',   en: 'Being prepared' }
};

// 대회 목록. 날짜(YYYY-MM-DD)가 지나면 사이트에서 자동으로 숨겨져요.
// 구글 시트를 연결해 두면 시트의 대회 칸이 대신 쓰여요. (sheet/README.md 참고)
window.LS_EVENTS = [
  { name: '예시 대회 A', date: '2026-12-20' },
  { name: '예시 대회 B', date: '2027-01-17' },
  { name: '예시 대회 C', date: '2027-02-21' }
];

window.LS_DRESSES = [
  {
    id: 'ls-01',
    number: '01',
    name: 'Ink & Moonlight',
    size: null,
    color: 'black',
    status: 'available',
    booked: ['예시 대회 A'],
    price: null,
    photos: ['images/dresses/ls-01/1.jpg'],
    featured: true
  },
  {
    id: 'ls-02',
    number: '02',
    name: 'Sugar Plum',
    size: null,
    color: 'pink',
    status: 'available',
    price: null,
    photos: ['images/dresses/ls-02/1.jpg'],
    featured: true
  },
  {
    id: 'ls-03',
    number: '03',
    name: 'Firebird',
    size: null,
    color: 'orange',
    status: 'available',
    price: null,
    photos: ['images/dresses/ls-03/1.jpg'],
    featured: false
  },
  {
    id: 'ls-04',
    number: '04',
    name: 'Coral Blossom',
    size: null,
    color: 'coral',
    status: 'available',
    price: null,
    photos: ['images/dresses/ls-04/1.jpg'],
    featured: true
  },
  {
    id: 'ls-05',
    number: '05',
    name: 'Honey Bloom',
    size: null,
    color: 'yellow',
    status: 'available',
    price: null,
    photos: ['images/dresses/ls-05/1.jpg'],
    featured: false
  },
  {
    id: 'ls-06',
    number: '06',
    name: 'First Frost',
    size: null,
    color: 'blue',
    status: 'available',
    price: null,
    photos: ['images/dresses/ls-06/1.jpg'],
    featured: true
  }
];
