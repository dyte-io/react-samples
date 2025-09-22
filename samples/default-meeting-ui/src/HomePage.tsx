import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddParticipantModal from "./AddParticipantModal";
const PAGE_SIZE = 20;

const HomePage: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // <-- Add page state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://api.realtime.cloudflare.com/v2/meetings", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Authorization": import.meta.env.VITE_AUTHORIZATION,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch meetings");
        setMeetings(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  // Filter meetings by meeting_id or title
  const filteredMeetings = meetings.filter((meeting: any) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      (meeting.id && meeting.id.toLowerCase().includes(searchLower)) ||
      (meeting.title && meeting.title.toLowerCase().includes(searchLower))
    );
  });

  // Paging logic
  const totalPages = Math.ceil(filteredMeetings.length / PAGE_SIZE);
  const pagedMeetings = filteredMeetings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to first page if search changes
  React.useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <>
      <div style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search by Meeting ID or Title"
            style={{ width: 320, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            style={{ background: "#1677ff", color: "#fff", border: "none", borderRadius: 4, padding: "8px 20px", fontWeight: 600 }}
            onClick={() => navigate("/create-meeting")}
          >
            + Create meeting
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
          <thead style={{ background: "#f7f7f7" }}>
            <tr>
              <th style={{ padding: 12, textAlign: "left" }}>Meeting ID</th>
              <th style={{ padding: 12, textAlign: "left" }}>Title</th>
              <th style={{ padding: 12, textAlign: "left" }}>Created At</th>
              <th style={{ padding: 12, textAlign: "left" }}>Status</th>
              <th style={{ padding: 12, textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 24 }}>Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} style={{ color: "red", textAlign: "center", padding: 24 }}>{error}</td></tr>
            ) : pagedMeetings.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 24 }}>No meetings found.</td></tr>
            ) : (
              pagedMeetings.map((meeting: any) => (
                <tr key={meeting.id}>
                  <td style={{ padding: 12 }}>
                    <a href="#" style={{ color: "#1677ff", textDecoration: "underline" }}>{meeting.id?.slice(-12)}</a>
                  </td>
                  <td style={{ padding: 12 }}>{meeting.title}</td>
                  <td style={{ padding: 12 }}>{meeting.created_at ? new Date(meeting.created_at).toLocaleString() : "-"}</td>
                  <td style={{ padding: 12 }}>{meeting.status || "Active"}</td>
                  <td style={{ padding: 12 }}>
                    {meeting.status !== "INACTIVE" && (
                      <button
                        style={{ background: "#222", color: "#fff", border: "none", borderRadius: 4, padding: "6px 16px" }}
                        onClick={() => {
                          setSelectedMeetingId(meeting.id);
                          setModalOpen(true);
                        }}
                      >
                        Join
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Paging controls */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 16 }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{
              padding: "6px 16px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: page === 1 ? "#eee" : "#fff",
              cursor: page === 1 ? "not-allowed" : "pointer"
            }}
          >
            Previous
          </button>
          <span style={{ alignSelf: "center" }}>
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            style={{
              padding: "6px 16px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: page === totalPages || totalPages === 0 ? "#eee" : "#fff",
              cursor: page === totalPages || totalPages === 0 ? "not-allowed" : "pointer"
            }}
          >
            Next
          </button>
        </div>
      </div>
      <AddParticipantModal
        meetingId={selectedMeetingId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={token => {
          setModalOpen(false);
          navigate(`/meeting/${token}`);
        }}
      />
    </>
  );
};

export default HomePage;
