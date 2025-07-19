# Usa imagem oficial do Node
FROM node:18

# Cria diretório dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Expõe a porta (opcional)
EXPOSE 5000

# Comando para iniciar o app
CMD ["npm", "start"]
