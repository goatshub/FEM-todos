import { HeaderType } from "@/type/Type";
import Image from "next/image";

const Header = ({ darkmode, setDarkmode }: HeaderType) => {
  const toggleDark = () => {
    setDarkmode((prev) => {
      let theme = !prev ? "dark" : "light";
      localStorage.setItem("theme", theme);
      return !prev;
    });
  };
  return (
    <div className="flex justify-between items-center pb-4 sm:pb-2">
      <h1
        className="text-white text-2xl font-bold tracking-[0.3em]
          sm:text-4xl sm:tracking-[0.5em] 
    "
      >
        TODO
      </h1>
      <button>
        {darkmode ? (
          <Image
            src="/images/icon-sun.svg"
            width={25}
            height={25}
            onClick={toggleDark}
            alt="switch to light mode"
          />
        ) : (
          <Image
            src="/images/icon-moon.svg"
            width={25}
            height={25}
            onClick={toggleDark}
            alt="switch to dark mode"
          />
        )}
      </button>
    </div>
  );
};
export default Header;
