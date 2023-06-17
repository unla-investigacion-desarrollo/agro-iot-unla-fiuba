import { Table, Tag } from "antd";
import { ColumnType } from "antd/lib/table";
import { IMetricReadingDTO } from "../../api/metricReadings/models";
import { formatISODate } from "../../helpers/date-helper";
import { formatMetricValueWithUnit } from "../../helpers/metric-helper";

interface Props {
  readings: IMetricReadingDTO[];
}

const SectorMetricsGrid: React.FC<Props> = ({ readings }) => {
  const columns: ColumnType<IMetricReadingDTO>[] = [
    {
      title: "Tipo de métrica",
      dataIndex: "metricTypeDescription",
      responsive: ["sm", "md"],
    },
    {
      title: "Valor",
      dataIndex: "value",
      responsive: ["sm", "md"],
    },
    {
      title: "Fecha de captura",
      dataIndex: "readingDate",
      render: (cell: any) => formatISODate(cell),
      responsive: ["sm", "md"],
    },
    {
      title: "Lecturas",
      render: (cell: any, row: IMetricReadingDTO) => (
        <>
          <p>{row.metricTypeDescription}</p>
          <p>
            {formatMetricValueWithUnit(+row.value, row.metricTypeCode)}{" "}
            {row.isCurrentReading && (
              <Tag style={{ marginLeft: 5 }}>Actual</Tag>
            )}
          </p>
          <p>{formatISODate(row.readingDate)}</p>
        </>
      ),
      responsive: ["xs"],
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
