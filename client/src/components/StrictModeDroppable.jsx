import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import PropTypes from "prop-types";

export const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

StrictModeDroppable.propTypes = {
  children: PropTypes.func,
};
