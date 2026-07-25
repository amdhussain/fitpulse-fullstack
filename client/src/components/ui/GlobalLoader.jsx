import { AnimatePresence, motion } from "framer-motion";
import { useLoading } from "../../context/LoadingContext";

function Spinner() {
  return (
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full border-[2.5px] border-black/[0.06] dark:border-white/[0.08]" />
      <div className="absolute inset-0 rounded-full border-[2.5px] border-transparent border-t-[#6366f1] animate-spin" style={{ animationDuration: "0.75s" }} />
      <div className="absolute inset-[5px] rounded-full border-[2px] border-transparent border-t-[#8b5cf6] animate-spin" style={{ animationDuration: "1.1s", animationDirection: "reverse" }} />
      <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/25 dark:shadow-[#6366f1]/40 animate-pulse" style={{ animationDuration: "1.5s" }} />
    </div>
  );
}

export default function GlobalLoader() {
  const { loading } = useLoading();

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Spinner />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Spinner };
