import { lolInstance } from "#src/apis";
import type { TChampionName, TChampionTag, TVersion } from "#src/types";
import { LOL_API_ENDPOINT } from "#src/constants";

/** 챔피언의 기본 능력치 정보를 담는 인터페이스 */
export interface IChampionInfo {
  /** 공격력 수치 (1-10) */
  attack: number;
  /** 방어력 수치 (1-10) */
  defense: number;
  /** 마법 능력 수치 (1-10) */
  magic: number;
  /** 난이도 수치 (1-10) */
  difficulty: number;
}
/** 이미지 정보를 담는 인터페이스 */
export interface IChampionImage {
  /** 이미지 파일의 전체 이름 */
  full: string;
  /** 이미지가 포함된 스프라이트 시트 이름 */
  sprite: string;
  /** 이미지 그룹 (champion, spell, item 등) */
  group: string;
  /** 스프라이트 시트 내 이미지의 X 좌표 */
  x: number;
  /** 스프라이트 시트 내 이미지의 Y 좌표 */
  y: number;
  /** 이미지의 너비 (픽셀) */
  w: number;
  /** 이미지의 높이 (픽셀) */
  h: number;
}
/** 챔피언의 상세 스탯 정보를 담는 인터페이스 */
export interface IChampionStats {
  /** 기본 체력 */
  hp: number;
  /** 레벨당 체력 증가량 */
  hpperlevel: number;
  /** 기본 마나/기력 */
  mp: number;
  /** 레벨당 마나/기력 증가량 */
  mpperlevel: number;
  /** 이동 속도 */
  movespeed: number;
  /** 기본 방어력 */
  armor: number;
  /** 레벨당 방어력 증가량 */
  armorperlevel: number;
  /** 기본 마법 저항력 */
  spellblock: number;
  /** 레벨당 마법 저항력 증가량 */
  spellblockperlevel: number;
  /** 기본 공격 사거리 */
  attackrange: number;
  /** 기본 체력 재생 */
  hpregen: number;
  /** 레벨당 체력 재생 증가량 */
  hpregenperlevel: number;
  /** 기본 마나/기력 재생 */
  mpregen: number;
  /** 레벨당 마나/기력 재생 증가량 */
  mpregenperlevel: number;
  /** 기본 치명타 확률 */
  crit: number;
  /** 레벨당 치명타 확률 증가량 */
  critperlevel: number;
  /** 기본 공격력 */
  attackdamage: number;
  /** 레벨당 공격력 증가량 */
  attackdamageperlevel: number;
  /** 레벨당 공격 속도 증가율(%) */
  attackspeedperlevel: number;
  /** 기본 공격 속도 */
  attackspeed: number;
}
/** 챔피언 정보를 담는 인터페이스 */
export interface IChampionData {
  /** API 데이터 버전 */
  version: TVersion;
  /** 챔피언의 고유 ID (API 요청에 사용) */
  id: string;
  /** 챔피언의 숫자 키 */
  key: string;
  /** 챔피언의 이름 */
  name: string;
  /** 챔피언의 부제목/타이틀 */
  title: string;
  /** 챔피언의 간략한 배경 설명 */
  blurb: string;
  /** 챔피언의 기본 능력치 정보 */
  info: IChampionInfo;
  /** 챔피언의 이미지 정보 */
  image: IChampionImage;
  /** 챔피언 역할 태그 (Fighter, Mage, Support 등) */
  tags: TChampionTag[];
  /** 챔피언이 사용하는 자원 유형 (마나, 기력 등) */
  partype: string;
  /** 챔피언의 상세 스탯 정보 */
  stats: IChampionStats;
}
/** 모든 챔피언 정보를 가져오는 API 응답 인터페이스 */
export interface IGetAllChampionsAPIResponse {
  /** 데이터 타입 */
  type: "champion";
  /** 응답 포맷 */
  format: "standAloneComplex";
  /** API 데이터 버전 */
  version: TVersion;
  /** 챔피언 데이터 맵 (챔피언 이름을 키로 사용) */
  data: {
    [key in TChampionName]: IChampionData;
  };
}

export const getAllChampions = async () => {
  const champion = await lolInstance
    .get<IGetAllChampionsAPIResponse>(LOL_API_ENDPOINT.allChampions())
    .json();

  return champion;
};
