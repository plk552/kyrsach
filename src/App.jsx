// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Help from './pages/Help';
import Main from './pages/Main';
import Constructor from './pages/Сonstructor';
import Purpose from './pages/Purpose';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header /> 
      <main>
        <Routes> 
          <Route path="/" element={<Main />} />
          <Route path="/purpose/:purposeId" element={<Purpose />} />
          <Route path="/Constructor" element={<Constructor />} />
          <Route path="/About" element={<About />} />
          <Route path="/Help" element={<Help />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
