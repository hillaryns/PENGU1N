async function signin() {

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  try {

    const response = await fetch(
      "http://localhost:5000/signin",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })

      }
    );

    const data = await response.json();

    if (data.success) {

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful");

      window.location.href =
        "dashboard.html";

    } else {

      alert(data.message);

    }

  } catch (error) {

    console.log(error);

    alert("Server error");

  }

}