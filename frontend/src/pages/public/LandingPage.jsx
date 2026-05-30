import { useNavigate } from 'react-router-dom';
import {
  Calendar, Stethoscope, Bell, Brain,
  FileText, Shield, ArrowRight,
  CheckCircle, Heart
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Button from '../../components/ui/Button';

/**
 * Landing Page
 *
 * Sections:
 * 1. Hero — headline, CTA, visual
 * 2. Stats — trust indicators
 * 3. Features — what the platform does
 * 4. How it works — 3 steps
 * 5. CTA — final conversion section
 * 6. Footer
 */
export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="text-ai-600" size={28} />,
      title: 'AI Symptom Checker',
      description:
        'Describe your symptoms and get instant AI-powered analysis with doctor recommendations.',
      bg: 'bg-ai-50',
    },
    {
      icon: <Calendar className="text-primary-600" size={28} />,
      title: 'Easy Appointment Booking',
      description:
        'Book appointments with top doctors in minutes. Real-time slot availability.',
      bg: 'bg-primary-50',
    },
    {
      icon: <Bell className="text-success-600" size={28} />,
      title: 'Real-time Notifications',
      description:
        'Get instant alerts for appointment confirmations, reminders, and updates.',
      bg: 'bg-success-50',
    },
    {
      icon: <FileText className="text-warning-600" size={28} />,
      title: 'AI Report Summarizer',
      description:
        'Upload your medical reports and get plain-language summaries instantly.',
      bg: 'bg-warning-50',
    },
    {
      icon: <Stethoscope className="text-danger-600" size={28} />,
      title: 'Top Specialists',
      description:
        'Access a network of verified specialists across 15+ medical specializations.',
      bg: 'bg-danger-50',
    },
    {
      icon: <Shield className="text-secondary-600" size={28} />,
      title: 'Secure & Private',
      description:
        'Your health data is protected with JWT authentication and encrypted storage.',
      bg: 'bg-secondary-100',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Register as a patient or doctor in under 2 minutes.',
    },
    {
      number: '02',
      title: 'Find Your Doctor',
      description: 'Browse specialists or use AI to find the right doctor for your symptoms.',
    },
    {
      number: '03',
      title: 'Book & Get Care',
      description: 'Book an appointment, get real-time confirmation and attend your consultation.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ──────────────────────────────── */}
      <PublicNavbar />

      {/* ── Hero Section ────────────────────────── */}
      <section className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur
                            px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain size={16} className="text-ai-400" />
              <span>AI-Powered Healthcare Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold
                           leading-tight mb-6">
              Your Health,{' '}
              <span className="text-primary-400">Our Priority</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-secondary-300 mb-10 max-w-2xl mx-auto">
              Book appointments with top doctors, get AI-powered symptom analysis,
              and manage your health journey — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-primary-600 hover:bg-primary-500 text-white px-8"
              >
                Get Started Free
                <ArrowRight size={18} />
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/doctors')}
                className="bg-white/10 hover:bg-white/20 text-white border
                           border-white/20 px-8"
              >
                Browse Doctors
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-10
                            text-secondary-400 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={15} className="text-success-400" />
                Free to join
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={15} className="text-success-400" />
                No credit card
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={15} className="text-success-400" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────── */}
      <section className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+',  label: 'Verified Doctors' },
              { value: '10K+',  label: 'Happy Patients' },
              { value: '15+',   label: 'Specializations' },
              { value: '98%',   label: 'Satisfaction Rate' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-secondary-900">
                  {stat.value}
                </p>
                <p className="text-sm text-secondary-500 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────── */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900">
              Everything you need for better health
            </h2>
            <p className="text-secondary-500 mt-4 max-w-2xl mx-auto">
              MediConnect combines AI technology with real doctor expertise
              to give you the best healthcare experience.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-hover group"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl
                                 flex items-center justify-center mb-4
                                 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900">
              How it works
            </h2>
            <p className="text-secondary-500 mt-4">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="text-center">

                {/* Step number */}
                <div className="w-16 h-16 bg-primary-600 rounded-2xl
                                flex items-center justify-center mx-auto mb-5">
                  <span className="text-white text-xl font-bold">
                    {step.number}
                  </span>
                </div>

                {/* Arrow between steps — desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-8
                                  text-secondary-300">
                    <ArrowRight size={24} />
                  </div>
                )}

                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-secondary-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────── */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to take control of your health?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Join thousands of patients and doctors on MediConnect today.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white text-primary-600 hover:bg-primary-50 px-10"
          >
            Get Started Free
            <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="bg-secondary-900 text-secondary-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center
                          justify-between gap-4">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-600 rounded-lg
                              flex items-center justify-center">
                <Heart size={14} className="text-white" />
              </div>
              <span className="text-white font-bold">MediConnect</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm">
              © 2026 MediConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
