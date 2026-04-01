import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "frameworks", label: "Frameworks" },
  { id: "ai-hub", label: "AI Hub" },
  { id: "playbooks", label: "Playbooks" },
  { id: "career", label: "Career" },
  { id: "tools", label: "Tools" },
  { id: "secrets", label: "Secrets" },
  { id: "blog", label: "Blog" },
  { id: "about", label: "About" },
];

// ─────────────────────────────────────────────
// BLOG POSTS — Add new posts here at the top!
// Copy the block below, fill in your content,
// and push to GitHub. That's all it takes.
// ─────────────────────────────────────────────
const POSTS = [
  {
    id: 1,
    date: "2026-04-01",
    title: "Why most PMs are bad at prioritization (and how to fix it)",
    excerpt: "It's not about having the wrong framework. It's about the wrong incentives. Here's what I've learned after years in the trenches.",
    tag: "Strategy",
    tagColor: "#1D9E75",
    tagBg: "#E1F5EE",
    readTime: "4 min",
    content: `Most PMs I've worked with know RICE. They know MoSCoW. They've heard of the Kano model. And yet, their backlogs are still a mess.

The real problem isn't frameworks — it's incentives. When your promotion depends on shipping features, you prioritize features. When your stakeholders are loud, you prioritize loudness. The framework becomes a post-hoc justification for what you already decided emotionally.

Here's the fix I've found actually works: **Prioritize problems, not features.** Before any scoring exercise, write down the top 3 problems your users have right now. Not solutions — problems. Then ask: which item on my backlog most directly solves problem #1?

If no item on your backlog addresses your top problems, that's your signal. Stop refining the backlog. Start discovery.

The second fix: **Make your prioritization decisions public.** Share a monthly "what we're NOT building" doc with your team. Forcing yourself to explain what you deprioritized — and why — creates accountability that no scoring framework can.`,
  },
  {
    id: 2,
    date: "2026-03-28",
    title: "The 10-minute stakeholder alignment trick",
    excerpt: "Before any big review, I spend 10 minutes doing this. It's saved me from more derailed meetings than I can count.",
    tag: "Leadership",
    tagColor: "#534AB7",
    tagBg: "#EEEDFE",
    readTime: "3 min",
    content: `Every PM has had this experience: you walk into a big review meeting confident, and within 5 minutes someone raises an objection that derails the entire session.

The cause is almost always the same: you pre-wired the content, but not the people.

Here's the 10-minute trick. The day before any significant review:

1. List every person in the room.
2. For each person, write one sentence: "What is their most likely objection?"
3. Send a Slack message to each person: "Quick heads up — we're covering X tomorrow. Anything specific you'd want to make sure we address?"

That's it. This does three things: it forces you to think from their perspective, it signals respect for their time, and it surfaces objections when you can still address them — not in the room.

The goal isn't to eliminate disagreement. It's to convert surprises into expected friction, which is infinitely easier to navigate.`,
  },
  {
    id: 3,
    date: "2026-03-20",
    title: "How I use Claude to write better PRDs in half the time",
    excerpt: "Not by asking it to write the PRD for me — that produces garbage. Here's the multi-turn method that actually works.",
    tag: "AI",
    tagColor: "#D85A30",
    tagBg: "#FAECE7",
    readTime: "5 min",
    content: `The wrong way to use AI for PRDs: "Write me a PRD for a notification system."

The output is always the same — generic, shallow, missing your actual context. It's not the AI's fault. You gave it nothing to work with.

The right way is multi-turn prompting with progressive context loading:

**Turn 1 — Context dump.** Paste your product vision, user personas, and the problem you're solving. Ask for nothing yet. Just say: "I'm going to share some context. Absorb it and confirm when ready."

**Turn 2 — Problem sharpening.** Ask: "Based on this context, write 3 versions of the problem statement — one for engineers, one for executives, one for users." Pick the best, iterate.

**Turn 3 — Solution hypothesis.** Now ask for solutions — with alternatives. "Give me 3 solution approaches with different trade-offs on scope, risk, and time."

**Turn 4 — Acceptance criteria.** Feed the chosen solution back. Ask for edge cases and acceptance criteria. This is where AI genuinely saves time.

The whole process takes 20–30 minutes versus 2–3 hours. And because you're steering every step, the output reflects your actual thinking — not a generic template.`,
  },
];

