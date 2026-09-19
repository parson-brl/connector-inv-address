# Oxford App Connector Inv Aloc

Aplicativo web desenvolvido usando o Quasar framework (ou Quasar.js), um framework de código aberto baseado na biblioteca Vue.js

Para acessar, entre no site do Connector (http://192.168.0.63/connector/), clique na opção Home, depois o link aparecerá com o label "Alocação - Mobile Web" (http://192.168.0.63/connector/mobile/index.html#/)

Ele foi feito com o Quasar v0.14 (lançado em 2017). Nessa época, o CLI do Quasar não gerenciava o build. O projeto v0.14 na verdade é um projeto Webpack puro, onde o Quasar era apenas uma biblioteca de componentes instalada (note que ele usa quasar-framework e quasar-extras nas dependências, e não o pacote quasar).

Nesta versão antiga, você não deve usar o comando quasar dev, pois ele não vai funcionar de jeito nenhum.

Abaixo o passo a passo para criar um ambiente local usando o Docker, poder executar a aplicação localmente e testar via Web.

## Crie o arquivo Dockerfile na raiz do projeto

```bash
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
```

---

## Construa a Imagem Docker

```bash
docker build -t oxford-app-connector-inv-address .
```

## Inicie o Container em Modo Interativo

```bash
docker run -it --name oxford-app-connector-inv-address-rodando -p 8080:8080 -v "${PWD}:/app" oxford-app-connector-inv-address
```

Caso você só tenha saido do container com o comando exit e quiser voltar de novo para o container de onde parou use os comandos:

```bash
# 1. Inicie o container existente
docker start oxford-app-connector-inv-address-rodando

# 2. Conecte o seu terminal de forma interativa dentro dele
docker exec -it oxford-app-connector-inv-address-rodando sh
```

---

---

# Para rodar o app pelo browser para testar:

### No terminal do Docker (que ficou aberto no passo anterior) execute os comandos:

- 1. Defina o Node correto: O Quasar v0.14 e o Webpack 3 são muito antigos e costumam quebrar no Node 12. Recomendo forçar o Node 8 ou Node 10 (o Node 8 era o padrão em 2017):

```bash
npm install -g n
n 8.17.0
hash -r
```

- 2. Limpe e reinstale as dependências locais:

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

- 3. Inicie o servidor de desenvolvimento (Em vez de quasar dev, use o próprio script do projeto):

```bash
npm run dev
```

---

# Parar o container atual:

No terminal do seu Docker, aperte Ctrl + C para derrubar o servidor Quasar. Depois, digite exit para sair do container.

# Destruindo o Ambiente (Limpeza Total):

- Para parar e remover o container que foi executado:

```bash
docker rm -f oxford-app-connector-inv-address-rodando
```

- Para deletar a imagem de build (liberando espaço em disco):

```bash
docker rmi oxford-app-connector-inv-address
```

---
