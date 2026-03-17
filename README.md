# myDE

> **What if your IDE had an away message?**

myDE
my developer environment. my vibe.

it looks like AIM.
it acts like an IDE.

Except this time, your buddy is an AI that builds entire web apps for you.

<br>

## What Is This, Exactly?

It's an IDE. It's a love letter to AIM. It's a development environment that looks like it runs on Windows 98 but is secretly powered by Next.js 16, React 19, and the [V0 Platform SDK](https://v0.dev).

You type "build me a landing page for a cheese store" into a chat window that looks like an IM conversation, and a few minutes later you're staring at a live preview of **The Curd & Rind** with a working deployment URL. All while your title bar gradient shimmers in navy blue.

<br>

## Features

**AI Chat (your new buddy)**
- Chat with V0-powered AI to generate full applications
- It's like talking to your smartest AIM buddy, except this one actually writes code instead of sending you song lyrics

**Live Preview**
- See your generated app running in a real iframe with a real URL
- Responsive viewport toggles (mobile, tablet, desktop)
- Edit code locally and sync changes back to V0

**Code Editor**
- Monaco Editor (the same engine behind VS Code) with full syntax highlighting
- Custom themes that match whatever nostalgic color scheme you've chosen
- File tabs, language detection, and a toolbar that looks like it belongs in Notepad circa 1998

**File Explorer (aka the Buddy List)**
- Your project files, organized in collapsible folder groups
- File-type icons, search, and right-click context menus
- It's giving "buddy list energy" and we're not sorry

**Themes**
- 6 built-in themes: Classic AIM, AIM Triton, Matrix, Midnight, Sunset, and fully Custom
- Every color is a CSS variable, so you can make it look however you want
- The title bar gradients alone are worth the clone

**Sound Effects**
- Door open, door close, message chime -- just like the old days
- Adjustable volume, or turn them off if you're in a meeting (we won't judge)

**Dictation**
- Hit the mic button and talk to your IDE
- It uses the Web Speech API, so it's as accurate as your pronunciation

**Window Management**
- Draggable, resizable, stackable windows with click-to-focus
- Minimize to taskbar, maximize to fill screen, snap to edges
- It's a full windowing system. In a browser. We may have gone too far.

**Aleo Blockchain Mode**
- Toggle on Aleo support for zero-knowledge application development
- Leo language syntax highlighting in the editor
- Privacy mode toggle: "Private by Default" or "Public"
- The AI knows Leo, so you can generate ZK apps from chat

**Deploy to Vercel**
- One-click deploy your AI-generated apps to production
- Because what's the point of building a cheese store if nobody can buy cheese?

<br>

## Getting Started

```bash
# Clone it like it's 2003
git clone https://github.com/lilfrijole/myDE.git
cd myDE

# Install dependencies
pnpm install

# Add your V0 API key
echo "V0_API_KEY=your_key_here" > .env.local

# Fire it up
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and try not to get emotional when you see the title bar gradient.

### Getting a V0 API Key

1. Go to [v0.dev/chat/settings/keys](https://v0.dev/chat/settings/keys)
2. Create a new API key
3. Drop it in `.env.local`
4. That's it. You're in the buddy list now.

<br>

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript |
| AI Engine | V0 Platform SDK |
| Editor | Monaco Editor |
| State | Zustand (persisted) |
| Styling | Tailwind v4 + CSS Custom Properties |
| Vibes | Windows 98 / AIM circa 2003 |

<br>

## Why?

Because every developer deserves an IDE that makes them smile. Because the best UI ever made was a buddy list with a gradient title bar. Because sometimes you want your terminal to play a door sound when you open a project.

And honestly? Because we could.

<br>

## Contributing

PRs welcome. If you add a new theme, bonus points. If you add the AIM running man as a loading animation, you win the internet.

<br>

## License

Do whatever you want with it. Just remember to set an away message.

<br>

---

*Built with mass amounts of mass amounts and mass amounts of mass amounts by [@lilfrijole](https://github.com/lilfrijole)*

*brb, setting my away message* 🏃
