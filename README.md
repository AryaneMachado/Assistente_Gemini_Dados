# 📊 Assistente de Carreiras e Mercado de Dados (RAG + Gemini)

Este é um sistema inteligente de busca semântica e resposta estruturada baseado na arquitetura **RAG (Retrieval-Augmented Generation)**. O objetivo principal do projeto é atuar como um assistente especializado para tirar dúvidas sobre o mercado de dados, mapeando papéis (Engenharia, Ciência, Análise de Dados e MLOps), competências técnicas (Hard Skills), habilidades comportamentais (Soft Skills) e infraestrutura tecnológica moderna.

O projeto integra uma interface reativa em **React (Vite)** a um back-end escalável em **Python (Flask)**, utilizando os embeddings da API do **Google Gemini** para indexar e pesquisar uma base de conhecimento personalizada com 40 registros especializados vindos do Google Sheets.

---

## 🛠️ Arquitetura e Tecnologias

A aplicação divide-se em três camadas principais:

### 1. Front-end (Interface do Utilizador)
* **React.js (Vite):** Framework ágil para componentização e renderização reativa da interface.
* **Axios:** Cliente HTTP para comunicação assíncrona com a API do Flask.
* **CSS3 Modular:** Estilização customizada e minimalista baseada numa paleta neutra de tons cinza e rosa (*minimal rose gold*), com um gradiente suave no background, suporte a animações de carregamento (*loaders*) e estados de transição.

### 2. Back-end (Processamento e Integração)
* **Python 3:** Linguagem base para manipulação dos modelos de IA e dados.
* **Flask / Flask-CORS:** Microframework para criação das rotas da API (`/perguntar`) e controlo de acessos cruzados entre domínios (CORS).
* **Pandas & NumPy:** Manipulação e leitura da base de dados, além do cálculo matemático de similaridade por produto escalar (busca vetorial).
* **Google Generative AI:** Utilização do modelo `models/gemini-embedding-001` para geração de vetores e do `gemini-2.5-flash` com instruções de sistema severas para síntese de respostas sem alucinações.

### 3. Pipeline de Dados (Camada RAG)
* **Extração:** Consumo de dados estruturados (Colunas `titulo` e `conteudo`) de uma base especializada de 40 registros.
* **Vetorização:** Codificação de textos em vetores matemáticos de alta dimensão armazenados localmente num arquivo serializado binário (`datasetEmbeddings.pkl`).

---

## ☁️ Estrutura de Deploy em Produção (Render)

Embora o código esteja unificado em um único repositório do GitHub, a infraestrutura foi distribuída no painel do **Render** em dois serviços independentes que cooperam de forma assíncrona:

### 🐍 1. O Back-end (Web Service)
Responsável por processar a lógica do RAG, carregar a matriz vetorial e se comunicar com os servidores do Google AI Studio.
* **Runtime:** Python
* **Build Command:** `pip install -r requirements.txt && pip install gunicorn && python gerarEmbeddings.py`
* **Start Command:** `gunicorn app:app`
* **Variáveis de Ambiente (Configuração Oculta e Segura):**
  * `PYTHON_VERSION`: `3.11.10` (Garante estabilidade dos SDKs de IA).
  * `GEMINI_API_KEY`: *(Chave privada e protegida do Google AI Studio)*.

### ⚛️ 2. O Front-end (Static Site)
Responsável por renderizar a interface visual do chat para o usuário diretamente pelo navegador.
* **Build Command:** `npm install && npm run build`
* **Publish Directory:** `dist`
* **Start Command:** *(Vazio / Gerenciado automaticamente como site estático)*.
* **Redirects/Rewrites:** Configurada a regra de captura `/* -> /index.html` (Action: Rewrite) para garantir a integridade de rotas da SPA (Single Page Application).

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) instalado.
* [Python 3.11.x](https://www.python.org/) instalado.
* Uma chave de API ativa do Google AI Studio (`GEMINI_API_KEY`).

### Passo 1: Configurar o Back-end
1. Ative o seu ambiente virtual (`venv`):
   * **Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`
   * **Linux/macOS ou Git Bash:** `source venv/Scripts/activate`
2. Certifique-se de ter as dependências instaladas: `pip install -r requirements.txt`
3. Configure seu arquivo `.env` local com a sua `GEMINI_API_KEY`.
4. Processe a planilha e gere a matriz inicial: `python gerarEmbeddings.py`
5. Inicialize o servidor local: `python app.py`

### Passo 2: Configurar o Front-end
1. Em um novo terminal, instale os módulos do Node: `npm install`
2. Inicialize o ecossistema do Vite: `npm run dev`

---

## 📁 Estrutura Essencial do Repositório

```text
├── src/
│   ├── assets/          # Centralizador de imagens e ícones visuais (code, bulb, compass, send)
│   ├── components/
│   │   ├── Sidebar/     # Menu lateral de contexto da aplicação
│   │   └── Main/        # Interface do chat principal, tratamento de tags HTML e estilização CSS
│   ├── config/
│   │   └── api_python.jsx # Arquivo de integração via Axios apontando para a rota do Render
│   ├── App.jsx          # Componente raiz do ecossistema React
│   └── main.jsx         # Ponto de entrada oficial do compilador Vite
├── app.py               # Servidor Flask contendo as rotas HTTP e inicialização do servidor
├── geminiFunctions.py   # Lógica estrutural do RAG: cálculo de distância semântica e prompt contextualizado
├── gerarEmbeddings.py   # Script local/nuvem para extração do Sheets e gravação de vetores em .pkl
├── .gitignore           # Bloqueio de subida de arquivos locais pesados ou confidenciais (.env, .pkl, venv)
├── package.json         # Dependências, scripts e metadados do ambiente Node
└── requirements.txt     # Mapeamento de dependências para o ecossistema Python no Render