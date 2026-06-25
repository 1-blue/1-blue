import { defineSeedCbt } from "./build";

export const frontendCs = defineSeedCbt({
  title: "프론트엔드 개발자 CS 퀴즈",
  description: "웹 프론트엔드 개발에 필요한 HTML·CSS·JavaScript·브라우저 기본 개념을 묻습니다.",
  publicId: "frontend-cs",
  adminToken: "admin-frontend-cs",
  questions: [
    {
      content:
        "웹 페이지의 구조는 HTML, 표현은 CSS, 동작은 JavaScript가 담당한다고 흔히 말합니다.\n문서의 제목을 브라우저 탭에 표시하려면 주로 어떤 요소를 쓰나요?",
      choices: ["<title>", "<header>", "<h1>", "<meta>"],
      correctIndex: 0,
      explanation: "<title>은 document title로 브라우저 탭·검색 결과 제목 등에 사용됩니다.",
    },
    {
      content:
        "CSS에서 요소의 크기 계산 시 padding과 border를 width에 포함시키려면 box-sizing을 조정합니다.\nwidth에 padding·border까지 포함하게 하는 값은?",
      choices: ["content-box", "border-box", "padding-box", "inherit-only"],
      correctIndex: 1,
      explanation: "border-box는 지정한 width/height 안에 padding과 border가 포함되어 레이아웃 계산이 직관적입니다.",
    },
    {
      content:
        "JavaScript에서 비동기 작업의 결과를 다룰 때 Promise를 자주 씁니다.\nPromise가 최종적으로 성공했을 때 호출되는 콜백을 연결하는 메서드는?",
      choices: [".catch()", ".then()", ".finally()", ".reject()"],
      correctIndex: 1,
      explanation: ".then()은 fulfilled 상태에서 값을 받아 다음 처리를 이어갑니다. .catch()는 실패 시입니다.",
    },
    {
      content:
        "브라우저는 HTML을 파싱해 DOM을 만들고, CSS를 파싱해 CSSOM을 만든 뒤 렌더 트리를 구성합니다.\n이 과정과 가장 관련 있는 용어는?",
      choices: ["컴파일 파이프라인", "크리티컬 렌더링 패스", "가비지 컬렉션", "메모리 스왑"],
      correctIndex: 1,
      explanation: "크리티컬 렌더링 패스는 DOM·CSSOM·레이아웃·페인트 등 화면 표시까지의 단계를 말합니다.",
    },
    {
      content:
        "HTTP에서 클라이언트가 서버에 리소스를 요청할 때 가장 흔한 메서드는 GET입니다.\n새 데이터를 서버에 보내 생성할 때 주로 쓰는 메서드는?",
      choices: ["GET", "POST", "HEAD", "OPTIONS"],
      correctIndex: 1,
      explanation: "POST는 요청 본문과 함께 서버에 데이터를 전송할 때 자주 사용됩니다.",
    },
    {
      content:
        "React 같은 라이브러리에서 UI는 상태(state)에 따라 달라집니다.\n상태가 바뀌었을 때 화면을 다시 그리는 개념을 무엇이라 부르나요?",
      choices: ["리렌더링", "리팩터링", "디버깅", "번들링"],
      correctIndex: 0,
      explanation: "상태·props 변경 시 React는 가상 DOM을 비교해 필요한 부분만 DOM을 갱신(리렌더)합니다.",
    },
    {
      content:
        "localStorage와 sessionStorage는 브라우저에 키-값 데이터를 저장합니다.\n탭을 닫으면 데이터가 사라지는 저장소는?",
      choices: ["localStorage", "sessionStorage", "IndexedDB만", "쿠키는 항상 즉시 삭제"],
      correctIndex: 1,
      explanation: "sessionStorage는 같은 탭·세션 동안만 유지되고, localStorage는 명시적 삭제 전까지 남습니다.",
    },
    {
      content:
        "접근성(a11y)을 위해 이미지에 대체 텍스트를 제공할 때 img 요소의 어떤 속성을 쓰나요?",
      choices: ["src", "alt", "role", "href"],
      correctIndex: 1,
      explanation: "alt는 스크린 리더 등 보조 기술이 이미지 내용을 전달할 때 사용합니다.",
    },
    {
      content:
        "Flexbox 레이아웃에서 주축(main axis) 방향을 가로·세로로 정하는 CSS 속성은?",
      choices: ["flex-direction", "flex-wrap", "align-content", "order"],
      correctIndex: 0,
      explanation: "flex-direction: row | column 등으로 주축 방향이 정해지고 정렬 속성의 기준이 됩니다.",
    },
    {
      content:
        "CORS는 다른 출처(origin)의 리소스를 브라우저가 제한하는 정책입니다.\n서버가 특정 출처의 요청을 허용한다고 알릴 때 주로 응답 헤더에 넣는 것은?",
      choices: [
        "Access-Control-Allow-Origin",
        "Content-Type-Only",
        "Cache-Control-Disable",
        "X-Frame-Options-None",
      ],
      correctIndex: 0,
      explanation: "Access-Control-Allow-Origin 등 CORS 관련 헤더로 허용 출처·메서드를 서버가 명시합니다.",
    },
  ],
});
