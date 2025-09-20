import React, { useEffect, useState } from "react";
import { Empty, Select, Spin } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import GardensService from "../../api/gardens/GardensService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

interface IMetricReadingDTO {
  metricReadingId: number;
  readingDate: string;
  hsValue: number | null;
}

interface Sector {
  sectorId: number;
  name: string;
  readings: IMetricReadingDTO[];
}

interface HsChartByGardenProps {
  gardenId: number;
}

const HsChartByGarden: React.FC<HsChartByGardenProps> = ({ gardenId }) => {
  const [range, setRange] = useState<"day" | "week" | "month" | "year">("day");
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const res: Sector[] = await GardensService.getMetrics(gardenId, range);

        // Transformamos lecturas -> formato tabular
        const formatted: any[] = [];

        res.forEach((sector) => {
          sector.readings
            .slice()
            .sort(
              (a, b) =>
                new Date(a.readingDate).getTime() -
                new Date(b.readingDate).getTime()
            )
            .forEach((r) => {
              const dateObj = dayjs
                .utc(r.readingDate)
                .tz("America/Argentina/Buenos_Aires")
                .toDate();

              let row = formatted.find(
                (f) => f.date === dateObj.getTime()
              );
              if (!row) {
                row = { date: dateObj.getTime() }; // 🔹 usamos timestamp (número)
                formatted.push(row);
              }
              row[sector.name ?? "Desconocido"] = r.hsValue;
            });
        });

        formatted.sort((a, b) => a.date - b.date);
        
        setSectors(res);
        setData(formatted);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [gardenId, range]);

  return (
    <div>
      <Select
        value={range}
        onChange={(val) => setRange(val)}
        style={{ marginBottom: 16 }}
      >
        <Option value="day">Último día</Option>
        <Option value="week">Última semana</Option>
        <Option value="month">Último mes</Option>
        <Option value="year">Último año</Option>
      </Select>

      {loading ? (
        <Spin />
      ) : data.length === 0 ? (
        <Empty description="No hay datos disponibles" />
      ) : (
        <div style={{ width: "80%", margin: "0 auto" }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"          
                tickFormatter={(d: number) =>
                  dayjs(d).format("DD/MM/YYYY HH:mm")
                }
              />
              <YAxis tickFormatter={(v: number) => `${v}%`} />
              <Tooltip
                labelFormatter={(value: number) =>
                  dayjs(value).format("DD/MM/YYYY HH:mm")
                }
                formatter={(val: any, name: string) => [`${val}%`, name]}
              />
              <Legend />

              {sectors.map((s, i) => (
                <Line
                  key={s.name}
                  type="linear"
                  dataKey={s.name ?? "Desconocido"}
                  name={s.name ?? "Desconocido"}
                  stroke={["#1890ff", "#52c41a", "#fa541c", "#722ed1"][i % 4]}
                  dot={{ r: 3 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default HsChartByGarden;
