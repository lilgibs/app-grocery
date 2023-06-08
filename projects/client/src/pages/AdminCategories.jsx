import React from 'react';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';

function AdminCategories() {
  return (
    <div className='w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto mt-5'>
      <div className='p-4 bg-white shadow-md rounded'>
        <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
          <p className="font-semibold text-pink-500 text-lg">Categories Management</p>
        </div>
        <div className='flex justify-end'>
          <button className='bg-pink-500 hover:bg-pink-600 font-semibold text-white py-2 px-4 rounded-md mb-2 flex items-center'>
            <FaPlus size={15} className="mr-2" /> Add Category
          </button>
        </div>
        <div className='flex flex-wrap justify-center gap-4'>
          {/* Component Start */}
          <div className='w-full md:w-[48%] lg:w-[49%] p-2 border rounded-md shadow-md'>
            <div className='flex'>
              <div className='flex flex-row items-center border-gray-200 rounded overflow-hidden  w-1/2'>
                <img
                  className='w-16 h-16'
                  src="https://png.pngtree.com/element_our/png/20180930/food-icon-design-vector-png_120564.jpg"
                  alt=""
                />
                <div>
                  <p className='text-lg font-semibold'>Kategori:</p>
                  <p className='text-md font-medium '>Makanan</p>
                </div>
              </div>
              <div className='flex flex-col justify-center gap-1 items-center w-1/2 border-l-2'>
                <button className='px-2 py-1 rounded bg-teal-500 font-semibold text-white w-1/2 flex items-center'>
                  <FaPen size={15} className='mx-2' />
                  Edit
                </button>
                <button className='px-2 py-1 rounded bg-rose-500 font-semibold text-white w-1/2 flex items-center'>
                  <FaTrash size={15} className='mx-2' />
                  Delete
                </button>
              </div>
            </div>
          </div>
          {/* Component End */}
          {/* Component Start */}
          <div className='w-full md:w-[48%] lg:w-[49%] p-2 border rounded-md shadow-md'>
            <div className='flex'>
              <div className='flex flex-row items-center border-gray-200 rounded overflow-hidden w-1/2'>
                <img
                  className='w-16 h-16'
                  src="https://png.pngtree.com/element_our/png/20180930/food-icon-design-vector-png_120564.jpg"
                  alt=""
                />
                <div>
                  <p className='text-lg font-semibold'>Kategori:</p>
                  <p className='text-md font-medium '>Makanan</p>
                </div>
              </div>
              <div className='flex flex-col justify-center gap-1 items-center  w-1/2 border-l-2'>
                <button className='px-2 py-1 rounded bg-teal-500 font-semibold text-white w-1/2'>Edit</button>
                <button className='px-2 py-1 rounded bg-rose-500 font-semibold text-white w-1/2'>Delete</button>
              </div>
            </div>
          </div>
          {/* Component End */}

        </div>
      </div>
    </div>

  );
}

export default AdminCategories;
