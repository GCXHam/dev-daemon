import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./Login";
import SignUp from "./SignUp";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/signup" exact component={SignUp} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
