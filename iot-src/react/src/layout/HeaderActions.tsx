import { Avatar, Dropdown, Menu } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import { IProfile } from "../api/auth/models";
import { HeaderMenuActions } from "../helpers/menu-helper";

interface Props {
  profile: IProfile;
}

const HeaderActions: React.FC<Props> = ({ profile }) => {
  const navigate = useNavigate();

  return (
    <Dropdown
      overlay={
        <Menu items={HeaderMenuActions} onClick={({ key }) => navigate(key)} />
      }
    >
      <Avatar className="header-avatar">
        {profile.name.slice(0, 1)}
        {profile.surname.slice(0, 1)}
      </Avatar>
    </Dropdown>
  );
};

export default HeaderActions;
