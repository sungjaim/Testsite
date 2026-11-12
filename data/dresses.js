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

    price    대여료(숫자, 원 단위). 예: 80000. 아직 모르면 null
    photos   사진 경로 목록. 비어 있으면 연회색 자리표시가 나와요
    featured true 이면 홈 슬라이드쇼에 나와요 (4벌 정도 추천)
*/

// 색상 이름 (필터와 상세 페이지에 쓰여요). 새 색은 여기에 한 줄 추가하세요.
window.LS_COLORS = {
  black:  { ko: '블랙',   en: 'Black' },
  white:  { ko: '화이트', en: 'White' },
  gray:   { ko: '그레이', en: 'Gray' },
  beige:  { ko: '베이지', en: 'Beige' },
  brown:  { ko: '브라운', en: 'Brown' },
  pink:   { ko: '핑크',   en: 'Pink' },
  coral:  { ko: '코랄',   en: 'Coral' },
  red:    { ko: '레드',   en: 'Red' },
  wine:   { ko: '와인',   en: 'Wine' },
  orange: { ko: '오렌지', en: 'Orange' },
  yellow: { ko: '옐로',   en: 'Yellow' },
  green:  { ko: '그린',   en: 'Green' },
  mint:   { ko: '민트',   en: 'Mint' },
  teal:   { ko: '청록',   en: 'Teal' },
  blue:   { ko: '블루',   en: 'Blue' },
  navy:   { ko: '네이비', en: 'Navy' },
  purple: { ko: '퍼플',   en: 'Purple' }
};

// 상태 이름 (화면에 보이는 글자). 순서는 필터 버튼 순서예요.
window.LS_STATUS = {
  available: { ko: '대여 가능', en: 'Available' },
  servicing: { ko: '준비 중',   en: 'Being prepared' }
};

// 대회 목록 (드레스 목록에서 "다가오는 대회"로 날짜를 바로 고를 때 쓰여요). 날짜가 지나면 자동으로 숨겨져요.
// 구글 시트를 연결해 두면 시트의 "대회" 탭이 대신 쓰여요. (sheet/README.md 참고)
window.LS_EVENTS = [
  { name: '예시 대회 A', date: '2026-12-20' },
  { name: '예시 대회 B', date: '2027-01-17' },
  { name: '예시 대회 C', date: '2027-02-21' }
];

// 예약 목록: 드레스 번호와 공연 날짜. 공연일 앞 8일, 뒤 5일은 다른 예약을 받을 수 없어요. (규칙은 js/config.js)
// 구글 시트를 연결해 두면 시트의 "예약" 탭이 대신 쓰여요.
window.LS_BOOKINGS = [
  // 예: { dress: '01', date: '2026-12-20' }
];

