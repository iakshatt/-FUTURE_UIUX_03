import { useState, useMemo } from "react";

const COLORS = {
  bg: "#0F1117",
  surface: "#181C26",
  card: "#1E2333",
  border: "#2A3045",
  accent: "#4F6EF7",
  accentSoft: "#2A3660",
  green: "#22C97A",
  greenSoft: "#143328",
  amber: "#F0A930",
  amberSoft: "#2E2210",
  red: "#F05656",
  redSoft: "#2E1212",
  purple: "#A67EF5",
  purpleSoft: "#221840",
  text: "#E8EAF0",
  muted: "#7A84A0",
  faint: "#3A4058",
};

const stages = ["New Lead", "Contacted", "Proposal Sent", "Negotiation", "Converted", "Lost"];
const stageColors = {
  "New Lead":       { dot: COLORS.muted,   bg: "#22273A", text: "#9BA8C8" },
  "Contacted":      { dot: COLORS.accent,  bg: COLORS.accentSoft, text: "#8FA4FF" },
  "Proposal Sent":  { dot: COLORS.amber,   bg: COLORS.amberSoft, text: "#F5C362" },
  "Negotiation":    { dot: COLORS.purple,  bg: COLORS.purpleSoft, text: "#C3A8FF" },
  "Converted":      { dot: COLORS.green,   bg: COLORS.greenSoft, text: "#4FE59A" },
  "Lost":           { dot: COLORS.red,     bg: COLORS.redSoft, text: "#FF8080" },
};
const engagementColors = {
  "Hot":    { bg: "#2E1A10", text: "#F08030", dot: "#F08030" },
  "Warm":   { bg: COLORS.amberSoft, text: COLORS.amber, dot: COLORS.amber },
  "Cold":   { bg: "#101E30", text: "#4F9ECC", dot: "#4F9ECC" },
  "Active": { bg: COLORS.greenSoft, text: COLORS.green, dot: COLORS.green },
  "Idle":   { bg: COLORS.faint, text: COLORS.muted, dot: COLORS.muted },
};

const initialLeads = [
  { id: 1, name: "Haruto Digital Agency", contact: "Yuki Tanaka", email: "yuki@haruto.io", value: 42000, stage: "Negotiation", engagement: "Hot", industry: "Marketing", source: "Referral", lastActivity: "2h ago", notes: "Requesting custom analytics module. Ready to close." },
  { id: 2, name: "BlueNorth Consulting", contact: "Priya Sharma", email: "priya@bluenorth.co", value: 18500, stage: "Proposal Sent", engagement: "Warm", industry: "Consulting", source: "LinkedIn", lastActivity: "1d ago", notes: "Sent revised proposal. Waiting on legal sign-off." },
  { id: 3, name: "Orion Fintech Ltd.", contact: "Marcus Webb", email: "mwebb@orionftch.com", value: 75000, stage: "Negotiation", engagement: "Hot", industry: "Fintech", source: "Inbound", lastActivity: "3h ago", notes: "Board approval pending. High priority — follow up EOD." },
  { id: 4, name: "Solaris Web Studio", contact: "Lena Vogt", email: "lena@solarisweb.de", value: 9800, stage: "Contacted", engagement: "Warm", industry: "Design", source: "Cold Outreach", lastActivity: "3d ago", notes: "Interested in rebrand package. Needs pricing sheet." },
  { id: 5, name: "Apex Growth SaaS", contact: "Rohan Mehta", email: "rohan@apexgrowth.in", value: 31000, stage: "Converted", engagement: "Active", industry: "SaaS", source: "Referral", lastActivity: "Today", notes: "Onboarding complete. Monthly retainer begins next week." },
  { id: 6, name: "Verdant Studios", contact: "Sofia Alves", email: "sofia@verdantstudio.br", value: 12000, stage: "New Lead", engagement: "Cold", industry: "Creative", source: "Website", lastActivity: "5d ago", notes: "Submitted contact form. Yet to be reached." },
  { id: 7, name: "TechFront Partners", contact: "James Liu", email: "james@techfront.us", value: 54000, stage: "Proposal Sent", engagement: "Warm", industry: "Tech", source: "Event", lastActivity: "2d ago", notes: "Met at SaaS Connect. Strong interest in CRM integration." },
  { id: 8, name: "Nimbus Analytics", contact: "Anika Patel", email: "anika@nimbusdata.io", value: 22000, stage: "Contacted", engagement: "Cold", industry: "Analytics", source: "LinkedIn", lastActivity: "6d ago", notes: "Initial call done. Went quiet after proposal discussion." },
  { id: 9, name: "Crestline Media", contact: "Tom Eriksen", email: "t.eriksen@crestline.no", value: 8000, stage: "Lost", engagement: "Idle", industry: "Media", source: "Referral", lastActivity: "2w ago", notes: "Went with competitor. Budget constraints cited." },
  { id: 10, name: "Flowrise HR Tech", contact: "Nalini Rao", email: "nalini@flowrise.com", value: 28000, stage: "New Lead", engagement: "Warm", industry: "HR Tech", source: "Inbound", lastActivity: "Yesterday", notes: "Downloaded whitepaper. Flagged as high-intent." },
];

