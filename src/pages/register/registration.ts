interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  gender: string;
  loginAs:string;
}
let targetRegForm = document.getElementById("signupForm") as HTMLButtonElement;
targetRegForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  valdate();
});

const valdate = (): void => {
  const firstName = (
    document.getElementById("firstName") as HTMLInputElement
  ).value.trim();
  const lastName = (
    document.getElementById("lastName") as HTMLInputElement
  ).value.trim();
  const email = (
    document.getElementById("email") as HTMLInputElement
  ).value.trim();
  const password = (
    document.getElementById("password") as HTMLInputElement
  ).value.trim();
  const address = (
    document.getElementById("address") as HTMLInputElement
  ).value.trim();
  const phoneNumber = (
    document.getElementById("mobile") as HTMLInputElement
  ).value.trim();

  const firstnameError = document.getElementById(
    "firstNameError"
  ) as HTMLDivElement;
  const lastNameError = document.getElementById(
    "lastNameError"
  ) as HTMLDivElement;
  const emailError = document.getElementById("emailError") as HTMLDivElement;
  const passwordError = document.getElementById(
    "passwordError"
  ) as HTMLDivElement;
  const addressError = document.getElementById(
    "addressError"
  ) as HTMLDivElement;
  const phoneNumberError = document.getElementById(
    "mobileError"
  ) as HTMLDivElement;
  const genderError = document.getElementById("genderError") as HTMLDivElement;
  const loginAsError = document.getElementById("loginAs-error") as HTMLDivElement;
  
  let validFirstName = nameCheck(firstName, firstnameError);
  let validLastName = nameCheck(lastName, lastNameError);
  let validEmail = emailValidate(email, emailError);
  let validPassword = passwordValidation(password, passwordError);
  let validAddress = checkAddress(address, addressError);
  let validPhone = phoneNumberValidation(phoneNumber, phoneNumberError);
  let validGender = validateGender(genderError);
  let loginUser =loginUserCheck(loginAsError);
  if (
    typeof validFirstName === "string" &&
    typeof validLastName === "string" &&
    typeof validEmail === "string" &&
    typeof validPassword === "string" &&
    typeof validAddress === "string" &&
    typeof validPhone === "string" &&
    typeof validGender === "string" &&
    typeof loginUser === "string"
  ) {
    let dataItem: IUser = {
      firstName: validFirstName,
      lastName: validLastName,
      email: validEmail,
      password: validPassword,
      address: validAddress,
      phoneNumber: validPhone,
      gender: validGender,
      loginAs:loginUser
    };
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((users) => {
        const user: { email: string } = users.find(
          (user: { email: string; password: string; id: string }) =>
            user.email === validEmail
        );
        if (user) {
          alert("user with this email already exist");
        } else {
          // save data into activeuser:
          fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataItem),
          })
            .then((response) => response.json())
            .catch((error) => {
              console.log(error);
            });
          window.confirm(
            `${firstName[0].toUpperCase() + firstName.slice(1)} ${
              lastName[0].toUpperCase() + lastName.slice(1)
            } Succesfully Registered`
          );
          window.location.href = "../login/login.html";
        }
      });
  }
};

function validateGender(errElement: HTMLSpanElement) {
  let genderChecked = document.querySelector('input[name="gender"]:checked');
  if (!genderChecked) {
    errElement.innerHTML = "*please select a gender.";
    return false;
  } else {
    errElement.innerHTML = "";
    return genderChecked?.id;
  }
}

function loginUserCheck(errElement: HTMLSpanElement) {
  let genderChecked = document.querySelector('input[name="login_as"]:checked');
  if (!genderChecked) {
    errElement.innerHTML = "*Please select a role";
    return false;
  } else {
    errElement.innerHTML = "";
    return genderChecked?.id;
  }
}

const checkAddress = (
  value: string,
  errElement: HTMLSpanElement
): boolean | string => {
  if (emptyCheck(value)) {
    errElement.innerHTML = "address can't be empty";
    return false;
  } else if (maxLengthCheck(value, 250)) {
    errElement.innerHTML = "address can contain only 250 character";
    return false;
  } else if (minLengthCheck(value, 5)) {
    errElement.innerHTML = "address should contain at least 5 character";
    return false;
  } else {
    errElement.innerHTML = "";
    return value;
  }
};

function phoneNumberValidation(
  element: string,
  errorElement: HTMLSpanElement
): string | boolean {
  const phoneNumberPattern = /^[0-9]{10}$/;
  if (!phoneNumberPattern.test(element)) {
    errorElement.innerHTML = "*enter a valid phone number";
    return false;
  } else {
    errorElement.innerHTML = "";
    return element;
  }
}
function passwordValidation(
  element: string,
  errorElement: HTMLSpanElement
): boolean | string {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{3,}$/;
  if (!passwordPattern.test(element)) {
    errorElement.innerHTML =
      "*password must be at least 4 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    return false;
  } else {
    errorElement.innerHTML = "";
    return element;
  }
}
function emailValidate(
  element: string,
  errorShow: HTMLSpanElement
): boolean | string {
  const validRegex =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (!validRegex.test(element)) {
    errorShow.innerHTML = "enter a vaild email address";
    return false;
  } else {
    errorShow.innerHTML = "";
    return element;
  }
}
function nameCheck(
  value: string,
  errorShow: HTMLSpanElement
): boolean | string {
  if (emptyCheck(value)) {
    errorShow.innerHTML = " field can't be empty";
    return false;
  } else if (minLengthCheck(value, 3)) {
    errorShow.innerHTML = " field contain at least 3 character";
    return false;
  } else if (maxLengthCheck(value, 20)) {
    errorShow.innerHTML = "field can contain at most 20 character";
    return false;
  } else if (specialCheck(value)) {
    errorShow.innerHTML = "field can't contain a special character or number";
    return false;
  } else {
    errorShow.innerHTML = "";
    return value;
  }
}

// empty check =>
const emptyCheck = (value: string): boolean =>
  value.length === 0 || value.length === null || value.length === undefined;

//min checking the  length:
const minLengthCheck = (value: string, lengthLimit: number): boolean =>
  value.length < lengthLimit;

// max checking the  length:
const maxLengthCheck = (value: string, lengthLimit: number): boolean =>
  value.length > lengthLimit;

// checking special character:
const specialCheck = (value: string): boolean => {
  const specialSymbolregex = /^[a-zA-Z\s]+$/;
  return !specialSymbolregex.test(value);
};
