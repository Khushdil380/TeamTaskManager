import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preloader from "./components/Preloader/Preloader";
import Home from "./pages/Home/Home";
import "./styles/index.css";
import "./App.css";

function App() {
  return (
    <>
      <Preloader />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
