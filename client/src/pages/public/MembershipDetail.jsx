import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiHome,
  FiChevronRight,
  FiCheck,
  FiStar,
  FiCreditCard,
  FiCalendar,
  FiShield,
  FiAward,
} from "react-icons/fi";
import { Container, Button, Skeleton } from "../../components/ui";
import { slideInLeft, slideInRight } from "../../lib/animations";
import { getMembershipPlans } from "../../lib/membershipData";

function MembershipDetailSkeleton() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton variant="shimmer" className="h-5 w-48 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-6">
            <Skeleton variant="shimmer" className="h-12 w-64" />
            <Skeleton variant="shimmer" className="h-8 w-32" />
            <Skeleton variant="shimmer" className="h-4 w-full" />
            <Skeleton variant="shimmer" className="h-4 w-full" />
            <Skeleton variant="shimmer" className="h-4 w-3/4" />
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="shimmer" className="h-5 w-full" />
              ))}
            </div>
          </div>
          <Skeleton variant="shimmer" className="h-[400px] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

function MembershipDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const all = getMembershipPlans();
      setPlan(all.find((p) => String(p.id) === String(id)));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <MembershipDetailSkeleton />;

  if (!plan) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-base-content">Plan Not Found</h2>
          <p className="text-base-content/50">The membership plan you are looking for does not exist.</p>
          <Link to="/membership">
            <Button variant="amber">Back to Membership</Button>
          </Link>
        </div>
      </div>
    );
  }

  const features = plan.features ? plan.features.split(",").map((f) => f.trim()) : [];

  return (
    <div className="py-20 sm:py-28">
      <Container>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <nav className="flex items-center gap-2 text-sm text-base-content/50 mb-8">
            <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <FiHome className="w-3.5 h-3.5" />
              Home
            </Link>
            <FiChevronRight className="w-3.5 h-3.5" />
            <Link to="/membership" className="hover:text-amber-400 transition-colors">
              Membership
            </Link>
            <FiChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-400">{plan.name}</span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="space-y-3">
              {plan.popular && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold backdrop-blur-sm">
                  <FiStar className="w-4 h-4 fill-amber-400" />
                  Most Popular
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold text-base-content">{plan.name}</h1>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-base-content" style={{ color: plan.color }}>
                  {plan.monthlyPrice}
                </span>
                <span className="text-base-content/40">/month</span>
              </div>
              {plan.yearlyPrice && (
                <p className="text-sm text-base-content/40">
                  Yearly: {plan.yearlyPrice}/year — Save with annual billing
                </p>
              )}
            </div>

            <p className="text-base-content/50 text-lg leading-relaxed">{plan.description}</p>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">What&apos;s Included</h3>
              <div className="space-y-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-base-content/60">
                    <FiCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Link to="/booking">
                <Button variant="amber" size="lg" className="group">
                  <FiCalendar className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link to="/membership">
                <Button variant="ghost" size="lg" className="group">
                  <FiArrowLeft className="w-5 h-5 mr-2" />
                  All Plans
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
          >
            <div className="rounded-3xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 p-8 space-y-6 sticky top-24">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-base-content">{plan.name}</h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-black" style={{ color: plan.color }}>
                    {plan.monthlyPrice}
                  </span>
                  <span className="text-base-content/40">/mo</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-base-300/30">
                  <FiShield className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-sm text-base-content/60">Cancel anytime, no lock-in</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-base-300/30">
                  <FiAward className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-sm text-base-content/60">Access to all {plan.name} features</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-base-300/30">
                  <FiCreditCard className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-sm text-base-content/60">Secure payment processing</span>
                </div>
              </div>

              <Link to="/booking" className="block">
                <Button variant="amber" className="w-full" size="lg">
                  Subscribe Now
                </Button>
              </Link>

              <p className="text-xs text-center text-base-content/35">
                By subscribing you agree to our Terms of Service
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

export default MembershipDetail;
