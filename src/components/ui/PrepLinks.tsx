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
    <div className="flex flex-wrap gap-1.5 text-xs leading-tight">
      {hazards.map((h) => (
        <Link
          key={h}
          to={`/prep/${h}`}
          aria-label={`Preparation for ${h}`}
          className="underline hover:no-underline"
        >
          {titleCase(h)}
        </Link>
      ))}
    </div>
  );
};

export default PrepLinks;
