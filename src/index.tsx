import ReactDOM from "react-dom/client";
import App from "@/App";

// Style
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@/style/index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
