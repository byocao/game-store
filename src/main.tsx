import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import '@fontsource-variable/inter';
import './styles.css';
import { useCatalog } from './lib/catalog';
import { ShopProvider } from './state/ShopProvider';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { GameDetail } from './pages/GameDetail';
import { NotFound } from './pages/NotFound';

function App() {
  const { catalog, error } = useCatalog();

  if (error) {
    return (
      <div className="boot">
        <p>The store couldn't load its catalog.</p>
        <button type="button" className="button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }
  if (!catalog) {
    return (
      <div className="boot" aria-busy="true">
        <span className="spinner" aria-label="Loading the store" />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout catalog={catalog} />}>
        <Route index element={<Home catalog={catalog} />} />
        <Route path="browse" element={<Browse catalog={catalog} />} />
        <Route path="game/:id" element={<GameDetail catalog={catalog} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ShopProvider>
        <App />
      </ShopProvider>
    </BrowserRouter>
  </StrictMode>,
);
