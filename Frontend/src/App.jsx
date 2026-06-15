import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import MeetingHistory from "./pages/MeetingHistory";
import Dashboard from "./pages/Dashboard";
import MeetingRoom from "./pages/MeetingRoom";
import Login from "./pages/Login";

function App() {
  const user =
    localStorage.getItem(
      "meetflow-user"
    );

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            user ? (
              <Dashboard />
            ) : (
              <Login />
            )
          }
        />
<Route
  path="/history"
  element={<MeetingHistory />}
/>
        <Route
          path="/room/:roomId"
          element={
            user ? (
              <MeetingRoom />
            ) : (
              <Login />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;