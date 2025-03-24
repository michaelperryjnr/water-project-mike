import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from "../../Layout/DefaultLayout";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import { BsChevronLeft, BsChevronRight, BsChevronDoubleLeft, BsChevronDoubleRight, BsSearch, BsPlus } from 'react-icons/bs';
import EmployeeDropdown from '../../Components/Dropdown/EmployeeDropdown';
import { exportToDOCX, exportToCSV, exportToXLSX } from '../../Components/Utils/exportUtils';
import ExportDropdown from '../../Components/Dropdown/ExportDropdown';
import axios from 'axios'; // Import axios for API requests
import Modal from '../../Components/Modal';
import EmployeeForm from '../../Components/Forms/EmployeeForm';

const Employee = () => {
  const [employees, setEmployees] = useState([]); // Initialize state for employee data
  const apiUrl = import.meta.env.VITE_API_URL;
  const employeeUrl = `${apiUrl}/employees`;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch employee data from API when the component mounts
    axios.get(employeeUrl)  // Replace with your actual API endpoint
      .then(response => {
        // Check if response.data is an array and set state accordingly
        if (Array.isArray(response.data)) {
          setEmployees(response.data);  // Set the fetched data to the state
        } else {
          console.error('Expected an array from API, but received:', response.data);
          setEmployees([]);  // If the data is not an array, fallback to an empty array
        }
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
        setEmployees([]);  // If the API call fails, fallback to an empty array
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredData = useMemo(() => {
    return Array.isArray(employees) ? employees.filter((row) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      );
    }) : [];  // fallback to empty array if employees is not an array
  }, [search, employees]);
  

  const resultCount = filteredData.length;

  const columns = useMemo(() => [
    {
      accessorKey: 'name',  // Custom accessor for full name
      header: () => <span>Name</span>,
      cell: info => {
        const { title, firstName, middleName, lastName } = info.row.original;
        return `${title} ${firstName} ${middleName || ''} ${lastName}`;
      },
    },
    {
      accessorKey: 'position',  // Access position title
      header: () => <span>Position</span>,
      cell: info => {
        return info.row.original.position?.positionTitle || 'N/A';
      },
    },
    {
      accessorKey: 'department',  // Access department name
      header: () => <span>Department</span>,
      cell: info => {
        return info.row.original.department?.departmentName || 'N/A';
      },
    },
    {
      accessorKey: 'email',  // Access email
      header: () => <span>Email</span>,
      cell: info => info.row.original.email,
    },
    {
      accessorKey: 'salary',  // Access salary
      header: () => <span>Salary</span>,
      cell: info => info.row.original.salary,
    },
    {
      accessorKey: 'isFullTime',  // Access full-time status
      header: () => <span>Full Time</span>,
      cell: info => (info.row.original.isFullTime ? 'Yes' : 'No'),
    },
    {
      accessorKey: 'actions',
      header: () => <span>Actions</span>,
      cell: info => (
        <EmployeeDropdown row={info.row.original} />
      ),
    },
  ], []);
  

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleExport = (format) => {
    switch (format) {
      case 'csv':
        exportToCSV(filteredData, 'Employees-data');
        break;
      case 'xlsx':
        exportToXLSX(filteredData, 'Employees-data');
        break;
      case 'docx':
        exportToDOCX(filteredData, 'Employees-data');
        break;
      default:
        break;
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 bg-white py-6 rounded-b-md">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            Employees
          </h3>
        </div>
        <div className='flex justify-end mb-4'>
            {/* <Modal btnName={"Employ"} title={"Create A New Employee"} >
                <EmployeeForm />
            </Modal> */}
            <Link to={'/test#employee-form'} className='text-center py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-taureanOrange text-white hover:bg-taureanLightBlue disabled:opacity-50 disabled:pointer-events-none'>
              Add Employee
              <BsPlus size={24} />
            </Link>
        </div>
        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
          <div className="sm:col-span-1 mt-4 md:pr-20 md:flex-shrink-0">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <input
                type="text"
                id="search"
                className="py-2 px-3 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                <BsSearch className="shrink-0 size-4 text-gray-400" size={24} />
              </div>
            </div>
          </div>
          <div className="sm:col-span-1 mt-4 md:flex-shrink-0">
            <p className="text-sm bg-gray-300 text-gray-700 font-bold rounded-md px-4 py-3 text-center sm:text-center sm:px-1">
              {resultCount} result{resultCount !== 1 && 's'} found
            </p>
          </div>
          <div className="sm:col-span-2 md:grow">
            <div className="flex justify-end gap-x-2">
              <ExportDropdown onExport={handleExport} />
            </div>
          </div>
        </div>

        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="divide-x">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="py-3 px-6">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-gray-600 divide-y">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="divide-x">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              Pages
            </p>
          </div>
          <div>
            <div className="inline-flex gap-x-2">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <BsChevronDoubleLeft className="shrink-0 size-4" size={24} />
                First Page
              </button>

              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <BsChevronLeft className="shrink-0 size-4" size={24} />
                Prev
              </button>

              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
                <BsChevronRight className="shrink-0 size-4" size={24} />
              </button>

              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                Last Page
                <BsChevronDoubleRight className="shrink-0 size-4" size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Employee;
