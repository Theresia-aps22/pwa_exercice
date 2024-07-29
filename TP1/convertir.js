// Récupération des éléments du DOM
const inputTempField = document.getElementById('input-temp');
const fromUnitField = document.getElementById('input-unit');
const toUnitField = document.getElementById('output-unit');
const outputField = document.getElementById('output-temp');
const form = document.getElementById('converter');

// Fonction de conversion de température
function convertTemp(value, fromUnit, toUnit) {
    if (fromUnit === 'c') {
        if (toUnit === 'f') {
            return value * 9 / 5 + 32;
        } else if (toUnit === 'k') {
            return value + 273.15;
        }
    } else if (fromUnit === 'f') {
        if (toUnit === 'c') {
            return (value - 32) * 5 / 9;
        } else if (toUnit === 'k') {
            return (value - 32) * 5 / 9 + 273.15;
        }
    } else if (fromUnit === 'k') {
        if (toUnit === 'c') {
            return value - 273.15;
        } else if (toUnit === 'f') {
            return (value - 273.15) * 9 / 5 + 32;
        }
    }
    throw new Error('Invalid unit');
}

// Écouteur d'événement pour la soumission du formulaire
form.addEventListener('input', () => {
    const inputTemp = parseFloat(inputTempField.value);
    const fromUnit = fromUnitField.value;
    const toUnit = toUnitField.value;
    
    const outputTemp = convertTemp(inputTemp, fromUnit, toUnit);
    outputField.value = (Math.round(outputTemp * 100) / 100) + ' ' + toUnit.toUpperCase();
});
