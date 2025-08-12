import Container from "./Container";

const Footer = () => {
  return (
    <footer className="border-t mt-12">
      <Container className="py-8 text-sm text-muted-foreground">
        <p className="mb-2">
          Sources:
          <a href="https://www.weather.gov/" target="_blank" rel="noreferrer nofollow" className="underline"> NOAA National Weather Service</a>,{" "}
          <a href="https://earthquake.usgs.gov/" target="_blank" rel="noreferrer nofollow" className="underline"> USGS Earthquake Hazards Program</a>,{" "}
          <a href="https://msc.fema.gov/nfhl" target="_blank" rel="noreferrer nofollow" className="underline"> FEMA National Flood Hazard Layer</a>,{" "}
          <a href="https://api.zippopotam.us/" target="_blank" rel="noreferrer nofollow" className="underline"> Zippopotam.us</a>.
        </p>
        <p className="opacity-80">Informational only. Not for emergency use. Always follow official guidance.</p>
      </Container>
    </footer>
  );
};

export default Footer;
