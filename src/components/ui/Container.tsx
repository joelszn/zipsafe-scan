import { cn } from "@/lib/utils";
import React from "react";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

const Container: React.FC<ContainerProps> = ({ className, ...props }) => {
  return (
    <div className={cn("container mx-auto px-4", className)} {...props} />
  );
};

export default Container;
