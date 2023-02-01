# Holistic API Server

<div style="display:flex;width:100%;">
<img src="https://img.shields.io/badge/node-white?style=flat&logo=Node.js&logoColor=#339933"/>
<img src="https://img.shields.io/badge/tfjs-white?style=flat&logo=TensorFlow&logoColor=#FF6F00"/>
<img src="https://img.shields.io/badge/gRPC-white?style=flat">
</div>

<br/>
이미지 or 비디오를 입력받아 홀리스틱 모델의 데이터를 제공하는 API

<br/>
<br/>

## "홀리스틱" 이란?

MediaPipe에서 라이브 스트리밍 맞춤형 머신러닝 솔루션을 제공합니다.  
Holistic(홀리스틱)은 MediaPipe에서 제공하는 서비스 중 하나입니다.  
인체 움직임, 얼굴 변화, 손 동작을 감지합니다. [자세히보기](https://google.github.io/mediapipe/solutions/holistic.html)

## 구조

![diagram](https://user-images.githubusercontent.com/97140962/215270620-aae3ba8d-61d6-4b11-aeb8-3a9a43c041b3.png)

## 구현

-   비디오 입력 시, FFmpeg를 이용하여 비디오를 JPEG로 변환
-   텐서플로우.js(Hands,Pose,Face) API를 추상화하여 홀리스틱 API 제작.
-   홀리스틱 데이터를 생성하는 서버 병렬처리, gRPC사용

<br/>

# 사용법

🙏

## 프로덕션

API 문서 : http://13.125.189.172/swagger

## 로컬

필수 환경

-   node.js ^v18.13.0
-   ffmpeg
-   yarn

```bash
#설치
yarn install

#테스트
yarn test

#빌드
yarn build

#실행
yarn start

#문서
http://localhost:4000/swagger
```

### 테스트 영상

https://user-images.githubusercontent.com/97140962/215148063-a7406d37-ea21-4ae6-936a-4e48e0aea432.mp4

# 기타

## 확장

시야를 넓히는 데에 도움을 받은 것 같아  
감사의 인사를 전합니다.
