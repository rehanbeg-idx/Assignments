import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

export default function AuthInput() {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleInput(identifier, value) {
    if (identifier === "email") {
      setEnteredEmail(value);
    } else if (identifier === "password") {
      setEnteredPassword(value);
    }
  }

  function handleLogin() {
    setSubmitted(true);

    if (enteredEmail.includes("@") && enteredPassword.trim().length >= 6) {
      console.log("Email:", enteredEmail);
      console.log("Password:", enteredPassword);
      alert("Login successful!");
    }
  }

  const emailNotValid = submitted && !enteredEmail.includes("@");
  const passwordNotValid = submitted && enteredPassword.trim().length < 6;

  return (
    <div className="w-full max-w-sm p-8 mx-auto rounded shadow-md bg-gradient-to-b from-stone-700 to-stone-800">
      <div className="flex flex-col gap-4 mb-6">
        <Input
          label="Email"
          type="email"
          value={enteredEmail}
          onChange={(e) => handleInput("email", e.target.value)}
          invalid={emailNotValid}
        />
        <Input
          label="Password"
          type="password"
          value={enteredPassword}
          onChange={(e) => handleInput("password", e.target.value)}
          invalid={passwordNotValid}
        />
      </div>
      <div className="flex justify-end gap-4">
        <button type="button" className="text-amber-400 hover:text-amber-500">
          Create a New Account
        </button>
        <Button onClick={handleLogin}>Sign In</Button>
      </div>
    </div>
  );
}
