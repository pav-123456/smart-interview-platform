import React from "react";

function PasswordStrength({ password }) {
  const getStrength = () => {
    if (password.length < 4) return "Weak";
    if (password.length < 8) return "Medium";
    return "Strong";
  };

  const strength = getStrength();

  return (
    <div style={{ marginTop: "5px" }}>
      <small>
        Password Strength: <b>{strength}</b>
      </small>
    </div>
  );
}

export default PasswordStrength;