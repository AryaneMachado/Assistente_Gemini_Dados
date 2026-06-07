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

# --- ROTA HOME (Pedida no novo roteiro) ---
@app.route("/")
def home():
    consulta = "O que faz um engenheiro de dados?"  # Alterado para testar o RAG com dados reais!
    resposta = gerarBuscarConsulta(consulta, modeloEmbeddings)
    prompt = f"Consulta: {consulta} Resposta: {resposta}"
    
    response = melhorarResposta(prompt)
    return response

# --- ROTA DA API (Para receber perguntas dinâmicas do front-end) ---
@app.route('/perguntar', methods=['POST'])
def perguntar():
    dados = request.get_json()
    
    if not dados or 'mensagem' not in dados:
        return jsonify({"erro": "O campo 'mensagem' é obrigatório."}), 400
    
    pergunta_usuario = dados['mensagem']
    
    try:
        # 1. Busca o contexto na planilha
        conteudo_recuperado = gerarBuscarConsulta(pergunta_usuario, modeloEmbeddings)
        
        # 2. Junta a pergunta com o contexto para o RAG
        prompt_rag = f"Consulta: {pergunta_usuario} Resposta: {conteudo_recuperado}"
        
        # 3. Melhora a resposta com o modelo generativo
        resposta_final = melhorarResposta(prompt_rag)
        
        return jsonify({"resposta": resposta_final}), 200
        
    except Exception as e:
        return jsonify({"erro": f"Erro interno ao processar: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)