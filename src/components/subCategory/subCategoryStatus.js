import React, { useState, useEffect } from 'react';

const SubCategoryStatus = () => {
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('https://ecommerce-backend-fm0r.onrender.com/subcategory/');
      const data = await response.json();
      setSubcategories(data.allSubCategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(`https://ecommerce-backend-fm0r.onrender.com/subcategory/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subCategoryStatus: updatedStatus }),
      });
      if (response.ok) {
        // If PATCH request is successful, update the local state
        const updatedSubcategories = subcategories.map(subcategory => {
          if (subcategory._id === id) {
            return { ...subcategory, subCategoryStatus: updatedStatus };
          }
          return subcategory;
        });
        setSubcategories(updatedSubcategories);
      } else {
        console.error('Error updating subcategory status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating subcategory status:', error);
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      {subcategories.map((subcategory, index) => (
        <div key={index} className="max-w-xs mx-4 my-4">
          <img
            src={subcategory.subCategoryUrl}
            alt="User"
            className="rounded-lg w-full h-full object-cover"
            style={{ width: '300px', height: '300px' }}
          />
          <div className="mt-2">
            <p className="font-bold uppercase">{subcategory.subCategoryName}</p>
            <p className="text-xl">
              Status:{' '}
              <span className={`font-semibold text-xl capitalize ${subcategory.subCategoryStatus === 'active' ? 'text-green-800' : 'text-red-800'}`}>
                {subcategory.subCategoryStatus}
              </span>
            </p>
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2`}
              onClick={() => toggleStatus(subcategory._id, subcategory.subCategoryStatus)}
            >
              Change Status
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubCategoryStatus;
