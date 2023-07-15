import React from 'react'

function AdminPagination({ page, totalProducts, limit, handlePrevPage, handleNextPage }) {
  return (
    <div className='flex gap-2 justify-center my-2'>
      <button className='px-2 py-1 rounded bg-pink-500 hover:bg-pink-600 text-white' onClick={handlePrevPage}>Prev</button>
      <p className='border px-2 py-1 rounded'>{page} of {Math.ceil(totalProducts / limit)}</p>
      <button className='px-2 py-1 rounded bg-pink-500 hover:bg-pink-600 text-white' onClick={handleNextPage}>Next</button>
    </div>
  );
}

export default AdminPagination