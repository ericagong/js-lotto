## 요구사항 기능 단위 분석

[feature1] 구입 버튼 이벤트

- `확인` 버튼 누르면, 구입 금액 읽어 최대 개수 로또 발행
  V 구입 금액이 유효성 검사 통과하지 못하면 window.alert 처리
  V 구입 금액 재입력 요청 후, 구매 금액 비우기
- 로또 발행 후 `총 n개를 구매하였습니다.` n 반영
- 로또 그림 개수 n 반영

[feature2] 번호 보기 토글 이벤트

- 번호 보기 on 시, 로또 번호 나열
  V 로또 번호 Element display: block 처리
  V 로또 view flex-direction: column 처리
  V 로또 view flex-wrap: nowrap(Default) 처리
- 번호 보기 off 시, 로또 번호 숨기기
  V 로또 번호 Element display: block(Default) 처리
  V 로또 view flex-direction: row(Default) 처리
  V 로또 view flex-wrap: wrap 처리

[feature3] 결과 확인하기 버튼 이벤트

- `결과 확인하기` 버튼 누르면, 당첨 번호와 보너스 번호 읽어 결과 확인
  V 당첨 번호나 보너스 번호가 유효성 검사 통과하지 못하면 에러 처리
  V 당첨 번호 오류 시, 당첨 번호 재입력 요청, 당첨 번호 칸 비우기
  V 보너스 번호 오류 시, 보너스 번호 재입력 요청, 보너스 번호 칸 비우기
- 당첨 통계 및 수익률 기반 모달창 띄움
  V 당첨 통계 n개 당첨 갯수 반영
  V 수익률 % 반영

[feature4] 모달창 닫기 이벤트

- 모달창 닫음

[feature5] 다시 시작하기 버튼 이벤트

- 모달창 닫음
- lottos 초기화
- HTML element 내 값 초기화
