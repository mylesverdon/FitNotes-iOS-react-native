import React, { FunctionComponent } from "react";
import { FitnotesDBProvider } from "./src/database/useFitnotesDB";
import { Home } from "./src/pages/Home/Home";
import "reflect-metadata";

export const App: FunctionComponent = () => {
  return (
    <FitnotesDBProvider>
      <Home />
    </FitnotesDBProvider>
  );
};

export default App;
