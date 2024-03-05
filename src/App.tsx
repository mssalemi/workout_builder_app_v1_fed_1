import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WorkoutPage from "./pages/WorkoutPage";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/:id?" element={<WorkoutPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
