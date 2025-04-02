import Chart from "react-apexcharts";
import { BsDot, BsThreeDots } from "react-icons/bs";
import { useState, useEffect } from "react";


// Placeholder for Dropdown components if missing
const Dropdown = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;
  return (
    <div className={`absolute right-0 mt-2 bg-white shadow-lg rounded-lg ${className}`}>
      {children}
    </div>
  );
};

const DropdownItem = ({ onItemClick, children, className }) => (
  <button onClick={onItemClick} className={`px-4 py-2 ${className}`}>
    {children}
  </button>
);

export default function DailySalesChart() {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch daily sales data from your API
    fetch("http://<your-server-ip>:3000/api/daily-sales")
      .then((response) => response.json())
      .then((data) => {
        setSalesData(data); // Example: [50, 60, 45, ..., 90]
      })
      .catch((error) => console.error("Error fetching daily sales data:", error));
  }, []);

  const options = {
    colors: ["#fb8602"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: Array.from({ length: 31 }, (_, i) => (i + 1).toString()), // ["1", "2", ..., "31"]
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      labels: {
        colors: ["#465fff"],
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: "Daily Sales",
      data: salesData.length > 0
        ? salesData
        : [
            50, 60, 45, 70, 55, 80, 90, 65, 75, 60, 85, 70, 95, 100, 80,
            55, 60, 45, 70, 55, 80, 90, 65, 75, 60, 85, 70, 95, 100, 80, 90,
          ],
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white px-5 pt-5  sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Daily Sales
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <BsThreeDots className="text-gray-400 hover:text-gray-700 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2 z-20">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}