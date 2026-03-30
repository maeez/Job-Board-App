"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRIES = [
  { code: "US", name: "United States", currency: "USD" },
  { code: "IN", name: "India", currency: "INR" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "DE", name: "Germany", currency: "EUR" },
  { code: "FR", name: "France", currency: "EUR" },
  { code: "JP", name: "Japan", currency: "JPY" },
  { code: "CA", name: "Canada", currency: "CAD" },
  { code: "AU", name: "Australia", currency: "AUD" },
  { code: "SG", name: "Singapore", currency: "SGD" },
  { code: "AE", name: "UAE", currency: "AED" },
  { code: "BR", name: "Brazil", currency: "BRL" },
  { code: "MX", name: "Mexico", currency: "MXN" },
  { code: "NG", name: "Nigeria", currency: "NGN" },
  { code: "ZA", name: "South Africa", currency: "ZAR" },
  { code: "PK", name: "Pakistan", currency: "PKR" },
  { code: "BD", name: "Bangladesh", currency: "BDT" },
  { code: "NL", name: "Netherlands", currency: "EUR" },
  { code: "SE", name: "Sweden", currency: "SEK" },
  { code: "NO", name: "Norway", currency: "NOK" },
  { code: "CH", name: "Switzerland", currency: "CHF" },
];

type Props = {
  defaultCountry?: string;
  defaultCurrency?: string;
};

export default function CountryCurrencySelect({
  defaultCountry,
  defaultCurrency,
}: Props) {
  const [country, setCountry] = useState(defaultCountry ?? "");
  const [currency, setCurrency] = useState(defaultCurrency ?? "");

  function handleCountryChange(val: string) {
    setCountry(val);
    const matched = COUNTRIES.find((c) => c.code === val);
    if (matched) setCurrency(matched.currency);
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select
          defaultValue={defaultCountry}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger id="country" className="w-full">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" name="country" value={country} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="compensationCurrency">Compensation currency</Label>
        <div className="flex h-8 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
          {currency || "Auto-filled from country"}
        </div>
        <input type="hidden" name="compensationCurrency" value={currency} />
      </div>
    </div>
  );
}