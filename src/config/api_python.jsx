import axios from "axios";

const getPythonData = async (query) => {
  try {
    const response = await axios.post("https://assistente-gemini-dados.onrender.com/perguntar", {
      mensagem: query 
    });

    console.log(response.data);
    
    // Retorna o campo correto da resposta do Flask
    return response.data.resposta; 
  } catch (error) {
    console.error("Erro de conexão com o Render:", error);
    return "Desculpe, ocorreu um erro ao processar sua pergunta com o servidor remoto.";
  }
};

export default getPythonData;