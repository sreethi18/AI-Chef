# AI‑Chef 🍳

> **Cooking AI based on instructions and ingredients given.**
>
> Built with **Vite + React + TypeScript**, powered by **Google Gemini** via AI Studio.

---

## ✨ What it does

AI‑Chef helps you:

* **Generate recipes** from free‑text prompts (e.g., “30‑minute vegetarian dinner with broccoli & rice”).
* **Plan meals** for a day or week.
* **Scale servings** and convert units.
* **Explain steps** like a tutor ("why do we sear first?").
* **Suggest substitutions** based on dietary preferences (vegan, gluten‑free, nut‑free, etc.).
* **Show difficulty & time**: Every suggestion includes an **estimated difficulty** (Easy/Medium/Hard) and an **approx. total time** (prep + cook).
* **Respect dietary restrictions**: Ask for and **filter** by vegetarian, vegan, gluten‑free, dairy‑free, and low‑carb.

> Tip: See the **Prompt Examples** below to get great results.

---

## 🧱 Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **AI:** Google Gemini (AI Studio / Generative Language API)
* **Styling:** Vanilla CSS / Tailwind (optional; see Roadmap)

---

## 🚀 Quick Start (Local)

**Prerequisites**: Node.js 18+ and npm

```bash
# 1) Install dependencies
npm install

# 2) Configure your Gemini API key (AI Studio)
# Create a file named .env.local in the project root with:
GEMINI_API_KEY=your_key_here

# 3) Start the dev server
npm run dev
```

Open the printed **Local** URL (usually `http://localhost:5173`).

> **Where do I get the key?** Create one in [Google AI Studio](https://aistudio.google.com/). Then paste it into `.env.local`.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```dotenv
GEMINI_API_KEY=your_key_here
```

> **Never commit real keys.** Add `.env.local` to your `.gitignore` (already included).

---

## 🗂️ Project Structure

```
AI-Chef/
├─ components/              # UI pieces (RecipeCard, PantryInput, Loader, etc.)
├─ services/                # API callers & helpers (gemini client, prompt builders)
├─ App.tsx                  # App shell & routes
├─ index.tsx                # React bootstrap
├─ index.html               # Vite HTML entry
├─ metadata.json            # AI Studio app metadata
├─ vite.config.ts           # Vite config
├─ tsconfig.json            # TypeScript config
├─ package.json             # Scripts & deps
├─ .gitignore               # Ignored files
└─ README.md                # This file
```

> The exact component filenames may differ; the folder purposes match what you see in the repo.

---

## 🧩 Core Concepts

**1) Single source of truth for prompts**
`services/` contains helpers that:

* Build a concise **system prompt** (tone, safety, persona).
* Construct **user prompts** from inputs (ingredients, dietary flags, time, cuisine).
* Call **Gemini** with temperature / tokens tuned for recipe output.

**2) Deterministic output structure**
Parse the model’s response into a recipe object:

```ts
interface Recipe {
  title: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time?: { prep?: string; cook?: string; total?: string };
  totalTime?: string; // convenience mirror of time.total
  ingredients: Array<{ item: string; quantity?: string; note?: string }>;
  steps: string[];
  notes?: string[];
  nutrition?: Record<string, string>; // kcal, protein, etc.
  flags?: Array<'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'low-carb'>;
  substitutions?: Array<{ missing: string; suggested: string; ratio?: string; caveat?: string }>;
}>;
  steps: string[];
  time?: { prep?: string; cook?: string; total?: string };
  notes?: string[];
  nutrition?: Record<string, string>; // kcal, protein, etc.
}
```

**3) UX that guides the model**
The UI shows clear fields (ingredients, allergies, cuisine, target time) and sample prompts so users provide the right context.

---

## 🧪 Usage & Prompt Examples

Try these in the input box:

* *“30‑minute gluten‑free dinner with broccoli, rice, eggs; 2 servings; Asian style.”*
* *“Meal plan for 1 day: high‑protein vegetarian, ~1800 kcal, include snacks.”*
* *“I only have canned chickpeas, tomatoes, onion, garlic. Give a quick curry for 3.”*
* *“I’m vegan and low‑carb. I have zucchini, tofu, coconut milk. 25 minutes max.”*
* *“Explain why we rest steak and how long for medium‑rare (cast‑iron).”*
* *“Swap peanuts & dairy; make it kid‑friendly.”*

> **Pro tip:** When prompted, confirm dietary preferences (Vegetarian/Vegan/Gluten‑free/Dairy‑free/Low‑carb). The UI will filter results.

---

## 🥗 Dietary Preferences & Filtering

On first use (and any time via the toggle panel), AI‑Chef asks whether you follow any of these:

* **vegetarian**, **vegan**, **gluten‑free**, **dairy‑free**, **low‑carb**

Recipes are **filtered** client‑side using the model’s structured JSON (the `flags` field) and server‑side by **prompting** the model *not* to include disallowed ingredients. If nothing matches, AI‑Chef offers close variants or substitutions.

---

## 🔁 Ingredient Substitutions (Smart Fallbacks)

When you’re missing an ingredient, AI‑Chef proposes **practical swaps** with ratios + caveats, e.g.:

* **Lemon juice → vinegar** (use ~¾ the amount; flavor is sharper/tangier)
* **Buttermilk → milk + vinegar** (1 cup milk + 1 tbsp vinegar; rest 5 minutes)
* **Sour cream → Greek yogurt** (1:1; slightly tangier)
* **Breadcrumbs → crushed oats/crackers** (texture changes; season more)
* **Soy sauce → tamari/coconut aminos** (gluten‑free options; sweetness varies)

Substitutions are returned in `recipe.substitutions[]` so the UI can show inline tips.

---

## 🧠 How the AI Call Works (High Level)

* Build a **system prompt**: “You are AI‑Chef, a friendly cooking assistant. Respond with structured JSON + markdown and include food‑safety notes when relevant.”
* Build a **user prompt**: merge form fields into a compact instruction block, including **dietary restrictions** and **available ingredients**.
* Ask the model to **estimate difficulty** (Easy/Medium/Hard) and **total time** (prep + cook) from the method & ingredients; return in JSON.
* Ask the model to **propose substitutions** when items are missing, with ratio + caveat notes.
* Call **Gemini** with parameters (temperature, topP, max tokens) and parse the result.
* Render the recipe object to React components (title, difficulty badge, time chips, ingredients with substitutions, steps, nutrition, print view).

---

## 🖼️ Screenshots / Demo

* **Home:** Prompt input + examples
* **Recipe View:** Title, time, ingredients, steps, notes
* **Meal Plan:** Breakfast → Dinner + snacks, per‑meal macros *(optional)*

*Add GIFs or images here once you have them.*

---

## 📦 Available Scripts

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview the production build locally
```

