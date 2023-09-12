import { FC } from "react";
import { BikesFeature } from "../types";

interface MarkerProps {
  bike: BikesFeature;
  status: 'available' | 'warning' | 'critical';
}

const Markers: FC<MarkerProps> = ({ bike, status }) => {
  return (
    <div className={`marker ${status}`}>
    </div>
  );
};

export default Markers;
