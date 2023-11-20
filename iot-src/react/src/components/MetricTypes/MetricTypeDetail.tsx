import { Button, Card, Divider, Form, Input, message, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetricTypesService from "../../api/metricTypes/MetricTypesService";
import {
  IMetricType,
  MetricTypeUpdateType,
} from "../../api/metricTypes/models";
import ErrorPage from "../../pages/ErrorPage";
import BackButton from "../BackButton/BackButton";

const formItemLayout = {
  wrapperCol: { xs: 24, sm: 24, md: 24, lg: 20 },
  labelCol: { xs: 24, sm: 24, md: 24, lg: 4 },
};

interface FormValues {
  code: string;
  description: string;
}

const MetricTypeDetail = () => {
  const [form] = useForm<FormValues>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(!!id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const [metricType, setMetricType] = useState<IMetricType>({
    code: "",
    description: "",
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const entity: MetricTypeUpdateType = {
        code: id!,
        description: values.description,
      };
      await MetricTypesService.update(id!, entity);
      message.success("Operación exitosa");
      navigate(-1);
    } catch (error) {
      if (error.message) message.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchMetricType = async () => {
      if (id) {
        try {
          const response = await MetricTypesService.fetchOne(id);
          setMetricType(response);
        } catch (error) {
          if (error.message) message.error(error.message);
          setError(true);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchMetricType();
  }, [id]);

  if (error) return <ErrorPage />;

  return (
    <div className="container">
      <Card title={<BackButton title="Tipo de métrica" />}>
        {isLoading ? (
          <div className="loading">
            <Spin />
          </div>
        ) : (
          <Form
            form={form}
            initialValues={metricType || undefined}
            onFinish={(values: FormValues) => handleSubmit(values)}
            {...formItemLayout}
          >
            <Form.Item name="code" label="Código">
              <Input disabled />
            </Form.Item>
            <Form.Item name="description" label="Descripción">
              <Input />
            </Form.Item>
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

export default MetricTypeDetail;
