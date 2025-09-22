
import React from "react";
import { BrowserRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import CreateMeetingPage from "./CreateMeetingPage";
import { RtkMeeting } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';

function MeetingRoute() {
  const { authToken } = useParams();
  const navigate = useNavigate();
  const [meeting, initMeeting] = useRealtimeKitClient();

  React.useEffect(() => {
    if (!authToken) {
      alert("No authToken provided in URL. Redirecting to home page.");
      navigate("/");
      return;
    }
    initMeeting({ authToken });
  }, [authToken, initMeeting, navigate]);

  return <RtkMeeting meeting={meeting!} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-meeting" element={<CreateMeetingPage />} />
        <Route path="/meeting/:authToken" element={<MeetingRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
