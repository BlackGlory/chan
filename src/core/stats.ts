export function stats() {
  return {
    memoryUsage: process.memoryUsage()
  , cpuUsage: process.cpuUsage()
  , resourceUsage: process.resourceUsage()
  }
}
