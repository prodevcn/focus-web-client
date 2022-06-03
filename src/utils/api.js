import axios from "axios";
import { isValidText } from "./validations";
//const BASE_URL = process.env.REACT_APP_API;
const BASE_URL = `${process.env.REACT_APP_API}/`;

function handleResponse(response) {
  try {
    if (!response.data.error) {
      return response.data;
    }
    const result = response.data.error.message;
    if (isValidText(result, true)) {
      let message = result.replace("Error: ", "");
      if (message.includes("jwt malformed")) {
        message = "Your credentials were not registered in system.";
      }
      if (message.includes("jwt expired")) {
        message = "Your credentials has been expired.";
      }
      return {
        success: false,
        error: message,
        errorCode: response.data.error.code,
      };
    }
    const { msg, param, value } = response.data.error.errors[0];
    return {
      success: false,
      param: param,
      error: msg,
      errorCode: response.data.error.code,
      errorValue: value,
    };
  } catch (error) {
    console.log(error);
  }
  return response.data;
}

function parseError(error, placeholder = "Something went wrong") {
  if (error.isAxiosError) {
    return placeholder;
  }

  if (error.message && error.message !== "") {
    return error.message;
  }

  const { msg, param } = error.errors[0];
  return msg;
}

function createConfiguration() {
  const defaultCorsHeaders = {
    "x-Trigger": "CORS",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, Content-Type, X-Auth-Token, Authorization",
  };

  const headers = {
    ...axios.defaults.headers,
    ...defaultCorsHeaders,
  };
  return {
    ...axios.defaults,
    headers: headers,
  };
}

async function get(path, param = undefined) {
  let query = "";
  if (param) {
    query = "?";
    let keys = Object.keys(param);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      query += `${key}=${encodeURIComponent(param[key])}`;
      if (i < keys.length - 1) {
        query += "&";
      }
    }
  }

  try {
    const requestPath = BASE_URL + path + query;
    console.log(requestPath);
    const response = await axios.get(requestPath, createConfiguration());
    return handleResponse(response);
  } catch (error) {
    console.log(error);
    // if (error.response && error.response.status === 401) {
    // 	return await get(path, param)
    // }

    // throw error
  }
}

async function post(path, param = undefined) {
  try {
    const response = await axios.post(
      BASE_URL + path,
      param,
      createConfiguration()
    );
    return handleResponse(response);
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      return await post(path, param);
    }

    throw error;
  }
}

export function objectToGetParams(obj) {
  const params = Object.entries(obj)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    );

  return params.length > 0 ? `?${params.join("&")}` : "";
}

export function onSuccess(type, response = undefined) {
  return { type: type, response: response };
}

export function onFailure(type, error) {
  return { type: type, error: error };
}

const Api = {
  get,
  post,
  parseError,
  onSuccess,
  onFailure,
  objectToGetParams,
};
export default Api;
