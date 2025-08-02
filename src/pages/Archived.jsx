import React from "react";
import { Archive } from "lucide-react";

const Archived = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
      <Archive size={48} />
      <h1 className="mt-4 text-2xl font-semibold">Archived</h1>
      <p className="text-sm">
        This is where your archived items will be displayed.
      </p>
    </div>
  );
};

export default Archived;
