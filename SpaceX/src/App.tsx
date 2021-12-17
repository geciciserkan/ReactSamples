import React from "react";
import { Provider } from "react-redux";
import "./App.css";

import SpacexTable from "./components/SpacexTable/SpacexTable";
import configureStore from "./store/store";

const store = configureStore()

function App() {
  
  return (
    <Provider store={store}>

    <div className="App">
      <SpacexTable />
    </div>
    </Provider>
  );
}

export default App;
