import axios from "axios";

const TIMEOUT = 20000;

const request = axios.create({
  timeout: TIMEOUT,
});

export { request };
