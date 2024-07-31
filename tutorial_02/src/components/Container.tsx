/** @format */

import { cn } from "@/utils/cn";
import React, { FC } from "react";

const Container: FC<React.HTMLProps<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={cn("w-full bg-white border rounded-xl flex py-4 shadow-sm", className)}>
      {children}
    </div>
  );
};

export default Container;