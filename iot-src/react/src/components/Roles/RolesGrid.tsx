import { EditOutlined } from "@ant-design/icons";
import { Button, Card, message, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IRole } from "../../api/roles/models";
import RolesService from "../../api/roles/RolesService";
import { URLs } from "../../config/enums";
import { ROWS_PER_PAGE } from "../../helpers/grid-helper";

const RolesGrid = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<IRole[]>([]);
  const navigate = useNavigate();

  const columns = [
    { title: "Nombre", dataIndex: "name" },
    {
      title: "Acciones",
      width: 120,
      render: (cell: any, row: IRole) => (
        <div style={{ textAlign: "center" }}>
          <Tooltip title="Editar">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(
                  `${URLs.ROLES}${URLs.DETAIL.replace(
                    ":id",
                    row.roleId.toString()
                  )}`
                )
              }
            ></Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        const response = await RolesService.fetchAll();
        setRoles(response);
      } catch (error) {
        if (error.message) message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="container">
      <Card title="Roles">
        <Table
          rowKey="roleId"
          loading={isLoading}
          columns={columns}
          bordered
          dataSource={roles}
          pagination={{ pageSize: ROWS_PER_PAGE, hideOnSinglePage: true }}
          scroll={{ x: 220 }}
        />
      </Card>
    </div>
  );
};

export default RolesGrid;
