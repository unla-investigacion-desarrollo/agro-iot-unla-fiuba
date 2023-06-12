import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { IRole, RoleUpdateType } from "../../api/roles/models";
import RolesService from "../../api/roles/RolesService";
import { IUser } from "../../api/users/models";
import UsersService from "../../api/users/UsersService";
import { URLs } from "../../config/enums";
import ErrorPage from "../../pages/ErrorPage";
import BackButton from "../BackButton/BackButton";

interface Props {}

interface FormValues {
  name: string;
  code: string;
}

const formItemLayout = {
  wrapperCol: { xs: 24, sm: 24, md: 24, lg: 20 },
  labelCol: { xs: 24, sm: 24, md: 24, lg: 4 },
};

const RoleDetail: React.FC<Props> = () => {
  const [form] = useForm<FormValues>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(!!id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [role, setRole] = useState<IRole>({
    code: "",
    name: "",
    roleId: 0,
  });
  const [roleUsers, setRoleUsers] = useState<IUser[]>([]);

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const entity: RoleUpdateType = {
        name: values.name,
        roleId: +id!,
      };
      await RolesService.update(id!, entity);
      message.success("Operación exitosa");
      navigate(-1);
    } catch (error) {
      if (error.message) message.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      if (id) {
        try {
          const response = await RolesService.fetchOne(id);
          const users = await UsersService.fetchUsersByRoleId(
            response.roleId.toString()
          );
          setRole(response);
          setRoleUsers(users);
        } catch (error) {
          if (error.message) message.error(error.message);
          setError(true);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchRole();
  }, [id]);

  if (error) return <ErrorPage />;

  return (
    <div className="container">
      <Card title={<BackButton title="Rol" />}>
        {isLoading ? (
          <div className="loading">
            <Spin />
          </div>
        ) : (
          <Form
            form={form}
            onFinish={(values) => handleSubmit(values)}
            layout="horizontal"
            {...formItemLayout}
          >
            <Form.Item
              name="name"
              label="Nombre"
              initialValue={role.name || undefined}
              rules={[{ required: true, message: "Complete este campo" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="code"
              label="Código"
              initialValue={role.code || undefined}
            >
              <Input disabled />
            </Form.Item>
            {roleUsers.length > 0 && (
              <Form.Item label="Usuarios">
                <div style={{ maxHeight: 200, overflow: "auto" }}>
                  {roleUsers.map((user) => (
                    <Tooltip
                      key={user.userId}
                      title={`${user.name} ${user.surname}`}
                    >
                      <Tag
                        key={user.userId}
                        style={{
                          cursor: "pointer",
                          marginBottom: 5,
                        }}
                        onClick={() =>
                          navigate(
                            URLs.USERS.concat(
                              URLs.DETAIL.replace(":id", user.userId.toString())
                            )
                          )
                        }
                      >{`${user.email}`}</Tag>
                    </Tooltip>
                  ))}
                </div>
              </Form.Item>
            )}
            <Divider />
            <Button
              htmlType="submit"
              type="primary"
              style={{ float: "right" }}
              loading={isSubmitting}
            >
              Guardar
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default RoleDetail;
