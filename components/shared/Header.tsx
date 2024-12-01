import { useEffect, useState } from "react";
import Link from "next/link";
import cx from "classnames";
import {
  GithubButton,
  TwitterButton,
  DiscordButton,
  MediumButton,
} from "./SocialButton";
import {
  SelectWalletModal,
  ConnectWallet,
  useRestoreWallet,
} from "@features/wallet";

export const Header: React.FC = () => {
  const [isSticky, setSticky] = useState(false);

  useRestoreWallet();

  useEffect(() => {
    const listener = () => {
      let value = window.scrollY;

      if (value > 200) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", listener, { passive: true });

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  return (
    <>
      <SelectWalletModal />

      <header className={cx("header", { "sticky-header": isSticky })}>
        <div className="lg:container flex justify-between items-center mx-auto pl-6 lg:pl-0 pr-6 lg:pr-0">
          <nav className="flex justify-between items-center pt-2 pb-2 w-full">
            <Link href="/" passHref>
              <div className="logo-box flex items-center justify-center">
                <img
                  className="rounded-circle mr-8"
                  style={{ maxHeight: 100 }}
                  src="/halalada3.png"
                  alt="Halal ADA Staking Pool - Logo"
                />
              </div>
            </Link>
            <ul className="nav-list hidden lg:flex">
              <li className="nav-link">
                <Link href="/#about" passHref>
                  Our Pool
                </Link>
              </li>

              {/* <li className="nav-link">
                <Link href="/pool-stats" passHref>
                  Pool Stats
                </Link>
              </li> */}

              <li className="nav-link">
                <Link href="/#resources" passHref>
                  Resources
                </Link>
              </li>

              <li className="nav-link">
                <Link href="/#contact" passHref>
                  Contact
                </Link>
              </li>
            </ul>
            <div className="hidden sm:flex lg:mr-0 items-center mr-6">
              <ConnectWallet />
            </div>
          </nav>
          <div className="mobile-nav lg:hidden">
            <div className="nav-hamburger">
              <input type="checkbox" />
              <span />
              <span />
              <span />

              <div className="menu-container">
                <div className="menu-row">
                  <div className="menu-box">
                    <ul className="menu-items">
                      <li className="menu-item">
                        <Link href="/" passHref>
                          Home
                        </Link>
                      </li>
                      <li className="menu-item">
                        <Link href="/#about" passHref>
                          Our Pool
                        </Link>
                      </li>

                      <li className="menu-item">
                        <Link href="/pool-stats" passHref>
                          Pool Stats
                        </Link>
                      </li>

                      <li className="menu-item">
                        <Link href="/#resources" passHref>
                          Resources
                        </Link>
                      </li>

                      <li className="menu-item">
                        <Link href="/#contact" passHref>
                          Contact
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="flex lg:hidden items-center justify-between ml-8 mb-40 w-1/2">
                    <TwitterButton size="md" variant="secondary" />
                    <GithubButton size="md" variant="secondary" />
                    <DiscordButton size="md" variant="secondary" />
                    <MediumButton size="md" variant="secondary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
