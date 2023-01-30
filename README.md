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

zoom에서 화상채팅을 할 때, 배경을 바꿔주는 기술이  
mediapipe에 있고, 라이브러리로 쉽게 사용할 수 있다는 점이  
충격적이었습니다.

이미 많은 사람들이 미디어파이프를 이용해  
재밌는 아이디어를 구현해놓은 것들을 유튜브에서 봤는데  
저 또한 이들처럼 재밌게 놀 수 있겠다는 생각에 참 기뻤습니다.

mediaPipe기술은 라이브 커머스 시장 외 다양한 분야에서 참 유용하게 쓰일 것 같다고 생각됩니다.  
굳갱랩스에서 Cloud AI API를 만드는 이유를 조금이나마 알 수 있게 되었습니다.

시야를 넓히는 데에 도움을 받은 것 같아  
감사의 인사를 전합니다.
