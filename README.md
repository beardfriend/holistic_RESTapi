# Todo

## module

#### holistic

-   [x] FaceLandMark
-   [x] Pose
-   [x] Hand
-   [ ] init 완료 안 됐을 경우 에러 예외처리

#### ffmpeg

-   [x] ffmpeg video buffer to frame buffer
-   [x] frame buffer 이미지 정상적으로 출력되는지 확인
-   [ ] frame buffer 이미지 테스트코드

## service

### holistic

-   [ ] bus error 메모리 초과
-   [x] promise.all가공
-   [x] cpu , gpu, wsam 속도 테스트
-   [ ] init 예외처리

### ffmpeg

-   [x] 모듈화

## HTTP handler

-   [ ] 정규식 video,image 이외 예외처리
-   [x] video, image 합치기
-   [ ] video 예외처리
-   [ ] swagger

## server

-   ffmpeg, node18, yarn 설치 코드작성
-   [] EC2 배포 파이프라인 (테스트 -> 빌드 -> Upload)
-   [] Nginx
