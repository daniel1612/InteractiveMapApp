import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coordinate, WeatherInfo, MapState } from '../utils/types';

// Initial state for the map slice
const initialState: MapState = {
  markers: [],
  polygons: [],
  weatherInfo: null,
  useStaticData: true,
  IsInitialPolygon: true,
  IsInitialMarkers: true,
};

// Create a slice for the map state
const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMarkers(state, action: PayloadAction<Coordinate[]>) {
      state.markers = action.payload;
    },
    setPolygons(state, action: PayloadAction<Coordinate[][]>) {
      state.polygons = action.payload;
    },

    setWeatherInfo(state, action: PayloadAction<WeatherInfo | null>) {
      state.weatherInfo = action.payload;
    },
    resetMarkers(state) {
      state.markers = [];
      state.weatherInfo = null;
    },
    resetPolygons(state) {
      state.polygons = [];
    },
    setUseStaticData(state, action: PayloadAction<boolean>) {
      state.useStaticData = action.payload;
    },
    setIsInitialPolygon(state, action: PayloadAction<boolean>) {
      state.IsInitialPolygon = action.payload;
    },
    setIsInitialMarkers(state, action: PayloadAction<boolean>) {
      state.IsInitialMarkers = action.payload;
    }
  },
});

export const { setMarkers, setPolygons,
  setWeatherInfo, resetMarkers, resetPolygons,
  setUseStaticData, setIsInitialPolygon, setIsInitialMarkers } = mapSlice.actions;

export default mapSlice.reducer;
