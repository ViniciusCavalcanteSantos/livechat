import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import "./Entrar.css"
import user from "../assets/user.svg";
import lock from "../assets/lock.svg";
import {socket} from "../helpers/socket";
import {toast} from "react-toastify";

export const Entrar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [senha, setSenha] = useState("");

    useEffect(() => {
        if(location.state) {
            setUsername(location.state.username ?? "")
        }

    }, [location.state]);

    const handleUsername = (e) => setUsername(e.target.value);
    const handleSenha = (e) => setSenha(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!username || !senha) alert("Usúario e sala devem ser preenchidos!");

        socket.connect();
        socket.emit("entrar", {username, senha}, ({status, message}) => {
            if(status) {
                navigate("/chat", {state: {username}});
            } else {
                toast(message);
            }
        })
    }

    return (
        <div className="background-fullscreen">
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="animate__animated animate__bounce">Entrar</h1>

                <label className="animate__animated animate__bounceInLeft">
                    <img src={user} alt="Logo do usuário"/>
                    <input type="text" placeholder="Usuário" value={username} onChange={handleUsername} required/>
                </label>
                <label className="animate__animated animate__bounceInRight">
                    <img src={lock} alt="Cadeado"/>
                    <input type="password" placeholder="Senha" value={senha} onChange={handleSenha} required autoComplete="on" minLength="6"/>
                </label>
                <input className="animate__animated animate__bounceInUp" type="submit" value="Entrar"/>

                <Link className="animate__animated animate__bounceInUp" to="/cadastrar">Não possui uma conta?</Link>
            </form>
        </div>
    );
}