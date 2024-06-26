export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface WeatherInfo {
  locationName: string;
  temperature: number;
  weatherDescription: string;
  iconUrl: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

export interface MapState {
  markers: Coordinate[];
  polygons: Coordinate[][];
  weatherInfo: WeatherInfo | null;
  useStaticData: boolean;
  IsInitialPolygon: boolean;
  IsInitialMarkers: boolean;

}
