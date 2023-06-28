import { MenuFilter } from "@/type/Type";

const MenuFilter = ({
  incompletedTodos,
  filter,
  setFilter,
  handleClearComplete,
}: MenuFilter) => {
  return (
    <div
      className="flex items-center justify-between  py-3 px-5 group
        text-gray-500 text-sm sm:text-base rounded-md overflow-hidden
        bg-white dark:bg-darkBlue
      "
    >
      <p className="mr-5 ">{incompletedTodos.length} items left</p>
      <div
        className="flex gap-5 rounded-md 
          max-sm:absolute max-sm:bottom-[-4.5rem] max-sm:left-0 
          max-sm:w-full max-sm:justify-center  max-sm:text-base max-sm:py-3 max-sm:px-5 
          bg-white  
          dark:bg-darkBlue
        "
      >
        <button
          onClick={() => setFilter(undefined)}
          className={`menuButton 
            ${filter === undefined && "active"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter(false)}
          className={`menuButton 
              ${filter === false && "active"}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter(true)}
          className={`menuButton 
            ${filter === true && "active"}`}
        >
          Completed
        </button>
      </div>
      <button onClick={handleClearComplete} className={`menuButton`}>
        Clear Completed
      </button>
    </div>
  );
};
export default MenuFilter;
