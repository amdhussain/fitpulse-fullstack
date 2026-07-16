import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiHome,
  FiCamera,
  FiMaximize2,
} from "react-icons/fi";
import { Container, Skeleton } from "../../components/ui";
import { zoomFade, staggerContainer, fadeUp } from "../../lib/animations";
import { getGalleryImages, getGalleryCategories } from "../../lib/galleryData";

function GalleryPageSkeleton() {
  return (
    <>
      <div className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-sky-950/40 via-base-100 to-cyan-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-sky-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[120px]" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl space-y-6">
            <Skeleton variant="shimmer" className="h-5 w-32 rounded-lg" />
            <Skeleton variant="shimmer" className="h-8 w-44 rounded-full" />
            <Skeleton variant="shimmer" className="h-14 w-full" />
            <Skeleton variant="shimmer" className="h-5 w-full" />
          </div>
        </div>
      </div>
      <div className="py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl bg-base-200/40 border border-base-300/30 overflow-hidden">
                <Skeleton variant="shimmer" className="h-64 w-full rounded-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function GalleryCard({ image, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="group relative"
    >
      <div className="relative rounded-2xl overflow-hidden bg-base-200/60 backdrop-blur-xl border border-base-300/50 shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 hover:-translate-y-2">
        <div className="relative h-64 sm:h-72 overflow-hidden">
          <img
            src={image.image}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-100/90 via-base-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/20 text-sky-400 text-[11px] font-semibold backdrop-blur-sm">
              {image.category}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Link to={`/gallery/${image.id}`}>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition-colors">
                <FiMaximize2 className="w-4 h-4" />
                View Full Size
              </button>
            </Link>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-bold text-base-content">{image.title}</h3>
          <p className="text-xs text-base-content/40 mt-1 line-clamp-1">{image.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function GalleryPage() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setImages(getGalleryImages().filter((i) => i.status === "active"));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <GalleryPageSkeleton />;

  const categories = getGalleryCategories().map((c) => c.value);
  const allCategories = ["All", ...categories];
  const filtered = filter === "All" ? images : images.filter((i) => i.category === filter);

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-sky-950/40 via-base-100 to-cyan-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-sky-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-sky-400/4 rounded-full blur-[100px]" />
        </div>

        <Container className="relative z-10 py-20 sm:py-24">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={zoomFade} custom={0}>
              <nav className="flex items-center gap-2 text-sm text-base-content/50 mb-6">
                <Link to="/" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  <FiHome className="w-3.5 h-3.5" />
                  Home
                </Link>
                <FiChevronRight className="w-3.5 h-3.5" />
                <span className="text-sky-400">Gallery</span>
              </nav>
            </motion.div>

            <motion.div variants={zoomFade} custom={1}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold backdrop-blur-sm">
                <FiCamera className="w-4 h-4" />
                Our Gallery
              </span>
            </motion.div>

            <motion.h1
              variants={zoomFade}
              custom={2}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-base-content leading-[1.08] tracking-tight"
            >
              Fitness
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400">
                In Action
              </span>
            </motion.h1>

            <motion.p
              variants={zoomFade}
              custom={3}
              className="mt-6 text-base-content/50 text-lg sm:text-xl leading-relaxed"
            >
              Take a look inside our world-class facility. From training zones
              to recovery lounges, every space is designed for your success.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 sm:py-28 bg-base-100">
        <Container>
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filter === cat
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                    : "bg-base-200/60 text-base-content/50 hover:bg-base-300/50 hover:text-base-content"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filtered.map((image, i) => (
                <GalleryCard key={image.id} image={image} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        </Container>
      </section>
    </>
  );
}

export default GalleryPage;
