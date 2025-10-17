export function getCurriculumSelect() {
  return {
    id: true,
    middle_name: true,
    maiden_name: true,
    street_address: true,
    city: true,
    state_province: true,
    postal_code: true,
    country: true,
    resume_url: true,
    linkedin_url: true,
    profile_picture_url: true,
    headline: true,
    summary_title: true,
    summary: true,
    willing_to_travel: true,
    has_vehicle: true,
  };
}

export function getProjectSelect() {
  return {
    title: true,
    description: true,
    technologies_used: true,
    project_url: true,
    is_personal: true,
    created_at: true,
  }
}

export function getExperienceSelect() {
  return {
    company_name: true,
    role_title: true,
    start_date: true,
    end_date: true,
    is_current: true,
    description: true,
  }
}

export function getEducationSelect() {
  return {
    institution_name: true,
    study_level: true,
    degree_name: true,
    field_of_study: true,
    started_date: true,
    end_date: true,
    is_current: true,
    honors: true,
  }
}