const initialTasks = [
  { id: 1, title: "Follow up on Orion proposal", leadId: 3, due: "Today 5:00 PM", priority: "High", done: false, type: "Follow-up" },
  { id: 2, title: "Send revised contract to Haruto", leadId: 1, due: "Today 6:00 PM", priority: "High", done: false, type: "Contract" },
  { id: 3, title: "Prepare demo for TechFront", leadId: 7, due: "Tomorrow 10:00 AM", priority: "Medium", done: false, type: "Demo" },
  { id: 4, title: "Re-engage Nimbus Analytics", leadId: 8, due: "Tomorrow 2:00 PM", priority: "Medium", done: false, type: "Follow-up" },
  { id: 5, title: "Onboarding call — Apex Growth", leadId: 5, due: "Jun 15, 9:00 AM", priority: "Low", done: true, type: "Onboarding" },
  { id: 6, title: "Cold outreach batch — 10 new leads", leadId: null, due: "Jun 16, 11:00 AM", priority: "Medium", done: false, type: "Outreach" },
  { id: 7, title: "Send pricing sheet to Solaris", leadId: 4, due: "Jun 14, 3:00 PM", priority: "Medium", done: false, type: "Proposal" },
  { id: 8, title: "Review Flowrise lead profile", leadId: 10, due: "Jun 14, 4:00 PM", priority: "Low", done: false, type: "Research" },
];

const priorityStyle = {
  High:   { bg: COLORS.redSoft, text: "#FF8080" },
  Medium: { bg: COLORS.amberSoft, text: COLORS.amber },
  Low:    { bg: COLORS.greenSoft, text: COLORS.green },
};
const taskTypeStyle = {
  "Follow-up": { bg: COLORS.accentSoft, text: "#8FA4FF" },
  "Contract":  { bg: "#2E1A10", text: "#F08030" },
  "Demo":      { bg: COLORS.purpleSoft, text: COLORS.purple },
  "Onboarding":{ bg: COLORS.greenSoft, text: COLORS.green },
  "Outreach":  { bg: "#101E30", text: "#4F9ECC" },
  "Proposal":  { bg: COLORS.amberSoft, text: COLORS.amber },
  "Research":  { bg: COLORS.faint, text: COLORS.muted },
};

