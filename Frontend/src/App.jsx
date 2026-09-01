import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { routes } from "./AppRoutes";
import MobileNav from "./components/MobileNav";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBreadcrumb } from "./slices/breadcrumbSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      {/* Sticky Actions */}
      <div className="right-sticky-wrapper">
        <a className="sticky-btn appointment cursor-pointer" onClick={() => {
          dispatch(setBreadcrumb(["Home", "Book Appointment"]));
          navigate("/book-appointment");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}>
          <span>Book Doctor Appointment</span>
          <i className="bi bi-calendar-check"></i>
        </a>

        <a className="sticky-btn opinion cursor-pointer" onClick={() => {
          dispatch(setBreadcrumb(["Home", "Expert Second Opinion"]));
          navigate("/free-second-opinion");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}>
          <span>Expert Second Opinion</span>
          <i className="bi bi-chat-dots"></i>
        </a>
        <a className="sticky-btn whatsapp cursor-pointer" href="https://wa.me/919459108108?text=Hello%20I%20would%20like%20to%20get%20more%20information%20about%20your%20hospital%20services.%20Please%20assist%20me." target="_blank">
        {/* <a href="tel:+91-9459108108" className="sticky-btn whatsapp cursor-pointer" onClick={() => window.open("https://wa.me/9876543210", "_blank")}> */}
          <i className="bi bi-whatsapp"></i>
        </a>
      </div>
      <ToastContainer autoClose={3000} theme="colored" />
    </div>
  );
}

export default App;
