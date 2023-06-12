import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import { URLs } from "../config/enums";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const content = () => {
    return (
      <Result
        status="404"
        title="404"
        subTitle="La página solicitada no existe"
        extra={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              type="primary"
              style={{ margin: "0px auto 10px auto" }}
              onClick={() => navigate(URLs.ROOT)}
            >
              Volver al principio
            </Button>
            <Button
              type="primary"
              style={{ margin: "0px auto" }}
              onClick={() => navigate(-1)}
            >
              Volver atrás
            </Button>
          </div>
        }
      />
    );
  };
  return <>{content()}</>;
};

export default NotFoundPage;
