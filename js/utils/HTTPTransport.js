import router from "../index";

const METHODS = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE",
};

const serverErrorStatusRegex = /5\d{2}/;
const successStatusRegex = /2\d{2}/;

class HTTPTransport {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  interceptResponse = (res) => {
    const { status, response } = res;
    if (serverErrorStatusRegex.test(status.toString())) {
      router.go("/500");
    }
    if (status === 401 || status === 403) {
      router.go("/login");
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

  interceptError = (error) => {
    let errorData = "Error occurred";
    if (error && error.status && error.response) {
      const { status, response } = error;
      errorData = { status, response: JSON.parse(response) };
    }
    return Promise.reject(errorData);
  };

  get = (url, options = {}) => {
    return this.request(
      `${this.baseURL}${url}`,
      { ...options, method: METHODS.GET },
      options.timeout
    )
      .then(this.interceptResponse)
      .catch(this.interceptError);
  };

  put = (url, options = {}) => {
    return this.request(
      `${this.baseURL}${url}`,
      { ...options, method: METHODS.PUT },
      options.timeout
    )
      .then(this.interceptResponse)
      .catch(this.interceptError);
  };

  post = (url, options = {}) => {
    return this.request(
      `${this.baseURL}${url}`,
      { ...options, method: METHODS.POST },
      options.timeout
    )
      .then(this.interceptResponse)
      .catch(this.interceptError);
  };

  delete = (url, options = {}) => {
    return this.request(
      `${this.baseURL}${url}`,
      { ...options, method: METHODS.DELETE },
      options.timeout
    )
      .then(this.interceptResponse)
      .catch(this.interceptError);
  };

  queryStringify = (data) => {
    if (!data) {
      return "";
    }
    const query = Object.keys(data).reduce((acc, param) => {
      return [...acc, `${param}=${data[param]}`];
    }, []);
    return `/?${query.join("&")}`;
  };

  setHeaders = (xhr, headers) => {
    Object.entries(headers).forEach((header) => {
      const [key, value] = header;
      xhr.setRequestHeader(key, value);
    });
  };

  request = (url, options, timeout = 5000) => {
    const { method, data } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        method,
        method === METHODS.GET ? `${url}${this.queryStringify(data)}` : url
      );

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

export const API = new HTTPTransport("https://ya-praktikum.tech/api/v2");
