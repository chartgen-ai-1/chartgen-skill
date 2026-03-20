# ChartGen AI — OpenClaw Skill

> **#1 Product of the Day on Product Hunt** 🏆

Transform natural language into professional charts, dashboards, diagrams, and
data analysis reports — powered by [ChartGen AI](https://chartgen.ai).

<p align="center">
  <a href="https://chartgen.ai">
    <img src="https://img.shields.io/badge/ChartGen_AI-Visit_Website-blue?style=for-the-badge" alt="ChartGen AI" />
  </a>
  <a href="https://www.producthunt.com/products/chartgen-ai">
    <img src="https://img.shields.io/badge/Product_Hunt-%231_Product_of_the_Day-da552f?style=for-the-badge&logo=producthunt&logoColor=white" alt="Product Hunt" />
  </a>
</p>

---

## What Can It Do?

| Feature | Description |
|---------|-------------|
| 📊 **Charts** | Bar, Line, Pie, Area, Scatter, Heatmap, Combo, Waterfall, Funnel |
| 📋 **Dashboards** | Interactive multi-chart dashboards with filters |
| 🔀 **Diagrams** | Flowcharts, architecture diagrams, mind maps, relationship maps |
| 📅 **Gantt Charts** | Project timelines with task dependencies |
| 📝 **Reports** | AI-powered analytical reports with embedded visualizations |
| 📽️ **Presentations** | Auto-generated PPT slides with charts |

Just describe what you want in plain language — no data formatting or design
skills required. Upload CSV/Excel files for data-driven visualizations.

---

## Installation

### Option A: Install from ClawHub

```bash
openclaw skills install chartgen-ai
```

### Option B: Install from GitHub

```bash
openclaw skills install github:chartgen/chartgen-openclaw-skill
```

### Option C: Manual Installation

1. Clone this repository into your OpenClaw skills directory:

```bash
cd ~/.openclaw/workspace/skills
git clone https://github.com/chartgen/chartgen-openclaw-skill.git chartgen-ai
```

2. Refresh skills:

```bash
openclaw skills refresh
```

---

## Configuration

### 1. Get Your API Key (Free)

1. Visit [chartgen.ai/chat](https://chartgen.ai/chat)
2. Click the **menu icon** (☰) in the bottom-left corner
3. Select **"API"**
4. Generate and copy your API key

### 2. Configure the Skill

```bash
openclaw config set chartgen-ai.api_key "your-api-key-here"
```

### Advanced Configuration (Optional)

| Setting | Default | Description |
|---------|---------|-------------|
| `api_key` | *(required)* | Your ChartGen AI API key |
| `api_base_url` | `https://deepanalysis.digitforce.com` | API endpoint URL |
| `poll_interval_seconds` | `20` | Seconds between status checks |
| `max_poll_attempts` | `30` | Max polling attempts (~10 min timeout) |
| `default_lang` | `en` | Default language for generated content |

```bash
# Example: set language to Chinese
openclaw config set chartgen-ai.default_lang "zh-CN"

# Example: adjust polling interval
openclaw config set chartgen-ai.poll_interval_seconds 15
```

---

## Usage Examples

### Generate a Chart

> "Create a pie chart showing market share: Apple 28%, Samsung 20%, Xiaomi 14%, Others 38%"

### Build a Dashboard

> "Build a sales dashboard with monthly revenue trend, top 10 products by sales, and regional distribution"

### Draw a Diagram

> "Draw a flowchart for user registration process: sign up → email verification → profile setup → welcome page"

### Create a Gantt Chart

> "Create a Gantt chart for a 3-month product launch plan with design, development, testing, and release phases"

### Data Analysis Report

> "Analyze this sales data and create a comprehensive report with charts and insights"
> *(attach a CSV/Excel file)*

### Follow-up Modifications

> "Change the color theme to blue"
> "Switch it to a bar chart"
> "Add a trend line"

---

## How It Works

```
User Request → ChartGen AI API → Async Processing → Poll for Results → Display Charts
```

1. **You describe** what you want in plain language
2. **ChartGen AI** processes your request (typically 1–3 minutes)
3. **Automatic polling** checks the status in the background
4. **Results delivered** — charts as images, reports as text, with download links

The skill uses OpenClaw's cron scheduling for async task polling, so your
conversation stays unblocked while charts are being generated.

---

## Supported Languages

ChartGen AI and this skill support multiple languages. The skill automatically
detects the user's language and responds accordingly:

🇺🇸 English · 🇨🇳 中文 · 🇯🇵 日本語 · 🇰🇷 한국어 · 🇩🇪 Deutsch · 🇫🇷 Français · 🇪🇸 Español

---

## About ChartGen AI

[ChartGen AI](https://chartgen.ai) is the world's leading AI-powered data
visualization platform, developed by [Ada.im](https://ada.im).

- 🏆 **#1 Product of the Day** on Product Hunt (Feb 2026)
- 🥈 **#2 Product of the Week** on Product Hunt
- 🔒 **SOC 2** compliant data security
- 🎨 **12 professional themes** with one-click export
- 📊 **9+ chart types** — from simple bar charts to complex heatmaps
- 🤖 **Natural language to visualization** — just describe what you need
- 📁 **CSV/Excel support** — upload your data files directly
- 🆓 **Free to use** — no signup required for core features

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "API Key Required" message | Get a free key at [chartgen.ai/chat](https://chartgen.ai/chat) → Menu → API |
| Task takes too long | Complex dashboards may take 3–5 min. Check with "Check task {task_id}" |
| "Task not found" | Tasks expire after ~1 hour. Submit a new request |
| Connection error | Verify `api_base_url` is correct and accessible |
| Rate limit (429) | Wait 30 seconds and try again |

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ by <a href="https://chartgen.ai">ChartGen AI</a> · Powered by <a href="https://ada.im">Ada.im</a>
</p>
