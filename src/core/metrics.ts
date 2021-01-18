export function metrics() {
  return {
    memoryUsage: process.memoryUsage()
  , cpuUsage: process.cpuUsage()
  , resourceUsage: process.resourceUsage()
  }
}