---

## ☁️ Deploy

You can deploy any Vite app easily:

### Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add `GEMINI_API_KEY` in **Project → Settings → Environment Variables**.
4. Deploy.

### Netlify

1. Netlify → New Site from Git.
2. Build command: `npm run build`, Publish directory: `dist`.
3. Add `GEMINI_API_KEY` in **Site settings → Environment variables**.

### GitHub Pages (Static)

Use `vite` + `gh-pages`. Note: You’ll need a simple serverless function or proxy if you ever move secrets server‑side.

---

## 🔒 Safety Notes

* AI output may be inaccurate. Always verify **food‑safety** critical steps (temps for poultry/pork/seafood).
* Include allergy disclaimers and substitution checks.

---

## 🛠️ Troubleshooting

* **API key not found:** Ensure `.env.local` exists and the key name is exactly `GEMINI_API_KEY`.
* **CORS / network errors:** If calling Gemini from browser, ensure the AI Studio key allows web usage. Consider routing via a tiny backend proxy.
* **Blank page:** Open the browser devtools console for errors (often a missing env var or TypeScript type mismatch).
* **Node mismatch:** Use Node 18+.

---

## 🗺️ Roadmap

* [ ] Pantry mode: type what you have → recipe ideas
* [ ] Nutrition estimates per serving
* [ ] Save/share recipes; export to PDF
* [ ] Weekly meal planner with shopping list
* [ ] Voice input + read‑aloud steps
* [ ] Theming + Tailwind polish
* [ ] Optional server proxy (Cloud Functions / Cloud Run)

---

## 🤝 Contributing

1. Fork the repo & create a feature branch.
2. Ensure type safety and add minimal tests where useful.
3. Submit a PR with screenshots for UI changes.

> Consider adding a `.env.local.example` with placeholder keys for contributors.

---

## 📄 License

MIT © 2025 Sreethi Sasikumar

---

## 📘 Appendix: Example Prompt Template

````text
You are AI‑Chef, a friendly and safety‑aware cooking assistant. Return structured JSON plus a concise markdown summary.

User profile:
- servings: <number>
- dietary_restrictions: <none | vegetarian | vegan | gluten-free | dairy-free | low-carb | comma list>
- time limit: <text>
- tools: <text>

Ingredients I have: <comma‑separated list>
Goal: <recipe / meal plan / substitution / explanation>

Return **both**:
1) A JSON block with keys: title, servings, difficulty(Easy|Medium|Hard), time{prep,cook,total}, totalTime, ingredients[{item, quantity, note}], steps[], notes[], substitutions[{missing,suggested,ratio,caveat}], flags[diet tags], nutrition{calories,protein,carbs,fat}.
2) A markdown explanation for humans (do not repeat JSON).```text
You are AI‑Chef, a friendly and safety‑aware cooking assistant.

User profile:
- servings: <number>
- diet/allergies: <text>
- time limit: <text>
- tools: <text>

Ingredients I have: <comma‑separated list>
Goal: <recipe / meal plan / substitution / explanation>

Return **both**:
1) A JSON block with keys: title, servings, ingredients[{item, quantity}], steps[], time{prep,cook,total}, notes[], nutrition{calories,protein,carbs,fat}.
2) A markdown explanation for humans (do not repeat JSON).
````
