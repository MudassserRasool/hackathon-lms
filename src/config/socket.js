import http from 'http';

const initializeSocketIo = (app) => {
  const server = http.createServer(app);

  return { server };
};

export default initializeSocketIo;
