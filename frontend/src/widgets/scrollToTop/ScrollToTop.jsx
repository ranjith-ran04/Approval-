import { useState, useEffect} from "react";
import "./scrollToTop.css";

function ScrollToTop({scrollRef}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
     
    const container = scrollRef?.current;
    console.log("Scrolled: ", container);
    const toggleVisibility = () => {
      const scrollTop = container.scrollTop;
      if (scrollTop  > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    container.addEventListener("scroll", toggleVisibility);
    return () => container.removeEventListener("scroll", toggleVisibility);
  }, [scrollRef]);

  const backToTop = () => {
     const container = scrollRef?.current;
     if(container){
      container.scrollTo({top: 0,behavior : "smooth"});
     }
  };

  return (
    <button
      className={`scroll-to-top ${visible ? "visible" : ""}`}
      onClick={backToTop}
      title="Go to top"
    >
      ↑
    </button>
  );
}

export default ScrollToTop;
