import router from '../index';

enum METHODS {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

type Headers = { [key: string]: string };

interface Options {
  method?: string;
  data?: any;
  headers?: Headers;
  timeout?: number;
}

const serverErrorStatusRegex = /5\d{2}/;
const successStatusRegex = /2\d{2}/;

export class HTTPTransport {
  constructor(private baseURL: string) {}

  interceptResponse = (res: XMLHttpRequest) => {
    const { status, response } = res;
    if (serverErrorStatusRegex.test(status.toString())) {
      router.go('/500');
    }
    if (status === 401 || status === 403) {
      router.go('/login');
      return Promise.reject(res);
    } else if (!successStatusRegex.test(status.toString())) {
      return Promise.reject(res);
    } else {
      let data;
      try {
        data = JSON.parse(response);
      } catch {
        data = response;
      }

      return { data, status };
    }
  };

  interceptError = (error: XMLHttpRequest) => {
    let errorData: string | { status: number; response: string } = 'Error occurred';
    if (error && error.status && error.response) {
      const { status, response } = error;
      errorData = { status, response: JSON.parse(response) };
    }
    return Promise.reject(errorData);
  };

  get = (url: string, options: Options = {}) => {
    return this.request(`${this.baseURL}${url}`, { ...options, method: METHODS.GET }, options.timeout)
      .then(this.interceptResponse)
      .catch(this.interceptError);
  };

  put = (url: string, options: Options = {}) => {
    return this.request(`${this.baseURL}${url}`, { ...options, method: METHODS.PUT }, options.timeout)
      .then(this.interceptResponse)
      .catch(this.interceptError);
  };

  post = (url: string, options: Options = {}) => {
    return this.request(`${this.baseURL}${url}`, { ...options, method: METHODS.POST }, options.timeout)
      .then(this.interceptResponse)
      .catch(this.interceptError);
  };

  delete = (url: string, options: Options = {}) => {
    return this.request(`${this.baseURL}${url}`, { ...options, method: METHODS.DELETE }, options.timeout)
      .then(this.interceptResponse)
      .catch(this.interceptError);
  };

  queryStringify = (data: { [key: string]: string } | null): string => {
    if (!data) {
      return '';
    }
    const query = Object.keys(data).reduce((acc: string[], param: string) => {
      return [...acc, `${param}=${data[param]}`];
    }, []);
    return `/?${query.join('&')}`;
  };

  setHeaders = (xhr: XMLHttpRequest, headers: Headers): void => {
    xhr.setRequestHeader('SameSite', 'none');
    Object.entries(headers).forEach(header => {
      const [key, value] = header;
      xhr.setRequestHeader(key, value);
    });
  };

  request = (url: string, options: Options, timeout = 5000): Promise<XMLHttpRequest> => {
    const { method, data } = options;

    return new Promise<XMLHttpRequest>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      if (method != null) {
        xhr.open(method, method === METHODS.GET ? `${url}${this.queryStringify(data)}` : url);
      }

      xhr.onload = function () {
        resolve(xhr);
      };
      xhr.timeout = timeout;

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;
      xhr.withCredentials = true;

      if (options.headers) {
        this.setHeaders(xhr, options.headers);
      }

      if (data) {
        xhr.send(data);
      } else {
        xhr.send();
      }
    });
  };
}

export const API = new HTTPTransport('https://ya-praktikum.tech/api/v2');
