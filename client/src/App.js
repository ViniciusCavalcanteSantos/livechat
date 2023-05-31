import "./App.css";
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import {Entrar} from "./pages/Entrar";
import {Cadastrar} from "./pages/Cadastrar";
import {Chat} from "./pages/Chat";
import 'animate.css';
import globalContext from "./helpers/globalContext";
import {socket} from "./helpers/socket";
import axios from "axios";
import {useEffect} from "react";

socket.connect();
const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true
})

function App(props) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit("isAuthorized", null, ({status, username}) => {
            const path = location.pathname;

            if((path === "/" || path === "cadastrar") && status) {
                navigate("/chat", {state: {username}});
            } else if(!status) {
                navigate("/");
            }
        });
    }, [])


    return (
        <globalContext.Provider value={{socket: socket, axios: api}}>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Entrar/>}/>
                    <Route path="/cadastrar" element={<Cadastrar/>}/>
                    <Route path="/chat" element={<Chat/>}/>
                </Routes>
            </div>
        </globalContext.Provider>
    )
}

export default App;