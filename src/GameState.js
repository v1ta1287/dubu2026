export const GameState = {
    // Change inventory from [] to {}
    inventory: {
        "Yellow Flower": 2,
        "Blue Flower": 5
    },
    pickedItems: new Set(),
    questStatus: 'NOT_STARTED',
    itemData: {
        "Yellow Flower": "A bright yellow daisy. It smells like sunshine.",
        "Blue Flower": "A cool blue petal. It feels slightly damp to the touch.",
        "Pink Flower": "A vibrant pink blossom. It looks very delicate."
    }
};