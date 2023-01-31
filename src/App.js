import logo from "./logo.svg";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React from "react";
import Home from "./Screens/Home/Home";

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

  async function handleBrowse() {
    setExtended(false);
    setTextExtended(false);
    setCartDisplayed(false);
    setHoverState([...hoverState, (hoverState[21].hovered = false)]);
    navigate("/browse");
  }

  const handleHome = () => {
    setExtended(false);
    setTextExtended(false);
    setCartDisplayed(false);
    setHoverState([...hoverState, (hoverState[21].hovered = false)]);
    navigate("/");
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

  const handleOpenCart = () => {
    setCartDisplayed(true);
  }
  
  const handleCloseCart = () => {
    setCartDisplayed(false);
  }

  React.useEffect(() => {
    setOverlap(false);
  }, [location.pathname]);

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes key={location.pathname} location={location}>
        <Route
          path="/"
          element={
            <Home
              overlap={overlap}
              setOverlap={setOverlap}
              hoverState={hoverState}
              setHoverState={setHoverState}
              cartAmount={cartAmount}
              cartDisplayed={cartDisplayed}
              handleOpenCart={handleOpenCart}
              handleCloseCart={handleCloseCart}
            />
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
