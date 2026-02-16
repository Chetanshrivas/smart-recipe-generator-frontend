# Smart Recipe Generator

A modern full-stack web application that helps users discover delicious recipes based on ingredients they already have in their kitchen. Built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

### Core Features
- **Ingredient-Based Recipe Matching**: Enter your available ingredients and get recipes ranked by match percentage
- **Image Recognition**: Upload photos of ingredients for automatic detection (simulated for demo)
- **25+ Curated Recipes**: Diverse collection spanning 10 different cuisines
- **Dietary Filtering**: Filter by Vegetarian, Vegan, Gluten-Free, Keto, and more
- **Smart Substitutions**: Get ingredient substitution suggestions
- **Favorites & Ratings**: Save recipes and rate them
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Technical Features
- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS, Node.js, Express, MongoDB
- **RESTful API**: Clean API design with proper error handling
- **State Management**: React Context for user state
- **Custom Hooks**: Reusable hooks for data fetching
- **Type Safety**: Full TypeScript implementation
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Graceful error handling throughout the app

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Lucide React for icons
- React Hot Toast for notifications

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- CORS enabled
- Environment variable configuration

## Project Structure
```
smart-recipe-generator/
├── client/                 # react frontend
│   ├── src/
│   │   ├── components/     # reusable UI components
│   │   ├── pages/          # page components
│   │   ├── hooks/          # custom React hooks
│   │   ├── services/       # aPI service functions
│   │   ├── context/        # treact context providers
│   │   ├── types/          # rtypeScript type definitions
│   │   └── utils/          # utility functions
│   ├── public/             # sstatic assets
│   └── package.json
│
├── server/                 # node.js backend
│   ├── src/
│   │   ├── controllers/    # route controllers
│   │   ├── models/         # mongoose models
│   │   ├── routes/         # aPI routes
│   │   ├── utils/          # utility functions
│   │   └── seed/           # database seeding
│   └── package.json
│
└── README.md
```
## Getting Started


### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-recipe-generator
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Server (`.env`):
   ```env
   PORT=5000
   MONGODB_URI= .......
   NODE_ENV=development
   ```
   
   Client (`.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Seed the database**
   ```bash
   cd server
   npm run seed
   ```

6. **Start the development servers**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

7. **Open the application**
   Navigate to `http://localhost:3000` in your browser.

## API Endpoints
### Recipes
- `GET /api/recipes` - get all recipes with filters
- `GET /api/recipes/:id` - get single recipe
- `POST /api/recipes/match` - maaatch recipes by ingredients
- `GET /api/recipes/substitutions` - get ingredient substitutions
- `POST /api/recipes/:id/rate` - Rate a recipe
- `GET /api/recipes/suggestions/:userId` - get personalized suggestions
- `GET /api/recipes/cuisines` - geet all cuisines
- `GET /api/recipes/dietary-tags` - get all dietary tags

### Users
- `GET /api/users/:userId` - gettt user profile
- `POST /api/users/:userId/favorites` - Add to favorites
- `DELETE /api/users/:userId/favorites/:recipeId` - Remove from favorites
- `GET /api/users/:userId/favorites/:recipeId` - Check if favorite
- `PUT /api/users/:userId/preferences` - update dietary preferences

### Upload
- `POST /api/upload/recognize` - rececognize ingredients from image
- `POST /api/upload/extract-text` - extract ingredients from text

## Database Schema
### Recipe Model
- name, description, cuisine
- ingredients (array), instructions (array)
- nutrition (calories, protein, carbs, fat, fiber)
- prepTime, cookTime, servings, difficulty
- dietaryTags, imageUrl
- ratings, averageRating, totalRatings
- substitutions (Map)

### User Model
- userId (unique identifier)
- favorites (array of recipe ids)
- dietaryPreferences (array)
- searchHistory (array with timestamps)

Build by -
**Chetan shrivas**

**Happy Cooking!**
