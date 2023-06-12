import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, message, Popconfirm, Table, Tag, Tooltip } from "antd";
import { ColumnType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetricAcceptationRangesService from "../../api/metricAcceptationRanges/MetricAcceptationRangesService";
import { IMetricAcceptationRange } from "../../api/metricAcceptationRanges/models";
import { PaginatedList } from "../../api/shared/models";
import { URLs } from "../../config/enums";
import {
  createBaseGridParams,
  GridParams,
  ROWS_PER_PAGE,
} from "../../helpers/grid-helper";
import { formatMetricValueWithUnit } from "../../helpers/metric-helper";
import { MetricAcceptationRangesData } from "../../helpers/test-data-helper";

const MetricAcceptationRangesGrid: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [gridState, setGridState] = useState<GridParams>(
    createBaseGridParams({ sortField: "createdAt" })
  );

  const navigate = useNavigate();

  const [rangesFetched, setRangesFetched] = useState<
    PaginatedList<IMetricAcceptationRange>
  >({
    list: [],
    count: 0,
  });

  const renderActions = (row: IMetricAcceptationRange) => {
    return (
      <>
        <Tooltip title="Editar">
          <Button
            style={{ marginRight: 10 }}
            type="default"
            icon={<EditOutlined />}
            onClick={() =>
              navigate(
                `${URLs.METRIC_ACCEPTATION_RANGES}${URLs.DETAIL.replace(
                  ":id",
                  row.metricAcceptationRangeId.toString()
                )}`
              )
            }
          />
        </Tooltip>
        <Tooltip title="Eliminar">
          <Popconfirm
            placement="right"
            cancelText="Cancelar"
            title="¿Eliminar Rango de métrica?"
            onConfirm={() =>
              handleDelete(row.metricAcceptationRangeId.toString())
            }
            cancelButtonProps={{ loading: isLoading }}
          >
            <Button danger type="primary" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Tooltip>
      </>
    );
  };

  const columns: ColumnType<IMetricAcceptationRange>[] = [
    {
      title: "Rangos de métrica",
      render: (cell: any, row: IMetricAcceptationRange) => (
        <>
          <p>
            <b>Nombre: </b>
            {row.name}
          </p>
          <p>
            <b>Valores: </b>
            {formatMetricValueWithUnit(
              row.startValue,
              row.metricTypeCode
            )} a {formatMetricValueWithUnit(row.endValue, row.metricTypeCode)}
          </p>
          <p>
            <b>Fecha de creación: </b>
            {row.createdAt}
          </p>
          <p>
            <b>Tipo de métrica: </b>
            <Tag>{row.metricTypeDescription}</Tag>
          </p>
          {renderActions(row)}
        </>
      ),
      responsive: ["xs"],
    },
    { title: "Nombre", dataIndex: "name", responsive: ["sm"] },
    {
      title: "Valor inicial",
      align: "center" as "center",
      dataIndex: "startValue",
      render: (cell: number, row: IMetricAcceptationRange) =>
        formatMetricValueWithUnit(cell, row.metricTypeCode),
      responsive: ["sm"],
    },
    {
      title: "Valor final",
      align: "center" as "center",
      dataIndex: "endValue",
      render: (cell: number, row: IMetricAcceptationRange) =>
        formatMetricValueWithUnit(cell, row.metricTypeCode),
      responsive: ["sm"],
    },

    {
      title: "Fecha de creación",
      dataIndex: "createdAt",
      responsive: ["sm"],
    },
    {
      title: "Tipo de métrica",
      dataIndex: "metricTypeDescription",
      render: (cell: any) => <Tag>{cell}</Tag>,
      responsive: ["sm"],
    },
    {
      title: "Acciones",
      render: (cell: any, row: IMetricAcceptationRange) => renderActions(row),

      responsive: ["sm"],
    },
  ];

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await MetricAcceptationRangesService.delete(id);
      message.success("Operación exitosa");
      setGridState({ ...gridState });
    } catch (error) {
      if (error.message) message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchMetricAcceptationRanges = async () => {
      try {
        setIsLoading(true);
        const response = await MetricAcceptationRangesService.fetchList(
          gridState
        );
        setRangesFetched(response);
      } catch (error) {
        if (error.message) message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetricAcceptationRanges();
  }, [gridState]);

  return (
    <div className="container">
      <Card
        title={
          <>
            <span>Rangos de métrica</span>
            <Tooltip title="Añadir">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                shape="circle"
                style={{ float: "right" }}
                onClick={() =>
                  navigate(`${URLs.METRIC_ACCEPTATION_RANGES}${URLs.NEW}`)
                }
              />
            </Tooltip>
          </>
        }
      >
        <Table
          rowKey="metricAcceptationRangeId"
          loading={isLoading}
          dataSource={rangesFetched.list}
          columns={columns}
          bordered
          pagination={{ pageSize: ROWS_PER_PAGE, hideOnSinglePage: true }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default MetricAcceptationRangesGrid;
