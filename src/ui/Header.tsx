import { ReactNode, useEffect, useRef, useState } from "react";

import { NavLink, useLocation } from "react-router";
import { motion, animate } from "motion/react";
import { MdHomeFilled } from "react-icons/md";
import { IoHome, IoDesktop } from "react-icons/io5";
import { BsGlobeCentralSouthAsia } from "react-icons/bs";

import styles from "./Header.module.css";

// mobile constants

export default function Header() {
  const MB_DURATION = 0.7;

  const desktopNavBoardRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useLocation();
  const ogPoint = {
    x: 0,
    y: 0,
  };
  //
  const [isMobileToggleNav, setIsMobileToggleNav] = useState(false);
  //
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const [desktopNavBoardPos, setDesktopNavBoardPos] = useState(ogPoint);

  const NAV_LINKS: { text: string; link: string; element: ReactNode }[] = [
    {
      text: "home",
      link: "/",
      element: <IoHome aria-description="Home Page" />,
    },
    // { TODO: add section later
    //   text: "about",
    //   link: "/about",
    //   element: <BsFillQuestionSquareFill aria-description="About Page" />,
    // },
    {
      text: "web sites",
      link: "/websites",
      element: <BsGlobeCentralSouthAsia aria-description="Web Sites Page" />,
    },
    {
      text: "Applications",
      link: "/apps",
      element: <IoDesktop aria-description="Apps Page" />,
    },
  ];

  const handleToggleMobileNav = () => setIsMobileToggleNav((prev) => !prev);

  // desktop effects
  const setPos = () => {
    const activeLink = document.querySelector(`[data-active="true"]`);
    if (activeLink) {
      const { top, left } = activeLink.getBoundingClientRect();

      setDesktopNavBoardPos({ x: left, y: top });
    }
  };

  useEffect(() => {
    setPos();
  }, [pathname]);

  useEffect(() => {
    const checkSize = () => {
      if (window.innerWidth < 1024 || !desktopNavRef.current) {
        animate(`.${styles.desktopNavContainer}`, {
          display: "none",
        });
      }
    };
    // FIX: buggy on track pad
    const wheelHandler = (event: WheelEvent) => {
      // Check the deltaY property of the wheel event to determine the direction
      checkSize();
      if (window.innerWidth < 1024 || !desktopNavRef.current) return;

      if (event.deltaY > 0) {
        animate(`.${styles.desktopNavContainer}`, {
          display: "none",
          scale: 0,
        });
      } else if (event.deltaY < 0) {
        animate(`.${styles.desktopNavContainer}`, {
          display: "flex",
          scale: 1,
        });
      }
    };

    const interval = setInterval(() => checkSize(), 500);

    // Add wheel event listener
    window.addEventListener("wheel", wheelHandler);

    // Cleanup the event listener
    return () => {
      clearInterval(interval);
      window.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  return (
    <header className={styles.header}>
      {/* desktop nav */}
      <motion.nav
        className={styles.desktopNavContainer}
        ref={desktopNavRef}
        data-name="desktop-nav"
      >
        <ul>
          {NAV_LINKS.map((link, index) => (
            <motion.li className={styles.desktopNavLink} key={index}>
              <NavLink to={link.link} data-active={pathname == link.link}>
                {link.element}
              </NavLink>
            </motion.li>
          ))}
        </ul>
        <motion.div
          className={styles.desktopNavBoard}
          ref={desktopNavBoardRef}
          initial={{
            scale: 0,
            left: ogPoint.x,
            top: ogPoint.y,
          }}
          animate={{
            scale: desktopNavBoardPos.x > 0 ? [0, 0, 0, 1] : 0,
            left: `${desktopNavBoardPos.x - 5}px`,
            top: `${desktopNavBoardPos.y - 2.5}px`,
          }}
        ></motion.div>
      </motion.nav>

      {/* mobile nav bar */}
      <motion.div
        className={styles.mobileNavContainer}
        data-name="mobile-nav"
        animate={{
          width: isMobileToggleNav ? "calc(100vw - 24px)" : "45px",
        }}
      >
        <motion.nav
          className={styles.mobileNav}
          animate={{
            display: isMobileToggleNav ? "flex" : "hidden",
            width: isMobileToggleNav ? "90%" : "45px",
            borderRadius: "15px",
            backgroundColor: "var(--ac-one)",
            transition: { duration: MB_DURATION },
          }}
        >
          <motion.ul>
            {NAV_LINKS.map((link, index) => (
              <motion.li
                animate={{
                  scale: isMobileToggleNav ? [1.2, 0.8, 1] : 0,
                  transition: {
                    duration: MB_DURATION,
                    delay: (index / 100) * 10,
                  },
                }}
                key={index}
              >
                <NavLink className={styles.mobileNavLink} to={link.link}>
                  {link.element}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>
        </motion.nav>
        {/* App Button */}
        <motion.button
          onClick={handleToggleMobileNav}
          className={styles.appBarBtn}
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{
              rotate: isMobileToggleNav ? -360 : 0,
              transition: { duration: MB_DURATION },
              borderLeft: " 1px solid var(--bg-one)",
              backgroundColor: isMobileToggleNav
                ? "var(--ac-one)"
                : "var(--ac-two)",
            }}
          >
            <MdHomeFilled />
          </motion.div>
        </motion.button>
      </motion.div>
    </header>
  );
}
