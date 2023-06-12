import { DateTime } from "luxon";
import { IGardenBasicInfo } from "../api/gardens/models";
import {
  IMetricAcceptationRange,
  IMetricAcceptationRangeGarden,
} from "../api/metricAcceptationRanges/models";
import { IMetricType } from "../api/metricTypes/models";
import {
  ISectorBasicData,
  ISectorMetricData,
  ISectorMetricRange,
} from "../api/sectors/models";
import { dateFormat } from "./date-helper";
import { randomNumber } from "./metric-helper";

export const MetricAcceptationRangesData: IMetricAcceptationRange[] = [
  {
    metricAcceptationRangeId: 1,
    name: "Rango 1",
    startValue: 35.2,
    endValue: 35.2,
    metricTypeCode: "HUMEDAD_AMBIENTE",
    metricTypeDescription: "Humedad del ambiente",
  },
  {
    metricAcceptationRangeId: 2,
    name: "Rango 2",
    startValue: 10.149,
    endValue: 10,
    metricTypeCode: "HUMEDAD_SUELO",
    metricTypeDescription: "Humedad del suelo",
  },
  {
    metricAcceptationRangeId: 3,
    name: "Rango 3",
    startValue: 25.1,
    endValue: 35.4,
    metricTypeCode: "TEMPERATURA_AMBIENTE",
    metricTypeDescription: "Temperatura ambiente",
  },
  {
    metricAcceptationRangeId: 4,
    name: "Rango 4",
    startValue: 15,
    endValue: 20,
    metricTypeCode: "HUMEDAD_AMBIENTE",
    metricTypeDescription: "Humedad del ambiente",
  },
  {
    metricAcceptationRangeId: 5,
    name: "Rango 5",
    startValue: 35,
    endValue: 37,
    metricTypeCode: "TEMPERATURA_AMBIENTE",
    metricTypeDescription: "Temperatura ambiente",
  },
];

export const MetricTypesData: IMetricType[] = [
  { code: "TEMPERATURA_AMBIENTE", description: "Temperatura Ambiente" },
  { code: "HUMEDAD_SUELO", description: "Humedad del suelo" },
  { code: "HUMEDAD_AMBIENTE", description: "Humedad Ambiente" },
];

export const MetricAcceptationRangesGardenData: IMetricAcceptationRangeGarden[] =
  [
    {
      metricAcceptationRangeId: 1,
      name: "Temperatura Ambiente - Calabazas",
      metricTypeCode: "TEMPERATURA_AMBIENTE",
      metricTypeDescription: "Temperatura Ambiente",
    },

    {
      metricAcceptationRangeId: 5,
      name: "Humedad suelo - Frutas tropicales",
      metricTypeCode: "HUMEDAD_SUELO",
      metricTypeDescription: "Humedad del Suelo",
    },

    {
      metricAcceptationRangeId: 8,
      name: "Humedad suelo - Frambuesas",
      metricTypeCode: "HUMEDAD_SUELO",
      metricTypeDescription: "Humedad del Suelo",
    },
  ];

export const SectorRangesTestData: ISectorMetricRange[] = [
  {
    name: "Rango de Temperatura Ambiente 1",
    metricTypeDescription: "Temperatura Ambiente",
    metricTypeCode: "TEMPERATURA_AMBIENTE",
    startValue: 10.1,
    endValue: 10.9,
  },
  {
    name: "Rango de Humedad del suelo 1",
    metricTypeDescription: "Humedad del Suelo",
    metricTypeCode: "HUMEDAD_SUELO",
    startValue: 18,
    endValue: 22,
  },
  {
    name: "Rango de Temperatura Ambiente 1",
    metricTypeDescription: "Humedad del Ambiente",
    metricTypeCode: "HUMEDAD_AMBIENTE",
    startValue: 15.2,
    endValue: 16.9,
  },
];

export const SectorRangesTestData2: ISectorMetricRange[] = [
  {
    name: "Rango de Temperatura Ambiente 1",
    metricTypeDescription: "Temperatura Ambiente",
    metricTypeCode: "TEMPERATURA_AMBIENTE",
    startValue: 1,
    endValue: 20,
  },
  {
    name: "Rango de Temperatura Ambiente 1",
    metricTypeDescription: "Humedad del Suelo",
    metricTypeCode: "HUMEDAD_SUELO",
    startValue: 20,
    endValue: 100,
  },
  {
    name: "Rango de Temperatura Ambiente 1",
    metricTypeDescription: "Humedad del Ambiente",
    metricTypeCode: "HUMEDAD_AMBIENTE",
    startValue: 25,
    endValue: 50,
  },
];

