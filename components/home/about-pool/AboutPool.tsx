import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Pagination, Navigation } from "swiper/modules";

import { Slide } from "./Slide";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import * as Icons from "../../../public";

export const AboutPool: React.FC = () => {
  const whyItems = [
    {
      icon: Icons.EthicalIcon,
      title: "Ethical Investing",
      description: "Aligns with Islamic principles",
    },
    {
      icon: Icons.HalalIcon,
      title: "Halal Staking",
      description: "No lending or interest",
    },
    {
      icon: Icons.TransparencyIcon,
      title: "Transparent Operations",
      description: "Clear and honest information",
    },
    {
      icon: Icons.SecurityIcon,
      title: "Secure & Inclusive",
      description: "Safe platform for everyone",
    },
    {
      icon: Icons.CommunityIcon,
      title: "Community Empowerment",
      description: "Support ethical financial solutions",
    },
    {
      icon: Icons.ProfessionalsIcon,
      title: "Professional Operators",
      description: "Career Cloud Engineers",
    },
    {
      icon: Icons.RewardsIcon,
      title: "Reliable Rewards",
      description: "Consistent staking rewards",
    },
    {
      icon: Icons.FeesIcon,
      title: "Lowest Fees",
      description: "170 ADA + 0% Variable Fee",
    },
  ];

  const specItems = [
    {
      icon: Icons.SpecCpuIcon,
      description: "AMD EPYC 7000 2.5 GHz",
    },
    {
      icon: Icons.SpecRamIcon,
      description: "12 GB DDR4 RAM",
    },
    {
      icon: Icons.SpecIoIcon,
      description: "I/O 2,780 Mbps",
    },
    {
      icon: Icons.SpecOsIcon,
      description: "Amazon Machine Linux",
    },
    {
      icon: Icons.SpecFirewallIcon,
      description: "Security Groups",
    },
    {
      icon: Icons.SpecNetIcon,
      description: "Fiber 5 GBit/s",
    },
  ];

  return (
    <section id="about" className="about py-36">
      <div className="container mx-auto px-6">
        <h2 className="section-heading" data-aos="fade-down">
          About our Pool
        </h2>
        <div className="flex justify-center">
          <div className="w-full max-w-[1200px]">
            <div className="lg:flex justify-center mx-auto">
              <div className="flex items-center justify-center w-full lg:w-4/5">
                <Swiper
                  modules={[EffectCreative, Pagination, Navigation]}
                  effect={"creative"}
                  pagination={{
                    dynamicBullets: true,
                  }}
                  navigation={true}
                  spaceBetween={50}
                  slidesPerView={1}
                  loop={true}
                  creativeEffect={{
                    prev: {
                      shadow: true,
                      translate: [0, 0, -400],
                    },
                    next: {
                      translate: ["100%", 0, 0],
                    },
                  }}
                >
                  <SwiperSlide>
                    <Slide title="What is Halal ADA?">
                      ADA staking is the process of participating in the Cardano
                      network by delegating your ADA tokens to a stake pool. By
                      doing so, you help secure the network and, in return, earn
                      rewards. This process does not involve interest or lending
                      in any way.
                      <br />
                      <br />
                      We combine ethical finance with the power of blockchain
                      technology. Our mission is to introduce the benefits of
                      decentralized finance to Muslims and the broader
                      community. At Halal ADA, we prioritize transparency,
                      security, and inclusivity, ensuring that our stake pool
                      aligns with Islamic principles while offering valuable
                      financial opportunities for everyone.
                      <br />
                      <br />
                      Join us in empowering communities through ethical and
                      decentralized financial solutions. Together, we can build
                      a brighter, more equitable future for all.
                    </Slide>
                  </SwiperSlide>

                  <SwiperSlide>
                    <Slide title="Why Stake with Halal ADA?">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 text-center max-w-[900px] mx-auto">
                        {whyItems.map((item) => (
                          <div
                            className="flex flex-col items-center p-5"
                            key={item.title}
                          >
                            <item.icon className="w-[50px] h-[50px] mb-[10px] text-white" />
                            <p className="font-bold mt-[10px] mb-[5px] text-white">
                              {item.title}
                            </p>
                            <span className="text-gray-300">
                              {item.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Slide>
                  </SwiperSlide>

                  <SwiperSlide>
                    <Slide title="Our Setup">
                      <div className="flex items-center justify-center h-[350px] relative">
                        {" "}
                        {/* Reduced height */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-center max-w-[900px]">
                          {" "}
                          {/* Slight adjustment */}
                          {specItems.map((item) => (
                            <div
                              className="flex flex-col items-center justify-center p-5 h-[120px]"
                              key={item.description}
                            >
                              <item.icon className="w-[50px] h-[50px] text-white mb-2" />
                              <span className="text-gray-300">
                                {item.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Slide>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
