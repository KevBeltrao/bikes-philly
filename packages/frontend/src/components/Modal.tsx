import { FC, memo, useMemo } from 'react';
import { BikesFeature } from '../types';

interface ModalProps {
  bike: BikesFeature | null;
  shouldModalShow: boolean;
  clearSelectedKiosk: () => void;
  hideModal: () => void;
}

const Modal: FC<ModalProps> = memo(({
  bike,
  shouldModalShow,
  clearSelectedKiosk,
  hideModal,
}) => {
  const stats = useMemo(() => {
    if (!bike) return {};

    const { bikes, bikesAvailable, classicBikesAvailable } = bike.properties;

    const numberOfClassicBikes = bikes.filter((currentBike) => !currentBike.isElectric).length;

    const numberOfElectricBikes = bikes.length - numberOfClassicBikes;
    const availableElectricBikes = bikes.filter((currentBike) => currentBike.isElectric && currentBike.isAvailable).length;

    return {
      bikes: `${bikesAvailable} / ${bikes.length}`,
      classic: `${classicBikesAvailable} / ${numberOfClassicBikes}`,
      electric: `${availableElectricBikes} / ${numberOfElectricBikes}`,
    }

  }, [bike]);

  return (
    <div
      className={`modal${shouldModalShow ? ' show' : ''}${bike ? '' : ' hide'}`}
      onAnimationEnd={shouldModalShow ? undefined : clearSelectedKiosk}
      onClick={hideModal}
    >
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <button className="close" onClick={hideModal}>&times;</button>
        <h2>{bike?.properties.name}</h2>
        <p>
          <strong>Bikes Available</strong> {stats.bikes}</p>
        <p>
          <strong>Classic Bikes Available</strong> {stats.classic}</p>
        <p>
          <strong>Electric Bikes Available</strong> {stats.electric}</p>
      </div>
    </div>
  );
});

export default Modal;
