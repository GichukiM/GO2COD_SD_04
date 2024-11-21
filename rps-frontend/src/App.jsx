import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import Header from "./components/Header";

function App() {

  return (
    <Router>
      <Header />
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<Game />} />
      </Routes>
    </div>
  </Router>
  )
}

export default App
