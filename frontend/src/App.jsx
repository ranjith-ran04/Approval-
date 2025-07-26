import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/LoginForm.jsx";
import Dashboard from "./Dashboard.jsx";
import { LoaderProvider} from "./context/LoaderContext.jsx";
import LoaderOverlay from "./widgets/loader/LoaderOverlay.jsx";

function AppContent() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}
function App() {
  return (
    <LoaderProvider>
      <AppContent />
      <LoaderOverlay/>
    </LoaderProvider>
  );
}
export default App;
