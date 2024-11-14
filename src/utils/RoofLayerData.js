const OuterLayer = [
  { name: "None", k_value: 1 },
  { name: "Cement plaster (sand aggregate)", k_value: 0.72, sh_value: 920, d_value: 1850 },
  { name: "Cement mortar", k_value: 0.65, sh_value: 850, d_value: 2250 },
];



const CoreLayer = [
  { name: "None", k_value: 1 },
  { name: " Concrete: Lightweight aggregates", k_value: 1.1, sh_value: 880, d_value: 2100 },
];



const InsulationLayer = [
  { name: "None", k_value: 1 },
  { name: "Poly Styrene (R-12)", k_value: 0.027, sh_value: 1300, d_value: 32.5 },
  { name: "Poly Styrene (molded beads)", k_value: 0.04, sh_value: 1300, d_value: 30 },
  { name: "Polyurethane Foam", k_value: 0.025, sh_value: 1550, d_value: 45 },
 { name: "Polyethylene/Jumbolon", k_value: 0.33, sh_value: 2050, d_value: 35},
];


const InnerLayer = [
  { name: "None", k_value: 1 },
  { name: "Cement plaster (sand aggregate)", k_value: 0.72, sh_value: 920, d_value: 1850 },
 { name: "Cement mortar", k_value: 0.65, sh_value: 850, d_value: 2250 },
];



export {
  OuterLayer,
  CoreLayer,
  InsulationLayer,
  InnerLayer
};



