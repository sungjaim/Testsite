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
    price    대여료(숫자, 원 단위). 예: 80000. 아직 모르면 null
    photos   사진 경로 목록. 비어 있으면 연회색 자리표시가 나와요
    featured true 이면 홈 슬라이드쇼에 나와요 (4벌 정도 추천)
    example  true 이면 예시 데이터. 실제 드레스로 바꾸거나 지운 뒤 사이트를 공개하세요
*/

// 색상 이름 (필터와 상세 페이지에 쓰여요). 새 색은 여기에 한 줄 추가하세요.
window.LS_COLORS = {
  black:  { ko: '블랙',   en: 'Black' },
  white:  { ko: '화이트', en: 'White' },
  pink:   { ko: '핑크',   en: 'Pink' },
  red:    { ko: '레드',   en: 'Red' },
  blue:   { ko: '블루',   en: 'Blue' },
  purple: { ko: '퍼플',   en: 'Purple' }
};

window.LS_DRESSES = [
  {
    id: 'ls-01',
    number: '01',
    name: 'Ink & Moonlight',
    size: null,
    color: 'black',
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
    price: null,
    photos: ['images/dresses/ls-02/1.jpg'],
    featured: true
  },

  // ↓ 여기부터는 예시 데이터예요. 실제 드레스로 바꾸거나 지워 주세요.
  { id: 'ls-03', number: '03', name: 'Snow Waltz',     size: '130', color: 'white',  price: null, photos: [], example: true },
  { id: 'ls-04', number: '04', name: 'Blue Hour',      size: '140', color: 'blue',   price: null, photos: [], example: true },
  { id: 'ls-05', number: '05', name: 'Violet Etude',   size: 'S',   color: 'purple', price: null, photos: [], example: true },
  { id: 'ls-06', number: '06', name: 'Crimson Tango',  size: 'M',   color: 'red',    price: null, photos: [], example: true }
];
