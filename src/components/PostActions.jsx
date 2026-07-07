import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { getVisitorId } from "../lib/visitorId";

const actionButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  fontWeight: 600,
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text-primary)",
  cursor: "pointer",
  textDecoration: "none",
  lineHeight: 1,
};

function useOutsideClose(ref, onClose) {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [ref, onClose]);
}

export function ShareButton({ title, url }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef(null);

  useOutsideClose(wrapRef, () => setOpen(false));

  const handleShareClick = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }
    setOpen((o) => !o);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — the input is still selectable for manual copy
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  return (
    <div ref={wrapRef} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={handleShareClick} style={actionButtonStyle}>↗ Share</button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 20,
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 16,
            width: 260,
            boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", margin: "0 0 8px" }}>Share this post</p>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <input
              readOnly
              value={url}
              onFocus={(e) => e.target.select()}
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: 12,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text-primary)",
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: "#1D9E75",
                color: "#fff",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {shareLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.label === "Email" ? undefined : "_blank"}
                rel="noreferrer"
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "6px 12px",
                  borderRadius: 20,
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ReplyButton({ title }) {
  const subject = encodeURIComponent(`Re: ${title}`);
  return (
    <a href={`mailto:sambitbastia@gmail.com?subject=${subject}`} style={actionButtonStyle}>
      ✉ Reply
    </a>
  );
}

export function ReactionBar({ postId }) {
  const [counts, setCounts] = useState({ likes: 0, loves: 0 });
  const [myReaction, setMyReaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!supabase) {
      setLoading(false);
      return;
    }
    const visitorId = getVisitorId();
    supabase
      .rpc("get_post_reactions", { p_post_id: String(postId), p_visitor_id: visitorId })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data && data[0]) {
          setCounts({ likes: data[0].likes, loves: data[0].loves });
          setMyReaction(data[0].my_reaction);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const toggle = async (reaction) => {
    if (!supabase || loading) return;
    const visitorId = getVisitorId();
    const prevCounts = counts;
    const prevReaction = myReaction;

    const next = { ...counts };
    if (prevReaction === reaction) {
      next[reaction === "like" ? "likes" : "loves"] -= 1;
      setMyReaction(null);
    } else {
      if (prevReaction) next[prevReaction === "like" ? "likes" : "loves"] -= 1;
      next[reaction === "like" ? "likes" : "loves"] += 1;
      setMyReaction(reaction);
    }
    setCounts(next);

    const { data, error } = await supabase.rpc("toggle_post_reaction", {
      p_post_id: String(postId),
      p_visitor_id: visitorId,
      p_reaction: reaction,
    });
    if (error || !data || !data[0]) {
      setCounts(prevCounts);
      setMyReaction(prevReaction);
      return;
    }
    setCounts({ likes: data[0].likes, loves: data[0].loves });
    setMyReaction(data[0].my_reaction);
  };

  if (!supabase) return null;

  return (
    <div style={{ display: "flex", gap: 10, marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
      <button
        onClick={() => toggle("like")}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          padding: "8px 16px",
          borderRadius: 20,
          border: myReaction === "like" ? "1px solid #1D9E75" : "1px solid var(--border)",
          background: myReaction === "like" ? "#E1F5EE" : "var(--surface)",
          color: myReaction === "like" ? "#1D9E75" : "var(--text-primary)",
          cursor: loading ? "default" : "pointer",
        }}
      >
        👍 Like <span>{counts.likes}</span>
      </button>
      <button
        onClick={() => toggle("love")}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          padding: "8px 16px",
          borderRadius: 20,
          border: myReaction === "love" ? "1px solid #D85A30" : "1px solid var(--border)",
          background: myReaction === "love" ? "#FAECE7" : "var(--surface)",
          color: myReaction === "love" ? "#D85A30" : "var(--text-primary)",
          cursor: loading ? "default" : "pointer",
        }}
      >
        ❤️ Love <span>{counts.loves}</span>
      </button>
    </div>
  );
}
