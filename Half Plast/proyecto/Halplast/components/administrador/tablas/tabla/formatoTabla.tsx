import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useTable, useFilters, usePagination, Column, TableState, TableInstance, Row } from 'react-table';

interface DataTableProps<T extends object> {
  data: T[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
  columns: Column<T>[];
}

type TableInstanceWithFiltersPagination<T extends object> = TableInstance<T> & {
  page: Row<T>[];
  setFilter: (columnId: string, filterValue: any) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
  pageCount: number;
  state: {
    pageIndex: number;
    pageSize: number;
  };
};

const Table = <T extends object>({ data, setRefreshData, columns }: DataTableProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [refreshData, setRefreshDataState] = useState(false);
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setFilter,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageCount,
    state: { pageIndex, pageSize },
  } = useTable<T>(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      } as TableState<T>,
    },
    useFilters,
    usePagination
  ) as TableInstanceWithFiltersPagination<T>;

  useEffect(() => {
    if (activeColumn) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      if (inputRef.current) {
        setFilter("", undefined);
      }
    }
  }, [activeColumn, setFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>, value: string, columnId: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [columnId]: value,
    }));
    setFilter(columnId, value || undefined);
  };

  const handleHeaderClick = useCallback(
    (columnId: string) => {
      if (filters[columnId] !== undefined) {
        setFilters((prevFilters) => {
          const { [columnId]: _, ...rest } = prevFilters;
          return rest;
        });
        setFilter(columnId, undefined);
      } else {
        setActiveColumn((prevActiveColumn) =>
          prevActiveColumn === columnId ? null : columnId
        );
      }
    },
    [filters, setFilter]
  );

  const isNonSearchableColumn = (columnId: string) => {
    const nonSearchableColumns = ['Editar', 'Eliminar'];
    return nonSearchableColumns.includes(columnId);
  };

  useEffect(() => {
    if (refreshData) {
      setRefreshData(true);
      setRefreshDataState(false);
    }
  }, [refreshData, setRefreshData]);

  return (
    <>
      <table
        {...getTableProps()}
        className="TableContainer"
      >
        <thead style={{ backgroundColor: "#f7f7f7" }}>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${index}`}>
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  {...column.getHeaderProps()}
                  key={`column-${column.id}-${columnIndex}`}
                  onClick={() =>
                    !isNonSearchableColumn(column.id) && handleHeaderClick(column.id)
                  }
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    cursor: isNonSearchableColumn(column.id)
                      ? "default"
                      : "pointer",
                    position: "relative",
                    backgroundColor:
                      activeColumn === column.id ? "#e0e0e0" : "inherit",
                  }}
                >
                  {column.render("Header")}
                  {((activeColumn === column.id && !isNonSearchableColumn(column.id)) ||
                    filters[column.id]) && (
                    <input
                      ref={inputRef}
                      className="inputBuscador"
                      type="text"
                      placeholder={`Buscar ${column.render("Header")}`}
                      value={filters[column.id] || ""}
                      onChange={(e) => handleSearch(e, e.target.value, column.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={`row-${row.id}-${rowIndex}`}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    {...cell.getCellProps()}
                    key={`cell-${cell.column.id}-${cellIndex}`}
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="paginacion">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Anterior
        </button>
        <span>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageCount}
          </strong>{' '}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Siguiente
        </button>
      </div>
    </>
  );
};

export default Table;
