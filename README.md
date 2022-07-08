<p align="center"><img style="width: 100px; height: 100px;" width=60% src="https://i.postimg.cc/dtjMj8S0/165718081026287107.png"></p>
<h1 align="center">
    Pengist
</h1>

<div style="margin-top=10px" align="center">
    <img src="https://img.shields.io/badge/Node.js-16.15.1-%23009933">
    <img src="https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg">
    <img src="https://img.shields.io/github/issues/Atsukoro1/simpleanilist.svg">
    <img src="https://img.shields.io/badge/contributions-welcome-orange.svg">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg">
</div>

## Basic Overview
Pengist is a platform for all anime lovers, manage completed or currently watching anime and explore more!

## Running backend
### Requirements for installation
- Node.js (version 16.15.1)
- Yarn package manager (install with npm install --location=global yarn)
- Docker
- Docker-compose
- Redis, Mongo and elasticsearch Docker images (pull images with "docker pull <imagename>")

### Installation process
Cd into the backend directory and install all dependencies with yarn
```bash
cd backend
yarn install 
```

Next, fill out the dotenv file like that, the keys are pretty self-describing
```env
DB_PORT=
REDIS_PORT=
DB_NAME=
JWT_SECRET=
DB_USERNAME=
DB_PASSWORD=
ORIGIN=
ELASTIC_PORT=
```

Create new Docker volumes
```bash
docker-compose up
```

## Start production or development process and the backend is running
```bash
yarn run start:dev
yarn run start:prod
```

# Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.
