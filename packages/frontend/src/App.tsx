/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useMemo, useRef, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import io from 'socket.io-client';

import './App.css';
import { GetBikesResponseDto } from './types';
import Marker from './components/Marker';

function App() {
  const [bikesInfo, setBikesInfo] = useState<GetBikesResponseDto | null>(null);

  const defaultPropsRef = useRef({
    center: {
      lat: 39.952583,
      lng: -75.165222,
    },
    zoom: 13,
  });

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
            bike={bike}
            // @ts-ignore
            lat={bike.geometry.coordinates[1]}
            // @ts-ignore
            lng={bike.geometry.coordinates[0]}
          />
        ))}

        {bikesInfo && bikesInfo.kiosksData.warning.map((bike) => (
          <Marker
            key={bike.properties.id}
            status="warning"
            bike={bike}
            // @ts-ignore
            lat={bike.geometry.coordinates[1]}
            // @ts-ignore
            lng={bike.geometry.coordinates[0]}
          />
        ))}

        {bikesInfo && bikesInfo.kiosksData.critical.map((bike) => (
          <Marker
            key={bike.properties.id}
            status="critical"
            bike={bike}
            // @ts-ignore
            lat={bike.geometry.coordinates[1]}
            // @ts-ignore
            lng={bike.geometry.coordinates[0]}
          />
        ))}
      </GoogleMapReact>
    </div>
  )
}

export default App
