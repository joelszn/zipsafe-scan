import { useParams, Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Helmet } from "react-helmet-async";

const CONTENT: Record<string, { title: string; body: string; links: { href: string; label: string }[] }> = {
  flood: {
    title: "Flood preparedness",
    body: "Floods can develop slowly or rapidly. Know your local risk, sign up for alerts, and prepare your home. Elevate utilities, keep important documents in waterproof containers, and have supplies ready. During a flood warning, avoid walking or driving through flood waters—turn around, don’t drown. After flooding, avoid contact with flood water, which may be contaminated. Document damage for insurance and contact local officials for guidance. Learn evacuation routes ahead of time and plan where to meet family members if separated. Consider purchasing flood insurance—it typically has a 30-day waiting period before coverage begins. Maintain gutters and drains to reduce localized flooding and keep an emergency kit with food, water, medications, and flashlights.",
    links: [
      { href: "https://www.ready.gov/floods", label: "Ready.gov Floods" },
      { href: "https://www.fema.gov/flood-insurance", label: "FEMA Flood Insurance" },
    ],
  },
  earthquake: {
    title: "Earthquake preparedness",
    body: "Earthquakes strike without warning. Secure heavy furniture, water heaters, and breakables. Practice Drop, Cover, and Hold On. Identify safe spots under sturdy furniture and away from windows. Prepare an emergency kit with water, food, medications, and sturdy shoes. After shaking stops, expect aftershocks. Check for gas leaks and damaged utilities. If near the coast, move to higher ground in case of tsunami. Keep a whistle handy to signal for help if trapped. Know how to shut off gas and water lines. Store important documents in a safe place and plan reunification with family. Review your building’s seismic safety and consider retrofits if needed.",
    links: [
      { href: "https://www.ready.gov/earthquakes", label: "Ready.gov Earthquakes" },
      { href: "https://www.shakeout.org/dropcoverholdon/", label: "Drop, Cover, Hold On" },
    ],
  },
  heat: {
    title: "Extreme heat preparedness",
    body: "High heat can be dangerous, especially for children, older adults, and those with chronic conditions. Stay hydrated, limit outdoor activity during peak heat, and check on vulnerable neighbors. Create cool zones at home with fans and curtains, and know the location of nearby cooling centers. Never leave children or pets in cars. Wear lightweight, light-colored clothing and use sunscreen. Recognize heat illness signs: heavy sweating, dizziness, nausea, and confusion. Cool down with cool baths or wet cloths, and call 911 for heat stroke. Plan your day to avoid strenuous tasks at midday.",
    links: [
      { href: "https://www.ready.gov/heat", label: "Ready.gov Heat" },
      { href: "https://www.cdc.gov/disasters/extremeheat/", label: "CDC Extreme Heat" },
    ],
  },
  wind: {
    title: "High wind preparedness",
    body: "Strong winds can topple trees, damage roofs, and cause power outages. Trim trees, secure outdoor items, and reinforce garage doors. If you receive a wind warning, stay indoors and away from windows. Charge devices and have backup power for medical needs. Avoid downed power lines and report them to authorities. After the event, check roofs and structures safely and photograph damage for insurance. Keep emergency supplies on hand, including batteries, flashlights, and a battery-powered radio.",
    links: [
      { href: "https://www.ready.gov/wind", label: "Ready.gov Wind" },
    ],
  },
  winter: {
    title: "Winter storm preparedness",
    body: "Winter storms can bring heavy snow, ice, and cold temperatures. Insulate pipes, stock up on warm clothing and blankets, and maintain heating equipment. Keep an emergency kit in your vehicle with blankets, food, and a shovel. During storms, stay off roads if possible. If you lose power, prevent carbon monoxide poisoning—never use a generator indoors. Dress in layers and watch for signs of hypothermia and frostbite. After the storm, clear snow safely and check on neighbors.",
    links: [
      { href: "https://www.ready.gov/winter-weather", label: "Ready.gov Winter" },
    ],
  },
  air: {
    title: "Air quality preparedness",
    body: "Poor air quality from pollution or wildfire smoke can impact health. Monitor local air quality indexes (AQI) and reduce outdoor activity during unhealthy periods. Create a clean air room with a HEPA filter and seal gaps. Wear a well-fitting N95 mask if you must be outside. Keep medications for asthma or heart conditions accessible and follow your doctor’s advice. Use recirculation settings in vehicles to limit smoke intake.",
    links: [
      { href: "https://www.airnow.gov/", label: "AirNow.gov" },
    ],
  },
  hurricane: {
    title: "Hurricane preparedness",
    body: "Hurricanes bring strong winds, heavy rain, storm surge, and tornadoes. Know your evacuation zone, assemble a go-bag, and plan for pets. Secure loose outdoor items and board up windows when a storm approaches. Charge devices and prepare for extended power outages. If ordered to evacuate, do so promptly. After the storm, avoid floodwaters and downed lines. Document damage for insurance and check for structural issues before reentering homes.",
    links: [
      { href: "https://www.ready.gov/hurricanes", label: "Ready.gov Hurricanes" },
    ],
  },
  wildfire: {
    title: "Wildfire preparedness",
    body: "Wildfires spread quickly. Create defensible space by clearing debris and trimming vegetation around your home. Prepare an evacuation plan and go-bag, including masks to protect from smoke. Monitor local alerts and be ready to leave if instructed. Keep gutters clean and use ember-resistant vents if possible. During evacuations, follow official routes. After a fire, watch for hazards such as unstable trees, ash, and hot spots. Limit smoke exposure by staying indoors and filtering air.",
    links: [
      { href: "https://www.ready.gov/wildfires", label: "Ready.gov Wildfires" },
    ],
  },
};

const HazardPrepPage = () => {
  const { hazard = '' } = useParams();
  const key = hazard.toLowerCase();
  const data = CONTENT[key];

  const title = data ? `${data.title} | MyRiskMap` : `Preparedness | MyRiskMap`;
  const desc = data ? `Practical preparation tips for ${hazard} hazards.` : 'Preparedness guidance.';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={typeof window!=="undefined"? window.location.href: ''} />
      </Helmet>
      <Header />
      <main>
        <Container className="py-8 space-y-4">
          <h1 className="text-3xl font-semibold">{data?.title || 'Preparedness'}</h1>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">{data?.body || 'Learn how to prepare for local hazards and stay safe during emergencies.'}</p>
          {data && (
            <ul className="list-disc pl-6 space-y-1">
              {data.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <Link to="/" className="underline">Back to search</Link>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default HazardPrepPage;
