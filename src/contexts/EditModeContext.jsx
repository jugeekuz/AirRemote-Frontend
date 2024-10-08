import React, { createContext, useState } from 'react';

export const EditModeContext = createContext();

export const EditModeProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(prevMode => !prevMode);
  };

  return (
    <EditModeContext.Provider value={{ editMode, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};
