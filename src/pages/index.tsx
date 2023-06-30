import { Josefin_Sans } from "next/font/google";
import MainSection from "@/components/mainSection";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import { auth } from "@/config/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

const josefin = Josefin_Sans({ subsets: ["latin"] });

export default function Home() {
  const [darkmode, setDarkmode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkmode(true);
  }, []);

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      console.log("no user, sign in anon mode.");
      signInAnonymously(auth)
        .then(() => console.log("Anonymous signed in"))
        .catch((error) => alert(error.message));
    }
  });

  return (
    <main
      className={`${darkmode && "dark"} 
        flex min-h-screen flex-col items-center
        ${josefin.className} 
      `}
    >
      <div
        className={`
        bg-cover w-screen h-[13rem] sm:h-[16.5rem]
        bg-[url('/images/bg-mobile-light.jpg')]
        sm:bg-[url('/images/bg-desktop-light.jpg')]
        dark:bg-[url('/images/bg-mobile-dark.jpg')] 
        dark:sm:bg-[url('/images/bg-desktop-dark.jpg')]
        headerDarkBackground
      `}
      ></div>

      <section className="absolute w-full sm:max-w-[38rem] sm:mx-auto px-8 pt-[2.5rem] pb-5 sm:pt-[5rem] grid grid-cols-1 gap-5">
        <Header darkmode={darkmode} setDarkmode={setDarkmode} />
        <MainSection />
        <p className="text-center mt-[4.5rem] sm:mt-2 text-sm text-gray-500 opacity-90">
          Drag and drop to reorder list
        </p>
      </section>
    </main>
  );
}
