import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./input";
import { Button } from "./button";
import { isValidZip } from "@/lib/geo";

export interface ZipSearchFormProps {
  initialZip?: string;
  ctaLabel?: string;
}

const ZipSearchForm = ({ initialZip = "", ctaLabel = "Check my ZIP" }: ZipSearchFormProps) => {
  const [zip, setZip] = useState(initialZip);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidZip(zip)) {
      setError("Enter a valid 5-digit ZIP code");
      return;
    }
    setError(null);
    navigate(`/zip/${zip}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md items-start gap-2">
      <div className="flex-1">
        <Input
          inputMode="numeric"
          pattern="^\\d{5}$"
          placeholder="Enter ZIP code"
          aria-label="ZIP code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
      <Button type="submit" variant="hero" className="px-6">{ctaLabel}</Button>
    </form>
  );
};

export default ZipSearchForm;
