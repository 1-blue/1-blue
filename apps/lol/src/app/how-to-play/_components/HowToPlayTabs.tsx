import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@1-blue/ui/components/tabs";
import Link from "next/link";
import routeMap from "#src/libs/routeMap";

const HowToPlayTabs: React.FC = () => {
  return (
    <Tabs defaultValue="basics" className="mb-4">
      <TabsList className="grid grid-cols-4 gap-2 w-full">
        <TabsTrigger value="basics">기본 규칙</TabsTrigger>
        <TabsTrigger value="multiple-choice">객관식</TabsTrigger>
        <TabsTrigger value="short-answer">주관식</TabsTrigger>
        <TabsTrigger value="contact">문의사항</TabsTrigger>
      </TabsList>

      <TabsContent value="basics">
        <div className="space-y-3">
          <motion.div
            className="bg-card/80 border border-border rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              👀 이미지 확인
            </h2>
            <p className="text-card-foreground/80">
              화면에 표시되는 리그 오브 레전드 챔피언 스킨 이미지를 잘
              살펴보세요.
            </p>
          </motion.div>

          <motion.div
            className="bg-card/80 border border-border rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              ⏱️ 제한 시간
            </h2>
            <p className="text-card-foreground/80">
              각 문제는 15초 이내에 맞혀야 합니다. 시간이 초과되면 자동으로 오답
              처리됩니다.
            </p>
          </motion.div>

          <motion.div
            className="bg-card/80 border border-border rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              💯 점수 획득
            </h2>
            <p className="text-card-foreground/80">
              정답을 맞히면 100점을 획득합니다. 총 10문제를 풀어 1000점을 목표로
              도전해보세요!
            </p>
          </motion.div>
        </div>
      </TabsContent>

      <TabsContent value="multiple-choice">
        <div className="space-y-3">
          <motion.div
            className="bg-card/80 border border-border rounded-lg p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              🔢 객관식 퀴즈 방법
            </h2>
            <p className="text-card-foreground/80 mb-3">
              챔피언 스킨 이미지를 보고 5개의 선택지 중에서 정확한 스킨 이름을
              선택하세요.
            </p>
            <ul className="space-y-2 text-card-foreground/80">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>화면에 표시된 스킨 이미지를 확인합니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>5개의 번호 선택지 중 정확한 스킨 이름을 선택합니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>정답이면 초록색, 오답이면 빨간색으로 표시됩니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>다음 버튼을 클릭하여 다음 문제로 넘어갑니다.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </TabsContent>

      <TabsContent value="short-answer">
        <div className="space-y-3">
          <motion.div
            className="bg-card/80 border border-border rounded-lg p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              ✍️ 주관식 퀴즈 방법
            </h2>
            <p className="text-card-foreground/80 mb-3">
              챔피언 스킨 이미지를 보고 스킨 이름을 직접 입력하세요.
            </p>
            <ul className="space-y-2 text-card-foreground/80">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>화면에 표시된 스킨 이미지를 확인합니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>텍스트 입력창에 스킨 이름을 입력합니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>띄어쓰기는 무시되며, 대소문자를 구분하지 않습니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>
                  제출 버튼을 누르거나 엔터키를 눌러 정답을 제출합니다.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">5.</span>
                <span>오답인 경우 정답을 확인할 수 있습니다.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </TabsContent>

      <TabsContent value="contact">
        <motion.div
          className="bg-card/80 border border-border rounded-lg p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">
            💬 문의 및 소통
          </h2>
          <p className="text-card-foreground/80 mb-6">
            퀴즈 관련 문의사항, 버그 제보, 건의사항
            <br />
            또는 자유로운 소통은 언제든지 환영합니다!
            <br />
            아래 오픈 채팅방 링크를 통해 참여해주세요.
          </p>
          <Link
            href={routeMap.openKakao.index}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            오픈 채팅방 바로가기
          </Link>
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};

export default HowToPlayTabs;
