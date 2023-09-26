import { BrowserRouter, Route, Routes } from "react-router-dom";
import ContinuousEvaluation from "./Pages/ContinuousEvaluation"
const App = () => {
  return (
    <div>
      <ContinuousEvaluation/>
    </div>
  // <BrowserRouter>
  // <Routes>
  //   <Route>
  //     index
  //     path="/"
  //     element={ <Home /> }
  //   </Route>
  // </Routes>
  // </BrowserRouter>
  );
}

export default App;
