FROM node:20

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Installer les dépendances de l'application
COPY package*.json ./
RUN npm install

# Exposer le port que votre application utilise
EXPOSE 3000

CMD ["npm", "start"]
