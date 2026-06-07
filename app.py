from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import os
import google.generativeai as generativeai
from dotenv import load_dotenv

# Importando as funções do arquivo que criamos
from geminiFunctions import gerarBuscarConsulta, melhorarResposta

load_dotenv()

app = Flask(__name__)
CORS(app)

# Garante a configuração na inicialização do Flask também
chave_secreta = os.getenv('GEMINI_API_KEY')
generativeai.configure(api_key=chave_secreta)

with open('datasetEmbeddings.pkl', 'rb') as f:
    modeloEmbeddings = pickle.load(f)

# @app.route("/")
# def home():
#     consulta = "O que faz um engenheiro de dados?"
#     resposta = gerarBuscarConsulta(consulta, modeloEmbeddings)
#     prompt = f"Consulta: {consulta} Resposta: {resposta}"
    
#     response = melhorarResposta(prompt)
#     return response

@app.route("/")
def home():
    return jsonify({
        "status": "online",
        "mensagem": "Back-end do Assistente de Dados rodando com sucesso no Render!"
    }), 200

@app.route('/perguntar', methods=['POST'])
def perguntar():
    dados = request.get_json()
    
    if not dados or 'mensagem' not in dados:
        return jsonify({"erro": "O campo 'mensagem' é obrigatório."}), 400
    
    pergunta_usuario = dados['mensagem']
    
    try:
        conteudo_recuperado = gerarBuscarConsulta(pergunta_usuario, modeloEmbeddings)
        
        prompt_rag = f"Consulta: {pergunta_usuario} Resposta: {conteudo_recuperado}"
        
        resposta_final = melhorarResposta(prompt_rag)
        
        return jsonify({"resposta": resposta_final}), 200
        
    except Exception as e:
        return jsonify({"erro": f"Erro interno ao processar: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)