import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Spin,
} from "antd";
import { useForm } from "antd/lib/form/Form";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { IRole } from "../../api/roles/models";
import RolesService from "../../api/roles/RolesService";
import { IUser, UserAddType, UserUpdateType } from "../../api/users/models";
import UsersService from "../../api/users/UsersService";
import NotFoundPage from "../../pages/NotFoundPage";
import BackButton from "../BackButton/BackButton";

interface Props {}

interface FormValues {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  roleId: number;
}

const formItemLayout = {
  wrapperCol: { xs: 24, sm: 24, md: 24, lg: 20 },
  labelCol: { xs: 24, sm: 24, md: 24, lg: 4 },
};

const UserDetail: React.FC<Props> = () => {
  const [form] = useForm<FormValues>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(!!id);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const [roles, setRoles] = useState<IRole[]>([]);
  const [user, setUser] = useState<IUser>({
    userId: 0,
    name: "",
    surname: "",
    email: "",
    username: "",
    password: "",
    roleId: 0,
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      if (id) {
        const entity: UserUpdateType = {
          name: values.name,
          surname: values.surname,
          email: values.email,
          username: values.username,
          roleId: values.roleId,
        };
        await UsersService.update(id, entity);
      } else {
        const entity: UserAddType = {
          name: values.name,
          surname: values.surname,
          email: values.email,
          username: values.username,
          password: values.password,
          roleId: values.roleId,
        };
        await UsersService.add(entity);
      }
      message.success("Operación exitosa");
      navigate(-1);
    } catch (error) {
      if (error.message) message.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await UsersService.delete(id);
      message.success("Operación exitosa");
      navigate(-1);
    } catch (error) {
      if (error.message) message.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const rolesResponse = await RolesService.fetchAll();
      setRoles(rolesResponse);

      if (id) {
        try {
          setIsLoading(true);
          const response = await UsersService.fetchOne(id!);
          setUser(response);
        } catch (error) {
          if (error.message) message.error(error.message);
          setError(true);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUser();
  }, [id]);

  if (error) return <NotFoundPage />;

  return (
    <div className="container">
      <Card title={<BackButton title="Usuario" />}>
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
              required
              rules={[{ required: true, message: "Complete este campo" }]}
              initialValue={user.name || undefined}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="surname"
              label="Apellido"
              required
              rules={[{ required: true, message: "Complete este campo" }]}
              initialValue={user.surname || undefined}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="username"
              label="Nombre de usuario"
              required
              rules={[{ required: true, message: "Complete este campo" }]}
              initialValue={user.username || undefined}
            >
              <Input readOnly={!!id} />
            </Form.Item>
            {!id && (
              <Form.Item
                name="password"
                label="Contraseña"
                required
                rules={[{ required: true, message: "Complete este campo" }]}
                initialValue={user.password || undefined}
              >
                <Input.Password />
              </Form.Item>
            )}

            <Form.Item
              name="email"
              label="Email"
              required
              rules={[{ required: true, message: "Complete este campo" }]}
              initialValue={user.email || undefined}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item
              name="roleId"
              label="Rol"
              required
              rules={[{ required: true, message: "Complete este campo" }]}
              initialValue={user.roleId || undefined}
            >
              <Select
                placeholder="Seleccione un rol"
                optionFilterProp="children"
              >
                {roles.map((role) => (
                  <Select.Option key={role.roleId} value={role.roleId}>
                    {role.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Divider />
            {!!id && (
              <Popconfirm
                title="¿Eliminar usuario?"
                cancelText="Cancelar"
                onConfirm={() => handleDelete(id)}
              >
                <Button
                  type="primary"
                  danger
                  loading={isSubmitting || isDeleting}
                >
                  Eliminar
                </Button>
              </Popconfirm>
            )}
            <Button
              htmlType="submit"
              type="primary"
              style={{ float: "right" }}
              loading={isSubmitting || isDeleting}
            >
              Guardar
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default UserDetail;
