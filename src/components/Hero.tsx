import React from 'react';
import { Sparkles, ChefHat, Clock, Leaf } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'Smart Matching',
      description: 'Find recipes based on ingredients you have',
    },
    {
      icon: ChefHat,
      title: '25+ Recipes',
      description: 'Curated collection from around the world',
    },
    {
      icon: Clock,
      title: 'Quick & Easy',
      description: 'Filter by cooking time and difficulty',
    },
    {
      icon: Leaf,
      title: 'Dietary Options',
      description: 'Vegetarian, vegan, gluten-free & more',
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Main Hero Content */}
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-gray-700">
              AI-Powered Recipe Finder
            </span>
          </div> */}
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Cook Smarter with{' '}
            <span className="gradient-text">What You Have</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Enter your available ingredients and discover delicious recipes tailored to your pantry. 
            No more food waste, just great meals!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartClick}
              className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <ChefHat className="w-5 h-5" />
              <span>Start Cooking</span>
            </button>
            <a
              href="#how-it-works"
              className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>Learn More</span>
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '25+', label: 'Recipes' },
            { value: '10', label: 'Cuisines' },
            { value: '10', label: 'Dietary Tags' },
            { value: '100%', label: 'Free' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;