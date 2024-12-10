import React, { useState, useEffect } from 'react';
import "./estilosFomurlario.css";

interface AddressFormProps {
  onSubmit: (data: any, tipoDireccion: string) => void;
  onCancel: () => void;
  initialData?: any | null;
  TituloFormulario?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, onCancel, initialData, TituloFormulario}) => {
  const [addressType, setAddressType] = useState(initialData?.tipoVia ? 'URBANA EN COLOMBIA' : 'RURAL O EXTRANJERA');
  const [address, setAddress] = useState({
    tipoVia: initialData?.tipoVia || '',
    numeroVia: initialData?.numeroVia || '',
    prefijoVia: initialData?.prefijoVia || '',
    cardinalidadVia: initialData?.cardinalidadVia || '',
    numeroViaCrl: initialData?.numeroViaCrl || '',
    prefijoViaCrl: initialData?.prefijoViaCrl || '',
    cardinalidadViaCrl: initialData?.cardinalidadViaCrl || '',
    numeroPlaca: initialData?.numeroPlaca || '',
    unidadUrbanizacion: initialData?.unidadUrbanizacion || '',
    ruralAddress: initialData?.ruralAddress || ''
  });
  const [ruralAddress, setRuralAddress] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!address || (addressType === 'URBANA EN COLOMBIA' && address.ruralAddress)) {
      console.error("Debe proporcionar una dirección urbana.");
      return;
    }
    
    if (addressType !== 'URBANA EN COLOMBIA' && !address.ruralAddress) {
      console.error("Debe proporcionar una dirección rural.");
      return;
    }
  
    const data = addressType === 'URBANA EN COLOMBIA' ? address : { ruralAddress: address.ruralAddress };
  
    onSubmit(data, addressType);
    
    onCancel();
  };

  const prefijosColombia = [
    'A','AC', 'AD', 'ADL', 'AER', 'AG', 'AGP', 'AK', 'AL', 'ALD', 'ALM', 'AP', 'APTDO', 'ATR', 'AUT', 'AV', 'AVIAL', 'B', 'BG', 'BL', 'BLV', 'BRR',
    'C', 'CA', 'CAS', 'CC', 'CD', 'CEL', 'CEN', 'CIR', 'CL', 'CLJ', 'CN', 'CON', 'CONJ', 'CR', 'CRT', 'CRV', 'CS', 'DG', 'DP', 'DPTO', 'DS',
    'ED', 'EN', 'ES', 'ESQ', 'ET', 'EX', 'FCA', 'GJ', 'GS', 'GT', 'HC', 'HG', 'IN', 'IP', 'IPD', 'IPM', 'KM', 'LC', 'LM', 'LT', 'MD', 'MJ',
    'MLL', 'MN', 'MZ', 'NORTE', 'O', 'OCC', 'OESTE', 'OF', 'P', 'PA', 'PAR', 'PD', 'PH', 'PJ', 'PL', 'PN', 'POR', 'POS', 'PQ', 'PRJ', 'PS',
    'PT', 'PW', 'RP', 'SA', 'SC', 'SD', 'SEC', 'SL', 'SM', 'SS', 'ST', 'SUITE', 'SUR', 'TER', 'TERPLN', 'TO', 'TV', 'TZ', 'UN', 'UR', 'URB',
    'VRD', 'VTE', 'ZF', 'ZN'
  ];

  return (
    <form onSubmit={handleSubmit} className="address-form" style={{minWidth:'400px'}}>
      <label className="titleSinFondoModal">{TituloFormulario}</label>
      <label style={{marginTop:'10px'}}>Dirección</label>
      <select 
        className="address-form__select" 
        value={addressType} 
        onChange={(e) => setAddressType(e.target.value)}
      >
        <option value="URBANA EN COLOMBIA">URBANA EN COLOMBIA</option>
        <option value="RURAL O EXTRANJERA">RURAL</option>
      </select>

      {addressType === 'URBANA EN COLOMBIA' ? (
        <div className="address-form__grid">
          <InputField label="Tipo Vía" name="tipoVia" value={address.tipoVia} onChange={handleInputChange}>
            <option value="">Seleccione</option>
            <option value="Calle">Calle</option>
            <option value="Carrera">Carrera</option>
            <option value="Avenida">Avenida</option>
          </InputField>
          <InputField label="Número Vía" name="numeroVia" value={address.numeroVia} onChange={handleInputChange} />
          <InputField label="Prefijo Vía" name="prefijoVia" value={address.prefijoVia} onChange={handleInputChange}>
            <option value="">Seleccione</option>
            {prefijosColombia.map(prefijo => <option key={prefijo} value={prefijo}>{prefijo}</option>)}
          </InputField>
          <InputField label="Cardinalidad" name="cardinalidadVia" value={address.cardinalidadVia} onChange={handleInputChange}>
            <option value="">Seleccione</option>
            <option value="Norte">Norte</option>
            <option value="Sur">Sur</option>
            <option value="Este">Este</option>
            <option value="Oeste">Oeste</option>
          </InputField>
              <div>
                <label>Número Vía CRL</label>
                <input type="text" name="numeroViaCrl" value={address.numeroViaCrl} onChange={handleInputChange} />
              </div>

              <div>
                <label>Prefijo Vía CRL</label>
                <select name="prefijoViaCrl" value={address.prefijoViaCrl} onChange={handleInputChange}>
                  <option value="">Seleccione</option>
                  {prefijosColombia.map((prefijo) => (
                    <option key={prefijo} value={prefijo}>{prefijo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Cardinalidad CRL</label>
                <select name="cardinalidadViaCrl" value={address.cardinalidadViaCrl} onChange={handleInputChange}>
                  <option value="">Seleccione</option>
                  <option value="Este">Este</option>
                  <option value="Oeste">Oeste</option>
                </select>
              </div>

              <div>
                <label>Número Placa</label>
                <input type="text" name="numeroPlaca" value={address.numeroPlaca} onChange={handleInputChange} />
              </div>
            </div>
          ) : (
            <div className="address-form__rural">
              <label>Dirección</label>
              <input
                type="text"
                name="ruralAddress"
                value={ruralAddress}
                onChange={(e) => setRuralAddress(e.target.value)}
                placeholder="Ej: Vereda Aguas Claras, 1412 Westside FL 33144"
              />
            </div>
          )}
      <div className="address-form__summary">
        <h3><strong>Unidad Urbanización</strong></h3>
        <input type="text" name="unidadUrbanizacion" value={address.unidadUrbanizacion} onChange={handleInputChange} className='inputUrbanizacion' placeholder="Ej: Urbanización Manzanares Bloque 4 Apto 302" />
      </div>

      <div className="address-form__summary">
        <h3><strong>Resumen de la dirección</strong></h3>
        <input type="text" className="address-form__disabled" disabled value={
          addressType === 'URBANA EN COLOMBIA'
            ? `${address.tipoVia || ''} ${address.numeroVia || ''} ${address.prefijoVia || ''} ${address.cardinalidadVia || ''} # ${address.numeroViaCrl || ''} ${address.prefijoViaCrl || ''} ${address.cardinalidadViaCrl || ''}- ${address.numeroPlaca || ''}, ${address.unidadUrbanizacion || ''}`
            : address.ruralAddress || ''
        }/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr'}}>
        <button type="submit" className="address-form__submit">Guardar</button>
        <button type="button" className="address-form__cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  children?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, children }) => (
  <div>
    <label>{label}</label>
    {children ? (
      <select name={name} value={value} onChange={onChange}>
        {children}
      </select>
    ) : (
      <input type="text" name={name} value={value} onChange={onChange} />
    )}
  </div>
);

export default React.memo(AddressForm);
