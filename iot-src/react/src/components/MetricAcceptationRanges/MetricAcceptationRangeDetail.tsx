import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Spin,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetricAcceptationRangesService from "../../api/metricAcceptationRanges/MetricAcceptationRangesService";
import {
  IMetricAcceptationRange,
  MetricAcceptationRangeAddType,
  MetricAcceptationRangeUpdateType,
} from "../../api/metricAcceptationRanges/models";
import ErrorPage from "../../pages/ErrorPage";
import BackButton from "../BackButton/BackButton";

interface FormValues {
  name: string;
  description: string;
  hsStartValue: number;
  hsEndValue: number;
  hrStartValue: number;
  hrEndValue: number;
  taStartValue: number;
  taEndValue: number;
}

const formItemLayout = {
  wrapperCol: { xs: 24, sm: 8, md: 6, lg: 6 },
  labelCol: { xs: 24, sm: 16, md: 12, lg: 12 },
};

const MetricAcceptationRangeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const [form] = useForm<FormValues>();
  const navigate = useNavigate();

  const [metricAcceptationRange, setMetricAcceptationRange] =
    useState<IMetricAcceptationRange>({
      metricAcceptationRangeId: 0,
      name: "",
      description: "",
      hsStartValue: 0,
      hsEndValue: 0,
      hrStartValue: 0,
      hrEndValue: 0,
      taStartValue: 0,
      taEndValue: 0,
      createdAt: "",
      metricTypeDescription: "",
    });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      if (id) {
        const entity: MetricAcceptationRangeUpdateType = {
          metricAcceptationRangeId: +id,
          name: values.name,
          description: values.description,
          hsStartValue: values.hsStartValue,
          hsEndValue: values.hsEndValue,
          hrStartValue: values.hrStartValue,
          hrEndValue: values.hrEndValue,
          taStartValue: values.taStartValue,
          taEndValue: values.taEndValue,
        };
        const response = await MetricAcceptationRangesService.update(id, entity);
        if (response === "Iguales") {
          message.warning("No hay campos para modificar");
          return;
        }
      } else {
        const entity: MetricAcceptationRangeAddType = {
          name: values.name,
          description: values.description,
          hsStartValue: values.hsStartValue,
          hsEndValue: values.hsEndValue,
          hrStartValue: values.hrStartValue,
          hrEndValue: values.hrEndValue,
          taStartValue: values.taStartValue,
          taEndValue: values.taEndValue,
        };
        const response = await MetricAcceptationRangesService.add(entity);
        if (response === "Existe") {
          message.warning("Ya existe una métrica con ese nombre y descripción");
          return;
        }
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
      setIsSubmitting(true);
      await MetricAcceptationRangesService.delete(id);
      message.success("Operación exitosa");
      navigate(-1);
    } catch (error) {
      if (error.message) message.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const metricAcceptationRange =
            await MetricAcceptationRangesService.fetchOne(id);
          setMetricAcceptationRange(metricAcceptationRange);
        }
      } catch (error) {
        setError(true);
        if (error.message) message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (error) return <ErrorPage />;

  return (
    <div className="container">
      <Card title={<BackButton title="Rango de métrica" />}>
        {isLoading ? (
          <div className="loading">
            <Spin />
          </div>
        ) : (
          <Form
            form={form}
            {...formItemLayout}
            onFinish={handleSubmit}
            initialValues={id ? metricAcceptationRange : undefined}
          >
            <Form.Item
              name="name"
              label="Nombre"
              required
              rules={[{ required: true, message: "Complete este campo" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Descripción"
              required
              rules={[{ required: true, message: "Complete este campo" }]}
            >
              <Input />
            </Form.Item>

           <Form.Item
              name="hsStartValue"
              label="Humedad del Sustrato Valor inicial (%)"
              rules={[
                { required: true, message: "Complete este campo" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const end = getFieldValue("hsEndValue");
                    if (end !== undefined && value > end) {
                      return Promise.reject("El valor inicial debe ser menor o igual al final");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber min={0} max={100} />
            </Form.Item>

            <Form.Item
              name="hsEndValue"
              label="Humedad del Sustrato Valor final (%)"
              dependencies={["hsStartValue"]}
              rules={[
                { required: true, message: "Complete este campo" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue("hsStartValue");
                    if (start !== undefined && value < start) {
                      return Promise.reject("El valor final debe ser mayor o igual al inicial");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber min={0} max={100} />
            </Form.Item>

            <Form.Item
              name="hrStartValue"
              label="Humedad Relativa Valor inicial (%)"
              rules={[
                { required: true, message: "Complete este campo" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const end = getFieldValue("hrEndValue");
                    if (end !== undefined && value > end) {
                      return Promise.reject("El valor inicial debe ser menor o igual al final");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber min={0} max={100} />
            </Form.Item>

            <Form.Item
              name="hrEndValue"
              label="Humedad Relativa Valor final (%)"
              dependencies={["hrStartValue"]}
              rules={[
                { required: true, message: "Complete este campo" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue("hrStartValue");
                    if (start !== undefined && value < start) {
                      return Promise.reject("El valor final debe ser mayor o igual al inicial");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber min={0} max={100} />
            </Form.Item>

            <Form.Item
              name="taStartValue"
              label="Temperatura Ambiente Valor inicial (°C)"
              rules={[
                { required: true, message: "Complete este campo" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const end = getFieldValue("taEndValue");
                    if (end !== undefined && value > end) {
                      return Promise.reject("El valor inicial debe ser menor o igual al final");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber min={0} max={100} />
            </Form.Item>

            <Form.Item
              name="taEndValue"
              label="Temperatura Ambiente Valor final (°C)"
              dependencies={["taStartValue"]}
              rules={[
                { required: true, message: "Complete este campo" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue("taStartValue");
                    if (start !== undefined && value < start) {
                      return Promise.reject("El valor final debe ser mayor o igual al inicial");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber min={0} max={100} />
            </Form.Item>
            <Divider />

            {!!id && (
              <Popconfirm
                title="¿Eliminar rango de métrica?"
                cancelText="Cancelar"
                onConfirm={() => handleDelete(id)}
              >
                <Button type="primary" danger loading={isSubmitting}>
                  Eliminar
                </Button>
              </Popconfirm>
            )}
            <Button
              type="primary"
              style={{ float: "right" }}
              htmlType="submit"
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

export default MetricAcceptationRangeDetail;
