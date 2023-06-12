import { Menu } from "antd";
import { useNavigate } from "react-router";
import { IProfile } from "../api/auth/models";
import { renderMenuItemsByRole } from "../helpers/menu-helper";

interface Props {
  profile: IProfile;
}

const HeaderMenu: React.FC<Props> = ({ profile }) => {
  const navigate = useNavigate();
  return (
    <Menu
      mode="horizontal"
      rootClassName="header-menu"
      items={renderMenuItemsByRole(profile.roleCode)}
      selectedKeys={[window.location.pathname]}
      onClick={({ key }) => navigate(key)}
    ></Menu>
  );
};

export default HeaderMenu;
