import logo from './logo.svg';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import Home from './Screens/Home/Home';
import games from './utils/games';
import Browse from './Screens/Browse/Browse';

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
              cart={cart}
              cartAmount={cartAmount}
              cartDisplayed={cartDisplayed}
              handleOpenCart={handleOpenCart}
              handleCloseCart={handleCloseCart}
              clearCart={clearCart}
              handleRemoveFromCart={handleRemoveFromCart}
              openGamePage={openGamePage}
              handleHover={handleHover}
              hoverState={hoverState}
              handleBrowse={handleBrowse}
              handleHome={handleHome}
              browsing={browsing}
              search={search}
              searching={searching}
              handleSearch={handleSearch}
              handleSearchSubmit={handleSearchSubmit}
            />
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