export const SectorRangesTestData3: ISectorMetricRange[] = [
  {
    name: "Rango de Temperatura Ambiente 1",
    metricTypeDescription: "Temperatura Ambiente",
    metricTypeCode: "TEMPERATURA_AMBIENTE",
    startValue: 20.22,
    endValue: 10.5,
  },
  {
    name: "Rango de Temperatura Ambiente 1",
    metricTypeDescription: "Humedad del Suelo",
    metricTypeCode: "HUMEDAD_SUELO",
    startValue: 1,
    endValue: 50,
  },
  {
    name: "Rango de Temperatura Ambiente 1",
    metricTypeDescription: "Humedad del Ambiente",
    metricTypeCode: "HUMEDAD_AMBIENTE",
    startValue: 30,
    endValue: 40,
  },
];

export const GardenBasicInfoSectorRangesTestData: ISectorBasicData[] = [
  {
    sectorId: 1,
    name: "Sector de prueba 1",
    sectorMetricRanges: [...SectorRangesTestData],
  },
  {
    sectorId: 2,
    name: "Sector de prueba 2",
    sectorMetricRanges: [...SectorRangesTestData2],
  },
  {
    sectorId: 3,
    name: "Sector de prueba 3",
    sectorMetricRanges: [...SectorRangesTestData3],
  },
];

export const GardenBasicInfoTestData: IGardenBasicInfo = {
  gardenId: 1,
  name: "Huerta de prueba en vivo",
  description: "Descripción de la huerta de prueba en vivo",
  location: "29 de Septiembre 1928, Buenos Aires, Argentina",
  sectorRangesBasicData: GardenBasicInfoSectorRangesTestData,
};

const TestData: ISectorMetricData[] = [
  {
    sectorId: 1,
    sectorName: "Sector de Prueba",
    readings: [
      {
        metricReadingId: 1,
        readingDate: DateTime.now().toFormat(dateFormat),
        value: randomNumber(10.25, 50.2).toString(),
        valueType: "string",
        metricTypeCode: "TEMPERATURA_AMBIENTE",
        metricTypeDescription: "Temperatura Ambiente",
        isCurrentReading: true,
      },
      {
        metricReadingId: 2,
        readingDate: DateTime.now().toFormat(dateFormat),
        value: randomNumber(10.25, 20.1).toString(),
        valueType: "string",
        metricTypeCode: "HUMEDAD_SUELO",
        metricTypeDescription: "Humedad del suelo",
        isCurrentReading: true,
      },
      {
        metricReadingId: 3,
        readingDate: DateTime.now().toFormat(dateFormat),
        value: randomNumber(1.8, 12.2).toString(),
        valueType: "string",
        metricTypeCode: "HUMEDAD_AMBIENTE",
        metricTypeDescription: "Humedad del Ambiente",
        isCurrentReading: true,
      },
      {
        metricReadingId: 4,
        readingDate: DateTime.now().toFormat(dateFormat),
        value: randomNumber(1.8, 12.2).toString(),
        valueType: "string",
        metricTypeCode: "HUMEDAD_AMBIENTE",
        metricTypeDescription: "Humedad del Ambiente",
        isCurrentReading: false,
      },
      {
        metricReadingId: 5,
        readingDate: DateTime.now().toFormat(dateFormat),
        value: randomNumber(1.8, 12.2).toString(),
        valueType: "string",
        metricTypeCode: "HUMEDAD_AMBIENTE",
        metricTypeDescription: "Humedad del Ambiente",
        isCurrentReading: false,
      },
    ],
  },
  {
    sectorId: 2,
    sectorName: "Sector de prueba 2",
    readings: [
      {
        metricReadingId: 7,
        readingDate: DateTime.now().toFormat(dateFormat),
        value: randomNumber(10.25, 50.2).toString(),
        valueType: "string",
        metricTypeCode: "TEMPERATURA_AMBIENTE",
        metricTypeDescription: "Temperatura Ambiente",
        isCurrentReading: true,
      },
      {
        metricReadingId: 8,
        readingDate: DateTime.now().toFormat(dateFormat),
        value: randomNumber(10.25, 20.1).toString(),
        valueType: "string",
        metricTypeCode: "HUMEDAD_SUELO",
        metricTypeDescription: "Humedad del suelo",
        isCurrentReading: true,
      },
      {
        metricReadingId: 9,
        readingDate: DateTime.now().toFormat(dateFormat),
        value: randomNumber(1.8, 12.2).toString(),
        valueType: "string",
        metricTypeCode: "HUMEDAD_AMBIENTE",
        metricTypeDescription: "Humedad del Ambiente",
        isCurrentReading: true,
      },
    ],
  },
  { sectorId: 3, sectorName: "Sector de prueba 3", readings: [] },
];
