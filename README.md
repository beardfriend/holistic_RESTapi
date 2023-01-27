# Holistic API Server

<div style="display:flex; gap:5px; width:100%;">
<img src="https://img.shields.io/badge/node.js-black?style=flat&logo=Node.js&logoColor=#339933" style="width:45px;"/>
<img src="https://img.shields.io/badge/tfjs-white?style=flat&logo=TensorFlow&logoColor=#FF6F00" style="width:45px;"/>
	<img src="https://img.shields.io/badge/gRPC-black?style=flat" style="width:45px;"/>
</div>

<br/>
이미지 or 비디오를 입력받아 홀리스틱 모델의 데이터를 제공하는 API



## "홀리스틱" 이란 무엇인가요?

라이브 스트리밍 맞춤형 머신러닝 솔루션을 MediaPipe에서 제공합니다.  
Holistic(홀리스틱)은 그들이 제공하는 서비스 중 하나입니다.  
인체 움직임, 얼굴에서의 변화, 손 동작을 감지합니다.
[자세히보기](https://google.github.io/mediapipe/solutions/holistic.html)



## 구조

![diagram](https://user-images.githubusercontent.com/97140962/215166495-79cec676-37ac-4e9e-81f6-4135e1000ec5.jpg)



## 구현

-   비디오 프레임 분할 속도개선을 위해, ffmpeg 파이프 사용. (로컬 혹은 클라우드 업로드 및 삭제 과정 생략)
-   텐서플로우.js(Hands,Pose,Face) API를 추상화하여 홀리스틱 API 제작.
-   속도 개선을 위해 holistic 데이터 송수신 서버 병렬처리, 노드간 통신에 gRPC 사용.

# 사용하기

## 환경 구축

## 빌드

## 배포

# 결과물

## API 문서

## 동작영상

https://user-images.githubusercontent.com/97140962/215148063-a7406d37-ea21-4ae6-936a-4e48e0aea432.mp4

# 기타

## 개발하며 고민했던 내용
