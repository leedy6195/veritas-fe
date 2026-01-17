# Veritas

학원을 위한 출입 관리 및 강의실 관리 시스템입니다. 관리자와 학생을 위한 웹 애플리케이션으로, 열람실/강의실 출입 관리, 강의 관리, 출석 관리 등의 기능을 제공합니다.

## 주요 기능

### 관리자 기능
- **출석 관리**: 학생 출석 정보 조회 및 관리
- **강의 관리**: 강의 생성, 일정 관리, 수강생 관리
- **시설 관리**: 
  - 열람실 관리 및 모니터링
  - 강의실 관리
- **학생 관리**: 학생 정보 조회 및 관리
- **수강 관리**: 수강 신청 내역 관리
- **디바이스 관리**: 
  - 키오스크 관리
  - 출입 디바이스 관리

### 학생 기능
- **카카오 로그인**: 카카오 계정을 통한 간편 로그인
- **수강 신청**: 강의 수강 신청 및 조회
- **홈 화면**: 개인 정보 및 주요 기능 접근

### 키오스크/뷰 화면
- 열람실 입출입 화면
- 강의실 입출입 화면
- 개인정보 처리 화면

## 기술 스택

- **Frontend Framework**: Vue 3.2.13
- **UI Framework**: Vuetify 3.5.14
- **State Management**: Vuex 4.1.0
- **Routing**: Vue Router 4.3.0
- **HTTP Client**: Axios 1.6.8
- **기타 라이브러리**:
  - `qrcode.vue`: QR 코드 생성
  - `xlsx`: Excel 파일 처리
  - `vue-fullscreen`: 전체화면 기능
  - `vuex-persistedstate`: 상태 관리 영속화

## 프로젝트 구조

```
veritas/
├── public/              # 정적 파일
├── src/
│   ├── assets/         # 이미지 및 리소스
│   ├── components/     # 공통 컴포넌트
│   │   ├── AdminLayout.vue
│   │   └── MemberLayout.vue
│   ├── pages/          # 페이지 컴포넌트
│   │   ├── admin/      # 관리자 페이지
│   │   │   ├── attendance/
│   │   │   ├── device/
│   │   │   ├── enrollment/
│   │   │   ├── facility/
│   │   │   ├── lecture/
│   │   │   └── student/
│   │   ├── student/    # 학생 페이지
│   │   └── view/       # 키오스크/뷰 화면
│   ├── plugins/        # 플러그인 설정
│   │   ├── vuetify.js
│   │   └── webfontloader.js
│   ├── scripts/        # 라우터 및 스토어
│   │   ├── router.js
│   │   └── store.js
│   ├── App.vue
│   └── main.js
├── Dockerfile          # Docker 빌드 설정
├── nginx.conf          # Nginx 설정
└── vue.config.js       # Vue CLI 설정
```

## 설치 및 실행

### 사전 요구사항

- Node.js 14 이상
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run serve
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 린트 검사 및 수정

```bash
npm run lint
```

## 환경 설정

### API 프록시 설정

`vue.config.js`에서 API 프록시를 설정할 수 있습니다:

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'https://veritas-s.app'
    }
  }
}
```

## Docker를 사용한 배포

### 이미지 빌드

```bash
docker build -t veritas .
```

### 컨테이너 실행

```bash
docker run -d -p 3000:3000 veritas
```

## 주요 라우트

### 관리자 라우트 (`/admin`)
- `/admin/login` - 관리자 로그인
- `/admin/attendances` - 출석 관리
- `/admin/students` - 학생 관리
- `/admin/lectures` - 강의 관리
- `/admin/lectures/:lectureId/schedules` - 강의 일정
- `/admin/lectures/:lectureId/enrolled` - 수강생 목록
- `/admin/enrollments` - 수강 신청 관리
- `/admin/readingrooms` - 열람실 관리
- `/admin/lecturerooms` - 강의실 관리
- `/admin/kiosks` - 키오스크 관리
- `/admin/entryDevices` - 출입 디바이스 관리

### 학생 라우트 (`/`)
- `/` - 학생 홈
- `/login` - 카카오 로그인
- `/kakaocallback` - 카카오 로그인 콜백
- `/enrollments` - 수강 신청

### 뷰 라우트 (`/views`)
- `/views/readingrooms/:roomId` - 열람실 화면
- `/views/readingroom/exit/:deviceId` - 열람실 퇴실 화면
- `/views/lectureroom/enter/:deviceId` - 강의실 입실 화면
- `/views/lectureroom/exit/:deviceId` - 강의실 퇴실 화면
- `/views/privacy` - 개인정보 처리 화면

## 인증

- **학생**: 카카오 로그인을 통한 인증 (`/api/auth/check`)
- **관리자**: 별도의 관리자 인증 (`/api/admin/check`)

라우터 가드가 자동으로 인증 상태를 확인하고 미인증 사용자를 로그인 페이지로 리다이렉트합니다.

## 브라우저 지원

- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)
- IE 11 미지원

## 개발 참고사항

- ESLint 설정이 포함되어 있으며, `vue/multi-word-component-names` 규칙은 비활성화되어 있습니다.
- Vuetify 3를 사용하며, Material Design Icons가 포함되어 있습니다.
- 상태 관리는 Vuex PersistedState를 사용하여 브라우저 세션에 영속화됩니다.
