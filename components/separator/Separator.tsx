import React from "react";

const Separator = ({title='Separator', className = '', titleClassName=''}) => {
  return (
    <div className={`separator-line  border-input dark:border-gray-600 border-t-1 relative my-10  ${className}`}>
      <div className={`text-xs font-normal text-gray-400 leading-tight bg-gray-100 dark:bg-gray-600  px-3 py-1 rounded-full absolute left-[0%] top-[50%] transform-[translate(0,-50%)] ${titleClassName}`}>
        {title}
      </div>
    </div>
  );
};

export default Separator;
