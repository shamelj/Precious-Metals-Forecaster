import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home"
const App = () => {
  return (
    <div>
      <Home/>
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
