"use client";

import { tabla_anidada } from "@/interfaces";
import axios from "axios";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import { useEffect, useState } from "react";

interface Props {
  title:string,
  entidad:string,
  anidados?:tabla_anidada[]
  columns:MUIDataTableColumn[]
}

export const GenericDataTable = (
  //options: MUIDataTableOptions,
  //rows: Array<object | number[] | string[]>,
  {columns,title,anidados,entidad}:Props) => {
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState<string>();
  const [filterParam, setFilter] = useState<string>();
  const [search, setSearch] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData(currentPage, pageSize, sortBy, filterParam, search);
  }, [currentPage, pageSize, sortBy, filterParam, search]);

  const fetchData = async (
    page?: number,
    pageSize?: number,
    sortBy?: string,
    filter?: string,
    search?: string
  ) => {
    const response = await axios.get(
      `http://localhost:8000/api/`+entidad + "?" + filter,
      {
        params: {
          page: page,
          limit: pageSize,
          sortBy: sortBy,
          search: search,
        },
      }
    );

    try {
      const data = response.data;
      setRows(data.data);
      setTotalRows(data.meta.totalItems);
      setPageSize(data.meta.itemsPerPage);
      setCurrentPage(data.meta.currentPage);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const options: MUIDataTableOptions = {
    pagination: true,
    serverSide: true,
    selectableRowsHeader: false,
    sort: true,
    count: totalRows,
    page: currentPage - 1,
    draggableColumns: {
      enabled: true,
    },
    onColumnSortChange: (column: string, direction: string) => {
      const newSortBy = `${column}:${direction.toUpperCase()}`;
      setSortBy(newSortBy);
      setCurrentPage(1);
    },
    rowsPerPage: pageSize,
    rowsPerPageOptions: [5, 10, 20],
    onChangePage: (page: number) => {
      setCurrentPage(page + 1);
    },
    onSearchChange: (search: string | null) => {
      if (search == null) search = "";
      setSearch(search);
      setCurrentPage(1);
    },
    onFilterChange: (
      column: string | MUIDataTableColumn | null,
      filterList: string[][]
    ) => {

      if(anidados){
        anidados.forEach(tabla => {
          if(column == tabla.tablaHija){
            tabla.columnas.forEach(columna => {
              column = column +'.'+columna
            });
          }
        });
      }

      let currentFilters = filterParam ? filterParam.split("&") : [];

      currentFilters = currentFilters.filter(
        (filter) => !filter.startsWith(`filter.${column}=`)
      );

      const newFilters = filterList
        .filter((subArray) => subArray.length > 0)
        .map((subArray) =>
          subArray
            .filter((filter) => filter !== "")
            .map((filter) => `filter.${column}=${encodeURIComponent(filter)}`)
            .join("&")
        )
        .filter((str) => str !== "");

      const filterString = [...currentFilters, ...newFilters].join("&");

      setFilter(filterString);

      setCurrentPage(1);
    },
    onChangeRowsPerPage: (rowsPerPage: number) => {
      setPageSize(rowsPerPage);
      setCurrentPage(1);
    },
  };

  return (
    <MUIDataTable
      options={options}
      title={title}
      data={rows}
      columns={columns}
    />
  );
};
