# build environment
FROM node:16 as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci --silent

# Accept build arguments for secrets
ARG API_URL
ARG API_KEY

# Set environment variables for build
ENV API_URL=$API_URL
ENV API_KEY=$API_KEY

COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]