const FRAMEWORKS = [
  {
    title: "RICE scoring",
    category: "Prioritization",
    difficulty: "Beginner",
    desc: "Reach × Impact × Confidence ÷ Effort. The most pragmatic framework when stakeholders demand objectivity.",
    insight: "Secret: Weight 'Confidence' 2× in early-stage products — your uncertainty IS the signal.",
    color: "#1D9E75",
    bg: "#E1F5EE",
  },
  {
    title: "Opportunity solution tree",
    category: "Discovery",
    difficulty: "Intermediate",
    desc: "Teresa Torres' visual map connecting outcomes → opportunities → solutions → experiments.",
    insight: "Secret: The tree should be WIDE at opportunities. If you have <5 opportunities per outcome, you stopped exploring too early.",
    color: "#534AB7",
    bg: "#EEEDFE",
  },
  {
    title: "Jobs to be done",
    category: "Research",
    difficulty: "Intermediate",
    desc: "Customers 'hire' products to make progress. Map the functional, emotional, and social jobs.",
    insight: "Secret: The emotional job almost always outweighs the functional one. People buy Slack for belonging, not messaging.",
    color: "#D85A30",
    bg: "#FAECE7",
  },
  {
    title: "Kano model",
    category: "Prioritization",
    difficulty: "Advanced",
    desc: "Classify features as Must-be, Performance, or Delighters. Satisfaction is non-linear.",
    insight: "Secret: Delighters decay into Must-bes in ~18 months. Schedule quarterly Kano re-calibration.",
    color: "#185FA5",
    bg: "#E6F1FB",
  },
  {
    title: "North star metric",
    category: "Strategy",
    difficulty: "Beginner",
    desc: "One metric that captures the core value your product delivers. Aligns the entire org.",
    insight: "Secret: Your NSM should have a LEADING indicator companion. If NSM is 'weekly active teams', lead with 'first collaboration within 24h'.",
    color: "#993556",
    bg: "#FBEAF0",
  },
  {
    title: "Double diamond",
    category: "Design",
    difficulty: "Beginner",
    desc: "Diverge → Converge → Diverge → Converge. Ensures you explore the problem before the solution.",
    insight: "Secret: Most PMs skip the FIRST diamond entirely. They solution-fit without problem-fit. Spend 60% of time in Diamond 1.",
    color: "#854F0B",
    bg: "#FAEEDA",
  },
];

const AI_TOOLS = [
  {
    name: "Claude",
    by: "Anthropic",
    use: "PRDs, user stories, strategy docs, code review",
    tier: "Essential",
    tip: "Use Projects with custom instructions for each product area. Feed it your PRD template once.",
  },
  {
    name: "ChatGPT",
    by: "OpenAI",
    use: "Brainstorming, competitive analysis, data interpretation",
    tier: "Essential",
    tip: "Use Canvas mode for iterative document editing. Custom GPTs for recurring PM workflows.",
  },
  {
    name: "Notion AI",
    by: "Notion",
    use: "Meeting summaries, doc generation, knowledge base Q&A",
    tier: "Productivity",
    tip: "Build a PM wiki and let Notion AI answer questions from it. Beats searching through docs.",
  },
  {
    name: "Gamma",
    by: "Gamma",
    use: "Stakeholder decks, product reviews, board presentations",
    tier: "Storytelling",
    tip: "Upload your raw data; let it structure the narrative. Edit the story arc, not the slides.",
  },
  {
    name: "Lovable / Bolt",
    by: "Various",
    use: "Rapid prototyping, proof-of-concept apps, internal tools",
    tier: "Prototyping",
    tip: "Build a working prototype before writing a PRD. Stakeholders respond to demos, not documents.",
  },
  {
    name: "Perplexity",
    by: "Perplexity AI",
    use: "Market research, competitive intel, trend analysis",
    tier: "Research",
    tip: "Use Pro Search with focus on Academic or Reddit for different quality of insights.",
  },
];

