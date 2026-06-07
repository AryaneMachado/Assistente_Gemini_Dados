import React, { useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import getPythonData from "../../config/api_python"; // Importando do seu arquivo correto!

const Main = () => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // Função para limpar o chat e resetar a tela
    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setInput("");
    };

    // Função que consome a API do Python
    const onSentApi = async (promptValue) => {
        const query = promptValue || input;
        
        if (!query.trim()) return;

        setResultData("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(query);

        // Invoca a busca semântica + RAG
        const response = await getPythonData(query);

        // Tratamento de negrito (transforma os asteriscos ** em tags html <b>)
        let responseArray = response.split("**");
        let formatedResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 === 0) {
                formatedResponse += responseArray[i];
            } else {
                formatedResponse += "<b>" + responseArray[i] + "</b>";
            }
        }

        // Corrige quebras de linha normais para HTML
        let finalResponse = formatedResponse.replace(/\n/g, "<br />");
        
        setResultData(finalResponse);
        setLoading(false);
        setInput("");
    };

    // Monitora os cliques nos cards de sugestões rápidas
    const handleCardClick = (text) => {
        onSentApi(text);
    };

    // Envia o prompt ao apertar Enter no teclado
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSentApi();
        }
    };

    return (
        <div className="main">
            <div className="nav">
                {/* Permite clicar no título do topo para limpar a conversa */}
                <p onClick={() => newChat()}>Assistente API Gemini</p>
                <img src={assets.usuario_foto} alt="" />
            </div>
            
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Olá! Sou seu Assistente focado em Dados.</span></p>
                            <p>O que você gostaria de entender hoje?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => handleCardClick('O que faz um engenheiro de dados?')}>
                                <p>O que faz um engenheiro de dados e quais suas hard skills?</p>
                                <img src={assets.dado_foto} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick('Explique o conceito de Cultura Data-Driven')}>
                                <p>Explique o conceito e a importância de uma Cultura Data-Driven.</p>
                                <img src={assets.robo2_foto} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick('Qual a diferença entre Cientista de Dados e Analista de BI?')}>
                                <p>Qual a diferença entre um Cientista de Dados e um Analista de BI?</p>
                                <img src={assets.dado_foto} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick('O que é Big Data e computação em nuvem?')}>
                                <p>Descubra o conceito de Big Data e a evolução do mercado na nuvem.</p>
                                <img src={assets.robo2_foto} alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="result">
                        <div className="result-title">
                            <img src={assets.robo_foto} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading ? (
                                <div className="loader">
                                    <hr /><hr /><hr />
                                </div>
                            ) : (
                                /* Correção do dangerouslySetInnerHTML do roteiro do PDF */
                                <p dangerouslySetInnerHTML={{ __html: resultData }} />
                            )}
                        </div>
                    </div>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            value={input}
                            type="text"
                            placeholder="Entre com sua pergunta aqui"
                        />
                        <div>
                            <img onClick={() => onSentApi()} src={assets.send_icon} alt="" />
                        </div>
                    </div>
                    <p className="bottom-info">
                        Assistente API Gemini • Base de Conhecimento focada em Mercado, Papéis e Competências na Área de Dados (RAG).
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Main;