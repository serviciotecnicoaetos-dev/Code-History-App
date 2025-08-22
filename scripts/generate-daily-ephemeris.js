#!/usr/bin/env node

import { createClient } from '@supabase/supabase/supabase-js'
import OpenAI from 'openai'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

// Configuración de APIs
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de Supabase')
  process.exit(1)
}

if (!openaiApiKey) {
  console.error('❌ Error: Falta OPENAI_API_KEY')
  process.exit(1)
}

// Inicializar clientes
const supabase = createClient(supabaseUrl, supabaseKey)
const openai = new OpenAI({ apiKey: openaiApiKey })

// Función para obtener la fecha objetivo
function getTargetDate() {
  const args = process.argv.slice(2)
  
  if (args.length > 0) {
    const dateArg = args[0]
    const targetDate = new Date(dateArg)
    
    if (isNaN(targetDate.getTime())) {
      console.error('❌ Error: Formato de fecha inválido. Use YYYY-MM-DD')
      process.exit(1)
    }
    
    return targetDate
  }
  
  // Si no hay argumentos, generar para mañana
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
}

// Función para generar efeméride con OpenAI
async function generateEphemeris(date) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  
  console.log(`🎯 Generando efeméride para ${day}/${month}/${year}...`)
  
  try {
    const prompt = `Genera una efeméride histórica relacionada con la programación, tecnología o computación para el ${day} de ${month}. 
    
    Requisitos:
    - Debe ser un evento real y verificable
    - Relacionado con programación, software, hardware, internet, o tecnología
    - Incluir año del evento
    - Descripción clara y concisa (máximo 200 palabras)
    - Formato: "El [fecha], [descripción del evento]"
    
    Ejemplo de formato:
    "El 22 de agosto de 2007, Google lanza oficialmente la versión 1.0 de Google Web Toolkit (GWT), un framework que permite escribir aplicaciones web complejas en Java y compilarlas a JavaScript, influyendo en la evolución de herramientas de desarrollo web y la adopción de compilación cruzada."
    
    Genera solo la efeméride, sin explicaciones adicionales.`
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7
    })
    
    const ephemerisText = completion.choices[0].message.content.trim()
    
    // Extraer el año del evento de la descripción
    const yearMatch = ephemerisText.match(/(\d{4})/)
    const historicalYear = yearMatch ? parseInt(yearMatch[1]) : null
    
    return {
      day,
      month,
      year,
      event: ephemerisText,
      historical_day: day,
      historical_month: month,
      historical_year: historicalYear,
      display_date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    }
    
  } catch (error) {
    console.error('❌ Error generando efeméride con OpenAI:', error.message)
    throw error
  }
}

// Función para guardar en Supabase
async function saveEphemeris(ephemerisData) {
  try {
    const { data, error } = await supabase
      .from('ephemerides')
      .insert([ephemerisData])
      .select()
    
    if (error) {
      throw error
    }
    
    console.log('✅ Efeméride guardada exitosamente')
    return data[0]
    
  } catch (error) {
    console.error('❌ Error guardando en Supabase:', error.message)
    throw error
  }
}

// Función principal
async function main() {
  try {
    const targetDate = getTargetDate()
    console.log(`🚀 Iniciando generación de efeméride...`)
    
    // Generar efeméride
    const ephemerisData = await generateEphemeris(targetDate)
    console.log('📝 Efeméride generada:', ephemerisData.event.substring(0, 100) + '...')
    
    // Guardar en base de datos
    const savedEphemeris = await saveEphemeris(ephemerisData)
    
    console.log(`🎉 ¡Efeméride generada y guardada para ${targetDate.toLocaleDateString('es-ES')}!`)
    console.log(`📊 ID: ${savedEphemeris.id}`)
    
  } catch (error) {
    console.error('💥 Error en la ejecución:', error.message)
    process.exit(1)
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateEphemeris, saveEphemeris }
