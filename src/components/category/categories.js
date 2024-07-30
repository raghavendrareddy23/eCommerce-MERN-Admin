import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";
// import { useNavigate } from "react-router-dom";
// import Status from "./categoryStatus";

const CategoriesPage = () => {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

//   const navigate = useNavigate();

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch("https://ecommerce-backend-fm0r.onrender.com/category");
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }
        const data = await response.json();
        setImageData(data.allCategories);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast.error("Failed to fetch image data");
      }
    };

    fetchImageData();
  }, [id]);


  return (
    <div>
      <div className="flex flex-wrap justify-center">
        {loading ? (
          <ThreeDots color="#0c6602" height={20} width={40}/>
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
                <p className="text-xl">Status: <span className="text-green-800 font-semibold text-xl capitalize">{image.categoryStatus}</span></p>
                {/* <Status /> */}
              </div>
            </div>
          ))
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default CategoriesPage;
