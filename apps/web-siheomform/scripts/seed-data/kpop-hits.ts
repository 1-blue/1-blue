import { defineSeedCbt } from "./build";

export const kpopHits = defineSeedCbt({
  title: "K-팝 히트곡 & 아티스트 퀴즈",
  description: "2010년대 이후 국내외에서 사랑받은 K-팝 곡과 아티스트 상식을 묻습니다.",
  publicId: "kpop-hits",
  adminToken: "admin-kpop-hits",
  questions: [
    {
      content:
        "2020년 빌보드 Hot 100 1위를 기록하며 K-팝 역사에 남은 곡이 있습니다.\n그 곡의 제목은?",
      choices: ["Dynamite", "Gangnam Style", "Love Scenario", "Spring Day"],
      correctIndex: 0,
      explanation: "BTS의 Dynamite(2020)는 K-팝 최초로 빌보드 Hot 100 1위를 달성했습니다.",
    },
    {
      content: "2012년 유튜브 조회수가 전 세계적으로 폭발하며 K-팝 붐의 상징이 된 싸이의 곡은?",
      choices: ["Gangnam Style", "Butter", "Ddu-du Ddu-du", "Cheer Up"],
      correctIndex: 0,
      explanation: "Gangnam Style은 글로벌 바이럴의 대표 사례로 K-팝 인지도 확대에 기여했습니다.",
    },
    {
      content:
        "걸그룹 BLACKPINK의 소속사는 YG엔터테인먼트입니다.\n다음 중 BLACKPINK 멤버가 아닌 사람은?",
      choices: ["지수", "제니", "로제", "윈터"],
      correctIndex: 3,
      explanation: "BLACKPINK는 지수·제니·로제·리사 4인조이며, 윈터는 aespa 멤버입니다.",
    },
    {
      content: "아이돌 그룹 BTS의 소속사는 하이브(구 빅히트)입니다.\nBTS의 팬덤 이름은?",
      choices: ["BLINK", "ARMY", "ONCE", "MOA"],
      correctIndex: 1,
      explanation: "BTS 공식 팬클럽명은 ARMY입니다. BLINK는 BLACKPINK, ONCE는 TWICE 팬덤입니다.",
    },
    {
      content: "2016년 데뷔 후 'TT', 'Cheer Up' 등으로 대중성을 입증한 9인조 걸그룹은?",
      choices: ["TWICE", "Red Velvet", "(G)I-DLE", "ITZY"],
      correctIndex: 0,
      explanation:
        "TWICE는 JYP 소속으로 데뷔곡부터 연속 히트를 내며 K-팝 대표 걸그룹이 되었습니다.",
    },
    {
      content:
        "보이그룹 SEVENTEEN은 멤버가 직접 프로듀싱에 참여하는 것으로도 알려져 있습니다.\nSEVENTEEN의 멤버 수는?",
      choices: ["7명", "9명", "13명", "17명"],
      correctIndex: 2,
      explanation: "SEVENTEEN은 이름과 달리 13명 체제이며, 퍼포먼스·보컬·힙합 팀으로 나뉩니다.",
    },
    {
      content: "2022년 코첼라 메인 스테이지에 K-팝 걸그룹으로 첫 출연한 그룹은?",
      choices: ["BLACKPINK", "NewJeans", "IVE", "LE SSERAFIM"],
      correctIndex: 0,
      explanation: "BLACKPINK는 2022년 코첼라 헤드라이너급 출연으로 화제가 되었습니다.",
    },
    {
      content:
        "아이유(IU)는 가수이자 배우로도 활동합니다.\n데뷔 초 대표곡으로 알려진 '좋은 날'에서 유명한 부분은?",
      choices: ["3단 고음 구간", "랩 8마디", "피아노만 반주", "영어 가사 전곡"],
      correctIndex: 0,
      explanation:
        "'좋은 날'은 후렴의 3단 고음으로 큰 화제를 모으며 아이유의 대표 히트가 되었습니다.",
    },
    {
      content:
        "걸그룹 NewJeans는 2022년 데뷔 직후 'Hype Boy', 'Ditto' 등으로 인기를 얻었습니다.\nNewJeans의 소속 레이블은?",
      choices: ["ADOR", "SM Entertainment", "Starship", "CUBE"],
      correctIndex: 0,
      explanation: "NewJeans는 하이브 레이블 ADOR 소속으로 데뷔했습니다.",
    },
    {
      content: "K-팝 앨범 판매·차트에서 '컴백'이란 무엇을 의미하나요?",
      choices: [
        "그룹 해체 후 재결합",
        "새 앨범·활동으로 가요계에 복귀",
        "해외 투어 종료",
        "멤버 솔로 전환만",
      ],
      correctIndex: 1,
      explanation: "컴백은 일정 기간 활동을 쉬었다가 새 음원·무대로 돌아오는 것을 말합니다.",
    },
  ],
});
