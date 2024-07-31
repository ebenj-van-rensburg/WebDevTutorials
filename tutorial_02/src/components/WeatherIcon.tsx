/** @format */

import React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

type WeatherIconProps = React.HTMLProps<HTMLDivElement> & { iconName: string };

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconName, className, ...props }) => {
  return (
    <div title={iconName} {...props} className={cn("relative h-20 w-20", className)}>
      <Image
        width={100}
        height={100}
        alt="weather-icon"
        className="absolute h-full w-full"
        src={`https://openweathermap.org/img/wn/${iconName}@4x.png`}
      />
    </div>
  );
};

export default WeatherIcon;