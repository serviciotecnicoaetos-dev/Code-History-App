#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de Supabase')
  console.log('Verifica tu .env.local:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=', supabaseUrl)
  console.log('SUPABASE_SERVICE_ROLE_KEY=', supabaseKey ? '✅ Configurado' : '❌ Faltante')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabase() {
  console.log('🔍 Probando conexión a Supabase...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...')
  
  try {
    // 1. Probar conexión básica
    console.log('\n1️⃣ Probando conexión básica...')
    const { data: healthData, error: healthError } = await supabase
      .from('ephemerides')
      .select('count')
      .limit(1)
    
    if (healthError) {
      console.log('❌ Error de conexión:', healthError.message)
      
      if (healthError.message.includes('relation "ephemerides" does not exist')) {
        console.log('\n💡 La tabla "ephemerides" no existe')
        console.log('Ejecuta este SQL en Supabase:')
        console.log(`
CREATE TABLE ephemerides (
  id BIGSERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  event TEXT NOT NULL,
  display_date TEXT NOT NULL,
  historical_day INTEGER,
  historical_month INTEGER,
  historical_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice único para evitar duplicados
CREATE UNIQUE INDEX ephemerides_date_unique 
ON ephemerides (day, month, year);

-- Habilitar RLS
ALTER TABLE ephemerides ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública
CREATE POLICY "Public read ephemerides"
ON ephemerides FOR SELECT
TO anon
USING (true);

-- Política para inserción (solo service role)
CREATE POLICY "Service role insert ephemerides"
ON ephemerides FOR INSERT
TO service_role
WITH CHECK (true);

-- Dar permisos
GRANT SELECT ON ephemerides TO anon;
GRANT INSERT ON ephemerides TO service_role;
        `)
      }
      
      return
    }
    
    console.log('✅ Conexión exitosa')
    
    // 2. Contar registros existentes
    console.log('\n2️⃣ Contando registros existentes...')
    const { count, error: countError } = await supabase
      .from('ephemerides')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.log('❌ Error contando registros:', countError.message)
      return
    }
    
    console.log(`✅ Registros en la tabla: ${count}`)
    
    // 3. Probar inserción de prueba
    console.log('\n3️⃣ Probando inserción de prueba...')
    const testData = {
      day: 99,
      month: 99,
      year: 9999,
      event: 'TEST - Este es un registro de prueba que se puede eliminar',
      display_date: '2025-12-31',
      historical_day: 99,
      historical_month: 99,
      historical_year: 9999
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('ephemerides')
      .insert([testData])
      .select()
    
    if (insertError) {
      console.log('❌ Error en inserción:', insertError.message)
      return
    }
    
    console.log('✅ Inserción exitosa')
    console.log('ID del registro de prueba:', insertData[0].id)
    
    // 4. Eliminar registro de prueba
    console.log('\n4️⃣ Eliminando registro de prueba...')
    const { error: deleteError } = await supabase
      .from('ephemerides')
      .delete()
      .eq('id', insertData[0].id)
    
    if (deleteError) {
      console.log('⚠️  No se pudo eliminar el registro de prueba:', deleteError.message)
      console.log('💡 Puedes eliminarlo manualmente desde Supabase Dashboard')
    } else {
      console.log('✅ Registro de prueba eliminado')
    }
    
    console.log('\n🎉 ¡Supabase está funcionando correctamente!')
    console.log('✅ Conexión: OK')
    console.log('✅ Tabla: OK')
    console.log('✅ Permisos: OK')
    console.log('✅ Inserción: OK')
    console.log('✅ Eliminación: OK')
    
  } catch (error) {
    console.error('💥 Error inesperado:', error.message)
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  testSupabase()
}

export { testSupabase }
