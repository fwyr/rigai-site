import { writable } from 'svelte/store';
export const isFirstPrompt = writable(true);
export const isAwaitingResponse = writable(false);
export const submissions = writable<Array<Record<string, any>>>([]);

interface ComponentSelection {
    id: number;
    name: string;
    price: number;
}

export interface Selections {
    cpu: ComponentSelection;
    cooler: ComponentSelection;
    storage: ComponentSelection;
    memory: ComponentSelection;
    motherboard: ComponentSelection;
}

export const selectedComponents = writable<Selections>({
    cpu: null,
    cooler: null,
    storage: null,
    memory: null,
    motherboard: null,
});


// sample response:
// {"cpu":{"index":0,"name":"AMD Ryzen 7 7800X3D","price":391.12},
// "cooler":{"index":5,"name":"Thermalright Frozen Notte ARGB","price":48.9},
// "storage":{"index":1,"name":"Crucial P3 Plus","price":61.99},
// "memory":{"index":1,"name":"G.Skill Aegis 16 GB","price":29.99},
// "motherboard":{"index":2,"name":"MSI MAG B650 TOMAHAWK WIFI","price":199.62}}


// {"cpu":{"index":0,"name":"AMD Ryzen 7 7800X3D","price":391.12},"cooler":{"index":5,"name":"Thermalright Frozen Notte ARGB","price":48.9},"storage":{"index":1,"name":"Crucial P3 Plus","price":61.99},"memory":{"index":1,"name":"G.Skill Aegis 16 GB","price":29.99},"motherboard":{"index":2,"name":"MSI MAG B650 TOMAHAWK WIFI","price":199.62}}
