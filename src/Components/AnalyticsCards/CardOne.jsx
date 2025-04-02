import { useState, useEffect } from "react";
import axios from "axios";
import { BsPeople } from "react-icons/bs";

function CardOne() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const endPointUrl = `${apiUrl}/employees`;

    const [entityData, setEntityData] = useState([]); // Store employee data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error handling

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(endPointUrl);
                setEntityData(response.data); // Assuming response.data is an array
            } catch (err) {
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endPointUrl]);

    return (
        <div className="p-4 md:p-5 relative before:absolute before:top-0 before:start-0 before:w-full before:h-px sm:before:w-px sm:before:h-full before:bg-gray-200 before:first:bg-transparent">
            <div>
                <BsPeople className="text-taureanOrange" size={24} />
                <div className="mt-3">
                    <div className="flex items-center gap-x-2">
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                            Number of Employees
                        </p>
                    </div>
                    <div className="mt-1 lg:flex lg:justify-between lg:items-center">
                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <h3 className="text-xl sm:text-2xl font-semibold text-taureanDeepBlue">
                                {entityData.length}
                            </h3>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardOne;
