#!/usr/bin/env node

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execAsync = promisify(exec)

// Función para verificar si cron está disponible
async function checkCronAvailability() {
  try {
    await execAsync('which crontab')
    return true
  } catch {
    return false
  }
}

// Función para crear el cron job
async function setupCronJob() {
  try {
    // Obtener la ruta absoluta del script
    const scriptPath = path.resolve('./scripts/generate-daily-ephemeris.js')
    
    // Crear el comando cron (ejecutar todos los días a las 00:01)
    const cronCommand = `1 0 * * * cd ${process.cwd()} && node ${scriptPath} >> logs/ephemeris-generation.log 2>&1`
    
    // Crear directorio de logs si no existe
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs')
      console.log('📁 Directorio logs creado')
    }
    
    // Obtener el cron actual
    const { stdout: currentCron } = await execAsync('crontab -l 2>/dev/null || echo ""')
    
    // Verificar si ya existe el cron job
    if (currentCron.includes(scriptPath)) {
      console.log('⚠️  El cron job ya está configurado')
      return
    }
    
    // Agregar el nuevo cron job
    const newCron = currentCron + cronCommand + '\n'
    
    // Crear archivo temporal con el nuevo cron
    const tempCronFile = '/tmp/new_cron'
    fs.writeFileSync(tempCronFile, newCron)
    
    // Instalar el nuevo cron
    await execAsync(`crontab ${tempCronFile}`)
    
    // Limpiar archivo temporal
    fs.unlinkSync(tempCronFile)
    
    console.log('✅ Cron job configurado exitosamente')
    console.log('🕐 Se ejecutará todos los días a las 00:01')
    console.log('📝 Los logs se guardarán en logs/ephemeris-generation.log')
    
  } catch (error) {
    console.error('❌ Error configurando cron job:', error.message)
    throw error
  }
}

// Función para mostrar el cron actual
async function showCurrentCron() {
  try {
    const { stdout } = await execAsync('crontab -l 2>/dev/null || echo "No hay cron jobs configurados"')
    console.log('📋 Cron jobs actuales:')
    console.log(stdout)
  } catch (error) {
    console.error('❌ Error mostrando cron jobs:', error.message)
  }
}

// Función para remover el cron job
async function removeCronJob() {
  try {
    const scriptPath = path.resolve('./scripts/generate-daily-ephemeris.js')
    
    // Obtener el cron actual
    const { stdout: currentCron } = await execAsync('crontab -l 2>/dev/null || echo ""')
    
    // Filtrar el cron job específico
    const filteredCron = currentCron
      .split('\n')
      .filter(line => !line.includes(scriptPath))
      .join('\n')
    
    if (filteredCron === currentCron) {
      console.log('⚠️  No se encontró el cron job para remover')
      return
    }
    
    // Crear archivo temporal con el cron filtrado
    const tempCronFile = '/tmp/filtered_cron'
    fs.writeFileSync(tempCronFile, filteredCron)
    
    // Instalar el cron filtrado
    await execAsync(`crontab ${tempCronFile}`)
    
    // Limpiar archivo temporal
    fs.unlinkSync(tempCronFile)
    
    console.log('✅ Cron job removido exitosamente')
    
  } catch (error) {
    console.error('❌ Error removiendo cron job:', error.message)
    throw error
  }
}

// Función principal
async function main() {
  const command = process.argv[2]
  
  try {
    // Verificar disponibilidad de cron
    const cronAvailable = await checkCronAvailability()
    if (!cronAvailable) {
      console.error('❌ Cron no está disponible en este sistema')
      console.log('💡 Alternativas:')
      console.log('   - Usar systemd timers (Linux)')
      console.log('   - Usar Windows Task Scheduler (Windows)')
      console.log('   - Usar GitHub Actions para automatización')
      process.exit(1)
    }
    
    switch (command) {
      case 'install':
        await setupCronJob()
        break
      case 'remove':
        await removeCronJob()
        break
      case 'show':
        await showCurrentCron()
        break
      default:
        console.log('📖 Uso: node scripts/setup-cron.js [install|remove|show]')
        console.log('')
        console.log('Comandos disponibles:')
        console.log('  install  - Configurar cron job automático')
        console.log('  remove   - Remover cron job')
        console.log('  show     - Mostrar cron jobs actuales')
        console.log('')
        console.log('Ejemplo:')
        console.log('  node scripts/setup-cron.js install')
    }
    
  } catch (error) {
    console.error('💥 Error en la ejecución:', error.message)
    process.exit(1)
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { setupCronJob, removeCronJob, showCurrentCron }
