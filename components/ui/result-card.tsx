import { Card } from "@/components/ui/card";

export function ResultCard({ data }: { data: Record<string, unknown> }) {
  return (
    <Card>
      <div className="space-y-1.5 px-(--card-spacing)">
        {Object.entries(data).map(([key, val]) =>
          key === "latitude" || key === "longitude" ? null : (
            <div key={key} className="flex gap-2 text-sm">
              <span className="text-muted-foreground w-32 shrink-0 capitalize">
                {key.replace(/_/g, " ")}
              </span>
              <span className="text-foreground font-medium">
                {val as string}
              </span>
            </div>
          )
        )}
      </div>
    </Card>
  );
}
