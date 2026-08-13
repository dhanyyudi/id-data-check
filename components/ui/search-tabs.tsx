"use client";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { value: "nik", label: "NIK" },
  { value: "kodepos", label: "Kode Pos" },
  { value: "plat", label: "Plat Nomor" },
  { value: "npsn", label: "NPSN" },
] as const;

export type SearchTab = (typeof tabs)[number]["value"];

type Props = {
  active: SearchTab;
  onChange: (tab: SearchTab) => void;
};

export function SearchTabs({ active, onChange }: Props) {
  return (
    <Tabs value={active} onValueChange={(v) => onChange(v as SearchTab)}>
      <TabsList>
        {tabs.map((t) => (
          <TabsTrigger
            key={t.value}
            value={t.value}
            className={cn(active === t.value && "font-medium")}
          >
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
