import { EnvironmentOutlined } from "@ant-design/icons";
import FormOutlined from "@ant-design/icons/lib/icons/FormOutlined";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import { IGardenBasicInfo } from "../../api/gardens/models";

interface Props {
  garden: IGardenBasicInfo;
}

export const GardenBasicInfo: React.FC<Props> = ({ garden }) => {
  return (
    <>
      <Title level={4}>{garden.name}</Title>
      {garden.description && (
        <Paragraph>
          {<FormOutlined style={{ fontSize: "1.2rem" }} />} {garden.description}
        </Paragraph>
      )}

      {garden.location && (
        <Paragraph>
          {<EnvironmentOutlined style={{ fontSize: "1.2rem" }} />}
          {garden.location}
        </Paragraph>
      )}
    </>
  );
};
