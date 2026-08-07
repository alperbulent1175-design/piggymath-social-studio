FROM node:20-alpine

# Install fontconfig and standard ttf fonts for crisp text rendering in resvg
RUN apk add --no-cache fontconfig ttf-dejavu ttf-droid ttf-freefont ttf-liberation

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 4000

ENV NODE_ENV=production

CMD ["npm", "start"]
