//import './App.css';
import Table from './Table.jsx';
import Home from './Home.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';;

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/table" element={<Table />} />
    </Routes>
  </Router>
  );
}

export default App;
