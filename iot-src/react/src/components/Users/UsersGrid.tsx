import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, message, Popconfirm, Table, Tag, Tooltip } from "antd";
import { ColumnType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaginatedList } from "../../api/shared/models";
import { IUser } from "../../api/users/models";
import UsersService from "../../api/users/UsersService";
import { URLs } from "../../config/enums";
import { createBaseGridParams } from "../../helpers/grid-helper";

const UsersGrid: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState<PaginatedList<IUser>>({
    list: [],
    count: 0,
  });

  const [gridState, setGridState] = useState(
    createBaseGridParams({ sortField: "createdAt" })
  );

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await UsersService.delete(id);
      message.success("Operación exitosa");
      setGridState({ ...gridState });
    } catch (error) {
      if (error.message) message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActions = (row: IUser) => {
    return (
      <div>
        <Tooltip title="Editar">
          <Button
            type="default"
            icon={<EditOutlined />}
            style={{ marginRight: 10 }}
            onClick={() =>
              navigate(
                `${URLs.USERS}${URLs.DETAIL.replace(
                  ":id",
                  row.userId.toString()
                )}`
              )
            }
          />
        </Tooltip>
        <Tooltip title="Eliminar">
          <Popconfirm
            placement="right"
            cancelText="Cancelar"
            title="¿Eliminar Usuario?"
            onConfirm={() => handleDelete(row.userId.toString())}
            cancelButtonProps={{ loading: isLoading }}
          >
            <Button danger type="primary" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Tooltip>
      </div>
    );
  };

  const columns: ColumnType<IUser>[] = [
    {
      title: "Usuarios",
      width: 10,
      render: (cell: any, row: IUser) => (
        <>
          <p>
            <b>Usuario:</b> {row.username}
          </p>
          <p>
            <b>Email:</b> {row.email}
          </p>
          <p>
            <b>Nombre:</b> {row.name} {row.surname}
          </p>
          <p>
            <b>Fecha de creación:</b> {row.createdAt}
          </p>
          <p>
            <b>Rol:</b> <Tag>{row.roleName}</Tag>
          </p>
          {renderActions(row)}
        </>
      ),
      responsive: ["xs"],
    },
    {
      title: "Nombre de usuario",
      dataIndex: "username",
      responsive: ["sm"],
    },
    {
      title: "Email",
      dataIndex: "email",
      responsive: ["sm"],
    },
    {
      title: "Nombre completo",
      width: 200,
      render: (cell: any, row: IUser) => `${row.name} ${row.surname}`,
      responsive: ["sm"],
    },
    {
      title: "Fecha de creación",
      dataIndex: "createdAt",
      render: (cell: any) => cell,
      responsive: ["sm"],
    },
    {
      title: "Rol",
      dataIndex: "roleName",
      align: "center" as "center",
      render: (cell: any) => <Tag>{cell}</Tag>,
      responsive: ["sm"],
    },
    {
      title: "Acciones",
      align: "center" as "center",
      responsive: ["sm"],
      render: (cell: any, row: IUser) => renderActions(row),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await UsersService.fetchList(gridState);
        setFetchedUsers(response);
      } catch (error) {
        if (error.message) message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [gridState]);

  return (
    <div className="container">
      <Card
        title={
          <>
            <span>Usuarios</span>
            <Tooltip title="Añadir">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                shape="circle"
                style={{ float: "right" }}
                onClick={() => navigate(`${URLs.USERS}${URLs.NEW}`)}
              />
            </Tooltip>
          </>
        }
      >
        <Table
          loading={isLoading}
          bordered
          rowKey="userId"
          columns={columns}
          dataSource={fetchedUsers.list}
          pagination={{
            hideOnSinglePage: true,
            current: gridState.page! + 1,
            pageSize: gridState.pageSize,
            total: fetchedUsers.count,
            showTotal: (total, range) =>
              `${range[0]} - ${range[1]} de ${total} resultados`,
            onChange: (pageNumber: number, pageSize: number) =>
              setGridState({ ...gridState, page: pageNumber - 1 }),
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default UsersGrid;
