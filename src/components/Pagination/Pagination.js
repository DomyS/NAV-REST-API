import React from "react";
import "./Pagination.css";

const Pagination = props => {
  const pageLinks = [];

  for (let i = 1; i <= 10; i++) {
    let active = props.currentPage === i ? "active" : "";
    pageLinks.push(
      <li
        className={`page-link ${active}`}
        key={i}
        onClick={() => props.nextPage(i)}
      >
        <a href="#">{i}</a>
      </li>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <ul className="pagination pagination-md">{pageLinks}</ul>
      </div>
    </div>
  );
};

export default Pagination;
