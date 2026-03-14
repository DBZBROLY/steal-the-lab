# ⚗️ Steal the Lab

A browser-based incremental/strategy game where you run a secret lab, produce items, and raid your enemy's lab.

![Game Preview](preview.png)

## 🎮 How to Play

1. **Produce** — Your lab automatically generates items every 2 seconds based on your level.
2. **Upgrade** — Spend items to upgrade your lab and produce faster.
3. **Steal** — Raid the enemy lab to steal their items. Watch out for their defense level!
4. The enemy lab also produces and upgrades over time — act fast!

## 🕹️ Mechanics

| Feature | Description |
|---|---|
| Production | +N items every 2s (N = your level) |
| Upgrade cost | Scales exponentially: `10 × 1.6^(level-1)` |
| Steal chance | 70% base, -7% per enemy defense level |
| Steal amount | Up to `level × 2.5` items per raid |
| Cooldown | 1.5s between raids |
| Enemy AI | Enemy auto-upgrades and builds defense over time |

## 🚀 Getting Started

No build tools needed — just open the file:

```bash
git clone https://github.com/YOUR_USERNAME/steal-the-lab.git
cd steal-the-lab
open index.html
```

Or serve with any static file server:

```bash
npx serve .
```

## 📁 File Structure

```
steal-the-lab/
├── index.html   # Game structure and layout
├── style.css    # Industrial terminal theme
├── game.js      # Game logic and state
└── README.md    # This file
```

## 🛠️ Built With

- Vanilla HTML / CSS / JavaScript (no frameworks)
- [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) + [Rajdhani](https://fonts.google.com/specimen/Rajdhani) from Google Fonts

## 📜 License

MIT — free to use, modify, and distribute.
