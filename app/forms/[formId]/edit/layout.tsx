import { Suspense } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

export default layout;
