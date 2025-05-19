# NEST + MSA + MongoDB 기반의 MonoRepo 프로젝트

## 실행방법

1. Docker 설치
2. Git Clone
3. `docker-compose up -build`

## 테스트 방벙

Swagger UI를 통해 API 테스트 가능 ( http://localhost:3000/docs#/)

### 주요 내용

✅ 계정

1. 계정 생성
   POST /auth/user
   init.js에 미리 권한 별 계정 생성 (admin@nexon.com , operator@nexon.com 등)

2. 권한 부여
   POST /auth/role - 관리자 계정만 사용 가능

3. 로그인
   POST /auth/login
   @CurrentUser 데코레이터로 req.user 정보 접근
   DTO 검증 후, res.cookie에 JWT 토큰 저장

4. 로그아웃
   GET /auth/logout
   res.cookie에서 토큰 삭제

✅ 이벤트

1. 보상/목표 아이템 목록 확인
   GET /event/rewardItem — 보상 가능 아이템 목록
   GET /event/goalItem — 목표 설정 가능 아이템 목록
   모든 목표는 DB에 저장된 이력을 기반으로 판단

2. 이벤트 생성
   POST /event
   아래 테이블에 eventId 기준으로 데이터 생성:
   event, reward, goal

### 주요 구현 사항

Token 을 cookie에 저장하는데 httpOnly 옵션을 사용하여 클라이언트에서 접근 불가하도록 설정

DTO 유효성 검증 및 필터링
→ @UsePipes(new ValidationPipe({ whitelist: true }))를 적용하여 불필요한 프로퍼티를 자동 제거하고 유효성 검사 수행

공통 모듈 분리 및 재사용성 강화
→ 모든 DTO 및 예외 처리 필터를 /common 디렉토리로 통합
→ 서비스 간 공통 사용을 위해 @common alias 설정 (tsconfig.json, 빌드 환경 포함)
→ common 디렉토리가 Docker 빌드에 포함되도록 설정

개발 및 운영 환경 설정
→ MSA 구조에 맞춘 개별 Dockerfile 및 통합 docker-compose.yml 구성
→ MongoDB 초기 데이터 삽입용 init.js 작성 및 자동 실행 설정

로깅 및 사용자 추적 기능
→ Gateway에 HttpLoggingInterceptor를 적용하여 요청/응답 로그 추적
→ 사용자 정보를 추출하는 커스텀 @User() 데코레이터 구현
→ MSA 간 통신 시 사용자 정보 전달 처리 (client.send() 호출 시 포함)

Swagger 기반 API 문서화
→ 각 서비스별 Swagger 문서 설정 및 UI 제공 (@nestjs/swagger 활용)
→ 공통 Swagger 옵션 적용으로 일관성 있는 문서 제공
