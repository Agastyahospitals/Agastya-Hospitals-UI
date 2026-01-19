import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import "./i18n";
import reportWebVitals from "./reportWebVitals";
import "react-quill/dist/quill.snow.css";


import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";

const Root = () => {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);

reportWebVitals();