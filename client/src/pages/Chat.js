import "./Chat.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import {useContext, useEffect, useState} from "react";
import GlobalContext from "../helpers/globalContext";

import perfilMasculino from "../assets/perfil-masculino.png";
import perfilFeminino from "../assets/perfil-feminino.png";

export const Chat = () => {
    const context = useContext(GlobalContext);
    const [contacts, setContacts] = useState([]);

    // CARREGA OS CONTATOS
    useEffect(() => {
        const socket = context.socket;
        socket.emit("getContacts", (data) => {
            const contacts = data.contacts.map((contact) => {
                return (
                    <li key={contact.username} className="friend">
                        <div className="container">
                            <figure>
                                <img
                                    src={perfilMasculino}
                                    alt="Foto de perfil"/>
                            </figure>
                            <div className="info">
                                <h4>{contact.username} <span>27 mar</span></h4>
                                <p>Hi, David. Hope you’re doing....</p>
                            </div>
                        </div>
                    </li>
                );
            })

            setContacts(contacts);
        });
    }, [])

    return (
        <section className="background-fullscreen-chat">
            <aside>
                <div className="padding">
                    <h2 className="title">Chat</h2>
                    <label className="input-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>

                        <input type="text" placeholder="Pesquise aqui"/>
                    </label>

                    <h2 className="title">Mensagens</h2>
                    <h3 className="subtitle">Chat recente</h3>
                </div>

                <ul className="friends">
                    {contacts}
                </ul>
            </aside>

            <main>
                <div className="user-info"></div>

                <ul className="mensagens">
                    <li className="mensagens-right">
                        <img src={perfilMasculino} alt=""/>

                        <div>
                            <p>OoOo, Thats so Cool!</p>
                            <p>OoOo, Thats so Cool!</p>
                            <p>OoOo, Thats so Cool!</p>
                            <p>OoOo, Thats so Cool!</p>
                            <p>OoOo, Thats so Cool!</p>
                            <p>OoOo, Thats so Cool!</p>
                        </div>
                    </li>

                    <li className="mensagens-left">
                        <img src={perfilFeminino} alt=""/>

                        <div>
                            <p>Yes, i’m at Istanbul.. </p>
                            <p>OoOo, Thats so Cool!</p>
                        </div>
                    </li>
                </ul>
            </main>
        </section>
    );
}//6F727A