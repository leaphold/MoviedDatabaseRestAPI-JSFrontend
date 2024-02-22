const REGISTER_URL = "https://localhost:7002/register";
const LOGIN_URL = "https://localhost:7002/login";

async function login(email, password) {
    const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Invalid email or password");


    }
    const data = await response.json();
    localStorage.setItem('token', data.accessToken); // Store the access token
    return data.accessToken;
}

async function registerUser(email, password) {
  const response = await fetch(REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = response.headers.get("Content-Length") === "0" ? {} : await response.json();
    console.log(data);
    return data;
  } else {
    const errorData = await response.json();
    console.error("Error creating account", errorData);
    throw new Error(errorData.message || "Failed to create an account");
  }
}

function logout() {
  localStorage.removeItem('token'); // Clear the token
  window.location.href = './index.html'; // Redirect to login page
}

export { login, registerUser, logout };
