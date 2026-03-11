// SIGNUP FORM

const signupForm = document.querySelector("#signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const phone = document.querySelector("#phone").value;
    const password = document.querySelector("#password").value;

    try {

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password
        })
      });

      const data = await response.json();

      alert(data.message);

      if (data.message === "Signup successful") {
        window.location.href = "login.html";
      }

    } catch (error) {
      console.log(error);
    }

  });
}


// LOGIN FORM

const loginForm = document.querySelector("#loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const loginInput = document.querySelector("#loginInput").value;
    const password = document.querySelector("#loginPassword").value;

    try {

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          loginInput,
          password
        })
      });

      const data = await response.json();

if (data.token) {

  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("email", loginInput);
  console.log("Saved userId:", data.userId);

  alert("Login Successful");

  window.location.href = "index.html";

} else {

  alert(data.message);

}

    } catch (error) {
      console.log(error);
    }

  });

}