const AI_STRATEGIES = [
  {
    title: "AI-first product discovery",
    desc: "Use AI to synthesize 100+ customer interviews in minutes. Pattern-match across user research at scale.",
    steps: ["Upload all transcripts to Claude Projects", "Prompt: 'Find the top 5 unmet needs across all interviews, with supporting quotes'", "Cross-reference with quantitative data from analytics", "Build opportunity solution trees from AI-surfaced patterns"],
  },
  {
    title: "Prompt-driven PRD writing",
    desc: "Write PRDs 10× faster without losing depth. The secret: structured multi-turn prompting, not one-shot.",
    steps: ["Start with context dump: product vision, user personas, constraints", "Ask for problem statement first, iterate until sharp", "Then request solution hypothesis with alternatives", "Finally, generate acceptance criteria and edge cases"],
  },
  {
    title: "AI-augmented A/B testing",
    desc: "Let AI design your experiment matrix and interpret results with statistical rigor.",
    steps: ["Describe your hypothesis and metrics to AI", "Have it generate a test plan with sample size calculations", "Feed raw results back for significance analysis", "Ask for counter-interpretations — what ELSE could explain these results?"],
  },
  {
    title: "Competitive intelligence automation",
    desc: "Build an always-on competitive radar using AI agents that monitor, summarize, and alert.",
    steps: ["Set up Perplexity Collections per competitor", "Use n8n or Zapier to pipe competitor changelog feeds to AI", "Weekly AI summary: 'What changed in competitor landscape this week?'", "Quarterly AI deep-dive: 'How has competitor X's strategy shifted over 90 days?'"],
  },
];

const PLAYBOOKS = [
  {
    title: "0 → 1 product launch",
    emoji: "🚀",
    phases: ["Discovery sprint: 2 weeks of user interviews + market sizing", "Prototype week: build clickable prototype, test with 10 users", "MVP scope: cut 60% of features. Ship the smallest thing that tests your riskiest assumption", "Launch: soft launch → measure → iterate → public launch"],
  },
  {
    title: "Stakeholder alignment",
    emoji: "🤝",
    phases: ["Map power vs. interest grid for all stakeholders", "Pre-wire: 1:1 meetings before any group review", "Use 'disagree and commit' protocol — document disagreements, then move forward", "Weekly 5-line status update: Goal → Progress → Blockers → Asks → Next"],
  },
  {
    title: "Feature deprecation",
    emoji: "🗑️",
    phases: ["Usage analytics: if <5% of users use it weekly, it's a candidate", "Impact assessment: revenue, contractual obligations, vocal minority vs. silent majority", "Migration plan: give users 90 days + alternative workflow", "Communication: transparent blog post > hidden changelog entry"],
  },
  {
    title: "Platform thinking",
    emoji: "🧩",
    phases: ["Identify repeated patterns across your product surface", "Abstract the pattern into a composable primitive (API, component, service)", "Build the primitive. Rebuild 2 existing features on top of it as proof", "Open the primitive to other teams. Measure adoption velocity"],
  },
];

const SECRETS = [
  {
    num: "01",
    title: "The 'silent user' fallacy",
    content: "Your loudest users are NOT your most important. The users who silently churn taught you the real lesson. Build a 'silent exit interview' — trigger a micro-survey when engagement drops 40% over 2 weeks, BEFORE they cancel.",
  },
  {
    num: "02",
    title: "Reverse roadmap",
    content: "Start from the outcome you want in 12 months and work backwards. Most PMs build roadmaps forward from today's backlog — which guarantees incremental thinking. Define the 'future state screenshot' first.",
  },
  {
    num: "03",
    title: "The 3-meeting rule",
    content: "If a decision requires more than 3 meetings, the problem isn't alignment — it's that nobody owns the decision. Assign a DRI (Directly Responsible Individual) and give them a deadline. Most 'alignment' is actually 'diffusion of responsibility'.",
  },
  {
    num: "04",
    title: "Metric manipulation immunity",
    content: "For every metric you set, immediately ask: 'How could a rational actor game this metric while destroying value?' If you can't think of at least 3 ways, you don't understand your metric well enough.",
  },
  {
    num: "05",
    title: "The API test for strategy",
    content: "If your product strategy can't be explained as an API contract (input → transformation → output → who benefits), it's not a strategy — it's a wish. Force yourself to define the interface.",
  },
  {
    num: "06",
    title: "Calendar audit = real priorities",
    content: "Your calendar reveals your actual strategy, not your PRD. If you claim 'user research is a priority' but spent 2 hours on it last month vs. 40 hours in stakeholder meetings, you've identified your real priority.",
  },
];

