import { Layout, Spin } from "antd";

const Loading = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <div className="loading-app">
        <Spin size="large" />
      </div>
    </Layout>
  );
};
export default Loading;
