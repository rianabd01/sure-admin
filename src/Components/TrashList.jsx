// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CheckCircleIcon,
  TrashIcon,
  ArrowUturnDownIcon,
} from '@heroicons/react/24/solid';

export default function TrashList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/trash', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data.results);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemoveOrRestore = async (id, isDeleted) => {
    try {
      const token = localStorage.getItem('token');
      const url = isDeleted ? `/unremove-trash/${id}` : `/remove-trash/${id}`;
      await axios.put(url, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refreshData();
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };
  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const url = `/verify-trash/${id}`;
      await axios.put(url, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refreshData();
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      await fetchData();
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="bg-gray-200 flex justify-center min-h-screen">
      <div className="items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-4 py-4 ">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={item.pictures || 'https://via.placeholder.com/300'} // Ganti item.image sesuai dengan field yang sesuai
                alt={`Gambar ${item.title}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-left text-gray-700 font-semibold">
                  {item.title}
                </p>
                <p className="text-left text-gray-700 font-light">
                  {truncateText(
                    item.description || 'No description available',
                    150,
                  )}
                </p>
                <div className="flex space-x-2 content-end mt-4">
                  {item.is_verified === 0 ? (
                    <CheckCircleIcon
                      className="w-6 h-6 text-gray-500 cursor-pointer"
                      onClick={() => handleVerify(item.id)}
                    />
                  ) : (
                    <CheckCircleIcon className="w-6 h-6 text-green-800 cursor-pointer" />
                  )}
                  {item.is_deleted === 0 ? (
                    <TrashIcon
                      className="w-6 h-6 text-gray-500 cursor-pointer"
                      onClick={() => handleRemoveOrRestore(item.id, 0)}
                    />
                  ) : (
                    <ArrowUturnDownIcon
                      className="w-6 h-6 text-gray-500 cursor-pointer"
                      onClick={() => handleRemoveOrRestore(item.id, 1)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
