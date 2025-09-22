import React, { useState } from "react";

interface AddParticipantModalProps {
  meetingId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

const AddParticipantModal: React.FC<AddParticipantModalProps> = ({ meetingId, open, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const [customId, setCustomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.realtime.cloudflare.com/v2/meetings/${meetingId}/participants`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Authorization": import.meta.env.VITE_AUTHORIZATION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          picture,
          preset_name: "group_call_host",
          custom_participant_id: customId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to add participant");
      onSuccess(data.data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 340, boxShadow: "0 2px 8px #eee" }}>
        <h3>Add a participant</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: 8, marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Picture URL</label>
            <input type="text" value={picture} onChange={e => setPicture(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Custom Participant ID</label>
            <input type="text" value={customId} onChange={e => setCustomId(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#1677ff", color: "#fff", border: "none", borderRadius: 4 }}>
            {loading ? "Adding..." : "Add Participant"}
          </button>
        </form>
        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
        <button onClick={onClose} style={{ marginTop: 16, background: "#eee", border: "none", padding: "8px 16px", borderRadius: 4 }}>Cancel</button>
      </div>
    </div>
  );
};

export default AddParticipantModal;
