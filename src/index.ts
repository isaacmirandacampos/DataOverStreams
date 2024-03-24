import App from './App';

const app = new App();
app.mountRoutes();
if (require.main === module) {
  try {
    const serverPort = 5000;
    app.server.listen({ host: '0.0.0.0', port: serverPort }, () => {
      console.info(`Server listening on port:: ${serverPort}`);
    });
  } catch (error: any) {
    console.error('Error on initialize the server::', error);
    process.exit(1);
  }
}