// ─── Components ───────────────────────────────

function NavDot({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        width: active ? 28 : 8,
        height: 8,
        borderRadius: 4,
        border: "none",
        background: active ? "#1D9E75" : "rgba(128,128,128,0.25)",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        padding: 0,
      }}
    />
  );
}

function Badge({ children, color, bg }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.02em",
      color: color,
      background: bg,
    }}>{children}</span>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1D9E75", marginBottom: 8 }}>{eyebrow}</p>
      <h2 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15, color: "var(--text-primary)", margin: "0 0 12px", fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 560 }}>{subtitle}</p>}
    </div>
  );
}

function FrameworkCard({ f, i, expanded, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 28,
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: f.color }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <Badge color={f.color} bg={f.bg}>{f.category}</Badge>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{f.difficulty}</span>
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 8px", color: "var(--text-primary)", fontFamily: "'Playfair Display', Georgia, serif" }}>{f.title}</h3>
      <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
      {expanded && (
        <div style={{ marginTop: 16, padding: 16, background: f.bg, borderRadius: 10, borderLeft: `3px solid ${f.color}` }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: f.color, margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Insider insight</p>
          <p style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}>{f.insight}</p>
        </div>
      )}
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12, marginBottom: 0 }}>{expanded ? "Click to collapse" : "Click to reveal insider insight →"}</p>
    </div>
  );
}

function AIToolCard({ tool }) {
  const tierColors = {
    Essential: { color: "#1D9E75", bg: "#E1F5EE" },
    Productivity: { color: "#534AB7", bg: "#EEEDFE" },
    Storytelling: { color: "#D85A30", bg: "#FAECE7" },
    Prototyping: { color: "#185FA5", bg: "#E6F1FB" },
    Research: { color: "#993556", bg: "#FBEAF0" },
  };
  const tc = tierColors[tool.tier] || tierColors.Essential;
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>{tool.name}</h4>
        <Badge color={tc.color} bg={tc.bg}>{tool.tier}</Badge>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>by {tool.by}</p>
      <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}><strong style={{ color: "var(--text-primary)" }}>Best for:</strong> {tool.use}</p>
      <div style={{ marginTop: "auto", padding: 12, background: "var(--surface)", borderRadius: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#1D9E75", margin: "0 0 4px" }}>Pro tip</p>
        <p style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5, margin: 0 }}>{tool.tip}</p>
      </div>
    </div>
  );
}

function StrategyAccordion({ strategy, isOpen, onClick }) {
  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: 12,
      overflow: "hidden",
      transition: "all 0.3s ease",
    }}>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          padding: "20px 24px",
          background: isOpen ? "var(--surface)" : "var(--card-bg)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <div>
          <h4 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px", color: "var(--text-primary)" }}>{strategy.title}</h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{strategy.desc}</p>
        </div>
        <span style={{ fontSize: 20, color: "var(--text-muted)", transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginLeft: 16 }}>+</span>
      </button>
      {isOpen && (
        <div style={{ padding: "0 24px 20px", background: "var(--surface)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            {strategy.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ minWidth: 24, height: 24, borderRadius: 12, background: "#1D9E75", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{i + 1}</span>
                <p style={{ fontSize: 14, color: "var(--text-primary)", margin: 0, lineHeight: 1.5 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PlaybookCard({ playbook }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: 28,
      cursor: "pointer",
    }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{playbook.emoji}</span>
        <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>{playbook.title}</h3>
      </div>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {playbook.phases.map((phase, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ minWidth: 20, height: 20, borderRadius: 10, border: "2px solid #1D9E75", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#1D9E75", flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
              <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>{phase}</p>
            </div>
          ))}
        </div>
      )}
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12, marginBottom: 0 }}>{open ? "Click to collapse" : "Click to expand phases →"}</p>
    </div>
  );
}

function SecretCard({ secret }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: 28,
      position: "relative",
      overflow: "hidden",
    }}>
      <span style={{
        position: "absolute",
        top: 12,
        right: 20,
        fontSize: 64,
        fontWeight: 800,
        color: "var(--text-primary)",
        opacity: 0.04,
        fontFamily: "'Playfair Display', Georgia, serif",
        lineHeight: 1,
      }}>{secret.num}</span>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#1D9E75", margin: "0 0 8px", letterSpacing: "0.06em" }}>SECRET #{secret.num}</p>
      <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px", color: "var(--text-primary)", fontFamily: "'Playfair Display', Georgia, serif" }}>{secret.title}</h3>
      <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>{secret.content}</p>
    </div>
  );
}

