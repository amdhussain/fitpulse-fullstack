import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiAward, FiSettings, FiClock, FiTarget } from "react-icons/fi";
import { Container, Card } from "../ui";
import { fadeUp, slideInLeft } from "../../lib/animations";
import { AboutSkeleton } from "../ui/Skeleton";

const features = [
  {
    icon: FiAward,
    title: "Certified Trainers",
    description: "Expert-led sessions with nationally certified fitness professionals.",
  },
  {
    icon: FiSettings,
    title: "Modern Equipment",
    description: "State-of-the-art machines and tools for every workout style.",
  },
  {
    icon: FiClock,
    title: "Flexible Schedule",
    description: "Morning, afternoon, or evening — book classes that fit your life.",
  },
  {
    icon: FiTarget,
    title: "Personalized Programs",
    description: "Custom plans designed around your goals and fitness level.",
  },
];

function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <AboutSkeleton />;

  return (
    <section id="about" className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-base-100 via-indigo-950/10 to-base-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-indigo-500/4 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative mx-auto lg:mx-0 w-full max-w-lg lg:max-w-none order-2 lg:order-1"
          >
            <div className="absolute inset-0 m-4 rounded-3xl bg-purple-500/5 backdrop-blur-xl border border-purple-500/10 -rotate-2" aria-hidden="true" />

            <div className="relative rounded-3xl overflow-hidden border border-purple-500/15 shadow-2xl shadow-black/20">
              <img
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=700&h=800&fit=crop&auto=format&q=80"
                alt="Modern fitness center with professional equipment and training areas"
                className="w-full h-[380px] sm:h-[440px] lg:h-[520px] object-cover"
                loading="lazy"
                width="700"
                height="800"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base-100/60 via-transparent to-transparent" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-indigo-950/60 backdrop-blur-lg border border-purple-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center" aria-hidden="true">
                    <FiAward className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-base-content">12+ Years Experience</p>
                    <p className="text-xs text-purple-300/50">Trusted by thousands of members</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left order-1 lg:order-2"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-purple-400" aria-hidden="true" />
                About Us
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-base-content leading-tight tracking-tight"
            >
              We Help You{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Achieve More
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-5 text-base-content/50 text-lg leading-relaxed"
            >
              FitBookPro is your all-in-one fitness platform designed to
              connect you with world-class trainers, premium classes, and a
              community that keeps you motivated.
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={3}
              className="mt-4 text-base-content/40 leading-relaxed"
            >
              Whether you are just starting your fitness journey or looking to
              push past your limits, our flexible booking system and expert
              trainers make it easy to stay on track.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={4}
              className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature) => (
                <Card key={feature.title} className="group p-5" glow="purple-500">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                      <feature.icon className="w-5 h-5 text-purple-400 transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-base-content">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-xs text-base-content/45 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default About;
