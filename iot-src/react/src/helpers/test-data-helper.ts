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
    description: "Rango humedad suelo",
    hsStartValue: 10,
    hsEndValue: 30,
    hrStartValue: 20,
    hrEndValue: 50,
    taStartValue: 15,
    taEndValue: 25,
    metricTypeDescription: "Descripción métrica 1",
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

export const GardenBasicInfoSectorRangesTestData: ISectorBasicData[] = [
  {
    sectorId: 1,
    name: "Sector de prueba 1",
    metricAcceptationRange: 
    {
      metricAcceptationRangeId: 1,
      name: "Tomate",
      description: "descripcion",
      hsStartValue: 10,
      hsEndValue: 30,
      hrStartValue: 20,
      hrEndValue: 50,
      taStartValue: 15,
      taEndValue: 25,
      metricTypeDescription: "Descripción métrica 1",
    },
  },
  {
    sectorId: 2,
    name: "Sector de prueba 2",
    metricAcceptationRange: {
      metricAcceptationRangeId: 2,
      name: "Lechuga",
      description: "lechuga mantecosa",
      hsStartValue: 10,
      hsEndValue: 30,
      hrStartValue: 20,
      hrEndValue: 50,
      taStartValue: 15,
      taEndValue: 25,
      metricTypeDescription: "Descripción métrica 2",
    },
  },
  {
    sectorId: 3,
    name: "Sector de prueba 3",
    metricAcceptationRange: {
      metricAcceptationRangeId: 3,
      name: "Tomate",
      description: "tomate perita",
      hsStartValue: 10,
      hsEndValue: 30,
      hrStartValue: 20,
      hrEndValue: 50,
      taStartValue: 15,
      taEndValue: 25,
      metricTypeDescription: "Descripción métrica 3",
    }, 
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
        taValue: 10,
        hrValue: 20,
        hsValue: 30,
        rainForecast: false,
        irrigation: true,
        valueType: "string",
        isCurrentReading: true,
      },
      {
        metricReadingId: 2,
        readingDate: DateTime.now().toFormat(dateFormat),
        taValue: 30,
        hrValue: 20,
        hsValue: 10,
        rainForecast: true,
        irrigation: false,
        valueType: "string",
        isCurrentReading: true,
      },
      {
        metricReadingId: 3,
        readingDate: DateTime.now().toFormat(dateFormat),
        taValue: 30,
        hrValue: 20,
        hsValue: 10,
        rainForecast: true,
        irrigation: true,
        valueType: "string",
        isCurrentReading: false,
      },
      {
        metricReadingId: 4,
        readingDate: DateTime.now().toFormat(dateFormat),
        taValue: 80,
        hrValue: 80,
        hsValue: 80,
        rainForecast: false,
        irrigation: false,
        valueType: "string",
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
        taValue: 80,
        hrValue: 80,
        hsValue: 80,
        rainForecast: false,
        irrigation: false,
        valueType: "string",
        isCurrentReading: true,
      },
      {
        metricReadingId: 8,
        readingDate: DateTime.now().toFormat(dateFormat),
        taValue: 80,
        hrValue: 80,
        hsValue: 80,
        rainForecast: false,
        irrigation: false,
        valueType: "string",
        isCurrentReading: true,
      },
      {
        metricReadingId: 9,
        readingDate: DateTime.now().toFormat(dateFormat),
        taValue: 80,
        hrValue: 80,
        hsValue: 80,
        rainForecast: false,
        irrigation: false,
        valueType: "string",
        isCurrentReading: true,
      },
    ],
  },
  { sectorId: 3, sectorName: "Sector de prueba 3", readings: [] },
];
