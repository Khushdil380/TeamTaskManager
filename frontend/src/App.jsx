import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Team Task Manager</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
