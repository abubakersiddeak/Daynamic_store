import { cn } from "@/utils/helpers";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-black text-white",
    secondary: "bg-gray-200 text-gray-900",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-900",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
