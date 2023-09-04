FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000:3000

# for running the command in the runtime
CMD npm run dev




# docker run --name mathduels --rm  mathduels:v2 
# docker build -t mathduels:v2 .