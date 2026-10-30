import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-[rgba(91,157,255,0.08)] animate-pulse rounded-md",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