const s = {
  app: { minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', sans-serif", display: "flex" },
  sidebar: { width: 220, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 },
  logo: { padding: "0 20px 28px", borderBottom: `1px solid ${COLORS.border}`, marginBottom: 16 },
  logoText: { fontSize: 17, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.3px" },
  logoSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", cursor: "pointer", borderRadius: 0, color: active ? COLORS.text : COLORS.muted, background: active ? `${COLORS.accent}18` : "transparent", borderLeft: active ? `2px solid ${COLORS.accent}` : "2px solid transparent", fontSize: 13.5, fontWeight: active ? 600 : 400, transition: "all 0.15s" }),
  navIcon: { fontSize: 16, width: 18, flexShrink: 0 },
  main: { flex: 1, overflow: "auto", padding: "32px 36px" },
  pageTitle: { fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: COLORS.muted, marginBottom: 28 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 },
  statCard: (accent) => ({ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 20px", borderTop: `2px solid ${accent}` }),
  statVal: { fontSize: 26, fontWeight: 700, color: COLORS.text, lineHeight: 1.2 },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  statChange: (pos) => ({ fontSize: 12, color: pos ? COLORS.green : COLORS.red, marginTop: 6 }),
  card: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" },
  cardHeader: { padding: "16px 20px 14px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 14, fontWeight: 600, color: COLORS.text },
  badge: (style) => ({ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: style.bg, color: style.text, display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }),
  dot: (color) => ({ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }),
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${COLORS.border}` },
  td: { padding: "12px 16px", fontSize: 13, borderBottom: `1px solid ${COLORS.faint}`, verticalAlign: "middle" },
  btn: (variant) => ({
    display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s",
    ...(variant === "primary" ? { background: COLORS.accent, color: "#fff" } :
        variant === "ghost" ? { background: "transparent", color: COLORS.muted, border: `1px solid ${COLORS.border}` } :
        { background: COLORS.faint, color: COLORS.muted })
  }),
  input: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: COLORS.text, outline: "none", width: "100%" },
  pipelineGrid: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 28 },
  pipeCol: { background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, minHeight: 300 },
  pipeColHeader: { padding: "12px 14px 10px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
  pipeColTitle: { fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.04em" },
  pipeCard: (highlight) => ({ margin: "10px 10px 0", padding: "12px", background: highlight ? `${COLORS.accent}12` : COLORS.card, border: `1px solid ${highlight ? COLORS.accent + "44" : COLORS.border}`, borderRadius: 8, cursor: "pointer", transition: "border 0.15s" }),
  profileRow: { display: "flex", gap: 4, flexWrap: "wrap" },
  avatar: (size, color) => ({ width: size, height: size, borderRadius: "50%", background: color || COLORS.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, color: COLORS.accent, flexShrink: 0 }),
  activityDot: { width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, flexShrink: 0 },
};

const avatarColors = [COLORS.accentSoft, "#1A2D20", "#2A1830", "#1A2230", "#2E1A10"];

function initials(name) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function Pill({ children, styleObj }) {
  return <span style={s.badge(styleObj)}>{children}</span>;
}

function StagePill({ stage }) {
  const c = stageColors[stage] || stageColors["New Lead"];
  return <span style={s.badge(c)}><span style={s.dot(c.dot)}></span>{stage}</span>;
}

function EngagePill({ eng }) {
  const c = engagementColors[eng] || engagementColors["Cold"];
  return <span style={s.badge(c)}><span style={s.dot(c.dot)}></span>{eng}</span>;
}

// ---- Dashboard Overview ----
function Overview({ leads, tasks }) {
  const converted = leads.filter(l => l.stage === "Converted").length;
  const pipeline = leads.filter(l => !["Converted", "Lost"].includes(l.stage)).reduce((a, l) => a + l.value, 0);
  const openTasks = tasks.filter(t => !t.done).length;
  const highPriority = tasks.filter(t => !t.done && t.priority === "High").length;

  const stageCount = stages.map(st => ({ stage: st, count: leads.filter(l => l.stage === st).length, value: leads.filter(l => l.stage === st).reduce((a, l) => a + l.value, 0) }));
  const recentActivity = leads.slice(0, 5);
  const urgentTasks = tasks.filter(t => !t.done && t.priority === "High").slice(0, 3);

  return (
    <div>
      <div style={s.statGrid}>
        {[
          { label: "Total leads", val: leads.length, change: "+4 this week", pos: true, accent: COLORS.accent },
          { label: "Pipeline value", val: `₹${(pipeline / 100000).toFixed(1)}L`, change: "+12% vs last month", pos: true, accent: COLORS.green },
          { label: "Converted this month", val: converted, change: "2 in progress", pos: true, accent: COLORS.purple },
          { label: "Open tasks", val: openTasks, change: `${highPriority} high priority`, pos: false, accent: COLORS.amber },
        ].map(st => (
          <div key={st.label} style={s.statCard(st.accent)}>
            <div style={s.statVal}>{st.val}</div>
            <div style={s.statLabel}>{st.label}</div>
            <div style={s.statChange(st.pos)}>↑ {st.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Pipeline visual */}
        <div style={s.card}>
          <div style={s.cardHeader}><span style={s.cardTitle}>Pipeline by stage</span></div>
          <div style={{ padding: "16px 20px" }}>
            {stageCount.map(({ stage, count, value }) => {
              const c = stageColors[stage];
              const pct = Math.round((count / leads.length) * 100);
              return (
                <div key={stage} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, color: COLORS.muted }}>{stage}</span>
                    <span style={{ fontSize: 12.5, color: COLORS.text, fontWeight: 500 }}>{count} leads · ₹{(value / 1000).toFixed(0)}K</span>
                  </div>
                  <div style={{ height: 6, background: COLORS.faint, borderRadius: 4 }}>
                    <div style={{ height: 6, width: `${pct}%`, background: c.dot, borderRadius: 4, transition: "width 0.4s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgent tasks */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>Due today</span>
            <span style={{ ...s.badge({ bg: COLORS.redSoft, text: "#FF8080" }), fontSize: 11 }}>{highPriority} urgent</span>
          </div>
          <div style={{ padding: "8px 0" }}>
            {urgentTasks.length === 0 && <div style={{ padding: "20px", color: COLORS.muted, fontSize: 13 }}>All clear for today 🎉</div>}
            {urgentTasks.map(t => {
              const lead = leads.find(l => l.id === t.leadId);
              return (
                <div key={t.id} style={{ padding: "12px 20px", borderBottom: `1px solid ${COLORS.faint}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ ...s.dot(COLORS.red), marginTop: 5 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{t.title}</div>
                    {lead && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{lead.name} · {t.due}</div>}
                  </div>
                  <Pill styleObj={priorityStyle[t.priority]}>{t.priority}</Pill>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent leads table */}
      <div style={s.card}>
        <div style={s.cardHeader}><span style={s.cardTitle}>Recent activity</span></div>
        <table style={s.table}>
          <thead>
            <tr>{["Client", "Contact", "Value", "Stage", "Engagement", "Last activity"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {recentActivity.map((l, i) => (
              <tr key={l.id} style={{ background: i % 2 === 0 ? "transparent" : `${COLORS.border}22` }}>
                <td style={s.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={s.avatar(30, avatarColors[i % 5])}>{initials(l.name)}</div>
                    <span style={{ fontWeight: 500 }}>{l.name}</span>
                  </div>
                </td>
                <td style={{ ...s.td, color: COLORS.muted }}>{l.contact}</td>
                <td style={{ ...s.td, fontWeight: 600, color: COLORS.green }}>₹{(l.value / 1000).toFixed(0)}K</td>
                <td style={s.td}><StagePill stage={l.stage} /></td>
                <td style={s.td}><EngagePill eng={l.engagement} /></td>
                <td style={{ ...s.td, color: COLORS.muted }}>{l.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Pipeline View ----
function Pipeline({ leads, onSelectLead }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(140px, 1fr))", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage);
          const total = stageLeads.reduce((a, l) => a + l.value, 0);
          const c = stageColors[stage];
          return (
            <div key={stage} style={s.pipeCol}>
              <div style={s.pipeColHeader}>
                <span style={{ ...s.pipeColTitle, color: c.text }}>{stage}</span>
                <span style={{ ...s.badge(c), fontSize: 11 }}>{stageLeads.length}</span>
              </div>
              <div style={{ padding: "0 0 12px", minHeight: 220 }}>
                <div style={{ padding: "8px 12px 4px", fontSize: 11, color: COLORS.muted }}>₹{(total / 1000).toFixed(0)}K total</div>
                {stageLeads.map(lead => (
                  <div key={lead.id} style={s.pipeCard(lead.engagement === "Hot")} onClick={() => onSelectLead(lead)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                      <div style={s.avatar(24, avatarColors[lead.id % 5])}>{initials(lead.name)}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, lineHeight: 1.3 }}>{lead.name}</div>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>{lead.contact}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.green }}>₹{(lead.value / 1000).toFixed(0)}K</span>
                      <EngagePill eng={lead.engagement} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Client List View ----
function ClientList({ leads, onSelectLead, search, setSearch }) {
  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.contact.toLowerCase().includes(search.toLowerCase()) ||
    l.industry.toLowerCase().includes(search.toLowerCase())
  );
  const [stageFilter, setStageFilter] = useState("All");
  const final = stageFilter === "All" ? filtered : filtered.filter(l => l.stage === stageFilter);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input style={{ ...s.input, maxWidth: 260 }} placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", ...stages].map(st => (
            <button key={st} style={{ ...s.btn(stageFilter === st ? "primary" : "ghost"), padding: "7px 12px", fontSize: 12 }} onClick={() => setStageFilter(st)}>{st}</button>
          ))}
        </div>
      </div>
      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr>{["", "Company", "Contact", "Industry", "Value", "Stage", "Engagement", "Source", "Last seen"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {final.map((lead, i) => (
              <tr key={lead.id} style={{ cursor: "pointer", transition: "background 0.1s" }} onClick={() => onSelectLead(lead)}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.faint + "44"}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                <td style={{ ...s.td, width: 40 }}><div style={s.avatar(32, avatarColors[i % 5])}>{initials(lead.name)}</div></td>
                <td style={s.td}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{lead.name}</div></td>
                <td style={{ ...s.td, color: COLORS.muted }}>{lead.contact}</td>
                <td style={{ ...s.td, color: COLORS.muted }}>{lead.industry}</td>
                <td style={{ ...s.td, fontWeight: 700, color: COLORS.green }}>₹{(lead.value / 1000).toFixed(0)}K</td>
                <td style={s.td}><StagePill stage={lead.stage} /></td>
                <td style={s.td}><EngagePill eng={lead.engagement} /></td>
                <td style={{ ...s.td, color: COLORS.muted }}>{lead.source}</td>
                <td style={{ ...s.td, color: COLORS.muted }}>{lead.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {final.length === 0 && <div style={{ padding: 32, textAlign: "center", color: COLORS.muted, fontSize: 14 }}>No leads match your search.</div>}
      </div>
    </div>
  );
}

// ---- Client Profile ----
function ClientProfile({ lead, tasks, onBack }) {
  const myTasks = tasks.filter(t => t.leadId === lead.id);
  const c = stageColors[lead.stage];
  const timeline = [
    { label: "Lead created", time: "Jun 2, 2025", icon: "+" },
    { label: "First contact made", time: "Jun 4, 2025", icon: "→" },
    { label: "Proposal sent", time: "Jun 8, 2025", icon: "✉" },
    { label: lead.stage === "Converted" ? "Deal closed" : "Follow-up scheduled", time: "Jun 12, 2025", icon: lead.stage === "Converted" ? "✓" : "⏰" },
  ];

  return (
    <div>
      <button style={{ ...s.btn("ghost"), marginBottom: 20, fontSize: 13 }} onClick={onBack}>← Back to clients</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 20 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={s.card}>
            <div style={{ padding: "24px 22px", textAlign: "center", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ ...s.avatar(60, avatarColors[lead.id % 5]), margin: "0 auto 14px", fontSize: 22 }}>{initials(lead.name)}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.text }}>{lead.name}</div>
              <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{lead.contact} · {lead.industry}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
                <StagePill stage={lead.stage} />
                <EngagePill eng={lead.engagement} />
              </div>
            </div>
            <div style={{ padding: "16px 20px" }}>
              {[
                { label: "Email", val: lead.email },
                { label: "Value", val: `₹${(lead.value / 1000).toFixed(0)}K` },
                { label: "Source", val: lead.source },
                { label: "Last activity", val: lead.lastActivity },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.faint}`, fontSize: 13 }}>
                  <span style={{ color: COLORS.muted }}>{row.label}</span>
                  <span style={{ color: COLORS.text, fontWeight: 500 }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={s.card}>
            <div style={s.cardHeader}><span style={s.cardTitle}>Notes</span></div>
            <div style={{ padding: "14px 18px", fontSize: 13, color: COLORS.muted, lineHeight: 1.65 }}>{lead.notes}</div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={s.card}>
            <div style={s.cardHeader}><span style={s.cardTitle}>Activity timeline</span></div>
            <div style={{ padding: "12px 20px" }}>
              {timeline.map((ev, i) => (
                <div key={i} style={{ display: "flex", gap: 14, paddingBottom: i < timeline.length - 1 ? 16 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS.accentSoft, border: `1px solid ${COLORS.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: COLORS.accent, flexShrink: 0 }}>{ev.icon}</div>
                    {i < timeline.length - 1 && <div style={{ width: 1, flex: 1, background: COLORS.border, marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingBottom: i < timeline.length - 1 ? 8 : 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{ev.label}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.card}>
            <div style={s.cardHeader}><span style={s.cardTitle}>Tasks for this client</span></div>
            {myTasks.length === 0 && <div style={{ padding: "16px 20px", fontSize: 13, color: COLORS.muted }}>No tasks assigned. Add a follow-up to stay on track.</div>}
            {myTasks.map(t => (
              <div key={t.id} style={{ padding: "12px 20px", borderBottom: `1px solid ${COLORS.faint}`, display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${t.done ? COLORS.green : COLORS.border}`, background: t.done ? COLORS.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {t.done && <span style={{ fontSize: 10, color: "#fff" }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: t.done ? COLORS.muted : COLORS.text, textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{t.due}</div>
                </div>
                <Pill styleObj={priorityStyle[t.priority]}>{t.priority}</Pill>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Tasks View ----
function Tasks({ tasks, setTasks, leads }) {
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const types = ["All", ...Array.from(new Set(tasks.map(t => t.type)))];
  const filtered = tasks
    .filter(t => filter === "All" ? true : filter === "Done" ? t.done : !t.done)
    .filter(t => typeFilter === "All" ? true : t.type === typeFilter);

  const toggle = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const grouped = {
    Today: filtered.filter(t => t.due.startsWith("Today")),
    Tomorrow: filtered.filter(t => t.due.startsWith("Tomorrow")),
    Later: filtered.filter(t => !t.due.startsWith("Today") && !t.due.startsWith("Tomorrow")),
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", "Pending", "Done"].map(f => (
          <button key={f} style={{ ...s.btn(filter === f ? "primary" : "ghost"), fontSize: 12 }} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <div style={{ width: 1, background: COLORS.border, margin: "0 4px" }} />
        {types.map(t => (
          <button key={t} style={{ ...s.btn(typeFilter === t ? "primary" : "ghost"), fontSize: 12 }} onClick={() => setTypeFilter(t)}>{t}</button>
        ))}
      </div>

      {Object.entries(grouped).map(([group, items]) => items.length > 0 && (
        <div key={group} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{group} · {items.length}</div>
          <div style={s.card}>
            {items.map((task, i) => {
              const lead = leads.find(l => l.id === task.leadId);
              const tt = taskTypeStyle[task.type] || taskTypeStyle["Research"];
              return (
                <div key={task.id} style={{ padding: "14px 20px", borderBottom: i < items.length - 1 ? `1px solid ${COLORS.faint}` : "none", display: "flex", gap: 14, alignItems: "center" }}>
                  <div onClick={() => toggle(task.id)} style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${task.done ? COLORS.green : COLORS.border}`, background: task.done ? COLORS.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>
                    {task.done && <span style={{ fontSize: 11, color: "#fff" }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: task.done ? COLORS.muted : COLORS.text, textDecoration: task.done ? "line-through" : "none" }}>{task.title}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                      {lead && <span style={{ fontSize: 12, color: COLORS.accent }}>{lead.name}</span>}
                      {lead && <span style={{ color: COLORS.faint }}>·</span>}
                      <span style={{ fontSize: 12, color: COLORS.muted }}>{task.due}</span>
                    </div>
                  </div>
                  <Pill styleObj={tt}>{task.type}</Pill>
                  <Pill styleObj={priorityStyle[task.priority]}>{task.priority}</Pill>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const navItems = [
  { id: "overview", label: "Overview", icon: "⊞" },
  { id: "pipeline", label: "Pipeline", icon: "⇥" },
  { id: "clients", label: "Client list", icon: "☰" },
  { id: "tasks", label: "Tasks", icon: "✓" },
];

export default function CRMDashboard() {
  const [page, setPage] = useState("overview");
  const [leads] = useState(initialLeads);
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState("");

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    setPage("profile");
  };

  const handleBack = () => {
    setSelectedLead(null);
    setPage("clients");
  };

  const activePage = selectedLead ? "profile" : page;

  const pageTitles = {
    overview: ["Dashboard", "Good morning, Akshat. Here's your agency at a glance."],
    pipeline: ["Lead pipeline", "Drag-and-drop your deals through the funnel."],
    clients: ["Client list", `${leads.length} leads across all stages.`],
    tasks: ["Tasks & follow-ups", "Stay on top of every client touchpoint."],
    profile: [selectedLead?.name || "", selectedLead ? `${selectedLead.contact} · ${selectedLead.industry} · ${selectedLead.source}` : ""],
  };

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoText}>⬡ NexCRM</div>
          <div style={s.logoSub}>Digital Agency Suite</div>
        </div>
        <div style={{ flex: 1 }}>
          {navItems.map(item => (
            <div key={item.id} style={s.navItem(page === item.id && !selectedLead)} onClick={() => { setSelectedLead(null); setPage(item.id); }}>
              <span style={s.navIcon}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={s.avatar(32, COLORS.accentSoft)}>AK</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Akshat Pratap Singh</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>Agency Owner</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={s.main}>
        <div style={{ marginBottom: 28 }}>
          <div style={s.pageTitle}>{pageTitles[activePage][0]}</div>
          <div style={s.pageSubtitle}>{pageTitles[activePage][1]}</div>
        </div>

        {activePage === "overview" && <Overview leads={leads} tasks={tasks} />}
        {activePage === "pipeline" && <Pipeline leads={leads} onSelectLead={handleSelectLead} />}
        {activePage === "clients" && <ClientList leads={leads} onSelectLead={handleSelectLead} search={search} setSearch={setSearch} />}
        {activePage === "tasks" && <Tasks tasks={tasks} setTasks={setTasks} leads={leads} />}
        {activePage === "profile" && selectedLead && <ClientProfile lead={selectedLead} tasks={tasks} onBack={handleBack} />}
      </div>
    </div>
  );
}
