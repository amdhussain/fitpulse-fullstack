import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiHome,
  FiChevronRight,
  FiCamera,
  FiCalendar,
  FiTag,
  FiInfo,
} from "react-icons/fi";
import { Container, Button, Skeleton } from "../../components/ui";
import { slideInLeft, slideInRight } from "../../lib/animations";
import { getGalleryImages } from "../../lib/galleryData";

function GalleryDetailSkeleton() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton variant="shimmer" className="h-5 w-48 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <Skeleton variant="shimmer" className="h-[400px] lg:h-[500px] rounded-3xl" />
          <div className="space-y-6">
            <Skeleton variant="shimmer" className="h-10 w-64" />
            <Skeleton variant="shimmer" className="h-4 w-full" />
            <Skeleton variant="shimmer" className="h-4 w-full" />
            <Skeleton variant="shimmer" className="h-4 w-3/4" />
            <div className="space-y-3 pt-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="shimmer" className="h-5 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const imgs = getGalleryImages();
      setAllImages(imgs);
      setImage(imgs.find((i) => String(i.id) === String(id)));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <GalleryDetailSkeleton />;

  if (!image) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-base-content">Image Not Found</h2>
          <p className="text-base-content/50">The gallery image you are looking for does not exist.</p>
          <Link to="/gallery">
            <Button variant="sky">Back to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedImages = allImages
    .filter((i) => i.category === image.category && i.id !== image.id && i.status === "active")
    .slice(0, 3);

  return (
    <div className="py-20 sm:py-28">
      <Container>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <nav className="flex items-center gap-2 text-sm text-base-content/50 mb-8">
            <Link to="/" className="hover:text-sky-400 transition-colors flex items-center gap-1">
              <FiHome className="w-3.5 h-3.5" />
              Home
            </Link>
            <FiChevronRight className="w-3.5 h-3.5" />
            <Link to="/gallery" className="hover:text-sky-400 transition-colors">
              Gallery
            </Link>
            <FiChevronRight className="w-3.5 h-3.5" />
            <span className="text-sky-400">{image.title}</span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <div className="absolute inset-0 m-4 rounded-3xl bg-sky-500/5 backdrop-blur-xl border border-sky-500/10 -rotate-1" aria-hidden="true" />
              <img
                src={image.image}
                alt={image.title}
                className="relative rounded-3xl overflow-hidden border border-sky-500/15 shadow-2xl shadow-black/20 w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold backdrop-blur-sm">
                <FiCamera className="w-4 h-4" />
                {image.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-base-content">{image.title}</h1>
            </div>

            <p className="text-base-content/50 text-lg leading-relaxed">{image.description}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200/40 border border-base-300/30">
                <FiTag className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <p className="text-xs text-base-content/40">Category</p>
                  <p className="text-sm font-medium text-base-content">{image.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200/40 border border-base-300/30">
                <FiCalendar className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <p className="text-xs text-base-content/40">Updated</p>
                  <p className="text-sm font-medium text-base-content">{image.updatedAt}</p>
                </div>
              </div>
              {image.featured && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200/40 border border-base-300/30">
                  <FiInfo className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs text-base-content/40">Status</p>
                    <p className="text-sm font-medium text-amber-400">Featured</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Link to="/gallery">
                <Button variant="sky" size="lg" className="group">
                  <FiArrowLeft className="w-5 h-5 mr-2" />
                  Back to Gallery
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {relatedImages.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-base-content mb-8">Related Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedImages.map((img) => (
                <Link key={img.id} to={`/gallery/${img.id}`}>
                  <div className="group rounded-2xl overflow-hidden bg-base-200/60 backdrop-blur-xl border border-base-300/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={img.image}
                        alt={img.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-base-content">{img.title}</h3>
                      <p className="text-xs text-base-content/40 mt-1">{img.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default GalleryDetail;
