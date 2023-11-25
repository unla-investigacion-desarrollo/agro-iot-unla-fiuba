import { Avatar, Dropdown } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import { IProfile } from "../api/auth/models";
import { HeaderMenuActions } from "../helpers/menu-helper";
import type { MenuProps } from 'antd';

interface Props {
  profile: IProfile;
}

const HeaderActions: React.FC<Props> = ({ profile }) => {
  const navigate = useNavigate();

  const items: MenuProps['items'] = HeaderMenuActions

  const handleDropdownItemClick = () => {
    navigate(HeaderMenuActions[0].key)
  };
  
  return (
    <Dropdown menu={{
      onClick: handleDropdownItemClick,
      items: items,
    }}>
      <Avatar className="header-avatar">
        {profile.name.slice(0, 1)}
        {profile.surname.slice(0, 1)}
      </Avatar>
    </Dropdown>
  );
};

export default HeaderActions;
