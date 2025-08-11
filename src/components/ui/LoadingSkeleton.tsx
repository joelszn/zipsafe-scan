import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

const LoadingSkeleton = ({ className }: LoadingSkeletonProps) => {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
};

export default LoadingSkeleton;
