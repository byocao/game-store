import styles from './GameDetail.module.css';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import Slider from '../../Components/Slider/Slider';
import Cart from '../../Components/Cart/Cart';
import AddedToCartBig from '../../Components/AddedToCartBig/AddedToCartBig';
import templateGame from '../../utils/templateGame';

import AnimatedGameDetail from '../../Components/Animated/AnimatedGameDetail';
import AnimatedText from '../../Components/Animated/AnimatedText';

import { ReactComponent as Arrow } from '../../Resources/image/arrow.svg';
import { ReactComponent as Up } from '../../Resources/image/up.svg';
import { ReactComponent as Down } from '../../Resources/image/down.svg';
import { ReactComponent as Like } from '../../Resources/image/like.svg';
import { ReactComponent as Add } from '../../Resources/image/add.svg';

const GameDetail = (props) => {
  const {
    handleHover,
    hoverState,
    handleHome,
    landingPage,
    cartAmount,
    cart,
    search,
    searching,
    handleSearch,
    handleSearchSubmit,
    browsing,
    handleBrowse,
    selectedGame,
    setSelectedGame,
    allGames,
    extended,
    setExtended,
    handleAddToCart,
    handleLike,
    textExtended,
    setTextExtended,
    handleOpenCart,
    handleCloseCart,
    cartDisplayed,
    clearCart,
    handleRemoveFromCart,
    openGamePage,
  } = props;

  const [carouselState, setCarouselState] = React.useState(0);

  const incrementCarousel = (e) => {
    if (carouselState === 3) {
      setCarouselState(0);
    } else {
      setCarouselState(carouselState + 1);
    }
  };

  const decrementCarousel = (e) => {
    if (carouselState === 0) {
      setCarouselState(3);
    } else {
      setCarouselState(carouselState - 1);
    }
  };

  const extendText = () => {
    setTextExtended(!textExtended);
  };

  const handleExtend = () => {
    if (document.getElementById('20').innerHTML === 'More')
      document.getElementById('20').className = 'aboutBottom';
    else if (document.getElementById('20').innerHTML === 'Hide')
      document.getElementById('20').className = 'aboutBottomClosed';

    setExtended(!extended);
    if (textExtended === false) setTimeout(extendText, 500);
    else setTextExtended(!textExtended);
  };

  return (
    <>
      <div className={styles.gamepage}>
        {cartDisplayed ? (
          <Cart
            cartDisplayed={cartDisplayed}
            handleOpenCart={handleOpenCart}
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

        <NavBar
          handleHover={handleHover}
          hoverState={hoverState}
          handleHome={handleHome}
          browsing={browsing}
          landingPage={landingPage}
          cartAmount={cartAmount}
          search={search}
          searching={searching}
          handleSearch={handleSearch}
          handleSearchSubmit={handleSearchSubmit}
          handleOpenCart={handleOpenCart}
          handleCloseCart={handleCloseCart}
        />

        <AnimatedGameDetail>
          <div className={styles.gamepageContent}>
            <header>
              <button
                style={{ color: hoverState[19].hovered ? '#92f' : '#cccccc' }}
                className={styles.goBack}
                onMouseEnter={handleHover}
                onMouseLeave={handleHover}
                onClick={handleBrowse}
                id='19'
                aria-label='Back'
              >
                <Arrow
                  style={{ fill: hoverState[19].hovered ? '#92f' : '#cccccc' }}
                  className={styles.arrow}
                />
                Store
              </button>

              <h1>{selectedGame ? selectedGame.name : templateGame.name}</h1>
            </header>
          </div>
        </AnimatedGameDetail>
      </div>
    </>
  );
};

export default GameDetail;
