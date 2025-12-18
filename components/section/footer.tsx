import { connection } from "next/server";
import { Suspense } from "react";

const Foter = async () => {
  await connection();
  const date = new Date().getFullYear();
  return (
    <footer>
      <div className="w-full h-20 border-t flex items-center justify-center">
        <p className="text-sm text-gray-500">
          &copy; {date} Form Zen AI. All rights reserved. Created by Sakibur.
        </p>
      </div>
    </footer>
  );
};
export default function Footer() {
  return (
    <Suspense fallback={<div>Loading Footer...</div>}>
      <Foter />
    </Suspense>
  );
}
