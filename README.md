# Daybit FE

Daybit의 앱(Expo, 안드로이드 · 웹)입니다. 작업 규칙(코드 구조, 이슈 · PR 방식 등)은 FE 팀이 정해서 이 저장소에 채웁니다. 아래는 BE와 맞춰 두면 좋은 내용만 정리했습니다.

## 기준 문서

팀 기획 문서의 원본은 [RailLine1/Docs](https://github.com/RailLine1/Docs)입니다(노션은 예전 버전). 화면은 `03_화면목록`의 화면 ID, 규칙은 `02_정책서`의 번호(P-XXX-NN)로 확인합니다. BE · FE와 같은 폴더에 clone해 두면 AI 도구가 `../docs`로 바로 읽을 수 있습니다.

```
작업 폴더/
├─ docs/   ← RailLine1/Docs
├─ BE/     ← RailLine1/BE
└─ FE/     ← RailLine1/FE
```

## 백엔드 연동

| 항목 | 위치 |
|---|---|
| 요청 · 응답 형식 | BE Swagger `https://<BE 도메인>/swagger-ui`. Orval 입력은 `/v3/api-docs` |
| 인증 흐름, 오류 코드, 구현 상태(✅ · ⬜) | [BE `docs/api.md`](https://github.com/RailLine1/BE/blob/main/docs/api.md) |
| API 주소 환경 변수 | `EXPO_PUBLIC_API_URL=https://<BE 도메인>/api/v1` |

- 아직 구현하지 않은 API는 형식만 있고 `501 NOT_IMPLEMENTED`를 반환합니다. Orval의 `mock` 옵션으로 MSW mock을 만들어 먼저 개발할 수 있습니다.
- 오류는 `{ "error": { "code", "message" } }` 형식입니다. 분기는 `code`로 합니다. `VALIDATION_FAILED`의 `message`는 `필드: 내용` 형식이라 앞의 필드 이름을 떼고 입력 칸에 표시합니다.
- 401 `UNAUTHORIZED`를 받으면 `POST /auth/refresh`로 토큰을 갱신하고 원래 요청을 다시 보냅니다. 리프레시 토큰은 1회용이므로 동시에 여러 갱신 요청을 보내지 않습니다.
- API가 문서와 다르게 동작하면 BE 저장소에 이슈를 남겨 주세요.

### API 호출

처음 받은 뒤 `.env.example`을 `.env.local`로 복사합니다. 페이지에서는 `src/api/`에 생성된 훅을 그대로 씁니다. 토큰 첨부와 갱신은 `src/lib/apiClient.ts`가 맡으므로 페이지에서 따로 처리하지 않습니다.

- `src/api/`는 자동 생성 파일이라 직접 고치지 않습니다. 변경 예정인 AI 작업 공간 API는 생성에서 제외했습니다.
- BE API가 바뀌면 `npm run api:generate`로 다시 생성합니다. 충돌을 막기 위해 재생성 결과는 다른 작업과 섞지 말고 별도 PR로 올립니다.
- 오류는 `ApiError`의 `code`로 분기합니다.
- 토큰은 앱에서 `expo-secure-store`, 웹에서 `localStorage`에 저장합니다.
- `npm test`로 토큰 갱신 로직을 확인합니다.

## 브랜치와 배포

BE와 같은 방식을 권장합니다. 기능 브랜치에서 작업해 `main`에 병합하고, 개발 기간에는 `main`을 EAS Hosting 미리보기로 배포합니다. 시연 직전에 `main`에서 `release` 브랜치를 만들어 정식 배포(제출 URL)합니다. 전체 배포 구성은 [Docs `08_배포.md`](https://github.com/RailLine1/Docs/blob/main/08_배포.md)에 있습니다.
