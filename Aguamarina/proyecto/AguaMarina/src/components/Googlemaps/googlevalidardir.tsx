/* import { useEffect } from 'react';

const AddressSelection = () => {
  useEffect(() => {
    // Asegúrate de que la librería esté disponible
    if (window.customElements.get('gmpx-api-loader')) {
      initMap();
    }
  }, []);

  async function initMap() {
    const { APILoader } = await import('https://unpkg.com/@googlemaps/extended-component-library@0.6');

    const CONFIGURATION = {
      ctaTitle: 'validar',
      mapOptions: {
        center: { lat: 37.4221, lng: -122.0841 },
        fullscreenControl: true,
        mapTypeControl: false,
        streetViewControl: true,
        zoom: 14,
        zoomControl: true,
        maxZoom: 22,
      },
      mapsApiKey: 'AIzaSyCRGp3XtSs5oNiYbl4_butj75-tn0RGElU', // Asegúrate de usar tu propia API key
      capabilities: {
        addressAutocompleteControl: true,
        mapDisplayControl: true,
        ctaControl: true,
      },
    };

    const SHORT_NAME_ADDRESS_COMPONENT_TYPES = new Set([
      'street_number',
      'administrative_area_level_1',
      'postal_code',
    ]);

    const ADDRESS_COMPONENT_TYPES_IN_FORM = [
      'location',
      'locality',
      'administrative_area_level_1',
      'postal_code',
      'country',
    ];

    function getFormInputElement(componentType: string) {
      return document.getElementById(`${componentType}-input`) as HTMLInputElement;
    }

    function fillInAddress(place: google.maps.places.PlaceResult) {
      function getComponentName(componentType: string) {
        for (const component of place.address_components || []) {
          if (component.types[0] === componentType) {
            return SHORT_NAME_ADDRESS_COMPONENT_TYPES.has(componentType)
              ? component.short_name
              : component.long_name;
          }
        }
        return '';
      }

      function getComponentText(componentType: string) {
        return componentType === 'location'
          ? `${getComponentName('street_number')} ${getComponentName('route')}`
          : getComponentName(componentType);
      }

      for (const componentType of ADDRESS_COMPONENT_TYPES_IN_FORM) {
        const input = getFormInputElement(componentType);
        if (input) {
          input.value = getComponentText(componentType);
        }
      }
    }

    function renderAddress(place: google.maps.places.PlaceResult) {
      const mapEl = document.querySelector('gmp-map') as HTMLElement;
      const markerEl = document.querySelector('gmp-advanced-marker') as HTMLElement;

      if (place.geometry && place.geometry.location) {
        mapEl.setAttribute('center', JSON.stringify(place.geometry.location));
        markerEl.setAttribute('position', JSON.stringify(place.geometry.location));
      } else {
        markerEl.setAttribute('position', '');
      }
    }

    const { Autocomplete } = await APILoader.importLibrary('places');

    const mapOptions = CONFIGURATION.mapOptions;
    mapOptions.mapId = mapOptions.mapId || 'DEMO_MAP_ID';
    mapOptions.center = mapOptions.center || { lat: 37.4221, lng: -122.0841 };

    await customElements.whenDefined('gmp-map');
    const mapElement = document.querySelector('gmp-map') as HTMLElement;
    mapElement.innerMap.setOptions(mapOptions);

    const autocomplete = new Autocomplete(getFormInputElement('location'), {
      fields: ['address_components', 'geometry', 'name'],
      types: ['address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        alert(`No details available for input: '${place.name}'`);
        return;
      }
      renderAddress(place);
      fillInAddress(place);
    });
  }

  return (
    <div>
      <gmpx-api-loader
        key="AIzaSyCRGp3XtSs5oNiYbl4_butj75-tn0RGElU"
        solution-channel="GMP_QB_addressselection_v3_cABC"
      />
      <gmpx-split-layout row-layout-min-width="600">
        <div className="panel" slot="fixed">
          <div>
            <img
              className="sb-title-icon"
              src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg"
              alt=""
            />
            <span className="sb-title">Address Selection</span>
          </div>
          <input type="text" placeholder="Address" id="location-input" />
          <input type="text" placeholder="Apt, Suite, etc (optional)" />
          <input type="text" placeholder="City" id="locality-input" />
          <div className="half-input-container">
            <input
              type="text"
              className="half-input"
              placeholder="State/Province"
              id="administrative_area_level_1-input"
            />
            <input
              type="text"
              className="half-input"
              placeholder="Zip/Postal code"
              id="postal_code-input"
            />
          </div>
          <input type="text" placeholder="Country" id="country-input" />
          <gmpx-icon-button variant="filled">validar</gmpx-icon-button>
        </div>
        <gmp-map slot="main">
          <gmp-advanced-marker></gmp-advanced-marker>
        </gmp-map>
      </gmpx-split-layout>

      <style jsx>{`
        .panel {
          background: white;
          box-sizing: border-box;
          height: 100%;
          width: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        .half-input-container {
          display: flex;
          justify-content: space-between;
        }

        .half-input {
          max-width: 120px;
        }

        h2 {
          margin: 0;
          font-family: Roboto, sans-serif;
        }

        input {
          height: 30px;
        }

        input {
          border: 0;
          border-bottom: 1px solid black;
          font-size: 14px;
          font-family: Roboto, sans-serif;
        }

        input:focus::placeholder {
          color: white;
        }
      `}</style>
    </div>
  );
};

export default AddressSelection;
 */