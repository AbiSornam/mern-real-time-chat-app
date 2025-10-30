import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import HomePage from "./pages/HomePage";
import FriendsPage from "./pages/FriendsPage";
import Signuppage from "./pages/Signuppage";
import Loginpage from "./pages/Loginpage";
import NotificationsPage from "./pages/NotificationsPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/Chatpage";
import OnboardingPage from "./pages/OnboardingPage";
import { useThemeStore } from "./store/useThemeStore";
// Components
import Layout from "./components/Layout";
import PageLoader from "./components/PageLoader";

// Hooks
import useAuthUser from "./hooks/useAuthUser";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const {theme}=useThemeStore();
  //used anywhere in application-theme
//checks if user is logged in
  const isAuthenticated = Boolean(authUser);
  //checks if user has completed onboarding
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;
  //zustand for theme
  return (
    // THIS IS THE CORRECTED LINE - The conflicting classes have been removed
    <div data-theme={theme}>
      
      <Routes>
        {/* Home (public) */}
        <Route
          path='/'
          element={
            <Layout showSidebar={true}>
              <HomePage />
            </Layout>
          }
        />

        {/* Signup */}
        <Route
          path='/signup'
          element={
            !isAuthenticated ? (
              <Signuppage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />

        {/* Login */}
        <Route
          path='/login'
          element={
            !isAuthenticated ? (
              <Loginpage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />

        {/* Notifications */}
        <Route
          path='/notifications'
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        {/* Friends */}
        <Route
          path='/friends'
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        {/* Call */}
        <Route
          path='/call/:id'
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        {/* Chat */}
        <Route
          path='/chat/:id'
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        {/* Onboarding */}
        <Route
          path='/onboarding'
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to='/' />
              )
            ) : (
              <Navigate to='/login' />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;