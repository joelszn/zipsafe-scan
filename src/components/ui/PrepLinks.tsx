import { Link } from "react-router-dom";

const DEFAULT_HAZARDS = [
  "flood",
  "earthquake",
  "heat",
  "wind",
  "winter",
  "air",
  "hurricane",
  "wildfire",
];

const PrepLinks = ({ hazards = DEFAULT_HAZARDS }: { hazards?: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {hazards.map((h) => (
        <Link key={h} to={`/prep/${h}`} className="text-sm underline hover:no-underline">
          Prep for {h}
        </Link>
      ))}
    </div>
  );
};

export default PrepLinks;
