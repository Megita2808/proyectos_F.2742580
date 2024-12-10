/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";

import { DataRowDistribuidor } from '../../tiposFilas/distribuidor';

import Table from '../../tabla/formatoTabla';

import EditarEstado from '@/service/api/usuarios/distribuidor/CambiarEstado';
import EstadoInput from './estado/estadoInput';

Modal.setAppElement('#root');

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

interface DataTableProps {
  data: DataRowDistribuidor[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data: initialData, setRefreshData }) => {

  const [data, setData] = useState<DataRowDistribuidor[]>(initialData);
  const [refreshData, setRefreshDataState] = useState(false);

  const EnviarSolicitud = async (estado: string, identificador: string) => {
    try {
      const response = await EditarEstado(identificador, estado);
      setData(prevData =>
        prevData.map(item =>
          item.identificador === identificador ? { ...item, estado } : item
        )
      );
      setRefreshData(true);
    } catch (error) {
      console.error("Error durante la solicitud:", error);
    }
  };

  const columns: Column<DataRowDistribuidor>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },      { 
        Header: "Nombre empresa", 
        accessor: "nombreEmpresa", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },      { 
        Header: "Correo de la empresa", 
        accessor: "correoEmpresa", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },      { 
        Header: "Teléfono", 
        accessor: "telefono", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },      { 
        Header: "Dirección", 
        accessor: "Direccion", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Estado", 
        accessor: "estado",
        Cell: ({ row }) => (
          <div   
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
          }}
        >
          <EstadoInput
            initialEstado={row.original.estado}
            onChange={(nuevoEstado) => {
              EnviarSolicitud(nuevoEstado, row.original.identificador);
            }}
          />
        </div>
        )
      }
    ],
    []
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    const columnsToInclude = [0, 1, 2];
    
    const tableColumn = columns
      .filter((_, index) => columnsToInclude.includes(index))
      .map((col) => col.Header as string);
    const tableRows = data.map((row) => {
      const rowData = Object.values(row);
      if (rowData[3] == true) {
        rowData[2] = "Habilitado" 
      }else{
        rowData[2] = "Inhabilitado"
      }

      rowData.splice(3, 1);
  
      return rowData;
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });
  
    doc.save("table.pdf");
  };

  useEffect(() => {
    if (refreshData) {
      setRefreshData(true);
      setRefreshDataState(false);
    }
  }, [refreshData, setRefreshData]);

  return (
    <div style={{ padding: "20px" }}>
      <Table<DataRowDistribuidor> columns={columns} data={data} setRefreshData={setRefreshData} />
    </div>
  );
};

export default DataTable;