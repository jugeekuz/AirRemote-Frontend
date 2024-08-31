import React, { createContext, useState } from 'react';

export const DraggingContext = createContext();

export const DraggingProvider = ({ children }) => {
  const [dragging, setDragging] = useState(false);

  return (
    <DraggingContext.Provider value={{ dragging, setDragging }}>
      {children}
    </DraggingContext.Provider>
  );
};
