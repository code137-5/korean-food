# Korean Food

비빔밥을 직접 구성해 보는 3D 인터랙티브 웹 애플리케이션입니다.

배포 페이지: https://code137-5.github.io/korean-food/

## 프로젝트 소개

이 프로젝트는 한국 음식 중 비빔밥을 중심으로 한 체험형 페이지입니다. 사용자는 비빔밥에 들어갈 재료를 고르고, 각 재료의 비율을 조정한 뒤, 완성된 비빔밥을 3D 결과물로 확인할 수 있습니다.

라우터에는 계절별 음식 페이지와 테스트용 페이지도 남아 있지만, 3D 에셋 확보의 어려움으로 인해 현재 실제 서비스 흐름은 비빔밥 소개와 비빔밥 제조 기능을 중심으로 사용됩니다.

## 리소스 생성

- 2D 이미지 및 UI: ChatGPT
- 3D 모델: VARCO

## 주요 기능

- 비빔밥 소개 페이지
- 재료 카테고리별 탐색
- 재료 선택 및 해제
- 선택한 재료 비율 조정
- 비율 합계가 100%일 때 비빔밥 완성
- 완성 결과 페이지에서 현재 링크 복사
- 완성된 비빔밥 3D 모델 GLB 다운로드

## 주요 페이지

- `/` - 비빔밥 소개 페이지
- `/cuisines/bibim/craft` - 비빔밥 제조 페이지
- `/cuisines/bibim/craft/result` - 비빔밥 제조 결과 페이지

## 기술 스택

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Three.js
- React Three Fiber
- Zustand
- TanStack Query
- i18next

## 실행 방법

의존성을 설치합니다.

```bash
yarn install
```

개발 서버를 실행합니다.

```bash
yarn dev
```

프로덕션 빌드를 생성합니다.

```bash
yarn build
```

빌드 결과를 미리 확인합니다.

```bash
yarn preview
```

## 프로젝트 구조

```text
src
|-- 3d
|   |-- canvas.tsx
|   `-- scene
|       |-- bibim
|       `-- bibim-result
|-- app
|   |-- App.tsx
|   |-- routes
|   |   `-- router.tsx
|   `-- styles
|       `-- index.css
|-- entities
|   |-- cuisine-detail
|   `-- ingredient
|-- pages
|   |-- cuisines
|   |   `-- bibim
|   |       |-- page.tsx
|   |       `-- craft
|   |           |-- page.tsx
|   |           `-- result
|   |               `-- page.tsx
|   `-- not-found
`-- shared
```

## 배포 메모

GitHub Pages 배포 경로가 `/korean-food/`이므로 Vite의 `BASE_URL`을 기준으로 React Router의 `basename`이 설정됩니다. 정적 배포에서 직접 URL 접근이 가능하도록 빌드 시 `scripts/create-pages-fallback.mjs`가 실행됩니다.
