import { Table, Tag } from "antd";
import { ColumnType } from "antd/lib/table";
import { IMetricReadingDTO } from "../../api/metricReadings/models";
import { formatISODate } from "../../helpers/date-helper";

interface Props {
  readings: IMetricReadingDTO[];
}

const SectorMetricsGrid: React.FC<Props> = ({ readings }) => {
  const columns: ColumnType<IMetricReadingDTO>[] = [
    {
      title: "Humedad Sustrato",
      dataIndex: "hsValue",
      align: "center",
      className: "text-center",
      render: (cell: any, row: IMetricReadingDTO) => (
        <>
          {row.hsValue? `${row.hsValue}%` : "-"}
          {row.isCurrentReading && <Tag style={{ marginLeft: 5 }}>Actual</Tag>}
        </>
      ),
      responsive: ["sm", "md"],
    },
    {
      title: "Humedad Relativa",
      dataIndex: "hrValue",
      align: "center",
      className: "text-center",
      render: (cell: any, row: IMetricReadingDTO) => (
        <>
          {row.hrValue? `${row.hrValue}%` : "-"}
          {row.isCurrentReading && <Tag style={{ marginLeft: 5 }}>Actual</Tag>}
        </>
      ),
      responsive: ["sm", "md"],
    },
    {
      title: "Temperatura Ambiente",
      dataIndex: "taValue",
      align: "center",
      className: "text-center",
      render: (cell: any, row: IMetricReadingDTO) => (
        <>
          {row.taValue? `${row.taValue}°C` : "-"}
          {row.isCurrentReading && <Tag style={{ marginLeft: 5 }}>Actual</Tag>}
        </>
      ),
      responsive: ["sm", "md"],
    },
    {
      title: "Lluvia próxima",
      dataIndex: "rainForecast",
      align: "center",
      className: "text-center",
      render: (cell: any, row: IMetricReadingDTO) => (
        <>
          {row.rainForecast !== false ? "Si" : "No"}
          {row.isCurrentReading && <Tag style={{ marginLeft: 5 }}>Actual</Tag>}
        </>
      ),
      responsive: ["sm", "md"],
    },
    {
      title: "Riego",
      dataIndex: "irrigation",
      align: "center",
      className: "text-center", width: 150,
      render: (cell: any, row: IMetricReadingDTO) => (
        <>
          {row.irrigation !== false ? "Si" : "No"}
          {row.isCurrentReading && <Tag style={{ marginLeft: 5 }}>Actual</Tag>}
        </>
      ),
      responsive: ["sm", "md"],
    },
    {
      title: "Fecha de captura",
      dataIndex: "readingDate",
      align: "center",
      className: "text-center",
      render: (cell: any) => formatISODate(cell),
      responsive: ["sm", "md"],
    },
  ];

  return (
    <Table
      rowKey="metricReadingId"
      bordered
      dataSource={readings}
      size="small"
      columns={columns}
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 8,
        showTotal: (total: number, range: [number, number]) =>
          `Mostrando ${range[0]} - ${range[1]} de ${total}`,
      }}
    />
  );
};

export default SectorMetricsGrid;
