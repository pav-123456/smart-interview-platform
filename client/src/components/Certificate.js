import React from "react";
import Certificate from "../components/Certificate";

function CertificatePage() {

  const certificate = JSON.parse(
    localStorage.getItem("certificate")
  );

  if (!certificate) {
    return (
      <h2>No certificate found</h2>
    );
  }

  return (
    <Certificate
      name={certificate.name}
      role={certificate.role}
      score={certificate.score}
      date={certificate.date}
    />
  );
}

export default CertificatePage;