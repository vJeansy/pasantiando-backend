export function mapIcon(type: string): string {
  switch (type) {
    case 'application_submitted':
    case 'application_received':
      return 'fa-check-circle';
    case 'interview_scheduled':
      return 'fa-calendar-alt';
    case 'profile_viewed':
    case 'profile_viewed_by_business':
      return 'fa-eye';
    default:
      return 'fa-info-circle';
  }
}

export function mapColor(type: string): string {
  switch (type) {
    case 'application_submitted':
    case 'application_received':
      return 'bg-green-100 text-green-500';
    case 'interview_scheduled':
      return 'bg-blue-100 text-blue-500';
    case 'profile_viewed':
    case 'profile_viewed_by_business':
      return 'bg-yellow-100 text-yellow-500';
    default:
      return 'bg-gray-100 text-gray-500';
  }
}