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
      setError("Enter a valid 5-digit U.S. ZIP code");
      return;
    }
    setError(null);
    navigate(`/zip/${zip}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-md items-start gap-2">
      <div className="flex-1">
        <Input
          id="zip"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          pattern="^[0-9]{5}$"
          maxLength={5}
          placeholder="Enter U.S. ZIP code"
          aria-label="U.S. ZIP code"
          aria-invalid={!!error}
          aria-describedby="zip-help"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0,5))}
        />
        <p id="zip-help" className="mt-1 text-xs text-muted-foreground">U.S. ZIP codes only</p>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
      <Button type="submit" variant="hero" className="px-6">{ctaLabel}</Button>
    </form>
  );
};

export default ZipSearchForm;
