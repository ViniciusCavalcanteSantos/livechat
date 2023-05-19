import "./App.css";
import {Routes, Route} from 'react-router-dom';
import {Entrar} from "./pages/Entrar";
import {Cadastrar} from "./pages/Cadastrar";
import {Chat} from "./pages/Chat";
import 'animate.css';

function App(props) {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Entrar/>}/>
                <Route path="/cadastrar" element={<Cadastrar/>}/>
                <Route path="/chat" element={<Chat/>}/>
            </Routes>
        </div>
    )
}

export default App;