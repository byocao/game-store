import logo from './logo.svg';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import Home from './Screens/Home/Home';
import games from './utils/games';
import Browse from './Screens/Browse/Browse';
import filterNames from './utils/filterNames';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [hoverState, setHoverState] = React.useState([
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
  ]);
  const [overlap, setOverlap] = React.useState(false);
  const [extended, setExtended] = React.useState(false);
  const [textExtended, setTextExtended] = React.useState(false);
  const [cartDisplayed, setCartDisplayed] = React.useState(false);
  const [cartAmount, setCartAmount] = React.useState(0);
  const [cart, setCart] = React.useState([]);
  const [allGames, setAllGames] = React.useState(games);
  const [selectedGame, setSelectedGame] = React.useState(false);
  const [browsing, setBrowsing] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [searching, setSearching] = React.useState(false);
  const [currentFilter, setCurrentFilter] = React.useState('none');
  const [shownGames, setShownGames] = React.useState(allGames);
  const [reviewDisplay, setReviewDisplay] = React.useState(false);

  async function handleBrowse() {
    setExtended(false);
    setTextExtended(false);
    setCartDisplayed(false);
    setHoverState([...hoverState, (hoverState[21].hovered = false)]);
    navigate('/browse');
  }

  const handleHome = () => {
    setExtended(false);
    setTextExtended(false);
    setCartDisplayed(false);
    setHoverState([...hoverState, (hoverState[21].hovered = false)]);
    navigate('/');
  };

  const handleHover = (e) => {
    if (hoverState[e.target.id].selected) return;

    let newHoverState = hoverState.map((element, i) => {
      if (e.target.id == i) {
        element.hovered = !element.hovered;
        return element;
      } else return element;
    });

    setHoverState(newHoverState);
  };

  const handleAddToCart = (e) => {
    let handleAddedGame = allGames.map((game, i) => {
      if (location.pathname === '/browse') {
        if (e.target.id == i) {
          game.inCart = true;
          let newCart = cart;
          newCart.push(game);
          setCart(newCart);
          setCartAmount(cartAmount + 1);
          return game;
        } else {
          return game;
        }
      } else {
        if (selectedGame.id == i) {
          game.inCart = true;
          let newCart = cart;
          newCart.push(game);
          setCart(newCart);
          setCartAmount(cartAmount + 1);
          return game;
        } else {
          return game;
        }
      }
    });

    setAllGames(handleAddedGame);
  };
  const handleOpenCart = () => {
    setCartDisplayed(true);
  };

  const handleCloseCart = () => {
    setCartDisplayed(false);
  };

  const clearCart = () => {
    setCart([]);
    setCartAmount(0);
    const defaultGames = allGames.map((game, i) => {
      game.inCart = false;
      game.isHovered = false;
      return game;
    });
    setAllGames(defaultGames);
    let newHoverState = hoverState[21];
    newHoverState.hovered = false;
    setHoverState([...hoverState, (hoverState[21] = newHoverState)]);
  };

  const handleRemoveFromCart = (e) => {
    let removeIndex = cart.findIndex((game) => game.id == e.target.id);

    let newAllGames = allGames.map((game, i) => {
      if (game.id == e.target.id) {
        game.inCart = false;
        game.isHovered = false;
        return game;
      } else {
        return game;
      }
    });
    setAllGames(newAllGames);
    let firstHalf = cart.slice(0, removeIndex);
    let secondHalf = cart.slice(removeIndex + 1);
    let addedUp = firstHalf.concat(secondHalf);
    setCart(addedUp);
    setCartAmount(cartAmount - 1);
    setHoverState([...hoverState, (hoverState[21].hovered = false)]);
  };

  const openGamePage = (e) => {
    setCartDisplayed(false);
    let selectedGameSurname = e.target.id;
    navigate(`/games/${selectedGameSurname}`);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setSearching(false);
  };

  const handleSearchSubmit = (e) => {
    setCurrentFilter('none');
    e.preventDefault();
    setSearching(true);

    if (location.pathname !== '/browse') {
      navigate('/browse');
    }
  };

  const handleSelect = (e) => {
    setCurrentFilter(filterNames[e.target.id - 8]);
  };

  const handleLike = (e) => {
    let handledLike = allGames.map((game, i) => {
      if (e.target.id == i) {
        game.isLiked = !game.isLiked;
        return game;
      } else {
        return game;
      }
    });
    setAllGames(handledLike);
  };

  const handleHoverGame = (e) => {
    let handledHoveredGame = allGames.map((game, i) => {
      if (e.target.id == i) {
        game.isHovered = !game.isHovered;
        return game;
      } else {
        return game;
      }
    });

    setAllGames(handledHoveredGame);
  };

  const handleSelectGame = (e) => {
    if (e.target.tagName === 'BUTTON') {
      return;
    } else if (e.target.classList[0] != 'AddToCart_addToCart__zbJPe') {
      setSelectedGame(games[e.target.parentNode.id]);
      navigate(`/games/${games[e.target.parentNode.id].surname}`);
    }
  };

  const clearFilter = () => {
    setCurrentFilter('none');
    setSearch('');
    setReviewDisplay(false);
  };

  React.useEffect(() => {
    setOverlap(false);

    if (location.pathname === '/') {
      setBrowsing(false);
    } else {
      setBrowsing(true);
    }

    if (location.pathname !== '/browse') {
      document.body.style.overflow = 'hidden';
    } else if (location.pathname === '/browse') {
      document.body.style.overflow = 'scroll';
    }
  }, [location.pathname]);

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes key={location.pathname} location={location}>
        <Route
          path='/'
          element={
            <Home
              handleHover={handleHover}
              hoverState={hoverState}
              cart={cart}
              cartAmount={cartAmount}
              cartDisplayed={cartDisplayed}
              handleOpenCart={handleOpenCart}
              handleCloseCart={handleCloseCart}
              clearCart={clearCart}
              handleAddToCart={handleAddToCart}
              handleRemoveFromCart={handleRemoveFromCart}
              setHoverState={setHoverState}
              overlap={overlap}
              setOverlap={setOverlap}
              openGamePage={openGamePage}
            />
          }
        />
        <Route
          path='/browse'
          element={
            <Browse
              handleHover={handleHover}
              handleSelect={handleSelect}
              hoverState={hoverState}
              currentFilter={currentFilter}
              shownGames={shownGames}
              setShownGames={setShownGames}
              clearFilter={clearFilter}
              setReviewDisplay={setReviewDisplay}
              reviewDisplay={reviewDisplay}
              allGames={allGames}
              handleLike={handleLike}
              handleHoverGame={handleHoverGame}
              cart={cart}
              cartAmount={cartAmount}
              handleAddToCart={handleAddToCart}
              handleSelectGame={handleSelectGame}
              handleSearch={handleSearch}
              handleSearchSubmit={handleSearchSubmit}
              search={search}
              handleOpenCart={handleOpenCart}
              handleCloseCart={handleCloseCart}
              cartDisplayed={cartDisplayed}
              clearCart={clearCart}
              handleRemoveFromCart={handleRemoveFromCart}
              openGamePage={openGamePage}
              handleBrowse={handleBrowse}
              handleHome={handleHome}
              browsing={browsing}
              searching={searching}
            />
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
