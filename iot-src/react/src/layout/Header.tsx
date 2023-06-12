import React from "react";
import { Col, Layout, Row } from "antd";
import HeaderMenu from "./HeaderMenu";
import HeaderMobileMenu from "./HeaderMobileMenu";
import { useSelector } from "react-redux";
import { IGlobalState } from "../redux/store";
import HeaderActions from "./HeaderActions";

const Header: React.FC = () => {
  const { profile } = useSelector((state: IGlobalState) => state.auth);

  if (!profile) return null;

  return (
    <Layout.Header className="header">
      <div className="container">
        <Row gutter={12} align="bottom">
          <Col xs={20} sm={12} md={7} lg={6}>
            <div className="logo">Agroecología IoT</div>
          </Col>
          <Col xs={0} sm={0} md={14} lg={14}>
            <HeaderMenu profile={profile} />
          </Col>
          <Col xs={4} sm={12} md={0} lg={0} style={{ textAlign: "end" }}>
            <HeaderMobileMenu profile={profile} />
          </Col>
          <Col xs={0} sm={0} md={3} lg={4} style={{ textAlign: "end" }}>
            <HeaderActions profile={profile} />
          </Col>
        </Row>
      </div>
    </Layout.Header>
  );
};

export default Header;
