const SEGMENTS = {
  middle_school_br: {
    name: 'Middle School Brasil',
    country: 'BR',
    age_min: 13,
    age_max: 17,
    interests: [
      { id: '6003136601172', name: 'Educação' },
      { id: '6002925969972', name: 'Dever de casa' },
      { id: '6003529506874', name: 'Jogos educativos' },
      { id: '6003139266461', name: 'Khan Academy' },
      { id: '6003454671972', name: 'YouTube' },
      { id: '6003397059695', name: 'Vestibular' },
    ],
    languages: [4],  // pt_BR
    placements: ['Instagram Feed', 'Instagram Stories', 'Facebook Feed'],
    budget_daily: 1500,
    currency: 'BRL'
  },

  high_school_br: {
    name: 'High School Brasil',
    country: 'BR',
    age_min: 18,
    age_max: 20,
    interests: [
      { id: '6003397059695', name: 'Vestibular' },
      { id: '6003397059696', name: 'ENEM' },
      { id: '6003136601172', name: 'Educação' },
      { id: '6002914012227', name: 'Matemática' },
      { id: '6003009574301', name: 'Física' },
      { id: '6003009574302', name: 'Química' },
      { id: '6003009574303', name: 'Biologia' },
      { id: '6003141961987', name: 'Literatura' },
    ],
    languages: [4],
    placements: ['Instagram Feed', 'Instagram Stories', 'Instagram Reels', 'Facebook Feed'],
    budget_daily: 2000,
    currency: 'BRL'
  },

  college_br: {
    name: 'College Brasil',
    country: 'BR',
    age_min: 18,
    age_max: 25,
    interests: [
      { id: '6003136601172', name: 'Educação' },
      { id: '6003529506874', name: 'Faculdade' },
      { id: '6002914012227', name: 'Universidade' },
      { id: '6003397059696', name: 'ENEM' },
      { id: '6003009574305', name: 'Medicina' },
      { id: '6003009574306', name: 'Direito' },
      { id: '6003009574307', name: 'Engenharia' },
    ],
    education_statuses: [13, 12],  // college_grad, some_college
    languages: [4],
    placements: ['Instagram Feed', 'Instagram Stories', 'Instagram Reels', 'Facebook Feed', 'Facebook Stories'],
    budget_daily: 2500,
    currency: 'BRL'
  },

  middle_school_us: {
    name: 'Middle School USA',
    country: 'US',
    age_min: 13,
    age_max: 17,
    interests: [
      { id: '6003136601172', name: 'Education' },
      { id: '6003529506874', name: 'Educational games' },
      { id: '6003139266461', name: 'Khan Academy' },
      { id: '6003454671972', name: 'Learning apps' },
      { id: '6002914012227', name: 'Science' },
      { id: '6002914012228', name: 'Mathematics' },
    ],
    languages: [6],  // en_US
    placements: ['Instagram Feed', 'Instagram Stories', 'Facebook Feed'],
    budget_daily: 1000,
    currency: 'USD'
  },

  high_school_us: {
    name: 'High School USA',
    country: 'US',
    age_min: 18,
    age_max: 20,
    interests: [
      { id: '6003397059697', name: 'SAT' },
      { id: '6003397059698', name: 'ACT' },
      { id: '6003136601172', name: 'College prep' },
      { id: '6003139266461', name: 'Khan Academy' },
      { id: '6003454671975', name: 'Quizlet' },
      { id: '6003454671976', name: 'Chegg' },
      { id: '6003454671977', name: 'Study skills' },
    ],
    languages: [6],
    placements: ['Instagram Feed', 'Instagram Stories', 'Instagram Reels', 'Facebook Feed'],
    budget_daily: 1500,
    currency: 'USD'
  },

  college_us: {
    name: 'College USA',
    country: 'US',
    age_min: 18,
    age_max: 24,
    interests: [
      { id: '6003136601172', name: 'College' },
      { id: '6003529506874', name: 'University life' },
      { id: '6003454671976', name: 'Chegg' },
      { id: '6003454671978', name: 'Coursera' },
      { id: '6003454671979', name: 'edX' },
      { id: '6003009574308', name: 'STEM' },
      { id: '6003009574309', name: 'Pre-med' },
    ],
    education_statuses: [12, 13],
    languages: [6],
    placements: ['Instagram Feed', 'Instagram Stories', 'Instagram Reels', 'Facebook Feed', 'Facebook Stories'],
    budget_daily: 2000,
    currency: 'USD'
  }
};

module.exports = { SEGMENTS };
