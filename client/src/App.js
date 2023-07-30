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

const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true
})

function App() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const path = location.pathname;
        
        api.get("/isAuthorized")
                .then((res) => {

                    if(res.data.status) {
                        socket.connect();
                        if(path === "/" || path === "cadastrar") {
                            navigate("/chat", {state: {username: res.data.username}});
                        }
                    } else {
                        if(path !== "/" || path !== "cadastrar") {
                            navigate("/")
                        }
                    }
                })


        socket.on("unauthorized", () => {
            console.log("Não autorizado")
            navigate("/")
        })

        return () => {
            socket.removeAllListeners("unauthorized");
        }
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