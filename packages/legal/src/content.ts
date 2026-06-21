export type LegalPageProps = {
  serviceName: string;
  contactEmail: string;
  effectiveDate: string;
};

export const getPrivacyPolicySections = ({
  serviceName,
  contactEmail,
  effectiveDate,
}: LegalPageProps) => [
  {
    title: "1. 수집하는 개인정보",
    body: `${serviceName}은(는) 서비스 제공을 위해 최소한의 정보만 수집합니다.`,
  },
  {
    title: "2. 개인정보의 이용 목적",
    body: "서비스 제공, 품질 개선, 문의 대응 목적으로 이용합니다.",
  },
  {
    title: "3. 문의",
    body: `개인정보 관련 문의: ${contactEmail} (시행일: ${effectiveDate})`,
  },
];

export const getTermsSections = ({ serviceName, contactEmail, effectiveDate }: LegalPageProps) => [
  {
    title: "1. 서비스 이용",
    body: `${serviceName} 서비스는 이용자에게 무료로 제공됩니다.`,
  },
  {
    title: "2. 면책",
    body: "서비스는 '있는 그대로' 제공되며, 정확성을 보장하지 않습니다.",
  },
  {
    title: "3. 문의",
    body: `문의: ${contactEmail} (시행일: ${effectiveDate})`,
  },
];
