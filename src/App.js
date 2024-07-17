import {BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Test_PAGE from "./test_page";
import MAIN_PAGE from "./main_page";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Test_PAGE />} />
      <Route path="/main_page" element={<MAIN_PAGE />} />
    </Routes>
  );
}

export default App;