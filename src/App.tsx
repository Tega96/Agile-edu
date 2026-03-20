import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard, ExamDashboard, LandingPage, Leaderboard, LearningDashboard, Settings, UserProfile } from "./components/pages";
import Login from "./components/Auth/Login";
import SignUp from './components/Auth/SignUp'
import Navigation from "./components/ui/Navigation";


const App = () => {
  return (
    <BrowserRouter>
      <div className="">
        <Navigation />
        <main>
          {/** Public Routes */}
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="sign-up" element={<SignUp />} />
          </Routes>

          {/** Protected Routes */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="exam" element={<ExamDashboard /> } />
            <Route path="rank" element={<Leaderboard />} />
            <Route path="learn" element={<LearningDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
export default App;