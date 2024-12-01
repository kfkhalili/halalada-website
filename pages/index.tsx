import type { NextPage } from "next";
import Head from "next/head";

import { Header } from "../components/shared/Header";
import { Footer } from "../components/shared/Footer";
import { Hero } from "../components/home/Hero/Hero";
import { AboutPool } from "../components/home/about-pool/AboutPool";
import { AboutCardano } from "../components/home/AboutCardano";
import { Resources } from "../components/home/Resources";
//import Home from "./style-guide";

import { useAOS } from "../hooks/useAOS";

const Home: NextPage = () => {
  useAOS();

  return (
    <div>
      <Head>
        <title>Halal ADA - HLAL1</title>
      </Head>

      <Header />

      <main>
        <Hero />

        <AboutPool />

        <Resources />

        <AboutCardano />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
