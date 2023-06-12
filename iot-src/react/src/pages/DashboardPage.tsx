import Title from "antd/lib/typography/Title";
import React from "react";

interface Props {}

const DashboardPage: React.FC<Props> = () => {
  return (
    <Title
      level={3}
      style={{
        textAlign: "center",
        color: "rgba(0,0,0, .65)",
      }}
    >
      Bienvenido al sistema de gestión de huertas agroecológicas
    </Title>
  );
};

export default DashboardPage;
