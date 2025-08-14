import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  showText?: boolean;
  text?: string;
}

const LoadingSkeleton = ({ 
  className, 
  lines = 1, 
  showText = false, 
  text = "Loading..." 
}: LoadingSkeletonProps) => {
  return (
    <div className="space-y-3">
      {showText && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>{text}</span>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              "animate-pulse rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted", 
              className
            )} 
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1.5s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
