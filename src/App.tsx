import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  type LegacyAnimationControls,
} from "framer-motion";

function App() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <AnimatePresence>
        {!selected && (
          <motion.div
            layoutId="card"
            className="w-40 h-40 bg-blue-400 rounded-lg shadow-lg cursor-pointer"
            onClick={() => setSelected(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="text-white text-xl">Click me</span>
          </motion.div>
        )}
        {selected && (
          <motion.div
            layoutId="card"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setSelected(false)}
          >
            <motion.div
              className="w-96 h-96 bg-blue-400 rounded-lg shadow-2xl flex items-center justify-center"
              style={{ cursor: "pointer" }}
            >
              <span className="text-white text-3xl">
                I'm expanded! Click to close.
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
