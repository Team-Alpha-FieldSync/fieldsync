import { BrowserRouter } from "react-router-dom";
import AppProvider from "./providers/AppProvider";
import AppRoutes from "./routes/AppRoutes";
// import TestApollo from "./TestApollo";

/**
 * Root application component
 * Wraps the app with:
 * - Global state provider (AppProvider)
 * - React Router (BrowserRouter)
 */

function App() {

  return (
    <AppProvider>
      {/* Enables routing across the entire app */}
      <BrowserRouter>
        {/* <TestApollo /> */}
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
