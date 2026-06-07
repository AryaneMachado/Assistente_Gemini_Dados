import os
from dotenv import load_dotenv
import google.generativeai as generativeai
import pandas as pd
import numpy as np
import pickle

load_dotenv()

# Configuração da API do Gemini via arquivo .env
chave_secreta = os.environ.get('GEMINI_API_KEY', '')
if not chave_secreta:
    raise ValueError("A variável GEMINI_API_KEY não foi encontrada no arquivo .env.")

generativeai.configure(api_key=chave_secreta)

# Extraído planilha Google Sheets
id_planilha_nova = '1NvsIfMqt539NSN0p_w-x8T62i5JEJ17jzhrWLsAUGBA'
csv_url = f'https://docs.google.com/spreadsheets/d/{id_planilha_nova}/export?format=csv'

# Carrega os dados da planilha
df = pd.read_csv(csv_url)
print("Primeiras linhas da planilha carregada:")
print(df.head())

model = 'models/gemini-embedding-001'

def gerarEmbeddings(title, text):
    result = generativeai.embed_content(
        model=model,
        content=text,
        task_type="retrieval_document",
        title=title
    )
    return result['embedding']

def gerarBuscarConsulta(consulta, dataset):
    embedding_consulta = generativeai.embed_content(
        model=model,
        content=consulta,
        task_type="retrieval_query",
    )
    
    produtos_escalares = np.dot(np.stack(dataset["Embeddings"]), embedding_consulta['embedding'])
    indice = np.argmax(produtos_escalares)
    return dataset.iloc[indice]['Conteúdo']

# Processamento

print("\nGerando embeddings... Isso pode levar alguns segundos dependendo do tamanho da base.")
df["Embeddings"] = df.apply(lambda row: gerarEmbeddings(row["Titulo"], row["Conteúdo"]), axis=1)

print("\nDados processados com sucesso:")
print(df)

# Salvando o resultado processado
pickle.dump(df, open('datasetEmbeddings.pkl', 'wb'))
print("\nArquivo 'datasetEmbeddings.pkl' gerado com sucesso!")