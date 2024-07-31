/** @format */
"use client";

import React, { useEffect } from "react";
import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import Navbar from "@/components/Navbar";
import WeatherIcon from "@/components/WeatherIcon";
import WeatherDetails from "@/components/WeatherDetails";
import { convertKelvinToCelsius } from "../utils/convertKelvinToCelcius";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometers";
import axios from "axios";
import { format, parseISO, fromUnixTime } from "date-fns";
import { useQuery } from "react-query";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  visibility: number;
  wind: {
    speed: number;
  };
  dt_txt: string;
}

interface WeatherData {
  list: WeatherDetail[];
  city: {
    name: string;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "weatherData",
    async () => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${API_KEY}&cnt=56`
      );
      return response.data;
    },
    { enabled: !!place }
  );

  useEffect(() => {
    if (place) refetch();
  }, [place, refetch]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const firstData = data?.list[0];

  const uniqueDates = Array.from(
    new Set(data?.list.map((entry) => entry.dt_txt.split(" ")[0]))
  );

  // Filter out undefined values from firstDataForEachDate
  const firstDataForEachDate: WeatherDetail[] = uniqueDates
    .map((date) =>
      data?.list.find(
        (entry) =>
          entry.dt_txt.startsWith(date) &&
          new Date(entry.dt_txt).getHours() >= 6
      )
    )
    .filter((entry): entry is WeatherDetail => entry !== undefined); // Type guard to ensure non-undefined values

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <TodayWeather data={firstData} cityData={data?.city} />
            <Forecast data={firstDataForEachDate} cityData={data?.city} />
          </>
        )}
      </main>
    </div>
  );
}

const TodayWeather: React.FC<{ data?: WeatherDetail; cityData?: WeatherData['city'] }> = ({
  data,
  cityData,
}) => {
  if (!data) return null;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="flex gap-1 text-2xl items-end">
          <p>{format(parseISO(data.dt_txt), "EEEE")}</p>
          <p className="text-lg">
            ({format(parseISO(data.dt_txt), "dd.MM.yyyy")})
          </p>
        </h2>
        <Container className="gap-10 px-6 items-center">
          <div className="flex flex-col px-4">
            <span className="text-5xl">
              {convertKelvinToCelsius(data.main.temp)}°
            </span>
            <p className="text-xs space-x-1 whitespace-nowrap">
              <span>Feels like</span>
              <span>{convertKelvinToCelsius(data.main.feels_like)}°</span>
            </p>
            <p className="text-xs space-x-2">
              <span>{convertKelvinToCelsius(data.main.temp_min)}°↓</span>
              <span>{convertKelvinToCelsius(data.main.temp_max)}°↑</span>
            </p>
          </div>
          <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
            {/** Previously, we might have incorrectly tried to map through `cityData.list`. 
                 Now, we correct this by accessing a valid array or property, if available. */}
            {/** Ensure the proper array is being iterated over, and remove incorrect property access */}
            {data && data.weather.map((weather, i) => (
              <div
                key={i}
                className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
              >
                <p className="whitespace-nowrap">
                  {format(parseISO(data.dt_txt), "h:mm a")}
                </p>
                <WeatherIcon
                  iconName={getDayOrNightIcon(weather.icon, data.dt_txt)}
                />
                <p>{convertKelvinToCelsius(data.main.temp)}°</p>
              </div>
            ))}
          </div>
        </Container>
      </div>
      <WeatherSummary data={data} cityData={cityData} />
    </section>
  );
};

const WeatherSummary: React.FC<{ data?: WeatherDetail; cityData?: any }> = ({
  data,
  cityData,
}) => {
  if (!data || !cityData) return null;

  return (
    <div className="flex gap-4">
      <Container className="w-fit justify-center flex-col px-4 items-center">
        <p className="capitalize text-center">{data.weather[0].description}</p>
        <WeatherIcon
          iconName={getDayOrNightIcon(data.weather[0].icon, data.dt_txt)}
        />
      </Container>
      <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
        <WeatherDetails
          visibility={metersToKilometers(data.visibility)}
          airPressure={`${data.main.pressure} hPa`}
          humidity={`${data.main.humidity}%`}
          sunrise={format(fromUnixTime(cityData.sunrise), "H:mm")}
          sunset={format(fromUnixTime(cityData.sunset), "H:mm")}
          windSpeed={convertWindSpeed(data.wind.speed)}
        />
      </Container>
    </div>
  );
};

const Forecast: React.FC<{ data: WeatherDetail[]; cityData?: any }> = ({
  data,
  cityData,
}) => {
  return (
    <section className="flex w-full flex-col gap-4">
      <p className="text-2xl">Forecast (7 days)</p>
      {data.map((d, i) => (
        <ForecastWeatherDetail
          key={i}
          description={d.weather[0].description ?? ""}
          weatherIcon={d.weather[0].icon ?? "01d"}
          date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
          day={d ? format(parseISO(d.dt_txt), "EEEE") : ""}
          feels_like={d.main.feels_like ?? 0}
          temp={d.main.temp ?? 0}
          temp_max={d.main.temp_max ?? 0}
          temp_min={d.main.temp_min ?? 0}
          airPressure={`${d.main.pressure} hPa`}
          humidity={`${d.main.humidity}%`}
          sunrise={format(fromUnixTime(cityData.sunrise), "H:mm")}
          sunset={format(fromUnixTime(cityData.sunset), "H:mm")}
          visibility={`${metersToKilometers(d.visibility)} km`}
          windSpeed={`${convertWindSpeed(d.wind.speed)} km/h`}
        />
      ))}
    </section>
  );
};

const LoadingScreen = () => (
  <div className="flex items-center min-h-screen justify-center">
    <p className="animate-bounce">Loading...</p>
  </div>
);

const ErrorScreen: React.FC<{ error: unknown }> = ({ error }) => (
  <div className="flex items-center min-h-screen justify-center">
    <p className="text-red-400">{(error as Error).message}</p>
  </div>
);

function WeatherSkeleton() {
  return (
    <section className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="flex gap-1 text-2xl items-end">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>
        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}