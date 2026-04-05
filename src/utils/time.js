export function getTimeCommitment(timeRange) {
    if (!timeRange || typeof timeRange !== 'string') return ''
  
    const normalized = timeRange
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace('–', '-')
  
    const match = normalized.match(
      /^(\d{1,2})(?::(\d{2}))?(am|pm)-(\d{1,2})(?::(\d{2}))?(am|pm)$/
    )
  
    if (!match) return ''
  
    let [, startHour, startMinute, startPeriod, endHour, endMinute, endPeriod] = match
  
    startHour = Number(startHour)
    endHour = Number(endHour)
    startMinute = Number(startMinute || 0)
    endMinute = Number(endMinute || 0)
  
    if (startPeriod === 'am' && startHour === 12) startHour = 0
    if (startPeriod === 'pm' && startHour !== 12) startHour += 12
  
    if (endPeriod === 'am' && endHour === 12) endHour = 0
    if (endPeriod === 'pm' && endHour !== 12) endHour += 12
  
    const startTotal = startHour * 60 + startMinute
    const endTotal = endHour * 60 + endMinute
  
    const diffMinutes = endTotal - startTotal
    if (diffMinutes <= 0) return ''
  
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
  
    if (hours > 0 && minutes > 0) {
      return `${hours} hr ${minutes} min`
    }
  
    if (hours === 1) return '1 hr'
    if (hours > 1) return `${hours} hrs`
  
    return `${minutes} min`
  }