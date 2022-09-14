const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  name: 'S3 Explorer',
  apiURL: isDevelopment ? '' : 'http://localhost:8080',
};

export default config;
