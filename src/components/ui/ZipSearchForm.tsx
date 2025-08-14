import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./input";
import { Button } from "./button";
import { isValidZip, getCoordsForZip } from "@/lib/geo";

export interface ZipSearchFormProps {
  initialZip?: string;
  ctaLabel?: string;
}

const ZipSearchForm = ({ initialZip = "", ctaLabel = "Check my ZIP" }: ZipSearchFormProps) => {
  const [zip, setZip] = useState(initialZip);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidZip(zip)) {
      setError("Enter a valid 5-digit U.S. ZIP code");
      return;
    }
    
    setIsValidating(true);
    setError(null);
    
    try {
      await getCoordsForZip(zip);
      navigate(`/zip/${zip}`);
    } catch (error) {
      setError("ZIP code not found. Please enter a valid U.S. ZIP code that exists.");
    } finally {
      setIsValidating(false);
    }
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
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0,5))}
        />
        
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
      <Button type="submit" variant="hero" className="px-6" disabled={isValidating}>
        {isValidating ? "Validating..." : ctaLabel}
      </Button>
    </form>
  );
};

export default ZipSearchForm;
