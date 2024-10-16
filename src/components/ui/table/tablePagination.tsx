import { faCircleLeft, faCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IoChevronBackCircleOutline,
  IoChevronForwardCircleOutline,
} from "react-icons/io5";

interface props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TablePagination:React.FC<props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {

  const handlePreviusPage = () =>{
    if(currentPage > 1){
      onPageChange(currentPage-1)
    }
  }
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-2 rounded-md ${
            currentPage === i ? "bg-royalBlue text-white rounded-xl px-2 text-lg" : ""
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="p-4 flex items-center justify-between">
      <button
        disabled={
          currentPage === 1
        }
        onClick={handlePreviusPage}
        className="flex items-center bg-royalBlue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royalBlue disabled:cursor-not-allowed disabled:bg-royalBlue-light"
      >
        <FontAwesomeIcon icon={faCircleLeft} className="block h-5 w-5 me-0 sm:me-1" />
        <span className="hidden sm:block">Anterior</span>
      </button>
      <div className=" flex items-center gap-2 text-sm ">
        {renderPageNumbers()}
      </div>
      <button
        onClick={handleNextPage}
        disabled={
          currentPage === totalPages
        }
        className="flex items-center bg-royalBlue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royalBlue disabled:cursor-not-allowed disabled:bg-royalBlue-light"
      >
        <span className="hidden sm:block">Siguiente</span>
        <FontAwesomeIcon icon={faCircleRight} className="block h-5 w-5 ms-0 sm:ms-1 " />
      </button>
    </div>
  );
};
