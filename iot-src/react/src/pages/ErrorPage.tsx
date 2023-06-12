import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { URLs } from "../config/enums";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Result
        status="error"
        title="Ha ocurrido un error"
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
      ></Result>
      ;
    </>
  );
};

export default ErrorPage;
