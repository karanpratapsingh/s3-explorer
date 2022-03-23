import config from '../config';

type Method = 'GET' | 'POST';

export async function http<R, B = undefined>(
  path: string,
  method: Method = 'GET',
  body?: B,
): Promise<R> {
  const options = {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const url = `${config.apiURL}${path}`;

  return fetch(url, options).then(res => res.json());
}
