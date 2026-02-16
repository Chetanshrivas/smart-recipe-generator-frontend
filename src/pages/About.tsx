import React from 'react';
import { ChefHat, } from 'lucide-react';

const About: React.FC = () => {
  // const techStack = [
  //   {
  //     category: 'Frontend',
  //     icon: Code2,
  //     items: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router'],
  //   },
  //   {
  //     category: 'Backend',
  //     icon: Database,
  //     items: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'TypeScript'],
  //   },
  //   {
  //     category: 'Features',
  //     icon: Sparkles,
  //     items: [
  //       'Ingredient-based recipe matching',
  //       'Image recognition (simulated)',
  //       'Dietary preference filtering',
  //       'Favorites & ratings',
  //       'Substitution suggestions',
  //     ],
  //   },
  // ];

  const features = [
    {
      title: 'Smart Recipe Matching',
      description:
        'Our algorithm analyzes your available ingredients and finds recipes with the highest match percentage, helping you use what you already have.',
    },
    {
      title: 'Diverse Recipe Collection',
      description:
        'Explore 25+ carefully curated recipes from 10 different cuisines including Italian, Indian, Chinese, Mexican, and more.',
    },
    {
      title: 'Dietary Preferences',
      description:
        'Filter recipes by dietary needs including Vegetarian, Vegan, Gluten-Free, Keto, and more.',
    },
    {
      title: 'Ingredient Substitutions',
      description:
        'Missing an ingredient? Get smart substitution suggestions to help you adapt any recipe.',
    },
    {
      title: 'Save Your Favorites',
      description:
        'Create your personal cookbook by saving recipes you love for quick access anytime.',
    },
    {
      title: 'Nutritional Information',
      description:
        'View detailed nutrition facts for every recipe including calories, protein, carbs, and fat.',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-6">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About Smart Recipe Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern web application that helps you discover delicious recipes 
            based on ingredients you already have in your kitchen.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-sm card-hover"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Technology Stack
          </h2>
          <div className="space-y-8">
            {techStack.map((stack) => {
              const Icon = stack.icon;
              return (
                <div
                  key={stack.category}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {stack.category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stack.items.map((item) => (
                      <span
                        key={item}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* Project Info */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Project Information
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong className="text-gray-900">Smart Recipe Generator</strong> is a 
                full-stack web application built as a technical assessment project. It 
                demonstrates modern web development practices including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>RESTful API design with Node.js and Express</li>
                <li>MongoDB database with Mongoose ODM</li>
                <li>React frontend with TypeScript</li>
                <li>Responsive design with Tailwind CSS</li>
                <li>State management with React Context</li>
                <li>Custom hooks for data fetching</li>
              </ul>
              <p className="mt-4">
                The application includes 25+ recipes across 10 different cuisines, with 
                features like ingredient matching, dietary filtering, favorites, ratings, 
                and substitution suggestions.
              </p>
            </div>

            {/* Links */}
             {/* <div className="mt-8 pt-6 border-t border-gray-200"> 
              <h3 className="font-semibold text-gray-900 mb-4">Links</h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub Repository</span>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Live Demo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section> */} 

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '25+', label: 'Recipes' },
              { value: '10', label: 'Cuisines' },
              { value: '100%', label: 'Free' },
              { value: '∞', label: 'Possibilities' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Cooking?
          </h2>
          <p className="text-gray-600 mb-8">
            Discover delicious recipes with the ingredients you already have.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/" className="btn-primary">
              Find Recipes
            </a>
            <a href="/recipes" className="btn-secondary">
              Browse All
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;