// ─── Blog Post Modal ───────────────────────────
function PostModal({ post, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--card-bg)",
          borderRadius: 20,
          padding: "40px 48px",
          maxWidth: 680,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 20, right: 20,
            border: "none", background: "var(--surface)",
            borderRadius: 8, width: 32, height: 32,
            cursor: "pointer", fontSize: 18,
            color: "var(--text-muted)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >×</button>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <Badge color={post.tagColor} bg={post.tagBg}>{post.tag}</Badge>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{post.date}</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>· {post.readTime} read</span>
        </div>
        <h2 style={{
          fontSize: 28, fontWeight: 700, lineHeight: 1.2,
          margin: "0 0 24px", color: "var(--text-primary)",
          fontFamily: "'Playfair Display', Georgia, serif",
        }}>{post.title}</h2>
        <div style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.85 }}>
          {post.content.split("\n\n").map((para, i) => {
            // Render **bold** text
            const parts = para.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} style={{ margin: "0 0 20px" }}>
                {parts.map((part, j) =>
                  part.startsWith("**") && part.endsWith("**")
                    ? <strong key={j} style={{ color: "var(--text-primary)", fontWeight: 600 }}>{part.slice(2, -2)}</strong>
                    : part
                )}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Blog Card ─────────────────────────────────
function BlogCard({ post, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 28,
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <Badge color={post.tagColor} bg={post.tagBg}>{post.tag}</Badge>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{post.readTime} read</span>
      </div>
      <h3 style={{
        fontSize: 18, fontWeight: 600, margin: 0,
        color: "var(--text-primary)",
        fontFamily: "'Playfair Display', Georgia, serif",
        lineHeight: 1.35,
      }}>{post.title}</h3>
      <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 8 }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{post.date}</span>
        <span style={{ fontSize: 13, color: "#1D9E75", fontWeight: 500 }}>Read post →</span>
      </div>
    </div>
  );
}

// ─── Mailing List Box ──────────────────────────
function MailingList() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error

  const handleSubmit = () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    // Opens Buttondown subscribe URL in a new tab
    // Replace YOUR_USERNAME with your Buttondown username after signup
    window.open(`https://buttondown.com/sambitbastia?email=${encodeURIComponent(email)}`, "_blank");
    setStatus("success");
    setEmail("");
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)",
      borderRadius: 20,
      padding: "40px 40px",
      marginTop: 48,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 200, height: 200, borderRadius: "50%",
        background: "rgba(255,255,255,0.06)",
      }} />
      <div style={{
        position: "absolute", bottom: -20, left: -20,
        width: 120, height: 120, borderRadius: "50%",
        background: "rgba(255,255,255,0.04)",
      }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>Weekly newsletter</p>
        <h3 style={{
          fontSize: 26, fontWeight: 700, color: "#fff",
          margin: "0 0 10px",
          fontFamily: "'Playfair Display', Georgia, serif",
        }}>PM insights, every week</h3>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: "0 0 28px" }}>
          One actionable insight every week — frameworks, AI strategies, and hard-won lessons from the product trenches. No fluff. Unsubscribe anytime.
        </p>
        {status === "success" ? (
          <div style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 12, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>✓</span>
            <p style={{ color: "#fff", fontSize: 15, fontWeight: 500, margin: 0 }}>
              Check the new tab to confirm your subscription!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="your@email.com"
              style={{
                flex: 1,
                minWidth: 200,
                padding: "12px 16px",
                borderRadius: 10,
                border: status === "error" ? "2px solid #ff6b6b" : "2px solid transparent",
                background: "rgba(255,255,255,0.95)",
                fontSize: 14,
                color: "#1a1a1a",
                outline: "none",
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                padding: "12px 24px",
                borderRadius: 10,
                border: "none",
                background: "#fff",
                color: "#0F6E56",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe →
            </button>
          </div>
        )}
        {status === "error" && (
          <p style={{ color: "#ffcdd2", fontSize: 12, marginTop: 8 }}>Please enter a valid email address.</p>
        )}
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 14 }}>
          Free forever · No spam · Unsubscribe anytime
        </p>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────
