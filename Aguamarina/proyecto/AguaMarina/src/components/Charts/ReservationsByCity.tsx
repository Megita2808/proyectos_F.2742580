"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchCities } from "@/api/fetchs/get_ciudades"; 
import Link from "next/link";

const ReservationsByCity: React.FC = () => {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCities();
      const filteredData = data.filter((ciudad: any) => ciudad.quantity > 0);
      const quantities = filteredData.map((ciudad: any) => ciudad.quantity);
      const names = filteredData.map((ciudad: any) => ciudad.name);

      setSeries(quantities);
      setLabels(names);
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#5750F1", "#5475E5", "#8099EC", "#ADBCF2"],
    labels: labels,
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Aprobadas y Finalizadas",
              fontSize: "16px",
              fontWeight: "400",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Reservas por Municipio
          </h4>
          <Link
                href="admin/reservas"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <svg width="24px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 10H7C9 10 10 9 10 7V5C10 3 9 2 7 2H5C3 2 2 3 2 5V7C2 9 3 10 5 10Z" stroke="#292D32" strokeWidth="1.5" /* stroke-miterlimit="10" */ strokeLinecap="round" strokeLinejoin="round"></path> <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" stroke="#292D32" strokeWidth="1.5" /* stroke-miterlimit="10" */ strokeLinecap="round" strokeLinejoin="round"></path> <path d="M17 22H19C21 22 22 21 22 19V17C22 15 21 14 19 14H17C15 14 14 15 14 17V19C14 21 15 22 17 22Z" stroke="#292D32" strokeWidth="1.5" /* stroke-miterlimit="10" */ strokeLinecap="round" strokeLinejoin="round"></path> <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" stroke="#292D32" strokeWidth="1.5" /* stroke-miterlimit="10" */ strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                Ver Reservas
              </Link>
        </div>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center items-center w-full" style={{ height: "min(60vw, 300px)" }}>
          {series.length > 0 && labels.length > 0 ? (
            <ReactApexChart options={options} series={series} type="donut" />
          ) : (
            <div className="text-center text-gray-500 text-xl font-sans">
              No hay reservas aprobadas o finalizadas
            </div>
          )}
        </div>
      </div>

      {series.length > 0 && labels.length > 0 && (
        <div className="mx-auto w-full max-w-[350px]">
          <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
            {labels.map((label, index) => (
              <div key={index} className="w-full px-7.5 sm:w-1/2">
                <div className="flex w-full items-center">
                  <span className={`mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light-${index + 1}`}></span>
                  <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                    <span>{label}</span>
                    <span>{series[index]}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsByCity;
