import React, {useState} from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    margin:"auto",
    height: '500px'
};

const MyGoogleMap = ({center}) => {
    const [map, setMap] = useState(null);
/*     const center = {
        lat: -3.745,
        lng: -38.523
    }; */

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map)
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, []);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "YOUR_API_KEY"
    });

    return(
        <div className="map mt-4">
        {
            isLoaded ?
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                { /* Child components, such as markers, info windows, etc. */ }
                <></>
            </GoogleMap> :
            null
        }
        </div>
    )
};

export default MyGoogleMap;