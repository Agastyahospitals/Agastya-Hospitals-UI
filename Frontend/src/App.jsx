import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { routes } from "./AppRoutes";
import MobileNav from "./components/MobileNav";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          {routes.map(({ path, component: Component }, i) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </main>
      <Footer />
      <MobileNav />
      <ToastContainer autoClose={3000} theme="colored" />
    </div>
  );
}

export default App;
