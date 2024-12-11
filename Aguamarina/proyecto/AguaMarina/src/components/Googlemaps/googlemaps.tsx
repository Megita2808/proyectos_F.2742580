import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '20px',  // Redondear los bordes
  overflow: 'hidden',
  margin: '20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 1)',

};

const center = {
  lat: 6.235387317079811,
  lng: -75.54852489080734,
};

const GoogleMapComponent = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCRGp3XtSs5oNiYbl4_butj75-tn0RGElU">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