export default function SambitBastiaWebsite() {
  const [activeSection, setActiveSection] = useState("hero");
  const [expandedFramework, setExpandedFramework] = useState(null);
  const [openStrategy, setOpenStrategy] = useState(null);
  const [openPost, setOpenPost] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.15 }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  const dark = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  return (
    <div style={{
      "--text-primary": dark ? "#E8E6DF" : "#1a1a1a",
      "--text-muted": dark ? "#9c9a92" : "#5f5e5a",
      "--card-bg": dark ? "#1c1c1a" : "#ffffff",
      "--surface": dark ? "#252523" : "#f7f6f3",
      "--border": dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
      "--page-bg": dark ? "#111110" : "#faf9f6",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "var(--page-bg)",
      color: "var(--text-primary)",
      minHeight: "100vh",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Post Modal */}
      {openPost && <PostModal post={openPost} onClose={() => setOpenPost(null)} />}

      {/* Fixed nav */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: dark ? "rgba(17,17,16,0.85)" : "rgba(250,249,246,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #1D9E75, #0F6E56)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>SB</div>
            <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)" }}>sambitbastia.com</span>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {SECTIONS.map((s) => (
              <NavDot key={s.id} active={activeSection === s.id} label={s.label} onClick={() => scrollTo(s.id)} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {SECTIONS.slice(0, 6).map((s) => (
              <button key={s.id} onClick={() => scrollTo(s.id)} style={{
                border: "none",
                background: activeSection === s.id ? "var(--surface)" : "transparent",
                borderRadius: 6,
                padding: "6px 10px",
                fontSize: 12,
                fontWeight: activeSection === s.id ? 600 : 400,
                color: activeSection === s.id ? "#1D9E75" : "var(--text-muted)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}>{s.label}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={(el) => (sectionRefs.current["hero"] = el)} id="hero" style={{
        padding: "100px 24px 80px",
        maxWidth: 1200,
        margin: "0 auto",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          top: 40, right: -40,
          width: 400, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <Badge color="#1D9E75" bg="#E1F5EE">The product manager's operating system</Badge>
        <h1 style={{
          fontSize: "clamp(40px, 6vw, 72px)",
          fontWeight: 700,
          lineHeight: 1.05,
          margin: "20px 0 24px",
          fontFamily: "'Playfair Display', Georgia, serif",
          maxWidth: 800,
        }}>
          Product craft,<br />
          <span style={{ color: "#1D9E75" }}>decoded.</span>
        </h1>
        <p style={{ fontSize: 19, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 600, marginBottom: 40 }}>
          Frameworks, AI strategies, and insider secrets that separate great PMs from good ones. Built by a practitioner, for practitioners.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <button onClick={() => scrollTo("frameworks")} style={{
            padding: "12px 28px", borderRadius: 8, border: "none",
            background: "#1D9E75", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>Explore frameworks →</button>
          <button onClick={() => scrollTo("blog")} style={{
            padding: "12px 28px", borderRadius: 8,
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--text-primary)", fontSize: 14, fontWeight: 500, cursor: "pointer",
          }}>Read the blog ↗</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginTop: 60 }}>
          {[
            { num: "6+", label: "Core frameworks" },
            { num: "6", label: "AI tools profiled" },
            { num: "4", label: "AI strategies" },
            { num: `${POSTS.length}`, label: "Blog posts" },
          ].map((s, i) => (
            <div key={i} style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <p style={{ fontSize: 28, fontWeight: 700, margin: 0, fontFamily: "'Playfair Display', Georgia, serif", color: "#1D9E75" }}>{s.num}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Frameworks */}
      <section ref={(el) => (sectionRefs.current["frameworks"] = el)} id="frameworks" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle eyebrow="Frameworks" title="The PM toolkit" subtitle="Every framework worth knowing, with the insider angles nobody teaches you. Click any card to reveal the secret." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {FRAMEWORKS.map((f, i) => (
            <FrameworkCard key={i} f={f} i={i} expanded={expandedFramework === i} onClick={() => setExpandedFramework(expandedFramework === i ? null : i)} />
          ))}
        </div>
      </section>

      {/* AI Hub */}
      <section ref={(el) => (sectionRefs.current["ai-hub"] = el)} id="ai-hub" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto", background: "var(--surface)", borderRadius: 24 }}>
        <SectionTitle eyebrow="AI Hub" title="AI × Product management" subtitle="The definitive guide to AI tools and strategies for modern PMs. Not just what to use — how to think about AI as a product superpower." />
        <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 20px", color: "var(--text-primary)" }}>The PM's AI toolkit</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 48 }}>
          {AI_TOOLS.map((tool, i) => <AIToolCard key={i} tool={tool} />)}
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 600, margin: "40px 0 20px", color: "var(--text-primary)" }}>AI-powered PM strategies</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {AI_STRATEGIES.map((strategy, i) => (
            <StrategyAccordion key={i} strategy={strategy} isOpen={openStrategy === i} onClick={() => setOpenStrategy(openStrategy === i ? null : i)} />
          ))}
        </div>
        <div style={{ marginTop: 40, padding: 32, background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #1D9E75, #534AB7, #D85A30)" }} />
          <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>The AI-PM mindset shift</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {[
              { from: "Write docs manually", to: "Co-create with AI, refine with judgment" },
              { from: "Research takes weeks", to: "First-pass synthesis in minutes" },
              { from: "Intuition-based decisions", to: "AI-augmented pattern recognition" },
              { from: "Build → Measure → Learn", to: "Simulate → Validate → Build → Measure" },
            ].map((shift, i) => (
              <div key={i} style={{ padding: 16, background: "var(--surface)", borderRadius: 10 }}>
                <p style={{ fontSize: 12, color: "#D85A30", fontWeight: 500, margin: "0 0 4px", textDecoration: "line-through" }}>{shift.from}</p>
                <p style={{ fontSize: 13, color: "#1D9E75", fontWeight: 600, margin: 0 }}>{shift.to}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Playbooks */}
      <section ref={(el) => (sectionRefs.current["playbooks"] = el)} id="playbooks" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle eyebrow="Playbooks" title="Battle-tested playbooks" subtitle="Step-by-step guides for the situations that make or break a PM's quarter. Click to expand." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {PLAYBOOKS.map((p, i) => <PlaybookCard key={i} playbook={p} />)}
        </div>
      </section>

      {/* Career */}
      <section ref={(el) => (sectionRefs.current["career"] = el)} id="career" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle eyebrow="Career" title="The PM career ladder" subtitle="What actually changes at each level — beyond the title." />
        <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
          <div style={{ position: "absolute", left: 19, top: 40, bottom: 40, width: 2, background: "linear-gradient(to bottom, #1D9E75, #534AB7, #D85A30)", borderRadius: 1 }} />
          {[
            { level: "APM", title: "Associate product manager", focus: "Execution & learning", skills: "Ship features, learn the domain, write clear tickets, shadow customer calls, master analytics tools", time: "0–2 years" },
            { level: "PM", title: "Product manager", focus: "Ownership & discovery", skills: "Own a product area, run discovery, define metrics, manage stakeholders, make trade-off decisions", time: "2–5 years" },
            { level: "SPM", title: "Senior product manager", focus: "Strategy & influence", skills: "Set product strategy, influence without authority, mentor PMs, drive org-level outcomes, build cross-functional partnerships", time: "5–8 years" },
            { level: "GPM", title: "Group product manager", focus: "Team building & scaling", skills: "Hire and develop PMs, define team structure, align multiple product areas, manage portfolio trade-offs", time: "8–12 years" },
            { level: "VP/CPO", title: "VP of product / CPO", focus: "Vision & organization", skills: "Set company product vision, build product culture, board-level communication, M&A product assessment, industry thought leadership", time: "12+ years" },
          ].map((role, i) => (
            <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start", padding: "24px 0", position: "relative" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 20,
                background: i === 0 ? "#1D9E75" : i === 4 ? "#D85A30" : "var(--card-bg)",
                border: `2px solid ${i === 0 ? "#1D9E75" : i === 4 ? "#D85A30" : "#534AB7"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                color: i === 0 || i === 4 ? "#fff" : "#534AB7",
                flexShrink: 0, zIndex: 2,
              }}>{role.level}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>{role.title}</h3>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{role.time}</span>
                </div>
                <Badge color="#534AB7" bg="#EEEDFE">{role.focus}</Badge>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, margin: "8px 0 0" }}>{role.skills}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section ref={(el) => (sectionRefs.current["tools"] = el)} id="tools" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle eyebrow="Essential tools" title="The PM's tech stack" subtitle="What top PMs actually use day-to-day." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { cat: "Analytics", tools: ["Amplitude", "Mixpanel", "PostHog", "Google Analytics"], color: "#185FA5", bg: "#E6F1FB" },
            { cat: "Roadmapping", tools: ["Linear", "Productboard", "Jira", "Notion"], color: "#534AB7", bg: "#EEEDFE" },
            { cat: "Design", tools: ["Figma", "Whimsical", "FigJam", "Miro"], color: "#D85A30", bg: "#FAECE7" },
            { cat: "Research", tools: ["Dovetail", "Hotjar", "Sprig", "UserTesting"], color: "#1D9E75", bg: "#E1F5EE" },
            { cat: "Communication", tools: ["Notion", "Loom", "Slack", "Confluence"], color: "#993556", bg: "#FBEAF0" },
            { cat: "AI productivity", tools: ["Claude", "ChatGPT", "Perplexity", "Gamma"], color: "#854F0B", bg: "#FAEEDA" },
          ].map((cat, i) => (
            <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
              <Badge color={cat.color} bg={cat.bg}>{cat.cat}</Badge>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {cat.tools.map((t, j) => <span key={j} style={{ fontSize: 14, color: "var(--text-muted)" }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Secrets */}
      <section ref={(el) => (sectionRefs.current["secrets"] = el)} id="secrets" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle eyebrow="Secrets" title="What nobody tells you" subtitle="The uncomfortable truths and counter-intuitive insights that take years to learn. Now you don't have to wait." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {SECRETS.map((s, i) => <SecretCard key={i} secret={s} />)}
        </div>
      </section>

      {/* ── BLOG ─────────────────────────────────── */}
      <section ref={(el) => (sectionRefs.current["blog"] = el)} id="blog" style={{
        padding: "80px 24px",
        maxWidth: 1200,
        margin: "0 auto",
        background: "var(--surface)",
        borderRadius: 24,
      }}>
        <SectionTitle
          eyebrow="Blog"
          title="From the product trenches"
          subtitle="Weekly essays on product management, AI, and the craft of building great products."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {POSTS.map((post) => (
            <BlogCard key={post.id} post={post} onClick={() => setOpenPost(post)} />
          ))}
        </div>
        <MailingList />
      </section>

      {/* About */}
      <section ref={(el) => (sectionRefs.current["about"] = el)} id="about" style={{ padding: "80px 24px 100px", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle eyebrow="About" title="Built by Sambit Bastia" subtitle="A practitioner's resource, not a textbook." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: "linear-gradient(135deg, #1D9E75, #0F6E56)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 24, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 20 }}>S</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 8px", fontFamily: "'Playfair Display', Georgia, serif" }}>Sambit Bastia</h3>
            <p style={{ fontSize: 14, color: "#1D9E75", fontWeight: 500, margin: "0 0 16px" }}>Product Manager</p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
              I've spent years in the trenches of product management — shipping features, aligning stakeholders, wrestling with roadmaps, and learning the hard way what works and what doesn't. This site is everything I wish I had when I started.
            </p>
          </div>
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: 32 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Why this site exists</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                "Most PM resources are theoretical. This is practical.",
                "Every framework includes the insider angle that courses don't teach.",
                "AI is transforming PM — this is the guide to navigating it.",
                "Free, no paywalls, no gated content. Knowledge should be accessible.",
              ].map((point, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "#1D9E75", fontSize: 16, lineHeight: 1.4 }}>✓</span>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: 32 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Connect</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Website", value: "www.sambitbastia.com" },
                { label: "LinkedIn", value: "linkedin.com/in/sambitbastia" },
                { label: "GitHub", value: "github.com/sambitbastia" },
              ].map((link, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{link.label}</span>
                  <span style={{ fontSize: 13, color: "#1D9E75", fontWeight: 500 }}>{link.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          © 2026 Sambit Bastia · Built with craft · All content is original and free to reference with attribution.
        </p>
      </footer>
    </div>
  );
}
