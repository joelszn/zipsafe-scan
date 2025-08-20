import { Button } from './button';
import ZipSearchForm from './ZipSearchForm';
import { useEffect, useState } from "react";

interface ResultsNavProps {
  zipCode: string;
  hasAlerts: boolean;
  hasEarthquakes: boolean;
  hasRisks: boolean;
  hasFlood: boolean;
}

const ResultsNav = ({ zipCode, hasAlerts, hasEarthquakes, hasRisks, hasFlood }: ResultsNavProps) => {
  const [activeSection, setActiveSection] = useState<string>("");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate offset for sticky headers (main header + results nav + padding)
      const headerHeight = 56; // h-14 = 56px
      const navHeight = 70; // approximate results nav height
      const padding = 20; // extra breathing room
      const offset = headerHeight + navHeight + padding;
      
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    const sections = ['weather-alerts', 'earthquakes', 'climate-risks', 'flood-insurance', 'preparation'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-16 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {hasAlerts && (
              <Button
                variant={activeSection === 'weather-alerts' ? "secondary" : "outline"}
                size="sm"
                onClick={() => scrollToSection('weather-alerts')}
                className="text-xs"
                aria-pressed={activeSection === 'weather-alerts'}
              >
                Weather Alerts
              </Button>
            )}
            {hasEarthquakes && (
              <Button
                variant={activeSection === 'earthquakes' ? "secondary" : "outline"}
                size="sm"
                onClick={() => scrollToSection('earthquakes')}
                className="text-xs"
                aria-pressed={activeSection === 'earthquakes'}
              >
                Earthquakes
              </Button>
            )}
            {hasRisks && (
              <Button
                variant={activeSection === 'climate-risks' ? "secondary" : "outline"}
                size="sm"
                onClick={() => scrollToSection('climate-risks')}
                className="text-xs"
                aria-pressed={activeSection === 'climate-risks'}
              >
                Climate Risks
              </Button>
            )}
            {hasFlood && (
              <Button
                variant={activeSection === 'flood-insurance' ? "secondary" : "outline"}
                size="sm"
                onClick={() => scrollToSection('flood-insurance')}
                className="text-xs"
                aria-pressed={activeSection === 'flood-insurance'}
              >
                Flood Insurance
              </Button>
            )}
            <Button
              variant={activeSection === 'preparation' ? "secondary" : "outline"}
              size="sm"
              onClick={() => scrollToSection('preparation')}
              className="text-xs"
              aria-pressed={activeSection === 'preparation'}
            >
              Preparation
            </Button>
          </div>
          <div className="flex-shrink-0">
            <ZipSearchForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsNav;