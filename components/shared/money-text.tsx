import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/utils";

interface MoneyTextProps {
  value: number;
  className?: string;
  compact?: boolean;
  showSign?: boolean;
  colored?: boolean; // positif=hijau, negatif=merah
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  xs: "text-[11px]",
  sm: "text-[13px]",
  md: "text-[15px]",
  lg: "text-[18px]",
  xl: "text-[22px]",
};

export function MoneyText({
  value,
  className,
  compact = false,
  showSign = false,
  colored = false,
  size = "md",
}: MoneyTextProps) {
  const colorClass = colored
    ? value > 0
      ? "text-success-600"
      : value < 0
        ? "text-danger-600"
        : "text-secondary-400"
    : "";

  return (
    <span
      className={cn("num font-medium", sizeMap[size], colorClass, className)}
    >
      {formatRupiah(value, { compact, showSign })}
    </span>
  );
}
