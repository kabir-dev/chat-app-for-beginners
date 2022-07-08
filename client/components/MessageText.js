import React from "react";

export default function MessageText({ text, owner }) {
  return (
    <div
      className={
        owner ? "mx-2 my-3 flex justify-end " : "mx-2 my-3 flex justify-start"
      }
    >
      <p
        className={
          owner
            ? " p-2 max-w-[250px] sm:max-w-xs text-justify bg-violet-700 rounded-lg text-white"
            : " p-2 max-w-[250px] sm:max-w-xs text-justify bg-gray-300 dark:bg-slate-600 rounded-lg text-black dark:text-white"
        }
      >
        {text && text}
      </p>
    </div>
  );
}
