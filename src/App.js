import React from 'react';
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import Slider from './components/Slider';
import CoinPage from './components/CoinPage';
import ThemeContext from './ThemeContext';

function App() {
  const [theme, setTheme] = React.useState(true);
  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      <Header />
        <Routes>
          <Route path="/" element={<Slider />} />
          <Route path="coins">
            <Route path=":coinId" element={<CoinPage />} />
          </Route>
        </Routes>
    </ThemeContext.Provider>
  );
}

export default App;