window.LS_DRESSES = [
  { id: 'ls-01', number: '01', name: 'Citron Vert', size: null, color: 'green', status: 'available', price: null,
    photos: ['images/dresses/ls-01/1.jpg', 'images/dresses/ls-01/2.jpg'], featured: false },   // 라임
  { id: 'ls-02', number: '02', name: 'Phénix d\'Or', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-02/1.jpg', 'images/dresses/ls-02/2.jpg'], featured: true },   // 황금 불사조
  { id: 'ls-03', number: '03', name: 'Ciel de Minuit', size: null, color: 'blue', status: 'available', price: null,
    photos: ['images/dresses/ls-03/1.jpg', 'images/dresses/ls-03/2.jpg'], featured: false },   // 한밤의 하늘
  { id: 'ls-04', number: '04', name: 'Corail Doux', size: null, color: 'coral', status: 'available', price: null,
    photos: ['images/dresses/ls-04/1.jpg', 'images/dresses/ls-04/2.jpg'], featured: false },   // 부드러운 산호
  { id: 'ls-05', number: '05', name: 'Perle Blanche', size: null, color: 'white', status: 'available', price: null,
    photos: ['images/dresses/ls-05/1.jpg', 'images/dresses/ls-05/2.jpg'], featured: false },   // 하얀 진주
  { id: 'ls-06', number: '06', name: 'Forêt d\'Émeraude', size: null, color: 'green', status: 'available', price: null,
    photos: ['images/dresses/ls-06/1.jpg', 'images/dresses/ls-06/2.jpg'], featured: false },   // 에메랄드 숲
  { id: 'ls-07', number: '07', name: 'Givre', size: null, color: 'blue', status: 'available', price: null,
    photos: ['images/dresses/ls-07/1.jpg', 'images/dresses/ls-07/2.jpg'], featured: false },   // 서리
  { id: 'ls-08', number: '08', name: 'Flamme', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-08/1.jpg', 'images/dresses/ls-08/2.jpg'], featured: false },   // 불꽃
  { id: 'ls-09', number: '09', name: 'Tournesol', size: null, color: 'yellow', status: 'available', price: null,
    photos: ['images/dresses/ls-09/1.jpg', 'images/dresses/ls-09/2.jpg'], featured: false },   // 해바라기
  { id: 'ls-10', number: '10', name: 'Feu Follet', size: null, color: 'green', status: 'available', price: null,
    photos: ['images/dresses/ls-10/1.jpg', 'images/dresses/ls-10/2.jpg'], featured: false },   // 도깨비불
  { id: 'ls-11', number: '11', name: 'Tango', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-11/1.jpg', 'images/dresses/ls-11/2.jpg'], featured: false },   // 탱고
  { id: 'ls-12', number: '12', name: 'Aigue-Marine', size: null, color: 'blue', status: 'available', price: null,
    photos: ['images/dresses/ls-12/1.jpg', 'images/dresses/ls-12/2.jpg'], featured: false },   // 아쿠아마린
  { id: 'ls-13', number: '13', name: 'Aurore', size: null, color: 'blue', status: 'available', price: null,
    photos: ['images/dresses/ls-13/1.jpg', 'images/dresses/ls-13/2.jpg'], featured: true },   // 새벽빛
  { id: 'ls-14', number: '14', name: 'Cygne Blanc', size: null, color: 'white', status: 'available', price: null,
    photos: ['images/dresses/ls-14/1.jpg', 'images/dresses/ls-14/2.jpg'], featured: false },   // 백조
  { id: 'ls-15', number: '15', name: 'Menthe Glacée', size: null, color: 'mint', status: 'available', price: null,
    photos: ['images/dresses/ls-15/1.jpg', 'images/dresses/ls-15/2.jpg'], featured: false },   // 얼음 민트
  { id: 'ls-16', number: '16', name: 'Océan', size: null, color: 'teal', status: 'available', price: null,
    photos: ['images/dresses/ls-16/1.jpg', 'images/dresses/ls-16/2.jpg'], featured: false },   // 바다
  { id: 'ls-17', number: '17', name: 'Éclat Noir', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-17/1.jpg', 'images/dresses/ls-17/2.jpg'], featured: false },   // 검은 반짝임
  { id: 'ls-18', number: '18', name: 'Rubis', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-18/1.jpg', 'images/dresses/ls-18/2.jpg'], featured: false },   // 루비
  { id: 'ls-19', number: '19', name: 'Crépuscule', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-19/1.jpg', 'images/dresses/ls-19/2.jpg'], featured: false },   // 해 질 녘
  { id: 'ls-20', number: '20', name: 'Coquelicot', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-20/1.jpg', 'images/dresses/ls-20/2.jpg'], featured: false },   // 개양귀비
  { id: 'ls-21', number: '21', name: 'Écume', size: null, color: 'white', status: 'available', price: null,
    photos: ['images/dresses/ls-21/1.jpg', 'images/dresses/ls-21/2.jpg'], featured: false },   // 물거품
  { id: 'ls-22', number: '22', name: 'Jardin d\'Automne', size: null, color: 'beige', status: 'available', price: null,
    photos: ['images/dresses/ls-22/1.jpg', 'images/dresses/ls-22/2.jpg'], featured: false },   // 가을 정원
  { id: 'ls-23', number: '23', name: 'Carmen', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-23/1.jpg', 'images/dresses/ls-23/2.jpg'], featured: false },   // 카르멘
  { id: 'ls-24', number: '24', name: 'Paon', size: null, color: 'teal', status: 'available', price: null,
    photos: ['images/dresses/ls-24/1.jpg', 'images/dresses/ls-24/2.jpg'], featured: false },   // 공작새
  { id: 'ls-25', number: '25', name: 'Bordeaux', size: null, color: 'wine', status: 'available', price: null,
    photos: ['images/dresses/ls-25/1.jpg', 'images/dresses/ls-25/2.jpg'], featured: false },   // 보르도 와인
  { id: 'ls-26', number: '26', name: 'Brume', size: null, color: 'white', status: 'available', price: null,
    photos: ['images/dresses/ls-26/1.jpg', 'images/dresses/ls-26/2.jpg'], featured: false },   // 안개
  { id: 'ls-27', number: '27', name: 'Saphir', size: null, color: 'blue', status: 'available', price: null,
    photos: ['images/dresses/ls-27/1.jpg', 'images/dresses/ls-27/2.jpg'], featured: false },   // 사파이어
  { id: 'ls-28', number: '28', name: 'Nuit Bleue', size: null, color: 'navy', status: 'available', price: null,
    photos: ['images/dresses/ls-28/1.jpg', 'images/dresses/ls-28/2.jpg'], featured: false },   // 푸른 밤
  { id: 'ls-29', number: '29', name: 'Mandarine', size: null, color: 'orange', status: 'available', price: null,
    photos: ['images/dresses/ls-29/1.jpg', 'images/dresses/ls-29/2.jpg'], featured: false },   // 귤
  { id: 'ls-30', number: '30', name: 'Cerise', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-30/1.jpg', 'images/dresses/ls-30/2.jpg'], featured: false },   // 체리
  { id: 'ls-31', number: '31', name: 'Kaléidoscope', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-31/1.jpg', 'images/dresses/ls-31/2.jpg'], featured: false },   // 만화경
  { id: 'ls-32', number: '32', name: 'Lavande', size: null, color: 'purple', status: 'available', price: null,
    photos: ['images/dresses/ls-32/1.jpg', 'images/dresses/ls-32/2.jpg'], featured: false },   // 라벤더
  { id: 'ls-33', number: '33', name: 'Glacier', size: null, color: 'white', status: 'available', price: null,
    photos: ['images/dresses/ls-33/1.jpg', 'images/dresses/ls-33/2.jpg'], featured: false },   // 빙하
  { id: 'ls-34', number: '34', name: 'Flocon', size: null, color: 'white', status: 'available', price: null,
    photos: ['images/dresses/ls-34/1.jpg', 'images/dresses/ls-34/2.jpg'], featured: false },   // 눈송이
  { id: 'ls-35', number: '35', name: 'Mademoiselle', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-35/1.jpg', 'images/dresses/ls-35/2.jpg'], featured: false },   // 아가씨
  { id: 'ls-36', number: '36', name: 'Améthyste', size: null, color: 'purple', status: 'available', price: null,
    photos: ['images/dresses/ls-36/1.jpg', 'images/dresses/ls-36/2.jpg'], featured: true },   // 자수정
  { id: 'ls-37', number: '37', name: 'Orchidée Noire', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-37/1.jpg', 'images/dresses/ls-37/2.jpg'], featured: false },   // 검은 난초
  { id: 'ls-38', number: '38', name: 'Argent', size: null, color: 'gray', status: 'available', price: null,
    photos: ['images/dresses/ls-38/1.jpg', 'images/dresses/ls-38/2.jpg'], featured: false },   // 은빛
  { id: 'ls-39', number: '39', name: 'Bleu Royal', size: null, color: 'blue', status: 'available', price: null,
    photos: ['images/dresses/ls-39/1.jpg', 'images/dresses/ls-39/2.jpg'], featured: false },   // 로열 블루
  { id: 'ls-40', number: '40', name: 'Rouge Velours', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-40/1.jpg', 'images/dresses/ls-40/2.jpg'], featured: false },   // 붉은 벨벳
  { id: 'ls-41', number: '41', name: 'Jade', size: null, color: 'mint', status: 'available', price: null,
    photos: ['images/dresses/ls-41/1.jpg', 'images/dresses/ls-41/2.jpg'], featured: false },   // 옥
  { id: 'ls-42', number: '42', name: 'Bleu Canard', size: null, color: 'teal', status: 'available', price: null,
    photos: ['images/dresses/ls-42/1.jpg', 'images/dresses/ls-42/2.jpg'], featured: false },   // 청둥오리 빛 청록
  { id: 'ls-43', number: '43', name: 'Bulles Roses', size: null, color: 'pink', status: 'available', price: null,
    photos: ['images/dresses/ls-43/1.jpg', 'images/dresses/ls-43/2.jpg'], featured: false },   // 분홍 거품
  { id: 'ls-44', number: '44', name: 'Rose Sauvage', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-44/1.jpg', 'images/dresses/ls-44/2.jpg'], featured: false },   // 들장미
  { id: 'ls-45', number: '45', name: 'Libellule', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-45/1.jpg', 'images/dresses/ls-45/2.jpg'], featured: false },   // 잠자리
  { id: 'ls-46', number: '46', name: 'Trèfle', size: null, color: 'green', status: 'available', price: null,
    photos: ['images/dresses/ls-46/1.jpg', 'images/dresses/ls-46/2.jpg'], featured: false },   // 클로버
  { id: 'ls-47', number: '47', name: 'Fuchsia', size: null, color: 'pink', status: 'available', price: null,
    photos: ['images/dresses/ls-47/1.jpg', 'images/dresses/ls-47/2.jpg'], featured: false },   // 푸크시아
  { id: 'ls-48', number: '48', name: 'Cygne Noir', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-48/1.jpg', 'images/dresses/ls-48/2.jpg'], featured: false },   // 흑조
  { id: 'ls-49', number: '49', name: 'Grenat', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-49/1.jpg', 'images/dresses/ls-49/2.jpg'], featured: false },   // 석류석
  { id: 'ls-50', number: '50', name: 'Obsidienne', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-50/1.jpg', 'images/dresses/ls-50/2.jpg'], featured: false },   // 흑요석
  { id: 'ls-51', number: '51', name: 'Jazz', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-51/1.jpg', 'images/dresses/ls-51/2.jpg'], featured: false },   // 재즈
  { id: 'ls-52', number: '52', name: 'Charleston', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-52/1.jpg', 'images/dresses/ls-52/2.jpg'], featured: false },   // 찰스턴 춤
  { id: 'ls-53', number: '53', name: 'Nuit de Paris', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-53/1.jpg', 'images/dresses/ls-53/2.jpg'], featured: false },   // 파리의 밤
  { id: 'ls-54', number: '54', name: 'Coucher de Soleil', size: null, color: 'orange', status: 'available', price: null,
    photos: ['images/dresses/ls-54/1.jpg', 'images/dresses/ls-54/2.jpg'], featured: true },   // 해넘이
  { id: 'ls-55', number: '55', name: 'Mille et Une Nuits', size: null, color: 'navy', status: 'available', price: null,
    photos: ['images/dresses/ls-55/1.jpg', 'images/dresses/ls-55/2.jpg'], featured: false },   // 천일야화
  { id: 'ls-56', number: '56', name: 'Macaron', size: null, color: 'mint', status: 'available', price: null,
    photos: ['images/dresses/ls-56/1.jpg', 'images/dresses/ls-56/2.jpg'], featured: false },   // 마카롱
  { id: 'ls-57', number: '57', name: 'Framboise', size: null, color: 'wine', status: 'available', price: null,
    photos: ['images/dresses/ls-57/1.jpg', 'images/dresses/ls-57/2.jpg'], featured: false },   // 라즈베리
  { id: 'ls-58', number: '58', name: 'Passion', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-58/1.jpg', 'images/dresses/ls-58/2.jpg'], featured: false },   // 열정
  { id: 'ls-59', number: '59', name: 'Sirène', size: null, color: 'mint', status: 'available', price: null,
    photos: ['images/dresses/ls-59/1.jpg', 'images/dresses/ls-59/2.jpg'], featured: false },   // 인어
  { id: 'ls-60', number: '60', name: 'Vague', size: null, color: 'white', status: 'available', price: null,
    photos: ['images/dresses/ls-60/1.jpg', 'images/dresses/ls-60/2.jpg'], featured: false },   // 물결
  { id: 'ls-61', number: '61', name: 'Étoile Filante', size: null, color: 'blue', status: 'available', price: null,
    photos: ['images/dresses/ls-61/1.jpg', 'images/dresses/ls-61/2.jpg'], featured: true },   // 별똥별
  { id: 'ls-62', number: '62', name: 'Dentelle', size: null, color: 'white', status: 'available', price: null,
    photos: ['images/dresses/ls-62/1.jpg', 'images/dresses/ls-62/2.jpg'], featured: false },   // 레이스
  { id: 'ls-63', number: '63', name: 'Pêche', size: null, color: 'coral', status: 'available', price: null,
    photos: ['images/dresses/ls-63/1.jpg', 'images/dresses/ls-63/2.jpg'], featured: false },   // 복숭아
  { id: 'ls-64', number: '64', name: 'Prune', size: null, color: 'purple', status: 'available', price: null,
    photos: ['images/dresses/ls-64/1.jpg', 'images/dresses/ls-64/2.jpg'], featured: false },   // 자두
  { id: 'ls-65', number: '65', name: 'Matador', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-65/1.jpg', 'images/dresses/ls-65/2.jpg'], featured: false },   // 투우사
  { id: 'ls-67', number: '67', name: 'Pivoine', size: null, color: 'pink', status: 'available', price: null,
    photos: ['images/dresses/ls-67/1.jpg', 'images/dresses/ls-67/2.jpg'], featured: false },   // 모란
  { id: 'ls-68', number: '68', name: 'Printemps', size: null, color: 'green', status: 'available', price: null,
    photos: ['images/dresses/ls-68/1.jpg', 'images/dresses/ls-68/2.jpg'], featured: false },   // 봄
  { id: 'ls-69', number: '69', name: 'Lagon', size: null, color: 'teal', status: 'available', price: null,
    photos: ['images/dresses/ls-69/1.jpg', 'images/dresses/ls-69/2.jpg'], featured: false },   // 석호
  { id: 'ls-70', number: '70', name: 'Désert', size: null, color: 'brown', status: 'available', price: null,
    photos: ['images/dresses/ls-70/1.jpg', 'images/dresses/ls-70/2.jpg'], featured: false },   // 사막
  { id: 'ls-71', number: '71', name: 'Dragée', size: null, color: 'pink', status: 'available', price: null,
    photos: ['images/dresses/ls-71/1.jpg', 'images/dresses/ls-71/2.jpg'], featured: false },   // 드라제 사탕
  { id: 'ls-72', number: '72', name: 'Fleur de Feu', size: null, color: 'red', status: 'available', price: null,
    photos: ['images/dresses/ls-72/1.jpg', 'images/dresses/ls-72/2.jpg'], featured: false },   // 불꽃 꽃
  { id: 'ls-73', number: '73', name: 'Smoking', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-73/1.jpg', 'images/dresses/ls-73/2.jpg', 'images/dresses/ls-73/3.jpg', 'images/dresses/ls-73/4.jpg'], featured: false },   // 턱시도
  { id: 'ls-74', number: '74', name: 'Domino', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-74/1.jpg', 'images/dresses/ls-74/2.jpg'], featured: false },   // 도미노
  { id: 'ls-75', number: '75', name: 'Bijou d\'Orient', size: null, color: 'blue', status: 'available', price: null,
    photos: ['images/dresses/ls-75/1.jpg', 'images/dresses/ls-75/2.jpg'], featured: false },   // 동방의 보석
  { id: 'ls-77', number: '77', name: 'Voie Lactée', size: null, color: 'navy', status: 'available', price: null,
    photos: ['images/dresses/ls-77/1.jpg', 'images/dresses/ls-77/2.jpg'], featured: false },   // 은하수
  { id: 'ls-78', number: '78', name: 'Lilas', size: null, color: 'purple', status: 'available', price: null,
    photos: ['images/dresses/ls-78/1.jpg', 'images/dresses/ls-78/2.jpg'], featured: true },   // 라일락
  { id: 'ls-79', number: '79', name: 'Flamant Rose', size: null, color: 'pink', status: 'available', price: null,
    photos: ['images/dresses/ls-79/1.jpg', 'images/dresses/ls-79/2.jpg'], featured: false },   // 홍학
  { id: 'ls-101', number: '101', name: 'Ruban Rouge', size: null, color: 'white', status: 'available', price: null,
    photos: ['images/dresses/ls-101/1.jpg', 'images/dresses/ls-101/2.jpg'], featured: false },   // 빨간 리본
  { id: 'ls-102', number: '102', name: 'Ombre', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-102/1.jpg', 'images/dresses/ls-102/2.jpg'], featured: false },   // 그림자
  { id: 'ls-103', number: '103', name: 'Prince Noir', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-103/1.jpg', 'images/dresses/ls-103/2.jpg'], featured: false },   // 검은 왕자
  { id: 'ls-104', number: '104', name: 'Chevalier', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-104/1.jpg', 'images/dresses/ls-104/2.jpg'], featured: false },   // 기사
  { id: 'ls-105', number: '105', name: 'Mousquetaire', size: null, color: 'black', status: 'available', price: null,
    photos: ['images/dresses/ls-105/1.jpg', 'images/dresses/ls-105/2.jpg', 'images/dresses/ls-105/3.jpg', 'images/dresses/ls-105/4.jpg'], featured: false },   // 삼총사
  { id: 'ls-106', number: '106', name: 'Gilet Marine', size: null, color: 'navy', status: 'available', price: null,
    photos: ['images/dresses/ls-106/1.jpg', 'images/dresses/ls-106/2.jpg', 'images/dresses/ls-106/3.jpg', 'images/dresses/ls-106/4.jpg'], featured: false },   // 네이비 조끼
  { id: 'ls-107', number: '107', name: 'Capitaine', size: null, color: 'white', status: 'available', price: null,
    photos: ['images/dresses/ls-107/1.jpg', 'images/dresses/ls-107/2.jpg'], featured: false },   // 선장
  { id: 'ls-108', number: '108', name: 'Jardin Royal', size: null, color: 'white', status: 'available', price: null,
    photos: ['images/dresses/ls-108/1.jpg', 'images/dresses/ls-108/2.jpg', 'images/dresses/ls-108/3.jpg', 'images/dresses/ls-108/4.jpg'], featured: false },   // 왕실 정원
  { id: 'ls-109', number: '109', name: 'Abricot', size: null, color: 'orange', status: 'available', price: null,
    photos: ['images/dresses/ls-109/1.jpg', 'images/dresses/ls-109/2.jpg', 'images/dresses/ls-109/3.jpg'], featured: false },   // 살구
  { id: 'ls-110', number: '110', name: 'Hussard', size: null, color: 'wine', status: 'available', price: null,
    photos: ['images/dresses/ls-110/1.jpg', 'images/dresses/ls-110/2.jpg', 'images/dresses/ls-110/3.jpg', 'images/dresses/ls-110/4.jpg'], featured: false }   // 경기병
];
