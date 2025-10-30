# 🍳 AI-Chef – Smart AI Cooking Assistant

> An intelligent, voice-enabled cooking assistant that helps users turn available ingredients into complete recipes — with cooking time, difficulty level, dietary filters, and smart substitutions.  
> Built using **React + TypeScript + Vite**, powered by **Google Gemini AI**.

---

## ✨ What It Does

AI-Chef helps you:

- 🧠 **Generate full recipes** from ingredients you have on hand (e.g., “broccoli, rice, and tofu”).
- 🕒 **Show cooking time & difficulty** (Easy / Medium / Hard) for every recipe.
- 🥗 **Ask about dietary preferences** — vegetarian, vegan, gluten-free, dairy-free, low-carb — and filter results.
- 🔁 **Suggest smart substitutions** (e.g., lemon juice → vinegar, buttermilk → milk + vinegar).
- 🎤 **Use voice input** to speak ingredients instead of typing.
- ⚖️ **Scale servings** — automatically update ingredient amounts.
- 🍽️ **Display nutrition info** (calories, protein, carbs, fat).
- ⏱️ **Add a cooking timer** for total or per-step durations.
- 📤 **Share recipes** via Web Share API or clipboard.
- 🎨 **Enjoy a clean, modern UI** with smooth fonts and colors.

---

## 🧱 Tech Stack

- **Frontend:** React 18, TypeScript, Vite  
- **AI:** Google Gemini (AI Studio API)  
- **UI:** Custom CSS + Inter Font  
- **APIs:** Web Speech API (voice), Web Share API (sharing)  
- **Build Tools:** Node.js, npm  

---

## 🚀 Quick Start

### 1️⃣ Prerequisites
- Node.js 18+  
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 2️⃣ Installation
```bash
# Clone the project
git clone https://github.com/sreethi18/AI-Chef.git
cd AI-Chef

# Install dependencies
npm install
🗂️ Project Structure
AI-Chef/
├── components/
│   ├── Header.tsx               # Top navigation & branding
│   ├── IngredientInput.tsx      # Ingredient input + mic + diet filters
│   ├── RecipeDisplay.tsx        # Recipe view with steps, nutrition, timers
│   ├── Loader.tsx               # Loading animation
│   └── icons/                   # Chef, Mic, Share icons
├── services/
│   └── geminiService.ts         # Handles Gemini AI requests & parsing
├── App.tsx                      # Root app layout
├── index.html                   # Entry point
├── index.tsx                    # React DOM render
├── metadata.json                # Gemini app metadata
├── vite.config.ts               # Vite configuration
└── package.json                 # Scripts & dependencies
🍽️ Core Features Explained
🕒 Difficulty & Time

Every recipe shows:

Difficulty — Easy / Medium / Hard

Total Time — combination of prep + cook duration

🥗 Dietary Filters

Selectable options:

Vegetarian

Vegan

Gluten-Free

Dairy-Free

Low-Carb

AI-Chef filters recipes based on your choice and avoids disallowed ingredients.

🔁 Ingredient Substitutions

If you don’t have something, AI-Chef suggests practical swaps:

Lemon juice → Vinegar (~¾ ratio)

Buttermilk → Milk + Vinegar

Breadcrumbs → Crushed oats/crackers
Each substitution includes a note on flavor differences.

🎤 Voice Input

Click the mic icon and speak your ingredients.
Continuous listening mode adds new items automatically, showing live transcription.

⚖️ Servings Scaling

Change the servings count — AI recalculates ingredient quantities instantly.

⏱️ Cooking Timer

Timer auto-sets from total time in recipe.

Each step with a duration gets its own Start Timer button.

Simple Start / Pause / Reset controls.

Plays a gentle alert when done 🔔.

🍽️ Nutrition Info

Shows approximate per-recipe values:

Calories

Protein

Carbs

Fat

🧪 Example Prompts

Try these in the app:

“Quick vegetarian lunch with spinach, eggs, and cheese — 20 minutes.”

“I have rice, lentils, tomato. Show me an Indian recipe for 3 servings.”

“Low-carb dinner using chicken and broccoli. Easy level.”

“Explain how to roast veggies evenly.”

“Vegan curry idea with chickpeas, coconut milk, and 25 minutes max.”
