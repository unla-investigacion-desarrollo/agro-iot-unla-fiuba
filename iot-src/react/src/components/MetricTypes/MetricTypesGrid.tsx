import { EditOutlined } from "@ant-design/icons";
import { Button, Card, message, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MetricTypesService from "../../api/metricTypes/MetricTypesService";
import { IMetricType } from "../../api/metricTypes/models";
import { URLs } from "../../config/enums";
import { ROWS_PER_PAGE } from "../../helpers/grid-helper";

const MetricTypesGrid = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [metricTypes, setMetricTypes] = useState<IMetricType[]>([]);
  const navigate = useNavigate();

  const columns = [
    { title: "Descripción", dataIndex: "description" },
    {
      title: "Acciones",
      width: 120,
      render: (cell: any, row: IMetricType) => (
        <div style={{ textAlign: "center" }}>
          <Tooltip title="Editar">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(
                  `${URLs.METRIC_TYPES}${URLs.DETAIL.replace(
                    ":id",
                    row.code.toString()
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
    const fetchMetricTypes = async () => {
      try {
        setIsLoading(true);
        const response = await MetricTypesService.fetchAll();
        setMetricTypes(response);
      } catch (error) {
        if (error.message) message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetricTypes();
  }, []);

  return (
    <div className="container">
      <Card title="Tipos de métrica">
        <Table
          rowKey="code"
          loading={isLoading}
          columns={columns}
          bordered
          dataSource={metricTypes}
          pagination={{ pageSize: ROWS_PER_PAGE, hideOnSinglePage: true }}
          scroll={{ x: 110 }}
        />
      </Card>
    </div>
  );
};

export default MetricTypesGrid;
