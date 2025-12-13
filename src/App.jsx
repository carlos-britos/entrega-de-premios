import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParticlesProvider } from './context/ParticlesContext';
import Header from './components/Header';
import ParticlesBackground from './components/ParticlesBackground';
import Home from './pages/Home';
import CategoriesList from './pages/CategoriesList';
import Category from './pages/Category';
import categoriesData from './data/categories.json';
import './styles/global.css';

function App() {
  const { eventTitle, eventYear } = categoriesData;

  return (
    <ParticlesProvider>
      <Router>
        <ParticlesBackground />
        <Header eventTitle={eventTitle} eventYear={eventYear} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/category/:categoryId" element={<Category />} />
          </Routes>
        </main>
      </Router>
    </ParticlesProvider>
  );
}

export default App;
