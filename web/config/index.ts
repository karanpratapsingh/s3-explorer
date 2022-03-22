const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  name: 'S3 Browser',
  apiURL: isDevelopment ? '' : 'http://localhost:8080',
};

export default config;
