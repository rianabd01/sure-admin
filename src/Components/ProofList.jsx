// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function ProofList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/proof', {
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

  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const url = `/verify-proof/${id}`;
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
                src={item.pictures || 'https://via.placeholder.com/300'}
                alt={`Gambar ${item.trash_id}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-left text-gray-700 font-semibold">
                  Dibersihkan oleh: {item.name}
                </p>
                <p className="text-left text-gray-700 font-light">
                  {truncateText(
                    item.user_message || 'No description available',
                    150,
                  )}
                </p>
                <div className="flex space-x-2 content-end mt-4">
                  {item.is_verified === 0 ? (
                    <CheckCircleIcon
                      className="w-6 h-6 text-gray-500 cursor-pointer"
                      onClick={() => handleVerify(item.trash_proof_id)}
                    />
                  ) : (
                    <CheckCircleIcon className="w-6 h-6 text-green-800 cursor-pointer" />
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
