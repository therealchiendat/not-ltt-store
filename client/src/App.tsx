import { useEffect, useState } from 'react';
import Routes from "./Routes";
import Navbar from "./components/Navbar";
import { AppContext } from "./libs/contextLibs";
import './App.css';

function App() {

  const [isTransparent, setIsTransparent] = useState<boolean>(true);
  const [storeData, setStoreData] = useState<any>();

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY
      if (scrollY > 10) {
        setIsTransparent(false);
      } else {
        setIsTransparent(true);
      }
    }
    window.addEventListener('scroll', handleScroll);
  }, [])

  return (
    <div className="App">
      <Navbar transparent={isTransparent} position="fixed-top" />
      <AppContext.Provider value={{ storeData }}>
        <Routes/>
      </AppContext.Provider>
    </div>
  );
}

export default App;
