# Build
FROM node:15.9.0-alpine3.10 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Run
FROM nginx:1.19.1
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/InternshipFe /usr/share/nginx/html
EXPOSE 80 443
