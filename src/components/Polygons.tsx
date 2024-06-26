// src/components/Polygons.tsx
import React from "react";
import { Polygon } from "react-native-maps";
import { Coordinate } from "../mock/mockData";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface PolygonsProps {
  polygons: Coordinate[][];
  currentPolygon: Coordinate[];
}

/**
 * Component for rendering polygons on the map
 * @param polygons List of polygons to render
 * @param currentPolygon The polygon currently being drawn
 */
const Polygons: React.FC<PolygonsProps> = ({ polygons, currentPolygon }) => {
  const polygonsState = useSelector((state: RootState) => state.map.polygons);

  return (
    <>
      {polygons.map((polygon, index) => (
        <Polygon
          key={index}
          coordinates={polygon}
          strokeColor="#000"
          fillColor="rgba(0,0,0,0.5)"
          strokeWidth={1}
        />
      ))}
      {currentPolygon.length > 0 && polygonsState.length > 0 && (
        <Polygon
          coordinates={currentPolygon}
          strokeColor="#000"
          fillColor="rgba(0,0,0,0.5)"
          strokeWidth={1}
        />
      )}
    </>
  );
};

export default Polygons;
