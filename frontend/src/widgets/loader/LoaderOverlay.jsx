import Loader from "./Loader";
import "./loaderOverlay.css";
import { useLoader } from "../../context/LoaderContext";

function LoaderOverlay() {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="loader-overlay">
      <Loader message="Loading..." size="medium" />
    </div>
  );
}

export default LoaderOverlay;
