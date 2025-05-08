"use client";

import { useParams } from "next/navigation";
import useSkin from "../_hooks/useSkin";
import useChampion from "../_hooks/useChampion";
import { Badge } from "@1-blue/ui/components/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@1-blue/ui/components/accordion";
import { AspectRatio } from "@1-blue/ui/components/aspect-ratio";
import Image from "next/image";

const SkinPage: React.FC = () => {
  const params = useParams();
  const { name: skinNameFromParams } = params;

  // 스킨 이름에 공백이 있을 경우, URL에서는 다른 문자로 인코딩되었을 수 있으므로 디코딩합니다.
  // 예를 들어, "Mecha Malphite"는 URL에서 "Mecha%20Malphite"가 됩니다.
  const decodedSkinName = decodeURIComponent(skinNameFromParams as string);

  const { skin, isLoading: isLoadingSkin } = useSkin({
    skinName: decodedSkinName,
  });
  // useChampion 훅은 championName이 undefined일 때 호출되지 않도록 조건부 활성화 (enabled 옵션 사용 가정)
  const { champion, isLoading: isLoadingChampion } = useChampion({
    championName: skin?.champion_name,
  });

  if (isLoadingSkin || (skin?.champion_name && isLoadingChampion)) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (!skin) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <p className="text-xl text-destructive">
          <strong>{decodedSkinName}</strong> 스킨 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  if (!champion && skin?.champion_name) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <p className="text-xl text-destructive">
          챔피언 <strong>{skin.champion_name}</strong> 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  // champion이 아직 로드되지 않았지만 skin.champion_name이 있는 경우 (isLoadingChampion이 true인 경우 위에서 처리됨)
  // 이 경우는 enabled 옵션으로 인해 champion이 아직 null/undefined일 수 있음.
  if (!champion) return null; // 또는 다른 로딩/에러 UI

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Skin Image and Basic Info */}
        <div className="md:col-span-1 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center md:text-left">
            {skin.skin_name}
          </h1>
          {skin.skin_name !== champion.name && (
            <p className="text-lg text-muted-foreground text-center md:text-left">
              {champion.name} - {champion.title}
            </p>
          )}
          <div className="w-full max-w-md mx-auto md:max-w-none">
            <AspectRatio
              ratio={16 / 9}
              className="bg-muted rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src={skin.splash_image_url}
                alt={skin.skin_name}
                fill
                className="object-cover"
                priority // LCP 요소일 가능성이 높으므로 priority 설정
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </AspectRatio>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>스킨 버전: {skin.version}</p>
            <p>챔피언 데이터 버전: {champion.version}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-card p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3 border-b pb-2">
              챔피언 정보
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1 text-primary">소개</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {champion.blurb}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1 text-primary">태그</h3>
              <div className="flex flex-wrap gap-2">
                {champion.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-lore"
            >
              <AccordionItem value="item-lore">
                <AccordionTrigger className="text-lg font-medium text-primary hover:no-underline">
                  배경 이야기
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {champion.lore}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Accordion type="multiple" className="w-full space-y-4">
            <AccordionItem
              value="item-allytips"
              className="bg-card rounded-lg shadow"
            >
              <AccordionTrigger className="text-xl font-semibold px-4 sm:px-6 py-3 hover:no-underline">
                👍 아군 플레이 팁 (Ally Tips)
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-6 pb-4">
                <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                  {champion.allytips.map((tip, index) => (
                    <li key={`ally-${index}`}>{tip}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-enemytips"
              className="bg-card rounded-lg shadow"
            >
              <AccordionTrigger className="text-xl font-semibold px-4 sm:px-6 py-3 hover:no-underline">
                👎 상대 플레이 팁 (Enemy Tips)
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-6 pb-4">
                <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                  {champion.enemytips.map((tip, index) => (
                    <li key={`enemy-${index}`}>{tip}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default SkinPage;
