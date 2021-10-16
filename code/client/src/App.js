import './App.css';
import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Project from './Pages/Project/Project';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Pages/Dashboard/Dashboard';
import Taskboard from './Pages/Taskboard/Taskboard';
import Scrumboard from './Pages/Scrumboard/Scrumboard';
import CollabBoard from './Pages/CollabBoard/CollabBoard';
import Reports from './Pages/Reports/Reports';
import Team from './Pages/Team/Team';
import FirstStep from './Pages/RecoveryPages/FirstStep';
import SecondStep from './Pages/RecoveryPages/SecondStep';
import ThirdStep from './Pages/RecoveryPages/ThirdStep';
import FinalStep from './Pages/RecoveryPages/FinalStep';
import SprintOverview from './Pages/SprintOverview/SprintOverview';
import SummaryChart from './Components/Charts/SummaryChart';
import LandingPage from './Pages/LandingPage/LandingPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/signin'>
          <Signin />
        </Route>
        <Route path='/signup'>
          <Signup />
        </Route>
        <Route path='/account-recovery/stepOne'>
          <FirstStep />
        </Route>
        <Route path='/account-recovery/stepTwo/:email'>
          <SecondStep />
        </Route>
        <Route path='/account-recovery/stepThree/:verificationCode'>
          <ThirdStep />
        </Route>
        <Route path='/account-recovery/success'>
          <FinalStep />
        </Route>
        <Route path='/project'>
          <Project />
        </Route>
        <Route path='/dashboard/:projectId'>
          <Navbar />
          <div className='app__flexSidebar'>
            <Sidebar />
            <Dashboard />
          </div>
        </Route>
        <Route path='/taskboard/:projectId'>
          <Navbar />
          <div className='app__flexSidebar'>
            <Sidebar />
            <Taskboard />
          </div>
        </Route>
        <Route path='/sprint/:sprintId'>
          <Navbar />
          <div className='app__flexSidebar'>
            <Sidebar />
            <Scrumboard />
          </div>
        </Route>
        <Route path='/scrumboard/:projectId'>
          <Navbar />
          <div className='app__flexSidebar'>
            <Sidebar />
            <SprintOverview />
          </div>
        </Route>
        <Route path='/collabboard/:projectId'>
          <Navbar />
          <div className='app__flexSidebar'>
            <Sidebar />
            <CollabBoard />
          </div>
        </Route>
        <Route path='/room/:roomId'>
          <Navbar />
          <div className='app__flexSidebar'>
            <Sidebar />
            <CollabBoard />
          </div>
        </Route>
        <Route path='/reports/:projectId'>
          <Navbar />
          <div className='app__flexSidebar'>
            <Sidebar />
            <Reports />
          </div>
        </Route>
        <Route path='/team/:projectId'>
          <Navbar />
          <div className='app__flexSidebar'>
            <Sidebar />
            <Team />
          </div>
        </Route>
        <Route path='/'>
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
