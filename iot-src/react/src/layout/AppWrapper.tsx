import { Provider } from "react-redux";
import store from "../redux/store";
import App from "./App";

const AppWrapper: React.FC = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWrapper;
