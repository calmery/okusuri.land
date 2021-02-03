import { logIn } from "../utils/authentication";

const Index: React.FC = () => (
  <button onClick={logIn}>Log in with Twitter</button>
);

export default Index;
