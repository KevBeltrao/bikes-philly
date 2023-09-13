import { FC, memo } from 'react';
import { BikesFeature } from '../types';


interface MarkerProps {
  bike: BikesFeature;
  status: 'available' | 'warning' | 'critical';
  handleClick: () => void;
}

const Markers: FC<MarkerProps> = memo(({ bike, status, handleClick }) => {
  return (
    <button
      onClick={handleClick}
      className={`marker ${status}`}
      data-name={bike.properties.name}
    >
    </button>
  );
});

export default Markers;
