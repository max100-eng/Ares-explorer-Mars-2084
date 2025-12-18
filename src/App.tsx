const preguntarAMarte = async () => {
    if (!pregunta) return;
    setCargando(true);
    setRespuesta("📡 Sincronizando enlace con base Ares...");

    try {
      // ✅ LA SOLUCIÓN DEFINITIVA: 
      // Forzamos el nombre 'gemini-1.5-flash' PERO con la versión 'v1beta'
      // Esta es la combinación que permite Google en la mayoría de las regiones ahora.
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: "v1beta" } 
      );

      const result = await model.generateContent(pregunta);
      const response = await result.response;
      setRespuesta(response.text());

    } catch (error: any) {
      console.error("Fallo de comunicación:", error);
      // Mensaje de diagnóstico dinámico
      setRespuesta(
        `❌ ERROR DE ENLACE: ${error.message}\n\n` +
        `Sugerencia: El satélite requiere protocolo v1beta. Reintentando configuración...`
      );
    }
    setCargando(false);
  };