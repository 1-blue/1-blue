export const SITE_OPERATOR = {
  brandName: "1-blue",
  nickname: "1-blue",
  operatorName: "박상은",
  contactEmail: "developer98.ninja@gmail.com",
  kakaoOpenChatUrl: "https://open.kakao.com/o/gghgEHAi",
  kakaoOpenChatLabel: "1-blue 서비스 문의",
  privacyOfficerTitle: "운영자",
  responseNotice: "평일 기준 순차 답변",
} as const;

export type LegalPageInput = {
  serviceName: string;
  effectiveDate: string;
};

export type LegalPageProps = LegalPageInput & {
  contactEmail: string;
  operatorName: string;
  privacyOfficerTitle: string;
  kakaoOpenChatUrl: string;
  kakaoOpenChatLabel: string;
};

export const getOperatorContactLine = (): string => {
  const { contactEmail, kakaoOpenChatUrl } = SITE_OPERATOR;
  return `이메일: ${contactEmail} / 카카오 오픈채팅: ${kakaoOpenChatUrl}`;
};

export const createLegalPageProps = ({
  serviceName,
  effectiveDate,
}: LegalPageInput): LegalPageProps => ({
  serviceName,
  effectiveDate,
  contactEmail: SITE_OPERATOR.contactEmail,
  operatorName: SITE_OPERATOR.operatorName,
  privacyOfficerTitle: SITE_OPERATOR.privacyOfficerTitle,
  kakaoOpenChatUrl: SITE_OPERATOR.kakaoOpenChatUrl,
  kakaoOpenChatLabel: SITE_OPERATOR.kakaoOpenChatLabel,
});
