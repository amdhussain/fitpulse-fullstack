import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiChevronRight,
  FiCheck,
  FiX,
  FiStar,
  FiUsers,
  FiAward,
  FiDollarSign,
  FiZap,
  FiShield,
  FiHeadphones,
  FiArrowRight,
  FiHome,
} from "react-icons/fi";
import { Container, Button, SectionTitle, Skeleton } from "../../components/ui";
import { zoomFade, staggerContainer, fadeUp } from "../../lib/animations";
import {
  getMembershipPlans,
  getComparisonFeatures,
  getWhyChooseData,
  getCtaData,
} from "../../lib/membershipData";

function MembershipSkeleton() {
  return (
    <>
      <div className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-amber-950/40 via-base-100 to-yellow-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/6 rounded-full blur-[120px]" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl space-y-6">
            <Skeleton variant="shimmer" className="h-8 w-44 rounded-full" />
            <Skeleton variant="shimmer" className="h-14 w-full" />
            <Skeleton variant="shimmer" className="h-14 w-3/4" />
            <Skeleton variant="shimmer" className="h-5 w-full" />
            <Skeleton variant="shimmer" className="h-5 w-4/5" />
          </div>
        </div>
      </div>

      <div className="py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <Skeleton variant="shimmer" className="h-8 w-36 rounded-full mx-auto" />
            <Skeleton variant="shimmer" className="h-10 w-72 mx-auto" />
            <Skeleton variant="shimmer" className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-base-200/40 border border-base-300/30 overflow-hidden space-y-0">
                <Skeleton variant="shimmer" className="h-48 w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton variant="shimmer" className="h-5 w-32" />
                  <Skeleton variant="shimmer" className="h-8 w-24" />
                  <Skeleton variant="shimmer" className="h-3 w-full" />
                  <Skeleton variant="shimmer" className="h-3 w-4/5" />
                  <Skeleton variant="shimmer" className="h-10 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function MembershipHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-amber-950/40 via-base-100 to-yellow-950/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-amber-400/4 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10 py-20 sm:py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div variants={zoomFade} custom={0}>
            <nav className="flex items-center gap-2 text-sm text-base-content/50 mb-6">
              <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <FiHome className="w-3.5 h-3.5" />
                Home
              </Link>
              <FiChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400">Membership Plans</span>
            </nav>
          </motion.div>

          <motion.div variants={zoomFade} custom={1}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold backdrop-blur-sm">
              <FiStar className="w-4 h-4" />
              Premium Membership
            </span>
          </motion.div>

          <motion.h1
            variants={zoomFade}
            custom={2}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-base-content leading-[1.08] tracking-tight"
          >
            Unlock Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              Full Potential
            </span>
          </motion.h1>

          <motion.p
            variants={zoomFade}
            custom={3}
            className="mt-6 text-base-content/50 text-lg sm:text-xl leading-relaxed"
          >
            Choose from our premium membership tiers designed to match your
            fitness goals. From basic access to VIP luxury, we have the perfect plan for you.
          </motion.p>

          <motion.div
            variants={zoomFade}
            custom={4}
            className="mt-8 flex items-center gap-6"
          >
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <FiAward className="w-5 h-5 text-amber-400" />
              <span>Award Winning</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <FiUsers className="w-5 h-5 text-yellow-400" />
              <span>5000+ Members</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <FiStar className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>4.9 Rating</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function PlanCard({ plan, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const featuresList = Array.isArray(plan.features)
    ? plan.features
    : typeof plan.features === "string"
      ? plan.features.split(",").map((f) => f.trim()).filter(Boolean)
      : [];

  return (
    <motion.div
      variants={zoomFade}
      custom={index}
      className="group relative"
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold shadow-lg shadow-amber-500/30">
            <FiStar className="w-3.5 h-3.5 fill-current" />
            Most Popular
          </span>
        </div>
      )}

      <div className={`relative rounded-2xl overflow-hidden bg-base-200/60 backdrop-blur-xl border shadow-lg shadow-black/10 transition-all duration-500 hover:-translate-y-2 ${
        plan.popular
          ? "border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10"
          : "border-base-300/50 hover:shadow-2xl hover:shadow-amber-500/5 hover:border-amber-500/20"
      }`}>
        <div className="relative h-48 overflow-hidden">
          {!imageLoaded && (
            <Skeleton variant="shimmer" className="absolute inset-0 h-full w-full rounded-none" />
          )}
          <img
            src={plan.image}
            alt={`${plan.name} - Premium Fitness Membership`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            width="600"
            height="400"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-100/95 via-base-100/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-base-content">{plan.name}</h3>
                <p className="text-sm text-amber-400 font-medium">{plan.duration}</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400">{plan.monthlyPrice}</span>
                  <span className="text-sm text-base-content/40">/mo</span>
                </div>
                <p className="text-xs text-base-content/40">{plan.yearlyPrice}/year</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 pt-4">
          <p className="text-sm text-base-content/50 leading-relaxed mb-4">
            {plan.description}
          </p>

          <div className="space-y-2 mb-5">
            {featuresList.slice(0, 6).map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                  <FiCheck className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-sm text-base-content/70">
                  {typeof feature === "string" ? feature : feature.label}
                </span>
              </div>
            ))}
          </div>

          <Button
            variant={plan.popular ? "amber" : "outline"}
            size="lg"
            className="w-full group/btn"
          >
            {plan.popular ? "Get Started Now" : "Choose Plan"}
            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ComparisonTable({ features, plans }) {
  return (
    <section className="py-20 sm:py-28 bg-base-200/30">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionTitle
            subtitle="Compare Plans"
            title="Feature Comparison"
            description="See exactly what's included in each membership tier to make the best choice for your fitness journey."
            accentColor="amber"
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="overflow-x-auto rounded-2xl border border-base-300/50 bg-base-200/40 backdrop-blur-xl"
        >
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-base-300/30">
                <th className="text-left px-6 py-4 text-sm font-semibold text-base-content/70">Features</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center px-4 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-bold text-base-content">{plan.name}</span>
                      <span className="text-xs text-amber-400">${plan.monthlyPrice}/mo</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr
                  key={feature.name}
                  className={`border-b border-base-300/20 transition-colors hover:bg-amber-500/5 ${
                    i % 2 === 0 ? "bg-base-200/20" : ""
                  }`}
                >
                  <td className="px-6 py-3.5 text-sm text-base-content/70 font-medium">{feature.name}</td>
                  {feature.plans.map((included, j) => (
                    <td key={j} className="text-center px-4 py-3.5">
                      {included ? (
                        <div className="inline-flex w-7 h-7 rounded-full bg-amber-500/15 items-center justify-center">
                          <FiCheck className="w-4 h-4 text-amber-400" />
                        </div>
                      ) : (
                        <div className="inline-flex w-7 h-7 rounded-full bg-base-300/20 items-center justify-center">
                          <FiX className="w-4 h-4 text-base-content/20" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </Container>
    </section>
  );
}

const whyChooseIcons = {
  flexible: FiZap,
  price: FiDollarSign,
  trainers: FiUsers,
  equipment: FiAward,
  support: FiHeadphones,
};

function WhyChoose({ data }) {
  return (
    <section className="py-20 sm:py-28 bg-base-100">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionTitle
            subtitle="Why Us"
            title="Why Choose This Membership"
            description="We deliver more than gym access. Our membership gives you a complete fitness ecosystem designed for results."
            accentColor="amber"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.map((item, i) => {
            const Icon = whyChooseIcons[item.icon] || FiStar;
            return (
              <motion.div
                key={item.title}
                variants={zoomFade}
                custom={i}
                className="group relative"
              >
                <div className="p-6 sm:p-7 rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 hover:border-amber-500/20 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-500 hover:-translate-y-1 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center mb-5 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-500">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-base-content mb-2">{item.title}</h3>
                  <p className="text-sm text-base-content/50 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}

function CTASection({ data }) {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-950/60 via-base-100 to-yellow-950/40" aria-hidden="true" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/8 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold backdrop-blur-sm mb-6">
            <FiShield className="w-4 h-4" />
            100% Satisfaction Guaranteed
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-base-content leading-tight tracking-tight mb-6">
            {data.heading}
          </h2>

          <p className="text-lg text-base-content/50 leading-relaxed mb-10 max-w-xl mx-auto">
            {data.description}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="amber" size="lg" className="group">
                {data.primaryButton.label}
                <FiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="lg" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                {data.secondaryButton.label}
              </Button>
            </motion.div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-base-content/40">
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-amber-400" />
              <span>No contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-amber-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-amber-400" />
              <span>Free trial</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function MembershipPage() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [comparisonFeatures, setComparisonFeatures] = useState([]);
  const [whyChoose, setWhyChoose] = useState([]);
  const [cta, setCta] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setPlans(getMembershipPlans());
      setComparisonFeatures(getComparisonFeatures());
      setWhyChoose(getWhyChooseData());
      setCta(getCtaData());
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <MembershipSkeleton />;

  return (
    <>
      <MembershipHero />

      <section id="plans" className="py-20 sm:py-28 bg-base-100">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <SectionTitle
              subtitle="Pricing"
              title="Membership Plans"
              description="Invest in yourself with a membership that matches your ambition. Every plan includes full gym access and world-class facilities."
              accentColor="amber"
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {plans.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} index={i} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-base-content/50">
              <FiShield className="w-4 h-4 text-amber-400" />
              <span className="text-sm">All plans include a free trial period. No credit card required.</span>
            </div>
          </motion.div>
        </Container>
      </section>

      <ComparisonTable features={comparisonFeatures} plans={plans} />

      <WhyChoose data={whyChoose} />

      {cta && <CTASection data={cta} />}
    </>
  );
}

export default MembershipPage;
