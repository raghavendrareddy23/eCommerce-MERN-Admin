import React from "react";
import CategoriesPage from "./category/categories";

function Home() {
  
  // window.location.reload();
  return (
    <div className=" min-h-screen flex flex-col justify-center items-center w-full"> {/* Add w-full class here */}
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <hr/>
      <CategoriesPage/>
    </div>
  );
}

export default Home;
