import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
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
import MetricTypesService from "../../api/metricTypes/MetricTypesService";
import { IMetricType } from "../../api/metricTypes/models";
import ErrorPage from "../../pages/ErrorPage";
import BackButton from "../BackButton/BackButton";

interface FormValues {
  name: string;
  startValue: number;
  endValue: number;
  metricTypeCode: string;
}

const formItemLayout = {
  wrapperCol: { xs: 24, sm: 24, md: 24, lg: 20 },
  labelCol: { xs: 24, sm: 24, md: 24, lg: 4 },
};

const MetricAcceptationRangeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const [form] = useForm<FormValues>();
  const navigate = useNavigate();

  const [metricTypes, setMetricTypes] = useState<IMetricType[]>([]);

  const [metricAcceptationRange, setMetricAcceptationRange] =
    useState<IMetricAcceptationRange>({
      metricAcceptationRangeId: 0,
      name: "",
      startValue: 0,
      endValue: 0,
      metricTypeCode: "",
    });

  const handleSubmit = async (values: FormValues) => {
    try {
      if (values.startValue > values.endValue)
        return message.error(
          "El valor inicial no puede ser mayor que el valor final"
        );

      setIsSubmitting(true);
      if (id) {
        const entity: MetricAcceptationRangeUpdateType = {
          metricAcceptationRangeId: +id,
          name: values.name,
          startValue: Number(
            values.startValue
            //formatMetricValue(values.startValue, values.metricTypeCode)
          ),
          endValue: Number(
            values.endValue
            //formatMetricValue(values.endValue, values.metricTypeCode)
          ),
          metricTypeCode: values.metricTypeCode,
        };
        await MetricAcceptationRangesService.update(id, entity);
      } else {
        const entity: MetricAcceptationRangeAddType = {
          name: values.name,
          startValue: Number(
            values.startValue
          ),
          endValue: Number(
            values.endValue
          ),
          metricTypeCode: values.metricTypeCode,
        };
        await MetricAcceptationRangesService.add(entity);
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
        const metricTypes = await MetricTypesService.fetchAll();
        setMetricTypes(metricTypes);
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
            onFinish={(values: FormValues) => handleSubmit(values)}
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
              name="startValue"
              label="Valor inicial"
              required
              rules={[{ required: true, message: "Complete este campo" }]}
            >
              <InputNumber min={0} max={100} />
            </Form.Item>
            <Form.Item
              name="endValue"
              label="Valor final"
              required
              rules={[{ required: true, message: "Complete este campo" }]}
            >
              <InputNumber min={0} max={100} />
            </Form.Item>
            <Form.Item
              name="metricTypeCode"
              label="Tipo de métrica"
              required
              rules={[{ required: true, message: "Complete este campo" }]}
            >
              <Select
                placeholder="Seleccione tipo de métrica"
                optionFilterProp="children"
                disabled={!!id}
              >
                {metricTypes.map((mt) => (
                  <Select.Option value={mt.code}>
                    {mt.description}
                  </Select.Option>
                ))}
              </Select>
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
