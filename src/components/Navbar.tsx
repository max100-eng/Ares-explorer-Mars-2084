// /src/components/Navbar.tsx
interface NavbarProps {
  onSelect: (view: "gemini" | "rover") => void;
}

export default function Navbar({ onSelect }: NavbarProps) {
  return (
    <nav style={{ display: "flex", gap: "20px", padding: "10px", background: "#eee" }}>
      <button onClick={() => onSelect("gemini")}>Gemini Chat</button>
      <button onClick={() => onSelect("rover")}>Rover Viewer</button>
    </nav>
  );
}
