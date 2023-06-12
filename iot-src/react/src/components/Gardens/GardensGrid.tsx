import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, message, Popconfirm, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IGarden } from "../../api/gardens/models";
import { PaginatedList } from "../../api/shared/models";
import { URLs } from "../../config/enums";
import { createBaseGridParams, ROWS_PER_PAGE } from "../../helpers/grid-helper";

const GardensGrid = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedGardens, setFetchedGardens] = useState<PaginatedList<IGarden>>({
    list: [],
    count: 0,
  });
  const navigate = useNavigate();

  const [gridState, setGridState] = useState(
    createBaseGridParams({ sortField: "createdAt" })
  );

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      // await GardensService.delete(id);
      message.success("Operación exitosa");
      // setGridState({ ...gridState });
    } catch (error) {
      if (error.message) message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { title: "Nombre", dataIndex: "name" },
    { title: "Descripción", dataIndex: "description" },
    { title: "Ubicación", dataIndex: "location" },
    { title: "Fecha de creación", dataIndex: "createdAt" },
    {
      title: "Acciones",
      width: 120,
      render: (cell: any, row: IGarden) => (
        <>
          <Tooltip title="Editar">
            <Button
              style={{ marginRight: 10 }}
              type="default"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(
                  `${URLs.GARDENS}${URLs.DETAIL.replace(
                    ":id",
                    row.gardenId.toString()
                  )}`
                )
              }
            ></Button>
          </Tooltip>
          <Tooltip title="Eliminar">
            <Popconfirm
              placement="right"
              cancelText="Cancelar"
              title="¿Eliminar Huerta?"
              onConfirm={() => handleDelete(row.gardenId.toString())}
              cancelButtonProps={{ loading: isLoading }}
            >
              <Button danger type="primary" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        setIsLoading(true);
        // const response = await GardensService.fetch(gridState);
        setFetchedGardens({
          count: 4,
          list: [
            {
              gardenId: 1,
              name: "Huerta 1",
              description:
                "Una huerta random 1 con un texto extremadamente largo para manejarlo correctamente implementando algun tipo de manejo de cadenas de texto",
              location: "Avenida 29 de Septiembre 2213",
              ownerUserId: 1,
              sectors: [],
            },
            {
              gardenId: 2,
              name: "Huerta 2",
              description: "Una huerta random 2",
              location: "Avenida 29 de Septiembre 2213",
              ownerUserId: 1,
              sectors: [],
            },
            {
              gardenId: 3,
              name: "Huerta 3",
              description: "Una huerta random 2",
              location: "Avenida 29 de Septiembre 2213",
              ownerUserId: 1,
              sectors: [],
            },
            {
              gardenId: 4,
              name: "Huerta 4",
              description: "Una huerta random 3",
              location: "Avenida 29 de Septiembre 2213",
              ownerUserId: 1,
              sectors: [],
            },
          ],
        });
      } catch (error) {
        if (error.message) message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGardens();
  }, []);

  return (
    <div className="container">
      <Card
        title={
          <>
            <span>Huertas</span>
            <Tooltip title="Añadir">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                shape="circle"
                style={{ float: "right" }}
                onClick={() => navigate(`${URLs.GARDENS}${URLs.NEW}`)}
              />
            </Tooltip>
          </>
        }
      >
        <Table
          rowKey="gardenId"
          loading={isLoading}
          columns={columns}
          bordered
          dataSource={fetchedGardens.list}
          pagination={{ pageSize: ROWS_PER_PAGE, hideOnSinglePage: true }}
          scroll={{ x: 1024 }}
        />
      </Card>
    </div>
  );
};

export default GardensGrid;
