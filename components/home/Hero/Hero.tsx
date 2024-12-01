import { useEffect, useRef } from "react";
import { DelegateButton } from "@features/wallet";

export const Hero: React.FC = () => {
  return (
    <section className="hero flex items-center">
      <div className="container mx-auto relative">
        <div className="flex flex-col items-center justify-center w-full">
          <h1
            className="heading-hero text-center mb-12"
            data-aos="fade-right"
            data-aos-anchor-placement="top"
          >
            Ethical Staking, Educating and Empowering Communities on Cardano
          </h1>
          <div className="flex justify-center">
            <DelegateButton
              data-aos="fade-up"
              data-aos-anchor-placement="top"
              data-aos-delay={350}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
