import { Link } from "react-router-dom";
import Container from "./Container";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <Container className="flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="RiskByZip Home">
          <img src="/lovable-uploads/bd414dec-2211-477a-9f72-d9d4d3b7d4b0.png" alt="RiskByZip logo" className="h-5 w-5" />
          <span className="font-semibold">RiskByZip</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/methodology" className="text-sm hover:underline">Methodology</Link>
          <Link to="/prep" className="text-sm hover:underline">Preparation</Link>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
