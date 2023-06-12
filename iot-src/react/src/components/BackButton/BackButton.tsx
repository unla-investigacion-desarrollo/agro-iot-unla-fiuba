import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router";

interface Props {
  title?: string;
}

const BackButton: React.FC<Props> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        type="default"
        shape="circle"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
      ></Button>
      {title && <span style={{ marginLeft: 10 }}>{title}</span>}
    </>
  );
};

export default BackButton;
