export const baseUrl = import.meta.env.VITE_SERVER_URL + "api";

export const postRequest = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  })

  const data = await response.json();
  if (!response.ok) {
    let message = data?.message || data;

    return { error: true, message };
  }

  return data;
}

export const putRequest = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body
  })

  const data = await response.json();
  if (!response.ok) {
    let message = data?.message || data;

    return { error: true, message };
  }

  return data;
}

export const deleteRequest = async (url: string) => {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const data = await response.json();
  if (!response.ok) {
    let message = data?.message || data;

    return { error: true, message };
  }

  return data;
}

export const getRequest = async (url: string) => {
  const response = await fetch(url);

  const data = await response.json();
  if (!response.ok) {
    let message = data?.message || data;

    return { error: true, message };
  }

  return data;
}