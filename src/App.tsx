import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WorkoutPage from "./pages/WorkoutPage";
import HomePage from "./pages/HomePage";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:id" element={<WorkoutPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
