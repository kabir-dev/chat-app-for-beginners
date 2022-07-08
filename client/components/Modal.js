import React from "react";

export default function Modal({ text }) {
  return (
    <div className=" text-center w-11/12 m-auto">
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
        <span className="font-medium"> {text} !</span>
      </div>
    </div>
  );
}
