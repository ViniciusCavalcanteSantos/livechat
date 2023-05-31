import {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from 'react-toastify';

import "./Entrar.css"
import user from "../assets/user.svg";
import lock from "../assets/lock.svg";
import GlobalContext from "../helpers/globalContext";
import axios from "axios";
import {isAuthorized} from "../helpers/socket";

export const Cadastrar = () => {
    const context = useContext(GlobalContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const handleUsername = (e) => setUsername(e.target.value);
    const handleSenha = (e) => setSenha(e.target.value);
    const handleConfirmarSenha = (e) => setConfirmarSenha(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(senha !== confirmarSenha) {
            toast("Suas senhas não coincidem!");
        }

        axios.post("http://localhost:4000/cadastrar", {username, senha})
            .then((res) => {
                toast(res.data.message);

                if(res.data.status) {
                    navigate("/", {state: {username}});
                }
            })
    }

    return (
        <div className="background-fullscreen">
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="animate__animated animate__bounce">Entrar</h1>

                <label className="animate__animated animate__bounceInLeft">
                    <img src={user} alt="Logo do usuário"/>
                    <input type="text" placeholder="Usuário" value={username} onChange={handleUsername} required
                           autoComplete="on"/>
                </label>
                <label className="animate__animated animate__bounceInRight">
                    <img src={lock} alt="Cadeado"/>
                    <input type="password" placeholder="Senha" value={senha} onChange={handleSenha} required
                           autoComplete="new-password" minLength="6"/>
                </label>
                <label className="animate__animated animate__bounceInUp">
                    <img src={lock} alt="Cadeado"/>
                    <input type="password" placeholder="Confirmar senha" value={confirmarSenha}
                           onChange={handleConfirmarSenha} required autoComplete="new-password" minLength="6"/>
                </label>

                <input className="animate__animated animate__bounceInUp" type="submit" value="Criar conta"/>

                <Link className="animate__animated animate__bounceInUp" to="/">Já possui uma conta?</Link>
            </form>
        </div>
    );
}