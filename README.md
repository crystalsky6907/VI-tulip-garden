# Blooming Tulips — A Special Garden for Vismaya 🌷✨

An interactive blooming tulip website dedicated to **Vismaya**, featuring an interactive canvas garden and a personal flower collection: **"A Flower for Every Little Thing About You"**.

---

## 💌 How to Edit Your Personal Messages (For Mithun)

You can easily customize all personal messages and flower qualities in [`vismaya.js`](file:///C:/Users/Mithun%20N/.gemini/antigravity/scratch/tulip-bloom/vismaya.js#L10-L115).

Right at the top of [`vismaya.js`](file:///C:/Users/Mithun%20N/.gemini/antigravity/scratch/tulip-bloom/vismaya.js), you'll see:

```javascript
const VISMAYA_GARDEN_CONFIG = {
  sectionTitle: "A Flower for Every Little Thing About You",
  sectionSubtitle: "Every flower represents a special quality, memory, or reason why you are so important to me, Vismaya.",
  
  flowers: [
    {
      id: "pink",
      number: "01",
      name: "Pink Tulip",
      quality: "Your Beautiful Smile",
      // Edit your personal message below:
      message: "Your smile has a way of making even ordinary moments feel special."
    },
    {
      id: "red",
      number: "02",
      name: "Red Tulip",
      quality: "Your Kindness",
      // Edit your personal message below:
      message: "Your kindness is one of the many things that make you special."
    },
    {
      id: "yellow",
      number: "03",
      name: "Yellow Tulip",
      quality: "The Happiness You Bring",
      // Edit your personal message below:
      message: "You bring happiness into little moments without even realizing it."
    },
    {
      id: "white",
      number: "04",
      name: "White Tulip",
      quality: "Your Beautiful Heart",
      // Edit your personal message below:
      message: "There is something genuinely beautiful about the person you are."
    },
    {
      id: "purple",
      number: "05",
      name: "Purple Tulip",
      quality: "Your Uniqueness",
      // Edit your personal message below:
      message: "There is nobody quite like you, Vismaya."
    },
    {
      id: "orange",
      number: "06",
      name: "Orange Tulip",
      quality: "The Special Person You Are",
      // Edit your personal message below:
      message: "You make this little garden more beautiful just by being in it."
    }
  ],

  // Special Surprise Message unlocked after all 6 flowers are bloomed:
  surprise: {
    message: "Six flowers, six little reasons, and countless more that words could never explain. This garden is yours, Vismaya. ❤️"
  }
};
```

Simply update the text inside the quotes, save the file, and refresh your browser!

---

## 🌟 Features

### 1. Interactive Blooming Canvas Playground (Hero)
- Deep pitch black (`#000000`) starry night canvas.
- Click or tap anywhere to sprout and bloom glowing tulip bouquets with layered petals, leaves, and floating sparkles.
- Every click features a new vibrant color palette.
- Real-time Web Audio pentatonic chime notes on bloom.

### 2. "A Flower for Every Little Thing About You" (Dedicated Section)
- Quick-access button in the top toolbar: **"For Vismaya (0/6 🌷)"**.
- Floating scroll pill at the bottom of the canvas.
- Floating petals canvas in the background gently fluttering across the screen.
- **6 Hand-crafted Interactive Tulip Cards**:
  1. 🌷 **Pink Tulip** — *Your Beautiful Smile*
  2. 🌷 **Red Tulip** — *Your Kindness*
  3. 🌷 **Yellow Tulip** — *The Happiness You Bring*
  4. 🌷 **White Tulip** — *Your Beautiful Heart*
  5. 🌷 **Purple Tulip** — *Your Uniqueness*
  6. 🌷 **Orange Tulip** — *The Special Person You Are*
- Clicking any flower plays a blooming petal animation, glowing colored aura, and opens an elegant letter card with your personal message for her.

### 3. Special Surprise Celebration
- Once Vismaya unlocks all 6 flowers, a grand celebration is unlocked:
  - Burst of colorful floating blossom petals.
  - Triumphant chime melody.
  - The special surprise card:
    > *"Six flowers, six little reasons, and countless more that words could never explain. This garden is yours, Vismaya. ❤️"*
- She can replay the celebration anytime with the **"Replay Celebration ❤️"** button.

---

## 🚀 How to Open

Open [`index.html`](file:///C:/Users/Mithun%20N/.gemini/antigravity/scratch/tulip-bloom/index.html) in your browser (Chrome, Edge, Safari, Firefox).
