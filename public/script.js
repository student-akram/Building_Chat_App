/* =========================
   SIGNUP
========================= */

const signupForm = document.querySelector("#signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim().toLowerCase();
        const phone = document.querySelector("#phone").value.trim();
        const password = document.querySelector("#password").value.trim();

        try {

            const response = await fetch("/api/auth/signup", {
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

            if (response.ok) {

                alert(data.message);

                if (data.message === "Signup successful") {
                    window.location.href = "login.html";
                }

            } else {

                alert(
                    data.error ||
                    data.message ||
                    "Signup failed"
                );

            }

        } catch (err) {

            console.error("Signup error:", err);

            alert(
                "Unable to connect to the server. Please try again."
            );

        }

    });

}


/* =========================
   LOGIN
========================= */

const loginForm = document.querySelector("#loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const loginInput = document
            .getElementById("loginInput")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("loginPassword")
            .value
            .trim();

        try {

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    loginInput,
                    password
                })
            });

            const data = await res.json();

            if (data.token) {

                /* =========================
                   CLEAR OLD SESSION
                ========================= */

                sessionStorage.clear();


                /* =========================
                   SAVE LOGIN DATA
                ========================= */

                sessionStorage.setItem(
                    "token",
                    data.token
                );

                sessionStorage.setItem(
                    "userId",
                    data.userId
                );

                sessionStorage.setItem(
                    "email",
                    data.email
                );


                console.log(
                    "Logged userId:",
                    data.userId
                );

                console.log(
                    "Logged email:",
                    data.email
                );


                alert("Login Successful");

                window.location.href = "index.html";

            } else {

                alert(
                    data.message ||
                    data.error ||
                    "Login failed"
                );

            }

        } catch (err) {

            console.error("Login error:", err);

            alert(
                "Unable to connect to the server. Please try again."
            );

        }

    });

}