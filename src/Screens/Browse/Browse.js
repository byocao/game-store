import styles from './Browse.module.css';
import React from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import Cart from '../../Components/Cart/Cart';
import AnimatedPage from '../../Components/Animated/AnimatedPage.js';
import Footer from '../../Components/Footer/Footer';
import Filters from '../../Components/Filters/Filters';
import Grid from '../../Components/Grid/Gird';
import { ReactComponent as Grids } from '../../Resources/image/grid.svg';
import { ReactComponent as Columns } from '../../Resources/image/columns.svg';

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
    if (currentFilter === 'none') {
      setShownGames(allGames);
    } else if (
      currentFilter !== 'Ratings' &&
      currentFilter !== 'Reviews' &&
      currentFilter !== 'Wishlist'
    ) {
      let filteredShownGames = allGames.filter(
        (game) => game.genre === currentFilter
      );
      setShownGames(filteredShownGames);
    } else if (currentFilter === 'Ratings') {
      let filteredShownGames = allGames.slice(0);
      filteredShownGames = filteredShownGames.sort(function (a, b) {
        return b.rating - a.rating;
      });
      setShownGames(filteredShownGames);
    } else if (currentFilter === 'Reviews') {
      setReviewDisplay(true);
    } else if (currentFilter === 'Wishlist') {
      let filteredShownGames = allGames.filter((game) => game.isLiked === true);
      setShownGames(filteredShownGames);
    }

    if (currentFilter !== 'Reviews') {
      setReviewDisplay(false);
    }
  }, [currentFilter]);

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
        <div className={styles.browseContent}>
          <Filters
            hoverState={hoverState}
            handleHover={handleHover}
            handleSelect={handleSelect}
            currentFilter={currentFilter}
          />
          <div className={styles.list}>
            <h1>Trending and interesting</h1>
            <p>Based on player counts and ratings</p>

            <div className={styles.applied}>
              <div className={styles.filterList}>
                <button
                  className={styles.filterButton}
                  arial-label='Current Filter'
                >
                  Filter by:
                  <span> {currentFilter}</span>
                </button>
                <button
                  className={`${styles.filterButton} ${styles.clearButton}`}
                  onClick={clearFilter}
                  aria-label='Clear Filters'
                >
                  Clear Filter
                </button>
              </div>

              <div className={styles.displayStyle}>
                <p>Display options:</p>
                <button
                  className={styles.displayBtn}
                  onClick={handleLayoutSwitch}
                  id='grid'
                  aria-label='Display Grids'
                >
                  <Grids
                    className={styles.displayItem}
                    style={{ fill: grid ? '#e5e5e5' : '#6f6f6f' }}
                  />
                </button>
                <button
                  className={styles.displayBtn}
                  onClick={handleLayoutSwitch}
                  id='columns'
                  aria-label='Display columns'
                >
                  <Columns
                    className={styles.displayItem}
                    style={{ fill: grid ? '#6f6f6f' : '#e5e5e5' }}
                  />
                </button>
              </div>
            </div>

            <Grid
              shownGames={shownGames}
              reviewDisplay={reviewDisplay}
              handleLike={handleLike}
              handleHoverGame={handleHoverGame}
              handleAddToCart={handleAddToCart}
              grid={grid}
              search={search}
              searching={searching}
              handleSelectGame={handleSelectGame}
              cartDisplayed={cartDisplayed}
              hoverState={hoverState}
            />
          </div>
        </div>
      </AnimatedPage>
      <Footer />
    </section>
  );
};

export default Browse;
