// /src/pages/index.tsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import GeminiChat from "../components/GeminiChat";
import RoverViewer from "../components/RoverViewer";

export default function HomePage() {
  const [view, setView] = useState<"gemini" | "rover">("gemini");

  return (
    <div>
      <Navbar onSelect={setView} />

      <main style={{ padding: "20px" }}>
        {view === "gemini" && <GeminiChat />}
        {view === "rover" && <RoverViewer />}
      </main>
    </div>
  );
}
