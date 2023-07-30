import "./Chat.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import {useContext, useEffect, useRef, useState} from "react";
import GlobalContext from "../helpers/globalContext";

import perfilMasculino from "../assets/perfil-masculino.png";
import perfilFeminino from "../assets/perfil-feminino.png";
import {toast} from "react-toastify";

function formatDate(datetime) {
    const months = [
      'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
      'jul', 'ago', 'set', 'out', 'nov', 'dez'
    ];
  
    const date = new Date(datetime);
  
    const day = date.getDate();
    const month = months[date.getMonth()];
  
    return `${day} ${month}`;
}

export const Chat = () => {
    const myId = localStorage.getItem("id");
    const myUsername = localStorage.getItem("id");

    const context = useContext(GlobalContext);
    const socket = context.socket;

    const [search, setSearch] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);

    const handleContactChange = ({id, username}) => {
        setCurrentUser(id);
        setMessages([]);
        socket.emit("getMessages", {userId: id}, (messages) => {
            setMessages(messages.result);
        })
    }

    // CARREGA OS CONTATOS
    useEffect(() => {
        socket.emit("getContacts", (data) => {
            const contacts = data.contacts
            setContacts(contacts);
        });
    }, [currentUser]);

    // RECEBE MENSAGENS
    useEffect(() => {
        socket.on("sendMessage", ({id, message}) => {
            setMessages((prevState) => [...prevState, {id_from: id, message}]);
        })

        return () => {
            socket.removeAllListeners("sendMessage");
        }
    }, [])

    // ENVIA MENSAGENS
    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("sendMessage", {message: message, to: currentUser}, ({status, message}) => {
            if(status === false) {
                toast("Não foi possível enviar a mensagem.")
                return;
            }

            setMessages((prevState) => [...prevState, {id_from: myId, message}]);
        })
        setMessage("");
    }

    // Desce a barra ao selecionar uma conversa
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }
    useEffect(() => {
        scrollToBottom();
    }, [messages])

    return (
        <section className="background-fullscreen-chat">
            <aside>
                <div className="padding">
                    <h2 className="title">Chat</h2>
                    <label className="input-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>

                        <input type="text" placeholder="Pesquise aqui" onChange={(e) => setSearch(e.target.value)} value={search} />
                    </label>

                    <h2 className="title">Mensagens</h2>
                    <h3 className="subtitle">Chat recente</h3>
                </div>

                <ul className="friends">
                    {contacts.filter((contact) => {
                        return contact.username.toLowerCase().match(search.toLowerCase());
                    }).map((contact) => {
                        return (
                            <li key={contact.username} className={"friend " + ((currentUser === contact.id) ? "active" : "")}
                                onClick={() => handleContactChange({id: contact.id, username: contact.username})}>
                                <div className="container">
                                    <figure>
                                        <img
                                            src={perfilMasculino}
                                            alt="Foto de perfil"/>
                                    </figure>
                                    <div className="info">
                                        <h4>{contact.username} <span>{contact.last_message ? formatDate(contact.last_message_created_at) : ""}</span></h4>
                                        <p>{(contact.last_message && contact.last_message.length > 60) ? contact.last_message.substring(0, 60) + "..." : contact.last_message}</p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            {currentUser && <main className="conversa">
                <div className="user-info"></div>

                <ul className="mensagens">
                    {messages.map((message, index) => {
                        return (
                            <li key={index}
                                className={(myId == message.id_from) ? "mensagens-left" : ""}>
                                <img src={perfilMasculino} alt=""/>

                                <div>
                                    <p>{message.message}</p>
                                </div>
                            </li>
                        )
                    })}
                    <div ref={messagesEndRef}/>
                </ul>

                <div className="mensagens-input">
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Send message" value={message}
                               onChange={(e) => setMessage(e.target.value)} maxLength={1000}/>

                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                                 fill="none">
                                <path
                                    d="M17.8325 0.166404C17.9118 0.245875 17.9661 0.346908 17.9885 0.456951C18.0109 0.566994 18.0005 0.681198 17.9585 0.785376L11.2894 17.4598C11.2306 17.6066 11.1325 17.7344 11.0058 17.8291C10.8791 17.9237 10.7287 17.9816 10.5712 17.9963C10.4137 18.011 10.2553 17.9819 10.1132 17.9124C9.97122 17.8428 9.85113 17.7354 9.76621 17.6019L6.12391 11.8764L0.399134 8.23367C0.265405 8.14883 0.15771 8.02869 0.0879332 7.88651C0.0181566 7.74432 -0.0109891 7.58562 0.00371211 7.42792C0.0184133 7.27022 0.0763899 7.11964 0.171244 6.99281C0.266099 6.86598 0.394144 6.76782 0.541251 6.70917L17.2136 0.0414633C17.3177 -0.000475159 17.4319 -0.0108827 17.542 0.0115334C17.652 0.0339496 17.753 0.0882016 17.8325 0.16755V0.166404ZM7.26772 11.5417L10.4321 16.5141L15.8566 2.95178L7.26772 11.5417ZM15.0463 2.14138L1.48564 7.56656L6.45857 10.7302L15.0474 2.14138H15.0463Z"
                                    fill="#C5BDBD"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </main>}
        </section>
    );
}//6F727A