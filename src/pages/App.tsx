import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../AuthContext";
import Login from "./Login";
import SignUp from "./SignUp";
import CheckStatus from "./CheckStatus";

function App(): JSX.Element {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/checkstatus" exact component={CheckStatus} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
