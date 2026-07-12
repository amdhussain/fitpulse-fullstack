import { motion, AnimatePresence } from "framer-motion";
import { FiCheck } from "react-icons/fi";

function SavedBadge({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="inline-flex items-center gap-1.5 text-sm text-success font-medium"
        >
          <FiCheck className="w-4 h-4" />
          Saved successfully!
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default SavedBadge;
