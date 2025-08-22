# Sistema de Generación Automática de Efemérides

Este sistema permite generar efemérides de programación automáticamente usando OpenAI y almacenarlas en Supabase.

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno en `.env.local`:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# OpenAI
OPENAI_API_KEY=tu_openai_api_key
```

## 📝 Uso Manual

### Generar efeméride para mañana:
```bash
npm run generate:ephemeris
```

### Generar para una fecha específica:
```bash
npm run generate:ephemeris:date 2024-12-25
```

### Ejecutar directamente:
```bash
node scripts/generate-daily-ephemeris.js
node scripts/generate-daily-ephemeris.js 2024-12-25
```

## ⏰ Automatización con Cron

### Instalar cron job automático:
```bash
npm run cron:install
```

### Ver cron jobs actuales:
```bash
npm run cron:show
```

### Remover cron job:
```bash
npm run cron:remove
```

## 🔧 Configuración del Cron

El cron job se ejecuta **todos los días a las 00:01** y:
- Genera una efeméride para el día siguiente
- La guarda en la base de datos Supabase
- Registra logs en `logs/ephemeris-generation.log`

## 📊 Estructura de Datos

La efeméride se guarda con esta estructura:
```json
{
  "id": 1,
  "day": 22,
  "month": 8,
  "year": 2025,
  "event": "El 22 de agosto de 2007, Google lanza...",
  "created_at": "2025-08-22T13:50:21.788073+00:00",
  "historical_day": 22,
  "historical_month": 8,
  "historical_year": 2007,
  "display_date": "2025-08-22"
}
```

## 🎯 Prompt de OpenAI

El sistema usa este prompt para generar efemérides:
- Eventos reales y verificables
- Relacionados con programación/tecnología
- Máximo 200 palabras
- Formato específico con fecha y descripción

## 📝 Logs

Los logs se guardan en `logs/ephemeris-generation.log` e incluyen:
- Fecha y hora de ejecución
- Efeméride generada
- Estado de guardado en Supabase
- Errores si los hay

## 🚨 Solución de Problemas

### Error: "Faltan variables de Supabase"
- Verifica que `.env.local` tenga las variables correctas
- Asegúrate de que `SUPABASE_SERVICE_ROLE_KEY` esté configurado

### Error: "Falta OPENAI_API_KEY"
- Agrega tu API key de OpenAI en `.env.local`
- Verifica que la key sea válida y tenga créditos

### Error de permisos en Supabase
- Verifica que la tabla `ephemerides` tenga RLS habilitado
- Asegúrate de que el rol tenga permisos de inserción

### Cron no funciona
- Verifica que cron esté instalado: `which crontab`
- Revisa los logs del sistema: `sudo journalctl -u cron`

## 🔄 Alternativas a Cron

Si cron no está disponible:

### GitHub Actions (Recomendado para Vercel):
```yaml
name: Generate Daily Ephemeris
on:
  schedule:
    - cron: '1 0 * * *'
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm run generate:ephemeris
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

### Systemd Timer (Linux):
```ini
# /etc/systemd/system/generate-ephemeris.timer
[Unit]
Description=Generate daily ephemeris
Requires=generate-ephemeris.service

[Timer]
OnCalendar=*-*-* 00:01:00
Persistent=true

[Install]
WantedBy=timers.target
```

## 📚 Referencias

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cron Documentation](https://man7.org/linux/man-pages/man5/crontab.5.html)
