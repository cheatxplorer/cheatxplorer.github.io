import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "react-day-picker/dist/style.css"; // Include day picker styling

createRoot(document.getElementById("root")!).render(<App />);
