// k values for orientation
const Orientation_k_values = {
    "North": {
        "k1": 26.3,
        "k2": -38.5,
        "k3": 14.8,
        "k4": -16.5,
        "k5": 27.3,
        "k6": -11.9,
        "k7": -1.06,
        "k8": 0.0872,
        "k9": -0.191
    },
    "North-East / North-West": {
        "k1": 0.165,
        "k2": -3.68,
        "k3": 3,
        "k4": 6.38,
        "k5": -1.53,
        "k6": -0.405,
        "k7": -1.38,
        "k8": 4.89,
        "k9": -1.99
    },
    "East / West": {
        "k1": 1.44,
        "k2": -2.36,
        "k3": 1.07,
        "k4": -0.514,
        "k5": 1.89,
        "k6": -1.64,
        "k7": -0.542,
        "k8": -0.757,
        "k9": 0.604
    },
    "South-East / South-West": {
        "k1": -2.95,
        "k2": 2.89,
        "k3": 1.17,
        "k4": 5.67,
        "k5": -3.51,
        "k6": -4.28,
        "k7": -2.72,
        "k8": -0.25,
        "k9": 3.07
    },
    "South": {
        "k1": -0.66,
        "k2": -0.106,
        "k3": 2.93,
        "k4": 3.63,
        "k5": -0.374,
        "k6": -7.4,
        "k7": -2.71,
        "k8": -0.991,
        "k9": 4.59
    }
};



// city wise ( monthly ) solar irradiance
const City_solar_irradiance = {
    "Islamabad": {
        "January": 148.43,
        "February": 188.70,
        "March": 243.61,
        "April": 305.32,
        "May": 324.05,
        "June": 337.49,
        "July": 298.97,
        "August": 279.73,
        "September": 246.70,
        "October": 205.36,
        "November": 166.73,
        "December": 137.98
    },
    "Peshawar": {
        "January": 152.69,
        "February": 187.11,
        "March": 242.75,
        "April": 305.22,
        "May": 321.23,
        "June": 339.46,
        "July": 303.11,
        "August": 276.70,
        "September": 241.62,
        "October": 204.41,
        "November": 164.56,
        "December": 139.43
    },
    "Lahore": {
        "January": 147.45,
        "February": 188.50,
        "March": 242.70,
        "April": 298.34,
        "May": 302.88,
        "June": 304.79,
        "July": 273.27,
        "August": 266.93,
        "September": 244.84,
        "October": 204.35,
        "November": 162.38,
        "December": 139.28
    },
    "Karachi": {
        "January": 194.19,
        "February": 235.80,
        "March": 272.16,
        "April": 300.90,
        "May": 303.86,
        "June": 295.62,
        "July": 277.77,
        "August": 275.70,
        "September": 251.92,
        "October": 234.55,
        "November": 192.76,
        "December": 171.90
    },
    "Multan": {
        "January": 156.25,
        "February": 192.34,
        "March": 241.78,
        "April": 302.89,
        "May": 319.45,
        "June": 333.87,
        "July": 290.21,
        "August": 280.56,
        "September": 249.32,
        "October": 208.45,
        "November": 167.89,
        "December": 141.34
    }
};

// monthly wise solar declination 
const Solar_declination = {
    "January": -21.18,
    "February": -12.78,
    "March": -2.25,
    "April": 9.67,
    "May": 18.8,
    "June": 23.29,
    "July": 21.56,
    "August": 14.12,
    "September": 3.12,
    "October": -8.42,
    "November": -18.42,
    "December": -23.26
};

// city wise latitude
const City_latitude = {
    "Peshawar": 34.01510,
    "Islamabad": 33.6995,
    "Multan": 30.1864,
    "Lahore": 31.5204,
    "Karachi": 24.8607
};



export {
    Orientation_k_values,
    City_solar_irradiance,
    Solar_declination,
    City_latitude
};

