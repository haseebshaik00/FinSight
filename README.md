# FinSight

A Smart Visual Analytics Platform for Personal Finance Tracking &amp; Goal-Oriented Investment Planning

## Description

FinSight is an intelligent personal finance platform that helps users track expenses, analyze spending habits, and visualize financial trends through intuitive and interactive dashboards. Beyond expense tracking, it leverages machine learning and real-time asset data to forecast savings and generate personalized investment plans.

By incorporating user risk profiles and market performance, FinSight delivers dynamic, monthly asset allocations across stocks, mutual funds, bonds, crypto, and gold—empowering users to make informed decisions and achieve long-term financial goals with confidence.

## Application Setup

### [0] Clone the repository
```shell
git clone https://github.com/haseebshaik00/FinSight.git
```

### [1] Environment Setup
- Navigate to the root folder: `FinSight/`
- This folder contains three folders: client, server and ml-engine
- Setup up your enviroment using miniconda (optional)

```shell
conda create -n finsight python=3.12
conda activate finsight
```

### [2] Node Server Setup
- Navigate to the folder `./FinSight/server`
- Create a .env file in the server folder and place the below content in it:
```shell
MONGO_URI=mongodb+srv://finsight123:finsight123@finsight-cluster.xi4is99.mongodb.net/finsightDB?retryWrites=true&w=majority
JWT_SECRET=myjwtsecret
```
- Install the required packages and boot the server
```shell
npm install
npm run dev
```

### [3] Fast API Server Setup
- Navigate to the folder `./FinSight/ml-engine`
- Install the required packages
```shell
pip install -r requirements.txt
```
- Finally, start your Fast API server:
```shell
uvicorn api:app --reload --port 8000
```

### [4] Client Setup

- Navigate to the folder `./FinSight/client`
- Install the required packages and start the client
```shell
npm install
npm run dev
```

## Application Walkthrough

## Expense Dashboard

![alt text](image.png)

## Savings and Forecasted Savings Dashboard
![alt text](image-2.png)

## Investment Plan Dashboard
![alt text](image-1.png)

## Folder Structure

```bash
FinSight/
├──ml-engine
├──client
├──server
    ├── node_modules/                       # Installed npm packages
    ├── src/                                # Application source code
    │   ├── config/                         # Configuration files (e.g., database, environment) / MongoDB configuration
    │   │   ├── db.js
    │   │   └── appConfig.js
    │   ├── controllers(or)components/      # Application controllers (handling requests)
    │   │   └── userController.js
    │   ├── models/                         # Database models (e.g., Mongoose, Sequelize) / Mongoose schemas
    │   │   └── userModel.js
    │   ├── routes/                         # Route definitions / Express Routes definitions
    │   │   └── userRoutes.js
    │   ├── services/                       # Business logic/services
    │   │   └── userService.js
    │   ├── middleware/                     # Custom middleware
    │   │   └── authMiddleware.js
    │   ├── utils(or)helpers/               # Utility functions/helpers
    │   │   └── logger.js
    │   ├── app.js                          # Main application setup
    │   └── server.js                       # Entry point for starting the server
    ├── tests/                              # Unit and integration tests
    │   └── userController.test.js
    ├── public/                             # Static assets (images, stylesheets, etc.)
    ├── views/                              # Templates (if using a templating engine like EJS, Pug, HBS)
    ├── .env                                # Environment variables    
    ├── package.json                        # NPM dependencies and scripts
    └── package-lock.json                   # Dependency tree lock file 
├──.gitignore                               # Git ignore file
└── README.md                               # Project documentation
```
