import React from 'react';
import ReactPaginate from 'react-paginate';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

function Pagination({ pageCount, onPageChange, forcePage }) {
  return (
    <ReactPaginate
      previousLabel={<IoIosArrowBack />}
      nextLabel={<IoIosArrowForward />}
      breakLabel={"..."}
      breakClassName={"break-me"}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={onPageChange}
      containerClassName={"pagination flex justify-center gap-4 items-center"}
      pageLinkClassName={"px-1"}
      previousLinkClassName={"previous-link"}
      previousClassName="pt-1"
      nextClassName="pt-1"
      nextLinkClassName={"next-link"}
      disabledClassName={"disabled"}
      activeClassName={"active font-semibold border-b-2 border-w text-green-500 border-b-green-500"}
      forcePage={forcePage} // react-paginate mulai dari 0
    />
  )
}

export default Pagination