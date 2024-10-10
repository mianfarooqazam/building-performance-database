const OuterLayer = [
    { name: "Cement plaster (sand aggregate)", k_value: 0.72 },
    { name: "Gypsum plaster (sand aggregate)", k_value: 0.22 },
    { name: "Gypsum plaster (Vermiculite aggregate)", k_value: 0.25 },
    { name: "Plywood", k_value: 0.12 },
    { name: "Sheathing (regular density)", k_value: 0.055 },
    { name: "Acustic tile", k_value: 0.058 },
    { name: "Hard board (siding)", k_value: 0.094 },
    { name: "Hard board (High density)", k_value: 0.15 },
    { name: "Particle board (low density)", k_value: 0.078 },
    { name: "Particle board (high density)", k_value: 0.17 },
    { name: "Hard wood (oak, maple)", k_value: 0.16 },
    { name: "Soft wood (fir, pine)", k_value: 0.12 },
    { name: "Clay tiles (3 cell deep)", k_value: 0.52 },
    { name: "Clay tiles (1 cell deep)", k_value: 0.69 },
    { name: "Cement lime", k_value: 1.4 },
    { name: "Cement mortar", k_value: 0.65 },
    { name: "Stucco", k_value: 0.72 },
  ];
  
  
  
  // refrence usman (obviouslu pick higher k-value than k-lower for same names)
  const CoreLayer = [
    { name: " Brick Common", k_value: 0.72 },
    { name: " Brick, face", k_value: 1.3 },
    { name: " Brick, fire clay", k_value: 1.34 },
    { name: " Concrete Block 3 oval cores", k_value: 1 },
    { name: " Concrete Block rectangular core (same with filled cores)", k_value: 0.6 },
    { name: " Concrete Block rectangular core (2 cores 20 cm thick, 16 kg)", k_value: 1.1 },
    { name: " Concrete Block 3 oval core cinder aggregate", k_value: 0.67 },
  ];
  
  
  
  
  const InsulationLayer = [
    { name: "Air Space", k_value: 0.01516 },
    { name: "Poly Styrene (R-12)", k_value: 0.027 },
    { name: "Poly Styrene (molded beads)", k_value: 0.04 },
    { name: "Polyurethane Foam", k_value: 0.025 },
    { name: "Mineral Fiber Board (roofing material)", k_value: 0.049 },
    { name: "Wood (shredded cemented)", k_value: 0.087 },
    { name: "Cork", k_value: 0.039 },
    { name: "Loose Fill Material (cork granulated)", k_value: 0.045 },
    { name: "Blanket and Batt (paper faced)", k_value: 0.46 },
    { name: "Glass Fiber (coated)", k_value: 0.038 },
    { name: "Glass Fiber (organic bonded)", k_value: 0.036 },
    { name: "Cellular Glass", k_value: 0.058 },
    { name: "Polyethylene/Jumbolon", k_value: 0.33 }
  ];
  
  
  const InnerLayer = [
    { name: "Cement plaster (sand aggregate)", k_value: 0.72 },
    { name: "Gypsum plaster (sand aggregate)", k_value: 0.22 },
    { name: "Gypsum plaster (Vermiculite aggregate)", k_value: 0.25 },
    { name: "Plywood", k_value: 0.12 },
    { name: "Sheathing (regular density)", k_value: 0.055 },
    { name: "Acoustic tile", k_value: 0.058 },
    { name: "Hard board (siding)", k_value: 0.094 },
    { name: "Hard board (High density)", k_value: 0.15 },
    { name: "Particle board (low density)", k_value: 0.078 },
    { name: "Particle board (high density)", k_value: 0.17 },
    { name: "Hard wood (oak, maple)", k_value: 0.16 },
    { name: "Soft wood (fir, pine)", k_value: 0.12 },
    { name: "Clay tiles (3 cell deep)", k_value: 0.52 },
    { name: "Clay tiles (1 cell deep)", k_value: 0.69 },
    { name: "Cement lime", k_value: 1.4 },
    { name: "Cement mortar", k_value: 0.65 },
    { name: "Stucco", k_value: 0.72 },
  ];
  
  
  
  export {
    OuterLayer,
    CoreLayer,
    InsulationLayer,
    InnerLayer
  };
  
  
  
  