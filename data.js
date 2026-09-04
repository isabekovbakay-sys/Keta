window.KETA_DATA = {
  cycleStart: null,
  weeks: [
    {
      id: 1, title: 'Week 1', focus: 'Build the rhythm',
      days: [
        {key:'mon', name:'Lower Body', type:'Strength', duration:'32 min', equipment:'Heavy dumbbells', goal:'Glutes, legs & control', exercises:[['Squat','3 × 10','Slow on the way down'],['Romanian deadlift','3 × 10','Keep your back long'],['Reverse lunge','3 × 8 / side','Stable front foot'],['Glute bridge','3 × 14','Pause at the top'],['Dead bug','2 × 10 / side','Move slowly']]},
        {key:'tue', name:'Pilates Flow', type:'Pilates', duration:'28 min', equipment:'Light dumbbells', goal:'Core, posture & mobility', exercises:[['Hundred prep','2 × 40 sec','Breathe steadily'],['Roll down','3 × 6','Articulate your spine'],['Side leg series','2 × 10 / side','Stay tall'],['Arm series','2 × 45 sec','Light, controlled range'],['Swimming','2 × 30 sec','Long through the crown']]},
        {key:'wed', name:'Upper Body + Core', type:'Strength', duration:'30 min', equipment:'Light dumbbells', goal:'Shoulders, back & core', exercises:[['Shoulder press','3 × 10','Ribs stacked'],['Bent-over row','3 × 12','Drive elbows back'],['Biceps curl','2 × 12','No swinging'],['Triceps extension','2 × 12','Slow return'],['Bird dog','2 × 8 / side','Keep hips level']]},
        {key:'thu', name:'Low Impact Cardio', type:'Cardio', duration:'24 min', equipment:'None', goal:'Energy without overload', exercises:[['March + reach','4 × 45 sec','Easy pace'],['Step touch','4 × 45 sec','Stay relaxed'],['Squat + reach','3 × 40 sec','Smooth tempo'],['Shadow boxing','3 × 45 sec','Breathe out on punches'],['Mobility flow','4 min','Gentle finish']]},
        {key:'fri', name:'Full Body', type:'Strength', duration:'35 min', equipment:'Light + heavy dumbbells', goal:'Full-body strength', exercises:[['Squat to press','3 × 10','Light dumbbells'],['Row + hinge','3 × 10','Heavy dumbbells'],['Split squat','3 × 8 / side','Use support if needed'],['Glute bridge march','3 × 10 / side','Pelvis stays steady'],['Plank','3 × 25 sec','Strong, quiet core']]},
        {key:'sat', name:'Cardio + Pilates', type:'Mixed', duration:'30 min', equipment:'Light dumbbells', goal:'Move, sweat, reset', exercises:[['Low-impact cardio','8 min','Comfortably challenging'],['Pilates squat pulses','3 × 40 sec','Small range'],['Side leg series','2 × 10 / side','Stay controlled'],['Arm circles','2 × 40 sec','Light dumbbells'],['Full-body stretch','5 min','Easy breathing']]},
        {key:'sun', name:'Recovery', type:'Recovery', duration:'15–20 min', equipment:'None', goal:'Recover and recharge', exercises:[['Easy walk','10+ min','Optional'],['Cat-cow','2 × 8','Gentle movement'],['90/90 switches','2 × 8 / side','Comfortable range'],['Child’s pose','2 × 45 sec','Relax']]}
      ]
    },
    {
      id:2, title:'Week 2', focus:'Add consistency',
      days: []
    },
    {
      id:3, title:'Week 3', focus:'Build control',
      days: []
    },
    {
      id:4, title:'Week 4', focus:'Finish strong',
      days: []
    }
  ]
};

const progressionNotes = [
  ['Week 2','Keep the same quality and add one rep to the main movements where it feels natural.'],
  ['Week 3','Use a slower tempo on strength exercises and make the final reps feel deliberate.'],
  ['Week 4','Keep the strongest version that feels sustainable. No need to chase extra volume.']
];

for (let i = 1; i < KETA_DATA.weeks.length; i++) {
  const base = KETA_DATA.weeks[0];
  KETA_DATA.weeks[i].days = base.days.map((day, idx) => {
    const cloned = JSON.parse(JSON.stringify(day));
    if (idx === 0 && i === 1) cloned.exercises[0][1] = '3 × 11';
    if (idx === 4 && i === 1) cloned.exercises[0][1] = '3 × 11';
    if (i === 2 && day.type === 'Strength') cloned.exercises = cloned.exercises.map((e, n) => n < 3 ? [e[0], e[1], 'Slow tempo · ' + e[2]] : e);
    if (i === 3 && day.type === 'Cardio') cloned.duration = day.duration === '24 min' ? '27 min' : day.duration;
    cloned.progression = progressionNotes[i-1][1];
    return cloned;
  });
}
