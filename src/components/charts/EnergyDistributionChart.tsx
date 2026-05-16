import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";

export default function EnergyDistributionChart() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark since Enerco is dark

  useEffect(() => {
    // Check if html has dark class
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
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: isDarkMode ? "#94a3b8" : "#475569", // slate-400 : slate-600
      },
    },
    colors: ["#10b981", "#06b6d4"], // emerald-500, cyan-500
    chart: {
      fontFamily: "Inter, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: isDarkMode ? "#0f172a" : "#ffffff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      borderColor: isDarkMode ? "#1e293b" : "#e2e8f0", // slate-800 : slate-200
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    theme: {
      mode: isDarkMode ? "dark" : "light",
    },
    tooltip: {
      enabled: true,
      theme: isDarkMode ? "dark" : "light",
    },
    xaxis: {
      type: "category",
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: isDarkMode ? "#64748b" : "#64748b", // slate-500
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDarkMode ? "#64748b" : "#64748b", // slate-500
        },
        formatter: (val) => `${val}k`,
      },
    },
  };

  const series = [
    {
      name: "Target Energi (kWh)",
      data: [45, 52, 38, 45, 48, 52, 60, 58, 65, 70, 68, 75],
    },
    {
      name: "Tersalurkan (kWh)",
      data: [35, 41, 36, 38, 45, 48, 55, 52, 60, 65, 62, 70],
    },
  ];

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="area" height={310} width="100%" />
    </div>
  );
}
