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
          const isVisible =
            rect.top >= 0 &&
            rect.bottom <= vpHeight &&
            rect.left >= 0 &&
            rect.right <= vpWidth;
          return isVisible ? p : null;
        })
/*         const visibleItems = refs.current.map((ref, i) => {
        if (!ref) return null;
        const rect = ref.getBoundingClientRect();

        if (
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0
        ) {
          return {
            ...products[i],
            boundingBox: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            },
            positionLabel: getPositionLabel(rect, window.innerWidth, window.innerHeight),
          };
        }
        return null;
        }) */
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
