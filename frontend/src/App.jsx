import { BrowserRouter, Route, Routes } from "react-router-dom";
import ContinuousEvaluation from "./Pages/ContinuousEvaluation"
import Home from "./Pages/Home";
import NavBar from "./Components/NavBar"

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/continuous_evaluation" element={<ContinuousEvaluation />} />
      </Routes>
    </>
  );
}

export default App;
