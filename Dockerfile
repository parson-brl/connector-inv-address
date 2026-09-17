FROM beevelop/cordova:latest

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de mapeamento de dependências
COPY package*.json ./

RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copia o restante do código fonte
COPY . .

# Expõe as portas padrão do Quasar
EXPOSE 8080 8081

# Comando padrão ao iniciar o container
CMD ["/bin/bash"]