import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import CheckStatus from "./CheckStatus";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/checkstatus" exact component={CheckStatus} />
      </Switch>
    </Router>
  );
}

export default App;
