import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Home from './Components/Home/Home';
import Trading from './Components/Trading/Trading';

function App() {
  return (
    <>
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />

               <Route path="/trading" element={<Trading />} />
          </Routes>
      </Router>
    </>
  );
}

export default App;
