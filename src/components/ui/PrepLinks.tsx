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

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const PrepLinks = ({ hazards = DEFAULT_HAZARDS }: { hazards?: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {hazards.map((h) => (
        <Link
          key={h}
          to={`/prep/${h}`}
          aria-label={`Preparation for ${h}`}
          className="text-sm underline hover:no-underline"
        >
          {titleCase(h)}
        </Link>
      ))}
    </div>
  );
};

export default PrepLinks;
