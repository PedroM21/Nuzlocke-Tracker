import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Runs from "./pages/Runs";
import NewRun from "./pages/NewRun";
import Details from "./pages/Details";
import Overview from "./pages/Overview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/log-in" element={<Login />} />
        <Route path="/runs" element={<Runs />} />
        <Route path="/new-run" element={<NewRun />} />
        <Route path="/runs/details" element={<Details />} />
        <Route path="/runs/:runId/edit" element={<Details />} />
        <Route path="/runs/:runId/overview" element={<Overview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
