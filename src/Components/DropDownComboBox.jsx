import { useState } from 'react';
import { BsCheck2All, BsChevronExpand } from 'react-icons/bs';
import { Combobox } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DropDownComboBox({ label, data, onChange, displayKey }) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredData =
    query === ''
      ? data
      : data.filter((item) => 
          item[displayKey]?.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox
      as="div"
      value={selectedItem}
      onChange={(value) => {
        setSelectedItem(value);
        onChange(value);
      }}
    >
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        {label}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-taureanOrange focus:outline-none focus:ring-1 focus:ring-taureanOrange sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(item) => item?.[displayKey] || ''}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <BsChevronExpand className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredData.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredData.map((item) => (
              <Combobox.Option
                key={item.id}
                value={item}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-taureanOrange text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames('block truncate', selected && 'font-semibold')}
                    >
                      {item[displayKey]}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-black'
                        )}
                      >
                        <BsCheck2All className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
