import { showErrorMessage } from "./message-box.js";

const token = window.sessionStorage.getItem("token");

export async function getWithAuth(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return await showErrorMessage();
    }
    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function deleteWithAuth(url) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return await showErrorMessage();
    }
    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function updateWithAuth(url, method, body) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body }),
    });
    if (!response.ok) {
      return await showErrorMessage();
    }
    return response;
  } catch (err) {
    console.error(err);
  }
}
