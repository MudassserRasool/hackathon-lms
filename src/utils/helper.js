import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
// const net = require('net');
import net from 'net';

// import os from 'os';
import mongoose from 'mongoose';
import path from 'path';
import winston from 'winston';
import { tokenExpirationDuration } from '../constants/index.js';
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    secure: true,
  });
}

const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
    expiresIn: tokenExpirationDuration,
  });
};

// const ipAddress = () => {
//   const networkInterfaces = os.networkInterfaces();
//   let ipAddress;

//   for (const interfaceName in networkInterfaces) {
//     const networks = networkInterfaces[interfaceName];

//     for (const network of networks) {
//       if (network.family === 'IPv4' && !network.internal) {
//         ipAddress = network.address;
//         break;
//       }
//     }
//     if (ipAddress) break;
//   }
//   return ipAddress;
// };

// Create Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join('logs', 'errors.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join('logs', 'requests.log'),
      level: 'info',
    }),
  ],
});

// utils/logger.js

const detailedLog = (title, ...details) => {
  const timestamp = new Date().toISOString();
  const separator = '-'.repeat(50);

  console.log(chalk.blueBright(`[${timestamp}]`)); // Timestamp
  console.log(
    chalk.greenBright(`---------- ${capitalizeFirstLetter(title)} ----------`)
  );
  details.forEach((detail, index) => {
    console.log(chalk.yellowBright(`Detail ${index + 1}:`), detail);
  });
  console.log(chalk.redBright(separator));
};

function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str; // return the string unchanged if it's not a string or is empty
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateChatId(userId1, userId2) {
  const chatIds = `${userId1}-${userId2}`.split('-');
  return chatIds.join('-');
}

function convertValidMongoId(id) {
  return mongoose.Types.ObjectId.createFromHexString(id);
}

function getAvailablePort(startPort = 4000, maxAttempts = 50) {
  return new Promise((resolve, reject) => {
    let port = startPort;
    let attempts = 0;

    const checkPort = (portToCheck) => {
      const server = net.createServer();

      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          attempts++;
          if (attempts >= maxAttempts) {
            reject(
              new Error(
                `No available port found after ${maxAttempts} attempts.`
              )
            );
          } else {
            port++;
            checkPort(port);
          }
        } else {
          reject(err);
        }
      });

      server.once('listening', () => {
        server.close(() => resolve(portToCheck));
      });

      server.listen(portToCheck);
    };

    checkPort(port);
  });
}

export {
  capitalizeFirstLetter,
  convertValidMongoId,
  createTransporter,
  detailedLog,
  generateToken,
  getAvailablePort,
  logger,
};
