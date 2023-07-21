import "./Chat.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import {useContext, useEffect} from "react";
import GlobalContext from "../helpers/globalContext";

export const Chat = () => {
    const context = useContext(GlobalContext);

    useEffect(() => {
        const socket = context.socket;
        socket.emit("getContacts", (contacts) => {
            console.log(contacts)
        });
    }, [context.socket])

    const friendsFakeData = [
        {
            username: "Adalberta",
            perfil: "https://img.freepik.com/fotos-gratis/retrato-de-uma-jovem-bonita-em-pe-na-parede-cinza_231208-10760.jpg?w=1380&t=st=1685559700~exp=1685560300~hmac=b8d4ac8d1c010d9c74cecd6bc60e8f9a4218685eda10091fd7e3c79a2de98f43"
        },
    ];
    const friends = friendsFakeData.map((friend) => {
        return (
            <li key={friend.username} className="friend">
                <div className="container">
                    <figure>
                        <img
                            src={friend.perfil}
                            alt="Foto de perfil"/>
                    </figure>
                    <div className="info">
                        <h4>{friend.username} <span>27 mar</span></h4>
                        <p>Hi, David. Hope you’re doing....</p>
                    </div>
                </div>
            </li>
        );
    })
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
                    {friends}
                </ul>
            </aside>

            <main>

            </main>
        </section>
    );
}//6F727A