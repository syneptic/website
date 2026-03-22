# Syneptic — IT Company Website

> **Where Intelligence Meets Innovation** | Built with HTML · CSS · JS | Hosted on GitHub Pages

## 🚀 Live Demo
This site is ready to deploy on [GitHub Pages](https://pages.github.com/).

## 📁 File Structure
```
syneptic/
├── index.html      ← Main website (single page)
├── index.css       ← All styles (dark/gold theme)
├── main.js         ← Particle animation, scroll effects, form
└── logo.jpg        ← Syneptic logo
```

## 🌐 Deploying to GitHub Pages

1. **Create a new GitHub repository** (e.g., `syneptic` or `your-username.github.io`)
2. **Push these files** to the repository:
   ```bash
   git init
   git add .
   git commit -m "🚀 Initial Syneptic website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   git push -u origin main
   ```
3. **Enable GitHub Pages:**
   - Go to repository **Settings → Pages**
   - Source: **Deploy from a branch** → `main` / `/ (root)`
   - Click **Save**
4. Your site will be live at `https://YOUR_USERNAME.github.io/REPO_NAME/`

## ✏️ Customization

| What to change | Where |
|---|---|
| Company info, tagline | `index.html` |
| Contact email / phone | `index.html` – Contact section |
| Team names & roles | `index.html` – Team section |
| Colors | `index.css` – `:root` variables |
| Particle count/speed | `main.js` – `CONFIG` object |
| Form submission | `main.js` – `initContactForm()` (integrate Formspree/EmailJS) |

## 📌 Features
- ✅ Animated particle canvas (gold circuit nodes)
- ✅ Scroll-reveal animations (Intersection Observer)
- ✅ Animated number counters
- ✅ Sticky navbar with transparency effect
- ✅ Mobile-responsive with hamburger menu
- ✅ Hover micro-animations (cards, buttons)
- ✅ SEO meta tags
- ✅ No dependencies — pure HTML/CSS/JS

## 📧 Connecting the Contact Form
To make the form actually send emails, integrate [Formspree](https://formspree.io):
1. Sign up at formspree.io
2. Create a new form and get your endpoint URL
3. In `main.js`, replace the simulated async in `initContactForm()` with:
   ```js
   await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(Object.fromEntries(new FormData(form)))
   });
   ```
