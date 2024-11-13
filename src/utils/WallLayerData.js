const OuterLayer = [
  { name: "None", k_value: 1 },
  { name: "Cement plaster (sand aggregate)", k_value: 0.72, sh_value: 920, d_value: 1850 },
  { name: "Gypsum plaster (sand aggregate)", k_value: 0.22, sh_value: 0, d_value: 0 },
  { name: "Gypsum plaster (Vermiculite aggregate)", k_value: 0.25, sh_value: 850, d_value: 700 },
  { name: "Plywood", k_value: 0.12, sh_value: 1210, d_value: 545 },
  { name: "Sheathing (regular density)", k_value: 0.055, sh_value: 0, d_value: 0 },
  { name: "Acustic tile", k_value: 0.058, sh_value: 0, d_value: 0 },
  { name: "Hard board (siding)", k_value: 0.094, sh_value: 0, d_value: 0 },
  { name: "Hard board (High density)", k_value: 0.15, sh_value: 0, d_value: 0 },
  { name: "Particle board (low density)", k_value: 0.078, sh_value: 0, d_value: 0 },
  { name: "Particle board (high density)", k_value: 0.17, sh_value: 0, d_value: 0 },
  { name: "Hard wood (oak, maple)", k_value: 0.16, sh_value: 0, d_value: 0 },
  { name: "Soft wood (fir, pine)", k_value: 0.12, sh_value: 0, d_value: 0 },
  { name: "Clay tiles (3 cell deep)", k_value: 0.52, sh_value: 0, d_value: 0 },
  { name: "Clay tiles (1 cell deep)", k_value: 0.69, sh_value: 0, d_value: 0 },
  { name: "Cement lime", k_value: 1.4, sh_value: 0, d_value: 0 },
  { name: "Cement mortar", k_value: 0.65, sh_value: 850, d_value: 2250 },
  { name: "Stucco", k_value: 0.72, sh_value: 0, d_value: 0 },
];




// refrence usman (obviously pick higher k-value than k-lower for same names)
const CoreLayer = [
  { name: "None", k_value: 1 },
  { name: " Brick Common", k_value: 0.72, sh_value: 0, d_value: 1750 },
  { name: " Brick, face", k_value: 1.3, sh_value: 0, d_value: 0 },
  { name: " Brick, fire clay", k_value: 1.34, sh_value: 0, d_value: 0 },
  { name: " Concrete Block 3 oval cores", k_value: 1, sh_value: 0, d_value: 0 },
  { name: " Concrete Block rectangular core (same with filled cores)", k_value: 0.6, sh_value: 0, d_value: 0 },
  { name: " Concrete Block rectangular core (2 cores 20 cm thick, 16 kg)", k_value: 1.1, sh_value: 0, d_value: 0 },
  { name: " Concrete Block 3 oval core cinder aggregate", k_value: 0.67, sh_value: 0, d_value: 0 },
];




const InsulationLayer = [
  { name: "None", k_value: 1 },
  { name: "Air Space", k_value: 0.01516, sh_value: 0, d_value: 0 },
  { name: "Poly Styrene (R-12)", k_value: 0.027, sh_value: 1300, d_value: 32.5 },
  { name: "Poly Styrene (molded beads)", k_value: 0.04, sh_value: 0, d_value: 0 },
  { name: "Polyurethane Foam", k_value: 0.025, sh_value: 0, d_value: 0 },
  { name: "Mineral Fiber Board (roofing material)", k_value: 0.049, sh_value: 0, d_value: 0 },
  { name: "Wood (shredded cemented)", k_value: 0.087, sh_value: 0, d_value: 0 },
  { name: "Cork", k_value: 0.039, sh_value: 0, d_value: 0 },
  { name: "Loose Fill Material (cork granulated)", k_value: 0.045, sh_value: 0, d_value: 0 },
  { name: "Blanket and Batt (paper faced)", k_value: 0.46, sh_value: 0, d_value: 0 },
  { name: "Glass Fiber (coated)", k_value: 0.038, sh_value: 0, d_value: 0 },
  { name: "Glass Fiber (organic bonded)", k_value: 0.036, sh_value: 0, d_value: 0 },
  { name: "Cellular Glass", k_value: 0.058, sh_value: 0, d_value: 0 },
  { name: "Polyethylene/Jumbolon", k_value: 0.33, sh_value: 0, d_value: 0 },
];


const InnerLayer = [
  { name: "None", k_value: 1 },
  { name: "Cement plaster (sand aggregate)", k_value: 0.72, sh_value: 920, d_value: 1850 },
  { name: "Gypsum plaster (sand aggregate)", k_value: 0.22, sh_value: 0, d_value: 0 },
  { name: "Gypsum plaster (Vermiculite aggregate)", k_value: 0.25, sh_value: 850, d_value: 700 },
  { name: "Plywood", k_value: 0.12, sh_value: 1210, d_value: 545 },
  { name: "Sheathing (regular density)", k_value: 0.055, sh_value: 0, d_value: 0 },
  { name: "Acoustic tile", k_value: 0.058, sh_value: 0, d_value: 0 },
  { name: "Hard board (siding)", k_value: 0.094, sh_value: 0, d_value: 0 },
  { name: "Hard board (High density)", k_value: 0.15, sh_value: 0, d_value: 0 },
  { name: "Particle board (low density)", k_value: 0.078, sh_value: 0, d_value: 0 },
  { name: "Particle board (high density)", k_value: 0.17, sh_value: 0, d_value: 0 },
  { name: "Hard wood (oak, maple)", k_value: 0.16, sh_value: 0, d_value: 0 },
  { name: "Soft wood (fir, pine)", k_value: 0.12, sh_value: 0, d_value: 0 },
  { name: "Clay tiles (3 cell deep)", k_value: 0.52, sh_value: 0, d_value: 0 },
  { name: "Clay tiles (1 cell deep)", k_value: 0.69, sh_value: 0, d_value: 0 },
  { name: "Cement lime", k_value: 1.4, sh_value: 0, d_value: 0 },
  { name: "Cement mortar", k_value: 0.65, sh_value: 850, d_value: 2250 },
  { name: "Stucco", k_value: 0.72, sh_value: 0, d_value: 0 },
];



export {
  OuterLayer,
  CoreLayer,
  InsulationLayer,
  InnerLayer
};



