import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Button } from "../components/ui";

function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1
            className="text-[10rem] sm:text-[14rem] font-black leading-none text-primary/10 select-none"
            aria-hidden="true"
          >
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-base-content -mt-8 sm:-mt-12 mb-4">
            Page Not Found
          </h2>
          <p className="text-base-content/50 mb-8 max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}

export default NotFound;
