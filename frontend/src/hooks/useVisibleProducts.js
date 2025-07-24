// FILE: hooks\useVisibleProducts.js
import { useEffect, useState } from "react";

function getPositionLabel(rect, winWidth, winHeight) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let vertical = centerY < winHeight / 3 ? "top"
               : centerY < (2 * winHeight) / 3 ? "middle"
               : "bottom";

  let horizontal = centerX < winWidth / 3 ? "left"
                 : centerX < (2 * winWidth) / 3 ? "center"
                 : "right";

  return `${vertical} ${horizontal}`;
}

const useVisibleProducts = (products, refs) => {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const updateVisibility = () => {
      const vpHeight = window.innerHeight;
      const vpWidth = window.innerWidth;

      const visibleItems = products
        .map(p => {
          const rect = refs.current[p.id]?.getBoundingClientRect();
          if (!rect) return null;

          const intersects =
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < vpHeight &&
            rect.left < vpWidth;

          if (!intersects) return null;

          return {
            ...p,
            boundingBox: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            },
            positionLabel: getPositionLabel(rect, vpWidth, vpHeight),
          };
        })
        .filter(Boolean);

      setVisible(visibleItems);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility);
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [products, refs]);

  return visible;
};

export default useVisibleProducts;