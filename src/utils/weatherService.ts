import axios from 'axios';

// API key for OpenWeatherMap
const API_KEY = 'd3ae26a46a817cad31183e0f4bcb6456';

// Base URL for fetching weather data
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetches weather data for given coordinates
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns A promise that resolves to an object containing weather data
 * @throws An error if the fetch request fails
 */
export const fetchWeatherData = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;

    return {
      locationName: data.name,
      temperature: data.main.temp,
      weatherDescription: data.weather[0].description,
      iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
      throw new Error('Failed to fetch weather data');
    } else {
      console.error('Unknown error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
};
