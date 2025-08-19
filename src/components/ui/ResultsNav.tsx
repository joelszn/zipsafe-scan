import { Button } from './button';
import ZipSearchForm from './ZipSearchForm';

interface ResultsNavProps {
  zipCode: string;
  hasAlerts: boolean;
  hasEarthquakes: boolean;
  hasRisks: boolean;
  hasFlood: boolean;
}

const ResultsNav = ({ zipCode, hasAlerts, hasEarthquakes, hasRisks, hasFlood }: ResultsNavProps) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-16 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {hasAlerts && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection('weather-alerts')}
                className="text-xs"
              >
                Weather Alerts
              </Button>
            )}
            {hasEarthquakes && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection('earthquakes')}
                className="text-xs"
              >
                Earthquakes
              </Button>
            )}
            {hasRisks && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection('climate-risks')}
                className="text-xs"
              >
                Climate Risks
              </Button>
            )}
            {hasFlood && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection('flood-insurance')}
                className="text-xs"
              >
                Flood Insurance
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('preparation')}
              className="text-xs"
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