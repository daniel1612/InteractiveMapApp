import { Coordinate } from '../utils/types';

/**
 * Static data for markers and polygons
 */
export const staticData = {
  markers: [
    { latitude: 31.265589, longitude: 34.796764 },
    { latitude: 31.310236, longitude: 34.611907 },
    { latitude: 31.523956, longitude: 34.595256 },
  ],
  polygons: [
    [
      { latitude: 31.265589, longitude: 34.796764 },
      { latitude: 31.310236, longitude: 34.611907 },
      { latitude: 31.523956, longitude: 34.595256 },
    ],
  ],
};

/**
 * Creates initial markers based on the provided latitude and longitude
 * @param latitude number
 * @param longitude number
 * @returns Coordinate[]
 */
export const createInitialMarkers = (latitude: number, longitude: number): Coordinate[] => {
  return [
    { latitude: latitude, longitude: longitude },
  ];
};

/**
 * Creates initial polygons based on the provided latitude and longitude
 * @param latitude number
 * @param longitude number
 * @returns Coordinate[][]
 */
export const createInitialPolygons = (latitude: number, longitude: number): Coordinate[][] => {
  return [
    [
      { latitude: latitude + 0.001, longitude: longitude },
      { latitude: latitude + 0.001, longitude: longitude + 0.001 },
      { latitude: latitude, longitude: longitude + 0.001 },
    ],
  ];
};

export { Coordinate };
