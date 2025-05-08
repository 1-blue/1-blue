const routeMap = {
  home: {
    index: "/",
  },
  howToPlay: {
    index: "/how-to-play",
  },
  rankings: {
    index: "/rankings",
  },
  champions: {
    skins: {
      index: "/skins",
      detail: (name: string) => `/champions/${name}/skins`,
    },
  },

  game: {
    index: "/game",
    result: {
      index: "/game/result",
    },
  },

  privacy: {
    index: "#",
  },
  openKakao: {
    index: "https://open.kakao.com/o/grPNDavh",
  },
};

export default routeMap;
