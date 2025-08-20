import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./input";
import { Button } from "./button";
import { Label } from "./label";
import { isValidZip, getCoordsForZip } from "@/lib/geo";

export interface ZipSearchFormProps {
  initialZip?: string;
  ctaLabel?: string;
}

const ZipSearchForm = ({ initialZip = "", ctaLabel = "Check my ZIP" }: ZipSearchFormProps) => {
  const [zip, setZip] = useState(initialZip);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  function validateZip(zipValue: string) {
    if (!zipValue) return null;
    if (!isValidZip(zipValue)) {
      return "Enter a valid 5-digit U.S. ZIP code. Try examples like 10001, 30301, or 94103.";
    }
    return null;
  }

  function handleBlur() {
    setTouched(true);
    const validationError = validateZip(zip);
    setError(validationError);
  }

  function handleChange(value: string) {
    const cleanValue = value.replace(/\D/g, '').slice(0, 5);
    setZip(cleanValue);
    
    // Clear error on valid input
    if (touched && isValidZip(cleanValue)) {
      setError(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    
    const validationError = validateZip(zip);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsValidating(true);
    setError(null);
    
    try {
      await getCoordsForZip(zip);
      navigate(`/zip/${zip}`);
    } catch (error) {
      setError("ZIP code not found. Only U.S. ZIP codes are supported. Try examples like 10001, 30301, or 94103.");
    } finally {
      setIsValidating(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-md items-start gap-2">
      <div className="flex-1">
        <Label htmlFor="zip" className="sr-only">
          U.S. ZIP code
        </Label>
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
          aria-describedby={error ? "zip-error" : undefined}
          value={zip}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={error ? "border-destructive focus-visible:ring-destructive" : undefined}
        />
        
        {error && (
          <p id="zip-error" className="mt-2 text-sm text-destructive font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" variant="hero" className="px-6" disabled={isValidating || !!error}>
        {isValidating ? "Validating..." : ctaLabel}
      </Button>
    </form>
  );
};

export default ZipSearchForm;
