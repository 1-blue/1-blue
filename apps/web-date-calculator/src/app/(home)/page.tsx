import { FaqJsonLd } from "@/app/_components/FaqJsonLd";
import { HomePage } from "@/app/_components/HomePage";
import { FAQ_ITEMS } from "@/app/_config/site-seo";

const Page = () => {
  return (
    <>
      <FaqJsonLd items={FAQ_ITEMS} />
      <HomePage />
    </>
  );
};

export default Page;
