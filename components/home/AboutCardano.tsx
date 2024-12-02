export const AboutCardano: React.FC = () => {
  return (
    <section id="cardano" className="features py-36 mx-auto">
      <div className="container mx-auto pl-6 sm:pl-0 pr-6 sm:pr-0">
        <h2 className="section-heading mb-10" data-aos="fade-down">
          About Cardano
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            image="/aboutcardano-crypto.svg"
            title="Cryptocurrency"
            data-aos="fade-right"
          >
            Cardano is a next-generation blockchain platform powered by its
            native cryptocurrency, ADA (₳). It enables secure and scalable
            decentralized transactions, offering an eco-friendly solution for
            global financial systems.
          </Card>

          <Card
            title="Earn"
            image="/aboutcardano-earn.svg"
            data-aos="fade-right"
            data-aos-delay={200}
          >
            By staking your ADA, you contribute to Cardano’s decentralized
            ecosystem while earning consistent rewards. Secure your funds and
            let them work for you through ethical and transparent staking.
          </Card>

          <Card
            title="Control"
            image="/aboutcardano-control.svg"
            data-aos="fade-right"
            data-aos-delay={400}
          >
            Cardano ensures that you maintain full custody of your ADA. Stake
            with freedom—you’re always in control, with the flexibility to
            spend, transfer, or switch pools anytime.
          </Card>

          <Card
            title="Governance"
            image="/aboutcardano-gov.svg"
            data-aos="fade-right"
            data-aos-delay={600}
          >
            Cardano empowers its community to participate in governance. Holders
            of ADA can vote on proposals and influence the evolution of the
            blockchain, shaping a fairer, decentralized future.
          </Card>

          <Card
            title="Sustainability"
            image="/aboutcardano-sustainability.svg"
            data-aos="fade-right"
            data-aos-delay={800}
          >
            Cardano stands out as a green blockchain. Utilizing a proof-of-stake
            mechanism, it minimizes energy consumption while delivering
            unparalleled security and efficiency.
          </Card>

          <Card
            title="Interoperability"
            image="/aboutcardano-interop.svg"
            data-aos="fade-right"
            data-aos-delay={1000}
          >
            Cardano aims to bridge blockchains, creating a seamless ecosystem
            for diverse cryptocurrencies and decentralized applications to
            thrive together.
          </Card>
        </div>
      </div>
    </section>
  );
};

// @ts-ignore
const Card = ({ image, title, children, ...rest }) => {
  return (
    <div
      className="bg-main text-dark p-10 shadow-md rounded-md relative w-full"
      {...rest}
    >
      <img className="mb-4 w-1/6 max-w-[100px]" src={image} alt="icon" />

      <h3 className="text-3xl mb-4">{title}</h3>
      <p>{children}</p>
    </div>
  );
};
