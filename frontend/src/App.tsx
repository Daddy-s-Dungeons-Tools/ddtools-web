import { Outlet } from "react-router-dom";
import TopNavbar from "./components/TopNavbar/TopNavbar";

function App() {
  return (
    <div className="App">
      <header>
        <TopNavbar />
      </header>
      <Outlet />
    </div>
  );
}

export default App;
