import Chart from "react-apexcharts";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";

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

export default function SupplierExpensesChart() {
  const series = [75];
  const options = {
    colors: ["#fb8602"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#fb8602",
            formatter: function (val) {
              return "GHS" + val;
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#fb8602"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Daily Supplier Expenses
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm">
              The amount it costs to supply goods and services to the company.
            </p>
          </div>
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <BsThreeDots className="text-gray-400 hover:text-gray-700 size-6" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2 z-20"
            >
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                View All Supplier Expenses
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-green-500">
            +10%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          An amount of GHS 3,287 was used to pay for MateriaOne, MaterialTwo and MaterialThree. This is more than the previous transaction on DateOne.
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs sm:text-sm">
            T & T Expenses
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg">
            GHS 2000
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs sm:text-sm">
            Invoice Expense
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg">
            GHS 31K
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs sm:text-sm">
            Balance with Supplier
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg">
            GHS 20K
          </p>
        </div>
      </div>
    </div>
  );
}