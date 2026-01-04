// /src/api/roverApi.js

export async function getRoverData() {
  try {
    const response = await fetch("/api/rover");

    if (!response.ok) {
      throw new Error("Error al obtener datos del rover");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getRoverData:", error);
    throw error;
  }
}
