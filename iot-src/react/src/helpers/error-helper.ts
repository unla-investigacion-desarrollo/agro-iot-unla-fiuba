export const getErrorText = (errorCode: number) => {
  if (errorCode === 403) return "No tiene permisos para ver este elemento";
  if (errorCode === 404) return "No se encontró el elemento";
  if (errorCode === 500) return "Error interno en el servidor";
};
