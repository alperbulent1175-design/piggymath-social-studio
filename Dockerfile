FROM node:20-alpine

# Install fontconfig and standard ttf fonts for crisp text rendering in resvg
RUN apk add --no-cache fontconfig ttf-dejavu ttf-droid ttf-freefont ttf-liberation

WORKDIR /app

# Set before install so the image is built the same way a production install
# would be. Safe now that express/cors/node-cron are real dependencies rather
# than devDependencies — previously this line had to sit AFTER `npm install`
# or the server crashed at boot with MODULE_NOT_FOUND.
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .
# Vite is a devDependency, so install it just for the build, then drop it.
RUN npm install --include=dev && npm run build && npm prune --omit=dev

EXPOSE 4000

CMD ["npm", "start"]
