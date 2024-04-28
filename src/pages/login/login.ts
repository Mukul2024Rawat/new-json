let handleSignIn = document.getElementById("handleSignIn");
handleSignIn?.addEventListener("click", (e) => {
  e.preventDefault();
  const emailInput = (document.getElementById("email") as HTMLInputElement)
    .value;
  const passwordInput = (
    document.getElementById("password") as HTMLInputElement
  ).value;

  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((users) => {
      const user: {
        email: string;
        password: string;
        id: string;
        loginAs: string;
      } = users.find(
        (user: { email: string; password: string; id: string }) =>
          user.email === emailInput
      );
      if (user) {
        if (emailInput === user.email && passwordInput === user.password) {
          let activeUser = {
            ActiveUserId: user.id,
            ActiveUserEmail: user.email,
            ActiveUserPassword: user.password,
          };
          alert("Login Successfully");
          if (user.loginAs === "seller") {
            localStorage.setItem(
              "activeSellerUser",
              JSON.stringify(activeUser)
            );
            window.location.href = "../seller/seller.html";
          }
          if (user.loginAs === "buyer") {
            localStorage.setItem("activeBuyerUser", JSON.stringify(activeUser));
            window.location.href = "../buyer/buyer.html";
          }
        } else {
          alert("invalid credientials");
        }
      } else {
        alert("invalid credientials");
      }
    });
});
