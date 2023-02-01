import styles from './Browse.module.css';
import React from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import Cart from '../../Components/Cart/Cart';
import AnimatedPage from '../../Components/Animated/AnimatedPage.js';
import Footer from '../../Components/Footer/Footer';

const Browse = (props) => {
  const {
    handleHover,
    handleSelect,
    hoverState,
    currentFilter,
    shownGames,
    setShownGames,
    clearFilter,
    setReviewDisplay,
    reviewDisplay,
    allGames,
    handleLike,
    handleHoverGame,
    cart,
    cartAmount,
    handleAddToCart,
    handleSelectGame,
    handleSearch,
    handleSearchSubmit,
    search,
    searching,
    browsing,
    handleBrowse,
    handleHome,
    handleOpenCart,
    handleCloseCart,
    cartDisplayed,
    clearCart,
    handleRemoveFromCart,
    setHoverState,
    openGamePage,
  } = props;

  const [landingPage, setLandingPage] = React.useState(false);
  const [grid, setGrid] = React.useState(true);

  const handleLayoutSwitch = (e) => {
    if (e.target.id == 'grid') {
      setGrid(true);
    } else {
      setGrid(false);
    }
  };

  React.useEffect(() => {
    if (cartDisplayed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }
  }, [cartDisplayed]);

  return (
    <section
      className={styles.Browse}
      style={{
        maxHeight: cartDisplayed ? '100vh' : '1000vh',
        minHeight: '100vh',
      }}
    >
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
        handleBrowse={handleBrowse}
        handleHome={handleHome}
        browsing={browsing}
        landingPage={landingPage}
        cartAmount={cartAmount}
        search={search}
        handleSearch={handleSearch}
        handleSearchSubmit={handleSearchSubmit}
        handleOpenCart={handleOpenCart}
        handleCloseCart={handleCloseCart}
      />

      <AnimatedPage exitBeforeEnter>
        <div className={styles.browseContent}></div>
      </AnimatedPage>
      <Footer />
    </section>
  );
};

export default Browse;
