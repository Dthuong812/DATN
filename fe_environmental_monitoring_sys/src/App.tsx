import Header from "./components/layout/Header";
import { Outlet } from "react-router-dom";
import "./App.css"; 

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="max-w-8xl py-15 h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
