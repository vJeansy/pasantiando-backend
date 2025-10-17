export default function formatDate(date: string) {
    if (!date) return "";

    const d = new Date(date);
    if (isNaN(d.getTime())) return ""; // Maneja fechas inválidas

    // Usa el locale "es-DO" para formato dominicano (DD/MM/YYYY)
    return d.toLocaleDateString("es-DO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
