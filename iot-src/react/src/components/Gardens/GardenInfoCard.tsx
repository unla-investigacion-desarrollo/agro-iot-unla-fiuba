import {
  DeleteFilled,
  EditOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Card, Popconfirm, Tooltip } from "antd";
import Meta from "antd/lib/card/Meta";
import gardenPlaceholder from "../../assets/ef3-placeholder-image.jpg";

interface Props {
  name: string;
  description: string;
  location: string;
  imageUrl?: string;
  handleViewDetails?: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

const GardenInfoCard: React.FC<Props> = ({
  name,
  description,
  location,
  imageUrl,
  handleDelete,
  handleViewDetails,
  handleEdit,
}) => {
  return (
    <Card
      style={{
        maxWidth: 250,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
      }}
      cover={<img alt={name} src={imageUrl || gardenPlaceholder} />}
      actions={[
        <Tooltip title="Detalles">
          <FileTextOutlined onClick={handleViewDetails} />
        </Tooltip>,

        <Tooltip title="Editar">
          <EditOutlined onClick={handleEdit} />
        </Tooltip>,

        <Popconfirm
          title="¿Eliminar?"
          onConfirm={handleDelete}
          cancelText="Cancelar"
        >
          <Tooltip title="Eliminar">
            <DeleteFilled />
          </Tooltip>
        </Popconfirm>,
      ]}
    >
      <Meta
        title={name}
        className="ant-card-no-ellipsis-title"
        description={
          <>
            <p style={{ marginBottom: 5 }}>
              {<FormOutlined />} {description}
            </p>
            <p style={{ marginBottom: 5 }}>
              {<EnvironmentOutlined />} {location}
            </p>
          </>
        }
      />
    </Card>
  );
};

export default GardenInfoCard;
