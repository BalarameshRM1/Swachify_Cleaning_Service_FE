export const menuItems = [
    { key: 'services', label: 'Our Services' },
    { key: 'how-it-works', label: 'How It Works' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'about', label: 'About Us' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'contact', label: 'Contact' },
  ];

export  const services = [
    {
      icon: '🏠',
      title: 'Home Deep Cleaning',
      description: 'Thorough cleaning of every corner of your home. Kitchen, bathrooms, living areas, and bedrooms - all spotless.',
      features: ['Kitchen & appliances', 'Bathroom sanitization', 'Floor & carpet cleaning'],
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)'
    },
    {
      icon: '🏢',
      title: 'Office Cleaning',
      description: 'Professional workspace cleaning for a productive environment. Daily, weekly, or monthly service available.',
      features: ['Desk & workstation cleaning', 'Common area maintenance', 'Restroom sanitization'],
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
    },
    {
      icon: '🪟',
      title: 'Window Cleaning',
      description: 'Crystal clear windows inside and out. Professional equipment for streak-free shine every time.',
      features: ['Interior & exterior glass', 'Frame & sill cleaning', 'High-rise specialists'],
      gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
    },
    {
      icon: '🛋️',
      title: 'Sofa & Carpet Cleaning',
      description: 'Deep cleaning for upholstery and carpets. Remove stains, odors, and allergens with our specialized treatment.',
      features: ['Steam cleaning', 'Stain removal', 'Fabric protection'],
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
    },
    {
      icon: '🏡',
      title: 'Move In/Out Cleaning',
      description: 'Complete cleaning for moving homes. Leave your old place spotless or move into a fresh, clean new home.',
      features: ['Complete house cleaning', 'Cabinet & closet cleaning', 'Same-day service available'],
      gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
    },
    {
      icon: '✨',
      title: 'Post-Construction Cleaning',
      description: 'Specialized cleaning after renovation or construction. Remove dust, debris, and make it move-in ready.',
      features: ['Dust & debris removal', 'Surface polishing', 'Final touch cleaning'],
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)'
    }
  ];

export  const pricingPlans = [
    {
      name: 'BASIC CLEANING',
      price: '₹499',
      period: '/visit',
      description: 'Perfect for regular maintenance',
      features: [
        'Dusting & vacuuming',
        'Mopping all floors',
        'Kitchen counters cleaning',
        'Bathroom basic cleaning',
        'Up to 1000 sq ft'
      ],
      popular: false
    },
    {
      name: 'DEEP CLEANING',
      price: '₹999',
      period: '/visit',
      description: 'Comprehensive cleaning solution',
      features: [
        'Everything in Basic',
        'Deep kitchen cleaning',
        'Bathroom sanitization',
        'Window & glass cleaning',
        'Up to 2000 sq ft',
        'Appliance cleaning'
      ],
      popular: true
    },
    {
      name: 'PREMIUM PACKAGE',
      price: '₹1,999',
      period: '/visit',
      description: 'Ultimate cleaning experience',
      features: [
        'Everything in Deep',
        'Sofa & carpet cleaning',
        'Balcony & terrace cleaning',
        'Unlimited square footage',
        'Priority scheduling',
        '24/7 support'
      ],
      popular: false
    }
  ];

export  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Homemaker, Mumbai',
      initial: 'P',
      rating: 5,
      text: 'Absolutely fantastic service! The team was professional, punctual, and my house has never been cleaner. Will definitely book again!',
      color: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
    },
    {
      name: 'Rahul Verma',
      role: 'Business Owner, Delhi',
      initial: 'R',
      rating: 5,
      text: 'We use Swachify for our office cleaning weekly. They\'re reliable, thorough, and use eco-friendly products. Highly recommend!',
      color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
    },
    {
      name: 'Anjali Patel',
      role: 'Engineer, Bangalore',
      initial: 'A',
      rating: 5,
      text: 'Best cleaning service in the city! They did an amazing job with my post-renovation cleaning. Everything sparkles now!',
      color: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
    }
  ];