import Container from "./Container";

const Footer = () => {
  return (
    <footer className="border-t mt-12">
      <Container className="py-8 text-sm text-muted-foreground">
        <p className="mb-2">Sources: NOAA NWS, USGS Earthquake Hazards Program, FEMA NFHL, Zippopotam.us.</p>
        <p className="opacity-80">Informational only. Not for emergency use. Always follow official guidance.</p>
      </Container>
    </footer>
  );
};

export default Footer;
