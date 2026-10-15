export const corners = [
  { id: 'FL', name: '前場左', shortName: '前左', type: '反手放短', x: 15, y: 15, active: true, zone: 'front' },
  { id: 'FR', name: '前場右', shortName: '前右', type: '正手放短', x: 85, y: 15, active: true, zone: 'front' },
  { id: 'ML', name: '中場左', shortName: '中左', type: '反手截擊', x: 15, y: 40, active: true, zone: 'middle' },
  { id: 'MR', name: '中場右', shortName: '中右', type: '正手截擊', x: 85, y: 40, active: true, zone: 'middle' },
  { id: 'BL', name: '後場左', shortName: '後左', type: '反手深球', x: 15, y: 88, active: true, zone: 'back' },
    { id: 'BR', name: '後場右', shortName: '後右', type: '正手深球', x: 85, y: 88, active: true, zone: 'back' },
]

export const trainingModes = [
  { id: 'match', name: '實戰隨機', description: '隨機變速 ±25%', pace: 3.2 },
  { id: 'fixed', name: '固定節拍', description: '穩定等距節奏', pace: 3.0 },
  { id: 'hiit', name: 'HIIT 衝刺', description: '短間隔高強度', pace: 2.4 },
]