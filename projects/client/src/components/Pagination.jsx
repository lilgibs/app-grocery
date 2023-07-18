import React from 'react';
import ReactPaginate from 'react-paginate';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

function Pagination({ pageCount, onPageChange, forcePage, color = 'green-500' }) {

  const handlePageClick = (data) => {
    onPageChange(data);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return (
    <ReactPaginate
      previousLabel={<IoIosArrowBack />}
      nextLabel={<IoIosArrowForward />}
      breakLabel={"..."}
      breakClassName={"break-me"}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName={"pagination flex justify-center gap-4 items-center"}
      pageLinkClassName={"px-1"}
      previousLinkClassName={"previous-link"}
      previousClassName="pt-1"
      nextClassName="pt-1"
      nextLinkClassName={"next-link"}
      disabledClassName={"disabled text-neutral-400"}
      activeClassName={`active font-semibold border-b-2 border-w text-${color} border-b-${color}`}
      forcePage={forcePage} // react-paginate mulai dari 0
    />
  )
}

export default Pagination