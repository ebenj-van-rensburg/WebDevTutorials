/** @format */

import React from "react";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";
import { ImMeter } from "react-icons/im";

export interface WeatherDetailProps {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
  temp_min?: number; // Optional, only for detailed weather views
  temp_max?: number; // Optional, only for detailed weather views
}

const WeatherDetails: React.FC<WeatherDetailProps> = ({
  visibility = "25km",
  humidity = "61%",
  windSpeed = "7 km/h",
  airPressure = "1012 hPa",
  sunrise = "6:20",
  sunset = "18:48",
  temp_min,
  temp_max
}) => {
  return (
    <>
      <SingleWeatherDetail icon={<LuEye />} information="Visibility" value={visibility} />
      <SingleWeatherDetail icon={<FiDroplet />} information="Humidity" value={humidity} />
      <SingleWeatherDetail icon={<MdAir />} information="Wind Speed" value={windSpeed} />
      <SingleWeatherDetail icon={<ImMeter />} information="Air Pressure" value={airPressure} />
      <SingleWeatherDetail icon={<LuSunrise />} information="Sunrise" value={sunrise} />
      <SingleWeatherDetail icon={<LuSunset />} information="Sunset" value={sunset} />
      {temp_min !== undefined && temp_max !== undefined && (
        <div className="flex justify-between">
          <SingleWeatherDetail information="Temp Min" value={`${temp_min}°`} />
          <SingleWeatherDetail information="Temp Max" value={`${temp_max}°`} />
        </div>
      )}
    </>
  );
};

export interface SingleWeatherDetailProps {
  information: string;
  icon?: React.ReactNode;
  value: string;
}

const SingleWeatherDetail: React.FC<SingleWeatherDetailProps> = ({ information, icon, value }) => {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
      <p className="whitespace-nowrap">{information}</p>
      {icon && <div className="text-3xl">{icon}</div>}
      <p>{value}</p>
    </div>
  );
};

export default WeatherDetails;