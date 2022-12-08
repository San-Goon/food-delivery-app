# Food Delivery App

**Food Delivery App**은 배달 라이더를 위한 주문 확인 및 배차 앱 입니다.

**Food Delivery App**으로 수 많은 배차를 받고 길안내 서비스 까지 함께 받아보세요🥰


</br>

## Installation 
```bash
npm i --force
npm run android # android studio setting이 되어있어야 합니다.
```
</br>


## 프로젝트 개요

**프로젝트 기간**  :  2022.11 ~ 진행중

**서비스 종류** : Mobile Application

**프로젝트 참여 인원** : Front-End 1명 (개인)

**Food Delivery App 주요 기능**

- 5초 간격 실시간 배차 콜 수신
- 배차 수락 시 TMAP 을 이용한 길안내 기능 (미구현)
- 배달 완료 시 사진 업로드를 통한 배달 확인 기능
- 총 정산액 계산 기능

[기술 세부 설명](https://magenta-forest-566.notion.site/b64e3c8f2006461ba92239f3c213213f)

</br>

## 사용한 기술 스택
- TypeScript
- React Native
- Soket.io
- Redux
- React Navigation
- React Native Elements
- Axios
- Naver Map

</br>

## Folder Structure

```bash
├── .bundle                    
├── android 
    ├── ...               
├── ios   
    ├── ...                   
├── src                     
    ├── assets        # 이미지,폰트 등
    ├── components    # 기타 컴포넌트       
    ├── hooks         # 커스텀 훅 모음    
    ├── pages         # 페이지 단위 컴포넌트   
    ├── slices        # 리덕스 스토어 세팅     
    └── store         # 리덕스 슬라이스
├── types             # 모듈 타입 정의
├── App.tsx           
├── AppInner.tsx      # App 에서 Provider 로 감싸기 위한 컴포넌트
├── types.ts          # 변수 타입 정의    
├── README.md               
└── ...
```

</br>

## REST API

### POST /user
- 회원가입
- data: { email, name, password }
- error: { status: 400, data: { message: '이미 가입한 회원입니다.' } }
### POST /login
- 로그인
- data: { email, password }
- responseData: { data: { name, email, accessToken } }
- error: { status: 400, data: { message: '가입되지 않은 회원입니다.' } }
- error: { status: 400, data: { message: '잘못된 비밀번호입니다.' } }
### POST /logout
- header: { authorization: 'Bearer 액세스토큰' }
- error: { status: 419, data: { code: 'expired', message: '만료된 액세스 토큰입니다.' } }
### POST /refreshToken
- header: { authorization: 'Bearer 리프레시토큰' }
- responseData: { data: { name, email, accessToken } }
- error: { status: 419, data: { code: 'expired', message: '만료된 리프레시 토큰입니다.' } }
### POST /accept
- header: { authorization: 'Bearer 액세스토큰' }
- data: { orderId: string }
- error: { status: 419, data: { code: 'expired', message: '만료된 액세스 토큰입니다.' } }
- error: { status: 400, data: { message: '다른 사람이 이미 수락한 주문입니다.' } }
### POST /complete
- header: { authorization: 'Bearer 액세스토큰', content-type: 'multipart/form-data' }
- data: { orderId: string, image: 폼데이터 }
- error: { status: 419, data: { code: 'expired', message: '만료된 액세스 토큰입니다.' } }
### POST /phonetoken
- 폰토큰을 서버로 보냄
- data: { token: string }
### GET /showmethemoney
- header: { authorization: 'Bearer 액세스토큰' }
- responseData: { data: number }
- error: { status: 419, data: { code: 'expired', message: '만료된 액세스 토큰입니다.' } }
### GET /completes
- 완료 내역 가져오기
- header: { authorization: 'Bearer 액세스토큰' }
- responseData: { data: Order[] }

## Websocket
### socket.on('hello', callback)
서버에서 emit 문자열 데이터를 주기적으로 보내줌

### socket.on('order', callback)
서버에서 주문접수 시 주문 정보를 보내줌.
- 단, socket.emit('acceptOrder', 아무값이나)를 호출해서 서버로 주문 접수받을 것임을 알려야 함.
- data
```
export interface Order {
  orderId: string;
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
  price: number;
}
```
### socket.on('acceptOrder')
지금부터 주문을 받기 시작합니다.
### socket.on('ignoreOrder')
지금부터 주문을 무시합니다.



