import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Menu } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { IProfile } from "../api/auth/models";
import {
  HeaderMenuActions,
  renderMenuItemsByRole,
} from "../helpers/menu-helper";

interface Props {
  profile: IProfile;
}

const HeaderMobileMenu: React.FC<Props> = ({ profile }) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <MenuOutlined
        style={{
          color: "white",
          padding: 8,
          fontSize: "1.2rem",
          border: "1px solid",
          borderRadius: 2.5,
        }}
        onClick={() => setVisible(true)}
      />
      <Drawer
        width={248}
        visible={visible}
        onClose={() => setVisible(false)}
        closable
      >
        <Menu
          rootClassName="header-menu"
          selectedKeys={[window.location.pathname]}
          style={{ border: 0 }}
          items={[
            ...renderMenuItemsByRole(profile.roleCode),
            ...HeaderMenuActions,
          ]}
          onClick={({ key }) => {
            setVisible(false);
            navigate(key);
          }}
        />
      </Drawer>
    </>
  );
};

export default HeaderMobileMenu;
