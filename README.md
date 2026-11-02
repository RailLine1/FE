# Daybit FE

Daybit의 앱(Expo, 안드로이드 · 웹)입니다. 동작 기준은 팀 기획 문서([RailLine1/Docs](https://github.com/RailLine1/Docs))이며, 백엔드 API는 [RailLine1/BE](https://github.com/RailLine1/BE)의 Swagger와 `docs/api.md`를 따릅니다.

<!-- 실행 방법, 폴더 구조, 사용 라이브러리는 FE 초기 세팅 후 채운다 -->

## 백엔드 연동

| 항목 | 위치 |
|---|---|
| 요청 · 응답 형식 | BE Swagger `https://<BE 도메인>/swagger-ui`. Orval 입력은 `/v3/api-docs` |
| 인증 흐름, 오류 코드, 구현 상태 | [BE `docs/api.md`](https://github.com/RailLine1/BE/blob/main/docs/api.md) |
| 환경 변수 | `EXPO_PUBLIC_API_URL=https://<BE 도메인>/api/v1` |

아직 구현하지 않은 API는 형식만 있고 `501 NOT_IMPLEMENTED`를 반환합니다. Orval의 `mock` 옵션으로 MSW mock을 만들어 먼저 개발할 수 있습니다.

## 브랜치와 배포

기능 브랜치에서 작업하고 `main`으로 PR을 엽니다. 개발 기간에는 `main`을 EAS Hosting 미리보기로 배포하고, 시연 직전에 `main`에서 `release` 브랜치를 만들어 정식 배포(제출 URL)합니다. 전체 배포 구성은 [Docs `08_배포.md`](https://github.com/RailLine1/Docs/blob/main/08_배포.md)에 있습니다.
