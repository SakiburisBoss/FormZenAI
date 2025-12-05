import React, { Suspense } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className=" bg-gray-200 dark:bg-black">{children}</div>
    </Suspense>
  );
};

export default layout;
