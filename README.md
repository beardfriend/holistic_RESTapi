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

라이브 스트리밍 맞춤형 머신러닝 솔루션을 MediaPipe에서 제공합니다.  
Holistic(홀리스틱)은 그들이 제공하는 서비스 중 하나입니다.  
인체 움직임, 얼굴에서의 변화, 손 동작을 감지합니다.
[자세히보기](https://google.github.io/mediapipe/solutions/holistic.html)


## 구조

![diagram](https://user-images.githubusercontent.com/97140962/215270620-aae3ba8d-61d6-4b11-aeb8-3a9a43c041b3.png)


## 구현

-   비디오 프레임 분할 속도개선을 위해, node와 ffmpeg 파이프 연결. (로컬 혹은 클라우드 업로드 및 삭제 과정 생략)
-   텐서플로우.js(Hands,Pose,Face) API를 추상화하여 홀리스틱 API 제작.
-   속도 개선을 위해 holistic 데이터 송수신 서버 병렬처리, 노드간 통신에 gRPC 사용.

<br/>

# 사용법
🙏

## 프로덕션

API 주소 : 


API 문서 : 


## 로컬

필수 환경

- node.js v18.0
- ffmpeg
- yarn


```bash
#빌드
yarn build

# gRPC서버 
HOLI_COUNT=0 yarn local:holi
HOLI_COUNT=1 yarn local:holi
HOLI_COUNT=2 yarn local:holi

# http 서버
yarn local:main

```




### 테스트 영상

https://user-images.githubusercontent.com/97140962/215148063-a7406d37-ea21-4ae6-936a-4e48e0aea432.mp4





# 기타

## 고민

