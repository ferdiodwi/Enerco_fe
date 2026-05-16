import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";

export default function SourcesBarChart() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    setIsDarkMode(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  const options: ApexOptions = {
    colors: ["#14b8a6", "#3b82f6", "#f59e0b"], // teal-500, blue-500, amber-500
    chart: {
      fontFamily: "Inter, sans-serif",
      type: "bar",
      height: 310,
      toolbar: { show: false },
      background: "transparent",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Senen", "Menteng", "Gambir", "Tanah Abang", "Cempaka", "Kemayoran", "Johar"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: isDarkMode ? "#64748b" : "#64748b" },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      labels: { colors: isDarkMode ? "#94a3b8" : "#475569" },
    },
    grid: {
      borderColor: isDarkMode ? "#1e293b" : "#e2e8f0",
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    theme: { mode: isDarkMode ? "dark" : "light" },
    tooltip: {
      enabled: true,
      theme: isDarkMode ? "dark" : "light",
      y: { formatter: (val) => `${val} kWh` },
    },
    yaxis: {
      labels: {
        style: { colors: isDarkMode ? "#64748b" : "#64748b" },
      },
    },
  };

  const series = [
    { name: "Solar", data: [44, 55, 41, 67, 22, 43, 21] },
    { name: "Wind", data: [13, 23, 20, 8, 13, 27, 33] },
    { name: "Hydro", data: [11, 17, 15, 15, 21, 14, 15] },
  ];

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="bar" height={310} width="100%" />
    </div>
  );
}
