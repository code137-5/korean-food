# Korean Food

사계절별 한식과 계절감을 소개하기 위한 WebGL 기반 3D 전시 웹 프로젝트입니다. 봄, 여름, 가을, 겨울 페이지를 통해 각 계절에 어울리는 한식 콘텐츠를 입체적인 전시 경험으로 탐색할 수 있도록 구성하고 있습니다.

## 프로젝트 소개

이 프로젝트는 계절별 한식 문화를 시각적으로 소개하는 React 기반 웹 애플리케이션입니다. React Three Fiber(R3F)와 Three.js를 활용해 WebGL 기반의 3D 전시 공간을 구현하고, 메인 3D 화면 위에 라우팅된 페이지를 표시하는 방식으로 구성했습니다.

계절별 페이지를 분리하여 봄, 여름, 가을, 겨울에 맞는 한식 콘텐츠를 확장하기 쉽게 만들었으며, 각 페이지는 3D 전시 경험과 결합될 수 있도록 설계했습니다.

## 주요 페이지

- `/` - 메인 페이지
- `/seasons/spring` - 봄 한식 소개 페이지
- `/seasons/summer` - 여름 한식 소개 페이지
- `/seasons/autumn` - 가을 한식 소개 페이지
- `/seasons/winter` - 겨울 한식 소개 페이지

## 기술 스택

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Three.js
- React Three Fiber(R3F)
- WebGL

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
|   `-- canvas.tsx
|-- app
|   |-- App.tsx
|   |-- routes
|   |   `-- router.tsx
|   `-- styles
|       `-- index.css
`-- pages
    |-- home
    |   `-- page.tsx
    |-- not-found
    |   `-- NotFoundPage.tsx
    `-- seasons
        |-- page.tsx
        |-- spring
        |   `-- page.tsx
        |-- summer
        |   `-- page.tsx
        |-- autumn
        |   `-- page.tsx
        `-- winter
            `-- page.tsx
```
