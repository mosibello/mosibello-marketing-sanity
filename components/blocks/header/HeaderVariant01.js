"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/modules/Button";
import { organization } from "@/lib/constants";
import { stegaClean } from "@sanity/client/stega";

const updateActiveStatusByKey = (data, uid) => {
  let itemFoundAtLevel = false;

  const updatedData = data.map((item) => {
    if (item.uid === uid) {
      itemFoundAtLevel = true;
      return { ...item, active: item.active ? false : true };
    }
    return item;
  });

  return updatedData.map((item) => {
    if (window.innerWidth >= 992) {
      if (itemFoundAtLevel && item.uid !== uid) {
        return { ...item, active: false };
      }
    }

    if (item.links && item.links.length > 0) {
      return { ...item, links: updateActiveStatusByKey(item.links, uid) };
    }
    return item;
  });
};

const getActiveStatusByKey = (data, uid) => {
  for (let item of data) {
    if (item.uid === uid) {
      return item.active !== undefined ? item.active : null;
    }
    if (item.links && item.links.length > 0) {
      const result = getActiveStatusByKey(item.links, uid);
      if (result !== null) {
        return result;
      }
    }
  }
  return null;
};

const MenuLink = ({
  depth,
  hasChildren,
  elem,
  isMobile,
  pathname,
  handleNavigationState,
  navigationState,
}) => {
  if (!elem) return null;

  const isActive = getActiveStatusByKey(navigationState, elem.uid);

  return (
    <li
      className={`b__header__header01__menu-item b__header__header01__menu-item-depth-${depth} ${hasChildren ? `b__header__header01__menu-item--has-children` : ``} ${isActive ? `b__header__header01__menu-item--active` : ``}`}
      key={elem._key}
      role="none"
    >
      <div className="b__header__header01__menu-item__text">
        <Link href={stegaClean(elem.destination)}>{elem.title}</Link>
        {hasChildren && (
          <button
            type="button"
            aria-label="Expand submenu"
            className="m-0 d-flex justify-content-center align-items-center b__header__header01__menu-item__icon u__cursor-pointer"
            onClick={
              hasChildren
                ? () => {
                    handleNavigationState(elem.uid);
                  }
                : null
            }
          >
            <span className="visually-hidden">Expand submenu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              style={{ width: "18px", height: "18px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        )}
      </div>

      {elem.links && elem.links.length > 0 && (
        <ul role="menu">
          {elem.links.map((childElem) => (
            <MenuLink
              key={childElem._key}
              depth={depth + 1}
              hasChildren={childElem.links && childElem.links.length > 0}
              elem={childElem}
              isMobile={isMobile}
              pathname={pathname}
              handleNavigationState={handleNavigationState}
              navigationState={navigationState}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const HeaderVariant01 = ({ navigationSchema }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navigationState, setNavigationState] = useState(
    navigationSchema?.items
  );
  const [subMenusToggledByTab, setSubMenusToggledByTab] = useState(false);

  const handleNavigationState = (id) => {
    setNavigationState(updateActiveStatusByKey(navigationState, id));
    if (window.innerWidth >= 992) {
      setSubMenusToggledByTab(true);
    }
  };

  const pathname = usePathname();

  const handleResize = () => {
    if (window.innerWidth >= 992) {
      setNavigationState(navigationSchema?.items);
    }
  };

  const handleMouseMove = () => {
    if (subMenusToggledByTab) {
      setNavigationState(navigationSchema?.items);
      setSubMenusToggledByTab(false);
    }
  };

  useEffect(() => {
    setMenuOpen(false);
    setNavigationState(navigationSchema?.items);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [subMenusToggledByTab]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header className="b__header__header01 b__header__header01--sticky">
        <div className="container">
          <Button
            linkClassName="c__button--skip-to-content"
            theme="primary"
            title={`Skip to Content`}
            destination={`#main-content`}
          />
          <div className="b__header__header01__wrapper">
            <Link
              className="u__text-decoration-none u__inherited-anchor"
              href="/"
            >
              <div className="b__header__header01__logo-wrapper u__cursor-pointer">
                <span className="b__header__header01__logo u__font-family-heading u__f-900 u__heading-color--primary u__h3 u__letter-spacing--tight">
                  {organization || ``}
                </span>
              </div>
            </Link>
            <div className="b__header__header01__nav-wrapper b__header__header01__nav-wrapper-large">
              <nav className="b__header__header01__nav">
                <ul role="menu">
                  {navigationSchema?.items?.map((elem) => {
                    let depth = 1;
                    let hasChildren = elem?.links && elem?.links?.length > 0;
                    return (
                      <MenuLink
                        depth={depth}
                        hasChildren={hasChildren}
                        elem={elem}
                        key={elem._key}
                        pathname={pathname}
                        navigationState={navigationState}
                        handleNavigationState={handleNavigationState}
                      />
                    );
                  })}
                </ul>
                <Button title={`Get Started`} destination={``} />
              </nav>
            </div>
            <div className="b__header__header01__hamburger-wrapper">
              <button
                onClick={() => {
                  menuOpen ? setMenuOpen(false) : setMenuOpen(true);
                }}
                type="button"
                role="button"
                aria-label="Hamburger toggler"
                className={`c__hamburger ${
                  menuOpen ? `c__hamburger--active` : ``
                }`}
              >
                <span className="c__hamburger__line c__hamburger__line-top"></span>
                <span className="c__hamburger__line c__hamburger__line-middle"></span>
                <span className="c__hamburger__line c__hamburger__line-bottom"></span>
              </button>
            </div>
            <div
              className={`b__header__header01__nav-wrapper b__header__header01__nav-wrapper-small ${menuOpen ? `b__header__header01__nav-wrapper-small--active` : ``}`}
            >
              <div className={`b__header__header01__navigation-board`}>
                <nav className="b__header__header01__nav">
                  <ul role="menu">
                    {navigationSchema?.items?.map((elem) => {
                      let depth = 1;
                      let hasChildren = elem?.links && elem?.links?.length > 0;
                      return (
                        <MenuLink
                          depth={depth}
                          hasChildren={hasChildren}
                          elem={elem}
                          key={elem._key}
                          isMobile
                          pathname={pathname}
                          navigationState={navigationState}
                          handleNavigationState={handleNavigationState}
                        />
                      );
                    })}
                  </ul>
                  <div className="mt-4 pt-2">
                    <Button
                      className="text-center w-100"
                      title={`Get Started`}
                      destination={``}
                    />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div
        onClick={() => {
          setMenuOpen(false);
        }}
        className={`b__header__header01__navigation-board__tint ${menuOpen ? `b__header__header01__navigation-board__tint--active` : ``}`}
      ></div>
    </>
  );
};

export default HeaderVariant01;
