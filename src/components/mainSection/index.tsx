import dynamic from "next/dynamic";
const MainSection = dynamic(() => import("./mainSection"), {
  ssr: false,
});
export default MainSection;
