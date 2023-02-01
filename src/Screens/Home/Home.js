import React from 'react';
import { useNavigate } from 'react-router-dom';
import games from '../../utils/games';
import styles from './Home.module.css';
import { motion, AnimatePresence, m } from 'framer-motion';
import NavBar from '../../Components/NavBar/NavBar';
import { ReactComponent as GitHubLogo } from '../../Resources/image/githublogo.svg';
import { ReactComponent as Enter } from '../../Resources/image/enter.svg';
import { ReactComponent as Dice } from '../../Resources/image/dice.svg';
import { ReactComponent as LinkedIn } from '../../Resources/image/linkedin.svg';
import { ReactComponent as Game } from '../../Resources/image/game.svg';
import { ReactComponent as NotFound } from '../../Resources/image/notfound.svg';
import { ReactComponent as NotFoundQuery } from '../../Resources/image/notfoundquery.svg';
import { ReactComponent as Git } from '../../Resources/image/git.svg';
import { ReactComponent as Performance } from '../../Resources/image/performance.svg';
import { ReactComponent as Sources } from '../../Resources/image/sources.svg';
import { ReactComponent as Facebook } from '../../Resources/image/fb.svg';
import Cart from '../../Components/Cart/Cart';

const Home = (props) => {
  const {
    cartAmount,
    cart,
    cartDisplayed,
    handleOpenCart,
    handleCloseCart,
    clearCart,
    handleRemoveFromCart,
    hoverState,
    setHoverState,
    overlap,
    setOverlap,
    openGamePage,
  } = props;

  const [browsing, setBrowsing] = React.useState(false);
  const [landingPage, setLandingPage] = React.useState(true);

  const navigate = useNavigate();

  const handleHover = (e) => {
    let newHoverState = hoverState[e.target.id];
    newHoverState.hovered = !newHoverState.hovered;

    setHoverState([...hoverState, (hoverState[e.target.id] = newHoverState)]);
  };

  const handleHome = () => {
    setBrowsing(false);
    navigate('/');
  };

  const handleBrowse = () => {
    setOverlap(true);
    setTimeout(() => {
      setBrowsing(true);
      navigate('/browse');
    }, 1500);
  };

  const handlePlayDice = () => {
    let randomIndex = Math.floor(Math.random() * 32);
    let randomSurname = games[randomIndex].surname;
    setOverlap(true);
    setTimeout(() => {
      setBrowsing(true);
      navigate(`/games/${randomSurname}`);
    }, 1500);
  };

  const handleNavGamePage = () => {
    setHoverState([...hoverState, (hoverState[21].hovered = false)]);
    navigate('/games/riseofthetombraider');
  };

  const handleNavNotFoundPage = () => {
    navigate('/page-not-page');
  };

  const handleNavNotFoundQuery = () => {
    navigate('/games/404');
  };

  const variants = {
    hidden: { opacity: 1, x: -150 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 150 },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 900 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { y: { type: 'tween', duration: 1.5, bounce: 0.3 } },
    },
  };

  return (
    <div className={styles.main}>
      {overlap ? (
        <motion.div
          className={styles.overlap}
          variants={buttonVariants}
          initial='hidden'
          animate='visible'
        ></motion.div>
      ) : null}

      {cartDisplayed ? (
        <Cart
          handleOpenCart={handleOpenCart}
          cartDisplayed={cartDisplayed}
          handleCloseCart={handleCloseCart}
          cart={cart}
          cartAmount={cartAmount}
          handleHover={handleHover}
          hoverState={hoverState}
          clearCart={clearCart}
          handleRemoveFromCart={handleRemoveFromCart}
          openGamePage={openGamePage}
        />
      ) : null}
      <div className={styles.home}>
        <video autoPlay muted loop className={styles.video}>
          <source
            src={require('../../Resources/image/theme2.mp4')}
            type='video/mp4'
          />
        </video>
        <div className={styles.filter} />

        <NavBar
          handleHover={handleHover}
          hoverState={hoverState}
          browsing={browsing}
          handleBrowse={handleBrowse}
          handleHome={handleHome}
          landingPage={landingPage}
          cartAmount={cartAmount}
          handleOpenCart={handleOpenCart}
          handleCloseCart={handleCloseCart}
        />
        <div className={styles.container}>
          <div className={styles.left}>
            <div className={styles.splash}>
              <h1>Game Center</h1>
              <p className={styles.intro}>
                The best destination to buy new games to competitive prices. 24
                hour support, "best price" guarantee and a flawless UX. Wish for
                more? Tell us <span className={styles.here}>below</span> — or
                check out our <span className={styles.careers}>careers.</span>
              </p>

              <p className={styles.intro}>
                Games are sometimes played purely for enjoyment, sometimes for
                achievement or reward as well. They can be played alone, in
                teams, or online; by amateurs or by professionals. The players
                may have an audience of non-players, such as when people are
                entertained by watching a chess{' '}
                <span className={styles.careers}>championship</span>.
              </p>
            </div>
            <div className={styles.buttons}>
              <button
                className={`${styles.cta} ${styles.browseBtn}`}
                onClick={handleBrowse}
                aria-label='Browse'
              >
                <Enter className={styles.ctaSVG} />
                Browse
              </button>
              <button
                className={styles.cta}
                onClick={handlePlayDice}
                aria-label='Open random game page'
              >
                <Dice className={styles.ctaSVG} />
                Play Dice
              </button>
              <a href='https://github.com/byocao/game-store' target='_blank'>
                <button className={styles.cta} aria-label='View Repository'>
                  <GitHubLogo className={styles.ctaSVG} />
                  GitHub
                </button>
              </a>
              <a href='https://www.facebook.com/byo.cao/' target='_blank'>
                <button
                  className={`${styles.cta} ${styles.lastChild}`}
                  aria-label='Open Facebook'
                >
                  <Facebook className={`${styles.ctaSVG} ${styles.linkedin}`} />
                  <span>Facebook</span>
                </button>
              </a>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.buttonsRight}>
              <h2>Quick Menu</h2>
              <button
                className={styles.cta}
                onClick={handleNavGamePage}
                aria-label='Open a game page'
              >
                <Game className={styles.ctaSVG} />
                Game Sale
              </button>
              <button
                className={styles.cta}
                onClick={handleNavNotFoundPage}
                aria-label='Open 404 page'
              >
                <NotFound className={styles.ctaSVG} />
                Game Hot
              </button>
              <button
                className={`${styles.cta} ${styles.lastChild}`}
                onClick={handleNavNotFoundQuery}
                aria-label='open 404 query page'
              >
                <NotFoundQuery className={`${styles.ctaSVG}`} />
                Top Seller
              </button>
              <a href='' target='_blank'>
                <button className={styles.cta} aria-label='Open commit log'>
                  <Git className={styles.ctaSVG} />
                  New & Noteworthy
                </button>
              </a>
              <a href='' target='_blank'>
                <button
                  className={`${styles.cta} ${styles.lastChild}`}
                  aria-label='Open performance test results'
                >
                  <Performance className={`${styles.ctaSVG}`} />
                  Free Games
                </button>
              </a>
              <a href='' target='_blank'>
                <button
                  className={`${styles.cta} ${styles.lastChild}`}
                  aria-label='View technologies used'
                >
                  <img
                    className={styles.technologies}
                    src={require('../../Resources/image/whatruns.png')}
                    alt='WhatRuns logo'
                  />
                  New & Noteworthy
                </button>
              </a>
              <a href='' target='_blank'>
                <button
                  className={`${styles.cta} ${styles.lastChild}`}
                  aria-label='View Sources'
                >
                  <Sources className={`${styles.ctaSVG}`} />
                  New Releases
                </button>
              </a>
              <a href='' target='_blank'>
                <button
                  className={`${styles.cta} ${styles.lastChild}`}
                  aria-label='View Sources'
                >
                  <Sources className={`${styles.ctaSVG}`} />
                  Recommendations
                </button>
              </a>
              <a href='' target='_blank'>
                <button
                  className={`${styles.cta} ${styles.lastChild}`}
                  aria-label='View Sources'
                >
                  <Sources className={`${styles.ctaSVG}`} />
                  Controller-Friendly
                </button>
              </a>
            </div>
          </div>
        </div>
        {/* <div className={styles.content}>

          </div> */}
      </div>
    </div>
  );
};

export default Home;
