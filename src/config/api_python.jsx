import axios from "axios";

const getPythonData = async (query) => {
  try {
    // Aponta para a porta 5000 local onde seu Flask está rodando
    const response = await axios.post("http://127.0.0.1:5000/perguntar", {
      mensagem: query // Mapeia para a chave correta usada no back-end
    });

    console.log(response.data);
    
    // Retorna a resposta contendo o texto gerado pela API
    return response.data.resposta; 
  } catch (error) {
    console.error("Erro de conexão com o Flask:", error);
    return "Desculpe, ocorreu um erro ao processar sua pergunta.";
  }
};

export default getPythonData;