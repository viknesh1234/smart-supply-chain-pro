export interface KPI {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  color: string; // tailwind class like "text-green-600"
}
