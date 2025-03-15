import React from "react";
import { Pagination } from "react-bootstrap";

const CustomPagination = ({ page, totalPages, setPage }) => {
  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <Pagination className="justify-content-center">
      <Pagination.First onClick={() => changePage(1)} disabled={page === 1} />
      <Pagination.Prev onClick={() => changePage(page - 1)} disabled={page === 1} />

      {getPageNumbers().map((pageNum) => (
        <Pagination.Item
          key={pageNum}
          active={pageNum === page}
          onClick={() => changePage(pageNum)}
        >
          {pageNum}
        </Pagination.Item>
      ))}

      <Pagination.Next onClick={() => changePage(page + 1)} disabled={page === totalPages} />
      <Pagination.Last onClick={() => changePage(totalPages)} disabled={page === totalPages} />
    </Pagination>
  );
};

export default CustomPagination;