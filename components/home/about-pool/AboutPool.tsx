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
      description: "Aligns with Islamic principles.",
    },
    {
      icon: Icons.HalalIcon,
      title: "Halal Staking",
      description: "No lending or interest.",
    },
    {
      icon: Icons.TransparencyIcon,
      title: "Transparent Operations",
      description: "Clear and honest information.",
    },
    {
      icon: Icons.SecurityIcon,
      title: "Secure & Inclusive",
      description: "Safe platform for everyone.",
    },
    {
      icon: Icons.CommunityIcon,
      title: "Community Empowerment",
      description: "Support ethical financial solutions.",
    },
    {
      icon: Icons.RewardsIcon,
      title: "Reliable Rewards",
      description: "Consistent staking rewards.",
    },
  ];

  const specItems = [
    {
      icon: "/spec-pc.svg",
      description: "AWS EC2",
    },
    {
      icon: "/spec-cpu.svg",
      description: "AMD EPYC 7000 2.5 GHz",
    },
    {
      icon: "/spec-ram.svg",
      description: "12 GB DDR4 RAM",
    },
    {
      icon: "/spec-io.svg",
      description: "I/O 2,780 Mbps",
    },
    {
      icon: "/spec-os.svg",
      description: "Amazon Machine Linux",
    },
    {
      icon: "/spec-firewall.svg",
      description: "Security Groups",
    },
    {
      icon: "/spec-net.svg",
      description: "Fiber 5 GBit/s",
    },
  ];

  return (
    <section id="about" className="about py-36">
      <div className="container mx-auto pl-6 sm:pl-0 pr-6 sm:pr-0">
        <h2 className="section-heading" data-aos="fade-down">
          About our Pool
        </h2>
        <div className="lg:flex mx-auto">
          <div className="flex items-center justify-center w-full lg:w-1/2">
            <Swiper
              modules={[EffectCreative, Pagination, Navigation]}
              effect={"creative"}
              pagination={{
                dynamicBullets: true,
              }}
              navigation={true}
              spaceBetween={50}
              slidesPerView={1}
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
                  rewards. This process does not involve interest or lending in
                  any way.
                  <br />
                  <br />
                  We combine ethical finance with the power of blockchain
                  technology. Our mission is to introduce the benefits of
                  decentralized finance to Muslims and the broader community. At
                  Halal ADA, we prioritize transparency, security, and
                  inclusivity, ensuring that our stakepool aligns with Islamic
                  principles while offering valuable financial opportunities for
                  everyone.
                  <br />
                  <br />
                  Join us in empowering communities through ethical and
                  decentralized financial solutions. Together, we can build a
                  brighter, more equitable future for all.
                </Slide>
              </SwiperSlide>

              <SwiperSlide>
                <Slide title="Why Stake with Halal ADA?">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-center max-w-[900px] mx-auto">
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
                <Slide title="Fees / Pledge">
                  0% + 1K ADA PLEDGE
                  <br />
                  <br />
                  LOW FEES AS WE STRONGLY BELIEVE IN ACCESSIBILITY TO FINANCE
                  FOR EVERYONE
                </Slide>
              </SwiperSlide>

              <SwiperSlide>
                <Slide title="Hardware">
                  We are using a fully cloud-based setup. Normally block
                  producer is running in the cloud AND in case of emergency we
                  can switch to on-premise instance.
                </Slide>
              </SwiperSlide>

              <SwiperSlide>
                <Slide title="Operators">
                  WELCOME TO HALAL ADA (HLAL1) STAKE POOL. WE ARE PROFESSIONAL
                  STAKE POOL OPERATORS. WE HAVE BEEN RUNNING LINUX SERVERS (BARE
                  METAL, CLOUD) FOR OVER 15 YEARS NOW.
                </Slide>
              </SwiperSlide>

              <SwiperSlide>
                <Slide title="Involvement">
                  WE STRONGLY BELIEVE THAT FINANCE SHOULD BE AVAILABLE FOR
                  EVERYONE NOT JUST PRIVILIGED ONES. THERE IS ABOUT 3 BLN PEOPLE
                  THAT ARE CURRENTLY UNBANKED, CARDANO AIMS TO CHANGE THIS AND
                  WE WILL SUPPORT IT VIA RUNNING LOW FEES STAKING POOL.
                </Slide>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};
