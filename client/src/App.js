import { Note } from './pages/note/Note';
import './App.css';
import {Login }from "./pages/login/Login";
import {Register} from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {useContext} from "react";
import { AuthContext } from './pages/context/AuthContext';



function App() {

  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
         {user ? <Note /> : <Register />} 
        </Route>
        <Route path="/login">
          <Login />
          {user ? <Redirect to= "/" /> : <Login />}
        </Route>
        <Route path="/register">
        {user ? <Redirect to= "/" /> : <Register />}
        </Route>
      </Switch>
    </Router>

 

  );
}

export default App;
