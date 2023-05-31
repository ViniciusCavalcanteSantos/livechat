import {useLocation} from "react-router-dom";
import "./Chat.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

import bg from "../assets/bg-entrar.svg";

export const Chat = () => {
    const friendsFakeData = [
        {
            username: "Adalberta",
            perfil: "https://img.freepik.com/fotos-gratis/retrato-de-uma-jovem-bonita-em-pe-na-parede-cinza_231208-10760.jpg?w=1380&t=st=1685559700~exp=1685560300~hmac=b8d4ac8d1c010d9c74cecd6bc60e8f9a4218685eda10091fd7e3c79a2de98f43"
        },
        {
            username: "Larissa",
            perfil: "https://img.freepik.com/fotos-gratis/jovem-linda-anda-pela-cidade-na-europa-foto-de-rua-mulher-posando-no-centro-da-cidade_1321-4297.jpg?w=740&t=st=1685559850~exp=1685560450~hmac=9092d7388a943cccad1fd92fa7c5bf9c28884b455aae59352b4c8461e9283db8"
        },
        {
            username: "Alberto",
            perfil: "https://img.freepik.com/fotos-gratis/homem-bonito-e-confiante-sorrindo-com-as-maos-cruzadas-no-peito_176420-18743.jpg?w=1380&t=st=1685559854~exp=1685560454~hmac=8a37de461abab57f13a4ace38857ee8b7612511e082b51bfc9aef962d2689aa0"
        },
        {
            username: "Patricia",
            perfil: "https://img.freepik.com/fotos-gratis/menina-alegre-negocios-encaracolados-usando-oculos_176420-206.jpg?w=1380&t=st=1685559959~exp=1685560559~hmac=de5c226eae0f243e502469a9f0520d2edda571ab99d8a8ae06b7f121b2b604a5"
        },
        {
            username: "Ana e João",
            perfil: "https://img.freepik.com/fotos-gratis/homem-e-mulher-elegantes-posando-juntos_273609-21827.jpg?w=1380&t=st=1685560011~exp=1685560611~hmac=3fa462608f278a89951aa1b65fcd3b0fdf655ccc11a1b51f2783576e6be64d7e"
        },
    ];

    const friends = friendsFakeData.map((friend) => {
        return (
            <li key={friend.username} className="friend">
                <figure>
                    <img
                        src={friend.perfil}
                        alt="Foto de perfil"/>
                </figure>
                <div className="info">
                    <h4>{friend.username} <span>27 mar</span></h4>
                    <p>Hi, David. Hope you’re doing....</p>
                </div>
            </li>
        );
    })
    return (
        <section className="background-fullscreen-chat">
            <aside>
                <h2 className="title">Chat</h2>
                <label className="input-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>

                    <input type="text" placeholder="Pesquise aqui"/>
                </label>

                <h2 className="title">Mensagens</h2>
                <h3 className="subtitle">Chat recente</h3>

                <ul className="friends">
                    {friends}
                </ul>
            </aside>

            <main>

            </main>
        </section>
    );
}//6F727A