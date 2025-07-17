import Header from "./components/layout/Header";
import { Outlet } from "react-router-dom";
import "./App.css"; 
import { Toaster } from "sonner";

function App() {
  return (
    <div className="h-screen flex flex-col">
       <Toaster richColors position="top-center" />
      <Header />
      <main className="max-w-8xl mt-[60px] h-[calc(100vh-60px)] overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
