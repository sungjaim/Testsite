# LS (엘에스) – 피겨 스케이팅 드레스 대여

Next.js (App Router) + TypeScript + Tailwind CSS 로 만든 정적 웹사이트입니다. 백엔드와 데이터베이스가 없고, 문의는 인스타그램과 전화로 받습니다. 한국어(`/ko`)와 영어(`/en`)를 지원합니다.

## 로컬에서 실행

Node.js 20 이상이 필요합니다.

```bash
npm install
npm run dev        # http://localhost:3000  (자동으로 /ko 로 이동)
```

배포 전 확인:

```bash
npm run build      # 정적 페이지 생성
npm start          # 빌드 결과를 http://localhost:3000 에서 확인
```

## Vercel 배포

1. 이 저장소를 Vercel 에서 Import 합니다. 설정은 기본값 그대로 두면 됩니다.
2. Environment Variables 에 `NEXT_PUBLIC_SITE_URL` 을 실제 주소(예: `https://example.com`)로 넣습니다. sitemap, 소셜 미리보기에 쓰입니다.

## 연락처·사업자 정보 수정

모두 `lib/config.ts` 한 파일에서 고칩니다. `PLACEHOLDER` 로 표시된 값은 반드시 바꿔 주세요.

- 인스타그램 주소와 아이디, 전화번호
- 주소, 영업시간 (한국어/영어)
- 푸터의 사업자 정보 (상호, 대표자, 사업자등록번호, 통신판매업 신고번호, 이메일). 빈 문자열(`""`)이면 해당 줄이 숨겨집니다.

인스타그램은 메시지를 미리 채워 보내는 링크가 없어서 프로필로 연결됩니다.

## 드레스 추가·수정·삭제

모든 드레스는 `data/dresses.json` 한 파일에 있습니다.

### 추가
1. 사진을 `public/dresses/<id>/` 폴더에 넣습니다. 예: `public/dresses/ls-007/1.jpg`. 세로가 긴 4:5 비율(예: 1000×1250)을 권장합니다.
2. `data/dresses.json` 배열에 항목을 추가합니다.

```json
{
  "id": "ls-007",
  "name": { "ko": "아이보리 펄", "en": "Ivory Pearl" },
  "description": { "ko": "한국어 설명", "en": "English description" },
  "size": "M",
  "measurements": { "height": "163–170", "bust": 84, "waist": 66, "hip": 91, "length": 68 },
  "colors": ["white", "champagne"],
  "price": 50000,
  "deposit": 200000,
  "status": "available",
  "images": ["/dresses/ls-007/1.jpg", "/dresses/ls-007/2.jpg"],
  "featured": false
}
```

- `id`: 영문 소문자, 숫자, `-`. 주소(`/ko/dresses/ls-007`)에 쓰이므로 한 번 정하면 바꾸지 마세요.
- `size`: 자유롭게 씁니다(`"140"`, `"S"` 등). 필터 목록은 데이터에서 자동으로 만들어집니다.
- `colors`: `white, pink, blue, navy, purple, champagne, silver, red, black, gold, green, yellow` 중에서 고릅니다. 새 색이 필요하면 `messages/ko.json` 과 `messages/en.json` 의 `colors` 에 같은 키로 이름을 추가하세요.
- `measurements`: cm 단위. 필요 없는 항목은 지우면 화면에서 숨겨집니다.
- `price`: 1회 대여(7일) 대여료, `deposit`: 보증금 (원).
- `status`: `"available"`(대여 가능) 또는 `"rented"`(대여 중).
- `featured`: `true` 이면 홈의 추천 드레스에 최대 4벌까지 표시됩니다. 첫 번째 추천 드레스는 홈 상단 큰 이미지로도 쓰입니다.
- `images`: 첫 번째 사진이 목록과 소셜 미리보기에 쓰입니다.

### 수정
같은 파일에서 값을 고칩니다. 대여 상태가 바뀌면 `status` 만 바꾸면 됩니다.

### 삭제
`data/dresses.json` 에서 항목을 지우고, 원하면 `public/dresses/<id>/` 폴더도 지웁니다.

저장 후 GitHub 에 푸시하면 Vercel 이 자동으로 다시 배포합니다.

## 문구 수정

화면의 모든 글은 `messages/ko.json`, `messages/en.json` 에 있습니다. 대여 안내(`guide`)의 기간, 연체료, 환불 규정은 예시이니 실제 운영 규정에 맞게 고쳐 주세요.

## 로고·이미지

- 로고: `public/logo.jpeg` (헤더, 파비콘)
- 소셜 미리보기 이미지: `public/og.png` (1200×630)
- 샘플 드레스 사진은 임시 이미지입니다. `public/dresses/` 아래 파일을 실제 사진으로 바꾸세요.

## 구조

```
app/[lang]/        페이지 (홈, dresses, dresses/[id], guide, about)
components/        헤더, 푸터, 드레스 카드, 필터, 갤러리, 플로팅 문의 버튼
data/dresses.json  드레스 데이터
lib/config.ts      연락처와 사업자 정보
messages/          한국어, 영어 문구
public/            로고, 드레스 사진, OG 이미지
```
