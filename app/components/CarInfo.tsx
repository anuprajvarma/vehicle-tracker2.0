"use client";

import React from "react";

const CarInfo = ({ info, infotype }: { info: string; infotype: string }) => {
  return (
    <div className="w-[5.3rem] h-[2.5rem] flex flex-col items-center">
      <div className="text-md w-full text-black text-center font-semibold">
        {info}
      </div>
      <div className="text-gray-500 w-full text-center">{infotype}</div>
    </div>
  );
};

export default CarInfo;
