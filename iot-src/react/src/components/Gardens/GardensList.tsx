import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, List, message, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import GardensService from "../../api/gardens/GardensService";
import { IGarden } from "../../api/gardens/models";
import { PaginatedList } from "../../api/shared/models";
import { URLs } from "../../config/enums";
import { createBaseGridParams, ROWS_PER_PAGE } from "../../helpers/grid-helper";
import ErrorPage from "../../pages/ErrorPage";
import GardenInfoCard from "./GardenInfoCard";

const GardensList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
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
      await GardensService.delete(id);
      message.success("Operación exitosa");
      setGridState({ ...gridState });
    } catch (error) {
      setError(true);
      if (error.message) message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        setIsLoading(true);
        const response = await GardensService.fetchList(gridState);
        setFetchedGardens(response);
      } catch (error) {
        if (error.message) message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGardens();
  }, [gridState]);

  if (error) return <ErrorPage />;

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
        {isLoading ? (
          <div className="loading">
            <Spin />
          </div>
        ) : (
          <List
            rowKey="gardenId"
            grid={{ gutter: 16 }}
            dataSource={fetchedGardens.list}
            pagination={{ pageSize: ROWS_PER_PAGE, hideOnSinglePage: true }}
            renderItem={(garden) => (
              <GardenInfoCard
                name={garden.name}
                description={garden.description}
                location={garden.location}
                handleViewDetails={() =>
                  navigate(
                    `${URLs.GARDENS}${URLs.GARDEN_METRICS.replace(
                      ":id",
                      garden.gardenId.toString()
                    )}`
                  )
                }
                handleDelete={() => handleDelete(garden.gardenId.toString())}
                handleEdit={() =>
                  navigate(
                    `${URLs.GARDENS}${URLs.DETAIL.replace(
                      ":id",
                      garden.gardenId.toString()
                    )}`
                  )
                }
              />
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default GardensList;
