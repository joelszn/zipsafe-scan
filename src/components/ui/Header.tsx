import { Link } from "react-router-dom";
import Container from "./Container";
import { Button } from "./button";
import { MapPinned } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <Container className="flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="RiskByZip Home">
          <MapPinned className="text-primary" />
          <span className="font-semibold">RiskByZip</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/methodology" className="text-sm hover:underline">Methodology</Link>
          <Link to="/prep/flood" className="text-sm hover:underline">Preparation</Link>
          <Button asChild variant="secondary" size="sm">
            <a href="https://www.noaa.gov/" target="_blank" rel="noreferrer">Sources</a>
          </Button>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
