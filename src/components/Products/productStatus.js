import React, { useState, useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import axios from 'axios'; // Import Axios

const ProductStatus = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      const response = await axios.get(`https://ecommerce-backend-fm0r.onrender.com/product/?page=${page}`);
      setProducts(response.data.data.allProducts);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await axios.patch(`https://ecommerce-backend-fm0r.onrender.com/product/${id}`, 
        { productStatus: updatedStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        // If PATCH request is successful, update the local state
        const updatedProducts = products.map(product => {
          if (product._id === id) {
            return { ...product, productStatus: updatedStatus };
          }
          return product;
        });
        setProducts(updatedProducts);
      } else {
        console.error('Error updating product status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 justify-center m-10">
        {products.map((product, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden flex">
            <div className="w-1/2">
              <div className="w-full overflow-hidden">
                <Slide autoplay={true} duration={5000}>
                  {product.imageGallery.map((image, index) => (
                    <div key={index} className="each-slide">
                      <img src={image} alt={`Product ${index + 1}`} className="object-contain w-full h-60 float-none" />
                    </div>
                  ))}
                </Slide>
              </div>
            </div>
            <div className="w-1/2 p-4">
              <h3 className="text-xl font-semibold">{product.productName}</h3>
              <p className="text-gray-600 mb-2">{product.productDescription}</p>
              <div className="flex items-center justify-between">
                <div>
                  {product.discount && (
                    <p className="text-gray-500 line-through">${product.price}</p>
                  )}
                  <p className="text-sm text-lime-600 font-semibold">Discount: <span className='font-bold'>{product.discount}%</span></p>
                  <p className="text-green-600 font-semibold">${product.sellPrice}</p>
                </div>
                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
              </div>
              <p className={`text-xl font-semibold ${product.productStatus === 'active' ? 'text-green-800' : 'text-red-800'}`}>
                {product.productStatus}
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={() => toggleStatus(product._id, product.productStatus)}
              >
                Change Status
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mr-2 border bg-gray-200 text-gray-700 rounded-md hover:bg-blue-500 hover:text-white`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductStatus;
