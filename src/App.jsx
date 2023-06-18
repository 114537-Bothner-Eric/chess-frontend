import { Chess } from "./Chess";
import { Menu } from "./Menu";
import { Route, Routes } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalChess } from "./Local";
import './styles.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />}></Route>
        <Route path="/chess" element={<Chess />}></Route>
        <Route path="/local" element={<LocalChess />}></Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
