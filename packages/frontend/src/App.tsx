/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import io from 'socket.io-client';

import './App.css';
import { BikesFeature, GetBikesResponseDto } from './types';
import Marker from './components/Marker';
import Modal from './components/Modal';

function App() {
  const [bikesInfo, setBikesInfo] = useState<GetBikesResponseDto | null>(null);
  const [selectedKiosk, setSelectedKiosk] = useState<BikesFeature | null>(null);
  const [shouldModalShow, setShouldModalShow] = useState(false);

  const defaultPropsRef = useRef({
    center: {
      lat: 39.952583,
      lng: -75.165222,
    },
    zoom: 13,
  });

  const showModal = useCallback(() => setShouldModalShow(true), []);
  const hideModal = useCallback(() => setShouldModalShow(false), []);
  const handleSelectKiosk = useCallback((bike: BikesFeature) => {
    setSelectedKiosk(bike);
    showModal();
  }, [showModal]);
  const clearSelectedKiosk = useCallback(() => setSelectedKiosk(null), []);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('update-bikes', (payload: GetBikesResponseDto) => {
      if (bikesInfo?.lastUpdated !== payload.lastUpdated) {
        setBikesInfo(payload);
      }
    });

    return () => {
      socket.close();
      socket.disconnect();
    }
  }, [bikesInfo?.lastUpdated]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<GetBikesResponseDto>('http://localhost:3000/bikes');

      setBikesInfo(data);
    };

    fetchData();
  }, []);

  const lastUpdated = useMemo(() => {
    if (!bikesInfo) return '';

    return new Date(bikesInfo.lastUpdated).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  }, [bikesInfo]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {lastUpdated && <span className="last-updated">Last updated: {lastUpdated}</span>}

      <Modal
        bike={selectedKiosk}
        shouldModalShow={shouldModalShow}
        clearSelectedKiosk={clearSelectedKiosk}
        hideModal={hideModal}
      />

      <GoogleMapReact
        style={{ height: '100vh', width: '100%' }}
        yesIWantToUseGoogleMapApiInternals
        bootstrapURLKeys={{ key: import.meta.env.VITE_MAPS_API_KEY }}
        defaultCenter={defaultPropsRef.current.center}
        defaultZoom={defaultPropsRef.current.zoom}
      >
        {bikesInfo && bikesInfo.kiosksData.available.map((bike) => (
          <Marker
            key={bike.properties.id}
            status="available"
            handleClick={() => handleSelectKiosk(bike)}
            bike={bike}
            // @ts-ignore
            lat={bike.geometry.coordinates[1]}
            // @ts-ignore
            lng={bike.geometry.coordinates[0]}
            // @ts-ignore
            info={bike.properties.name}
          />
        ))}

        {bikesInfo && bikesInfo.kiosksData.warning.map((bike) => (
          <Marker
            key={bike.properties.id}
            status="warning"
            handleClick={() => handleSelectKiosk(bike)}
            bike={bike}
            // @ts-ignore
            lat={bike.geometry.coordinates[1]}
            // @ts-ignore
            lng={bike.geometry.coordinates[0]}
            // @ts-ignore
            info={bike.properties.name}
          />
        ))}

        {bikesInfo && bikesInfo.kiosksData.critical.map((bike) => (
          <Marker
            key={bike.properties.id}
            status="critical"
            handleClick={() => handleSelectKiosk(bike)}
            bike={bike}
            // @ts-ignore
            lat={bike.geometry.coordinates[1]}
            // @ts-ignore
            lng={bike.geometry.coordinates[0]}
            // @ts-ignore
            info={bike.properties.name}
          />
        ))}
      </GoogleMapReact>
    </div>
  )
}

export default App
