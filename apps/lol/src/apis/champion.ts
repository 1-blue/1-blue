/* eslint-disable @typescript-eslint/no-explicit-any */

import { lolInstance } from "#src/apis";
import { LOL_API_ENDPOINT } from "#src/constants";
import type { TChampionTag } from "#src/types";

/** 챔피언, 스킬, 아이템 등의 이미지 관련 정보를 담는 인터페이스 */
export interface ImageInfo {
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
/** 챔피언 스킨 정보를 담는 인터페이스 */
export interface ChampionSkin {
  /** 스킨의 고유 ID */
  id: string;
  /** 스킨의 번호 (0은 기본 스킨) */
  num: number;
  /** 스킨의 이름 (기본 스킨은 "default") */
  name: string;
  /** 크로마 스킨 보유 여부 */
  chromas: boolean;
}
/** 챔피언의 기본 능력치 정보를 담는 인터페이스 */
export interface ChampionInfo {
  /** 공격력 수치 (1-10) */
  attack: number;
  /** 방어력 수치 (1-10) */
  defense: number;
  /** 마법 능력 수치 (1-10) */
  magic: number;
  /** 난이도 수치 (1-10) */
  difficulty: number;
}
/** 챔피언의 상세 스탯 정보를 담는 인터페이스 */
export interface ChampionStats {
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
/** 챔피언 스킬 레벨업 관련 팁 정보를 담는 인터페이스 */
export interface SkillLevelTip {
  /** 레벨업 시 변경되는 속성 라벨 */
  label: string[];
  /** 레벨업 시 변경되는 효과 설명 */
  effect: string[];
}
/** 챔피언 스킬(Q, W, E, R) 정보를 담는 인터페이스 */
export interface ChampionSpell {
  /** 스킬의 고유 ID */
  id: string;
  /** 스킬 이름 */
  name: string;
  /** 스킬의 간략한 설명 */
  description: string;
  /** 스킬의 상세 툴팁 (변수 포함) */
  tooltip: string;
  /** 스킬 레벨업 관련 정보 */
  leveltip: SkillLevelTip;
  /** 스킬의 최대 레벨 */
  maxrank: number;
  /** 각 레벨별 재사용 대기시간 */
  cooldown: number[];
  /** 각 레벨별 재사용 대기시간(문자열) */
  cooldownBurn: string;
  /** 각 레벨별 소모 자원 */
  cost: number[];
  /** 각 레벨별 소모 자원(문자열) */
  costBurn: string;
  /** 추가 데이터 값 */
  datavalues: Record<string, any>;
  /** 스킬 효과 수치 배열 */
  effect: (number[] | null)[];
  /** 스킬 효과 수치 배열(문자열) */
  effectBurn: (string | null)[];
  /** 스킬 변수 정보 */
  vars: any[];
  /** 소모 자원 유형 (마나, 기력 등) */
  costType: string;
  /** 최대 탄약 수 (-1은 무제한) */
  maxammo: string;
  /** 각 레벨별 스킬 사거리 */
  range: number[];
  /** 각 레벨별 스킬 사거리(문자열) */
  rangeBurn: string;
  /** 스킬 이미지 정보 */
  image: ImageInfo;
  /** 스킬 사용 시 표시되는 자원 텍스트 */
  resource: string;
}
/** 챔피언 고유 패시브 스킬 정보를 담는 인터페이스 */
export interface ChampionPassive {
  /** 패시브 스킬 이름 */
  name: string;
  /** 패시브 스킬 설명 */
  description: string;
  /** 패시브 스킬 이미지 정보 */
  image: ImageInfo;
}
/** 챔피언 전체 데이터 정보를 담는 인터페이스 */
export interface ChampionData {
  /** 챔피언의 고유 ID (API 요청에 사용) */
  id: string;
  /** 챔피언의 숫자 키 */
  key: string;
  /** 챔피언의 이름 */
  name: string;
  /** 챔피언의 부제목/타이틀 */
  title: string;
  /** 챔피언의 이미지 정보 */
  image: ImageInfo;
  /** 챔피언의 스킨 목록 */
  skins: ChampionSkin[];
  /** 챔피언의 상세 스토리/배경 */
  lore: string;
  /** 챔피언의 간략한 배경 설명 */
  blurb: string;
  /** 챔피언 사용자를 위한 팁 */
  allytips: string[];
  /** 챔피언 상대를 위한 팁 */
  enemytips: string[];
  /** 챔피언 역할 태그 (Fighter, Mage, Support 등) */
  tags: TChampionTag[];
  /** 챔피언이 사용하는 자원 유형 (마나, 기력 등) */
  partype: string;
  /** 챔피언의 기본 능력치 정보 */
  info: ChampionInfo;
  /** 챔피언의 상세 스탯 정보 */
  stats: ChampionStats;
  /** 챔피언의 기본 스킬(Q, W, E, R) 정보 */
  spells: ChampionSpell[];
  /** 챔피언의 패시브 스킬 정보 */
  passive: ChampionPassive;
  /** 추천 아이템 정보 */
  recommended: any[];
}
/** 챔피언 API 응답 데이터의 전체 구조를 담는 인터페이스 */
export interface IChampionAPIResponse {
  /** API 응답 타입 */
  type: string;
  /** API 응답 포맷 */
  format: string;
  /** 데이터 버전 */
  version: string;
  /** 챔피언 데이터 맵 (챔피언 이름을 키로 사용) */
  data: {
    [championName: string]: ChampionData;
  };
}

export const getChampionByName = async (name: string) => {
  const champion = await lolInstance
    .get<IChampionAPIResponse>(LOL_API_ENDPOINT.championDetail(name))
    .json();

  return champion;
};
