import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";

const CategoryStatus = () => {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch("https://ecommerce-backend-fm0r.onrender.com/category");
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }
        const data = await response.json();
        setImageData(data.allCategories);
        // console.log(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast.error("Failed to fetch image data");
      }
    };
    fetchImageData();
  }, [id]);

  const handleUpdateStatus = async (categoryId) => {
    try {
      const token = sessionStorage.getItem('adminToken'); // Retrieve token from sessionStorage
      const response = await fetch(`https://ecommerce-backend-fm0r.onrender.com/category/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include token in the request headers
        },
        body: JSON.stringify({ categoryStatus: 'inactive' }), // Change status as needed
      });
      if (!response.ok) {
        throw new Error('Failed to update category status');
      }
      // Update the local state with the new category status
      setImageData((prevImageData) =>
        prevImageData.map((image) =>
          image._id === categoryId
            ? { ...image, categoryStatus: 'inactive' } // Change status as needed
            : image
        )
      );
      toast.success('Category status updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update category status');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center">
        {loading ? (
          <ThreeDots color="green" height={50} width={50} />
        ) : (
          imageData.map((image) => (
            <div key={image._id} className="max-w-xs mx-4 my-4">
              <img
                src={image.categoryUrl}
                alt="User"
                className="rounded-lg w-full h-full object-cover"
                style={{ width: "300px", height: "300px" }}
              />
              <div className="mt-2">
                <p className="font-bold uppercase">{image.categoryName}</p>
                <p className="text-xl">
                  Status:{" "}
                  <span className="text-green-800 font-semibold text-xl capitalize">
                    {image.categoryStatus}
                  </span>
                </p>
                {/* Button to change category status */}
                <button
                  onClick={() => handleUpdateStatus(image._id)}
                  className="bg-blue-500 text-white py-1 px-3 rounded mt-2"
                >
                  Change Status
                </button>
              </div>
            </div>
          ))
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default CategoryStatus;
