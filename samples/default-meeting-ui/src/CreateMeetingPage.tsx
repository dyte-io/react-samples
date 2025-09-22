
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateMeetingPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [recordOnStart, setRecordOnStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Create Meeting only
      const meeting_result = await fetch("https://api.realtime.cloudflare.com/v2/meetings", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Authorization": import.meta.env.VITE_AUTHORIZATION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          preferred_region: "ap-south-1",
          record_on_start: recordOnStart,
          live_stream_on_start: false,
        }),
      });
      const meeting_data = await meeting_result.json();
      if (!meeting_result.ok) throw new Error(meeting_data.message || "Failed to create meeting");
      // Redirect to home page after success
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, boxShadow: "0 2px 8px #eee", borderRadius: 8 }}>
      <h2>Create a meeting</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Meeting Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={recordOnStart}
              onChange={e => setRecordOnStart(e.target.checked)}
            />
            Record on start
          </label>
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#1677ff", color: "#fff", border: "none", borderRadius: 4 }}>
          {loading ? "Creating..." : "Create Meeting"}
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      
    </div>
  );
};

export default CreateMeetingPage;
