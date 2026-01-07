import React from "react";
import { Link } from "react-router-dom";
import { P } from "../AbstractElements";

const OtherWay = () => {
  return (
    <>
      <P attrPara={{ className: "text-center mb-0 mt-4" }}>
        Don't have account?
        <Link className="ms-2" to={`/register-new-user`}>
          Create Account
        </Link>
      </P>
    </>
  );
};

export default OtherWay;
