export function makeAnimalSounds(animalSounds) {
  for (const [animal, sound] of Object.entries(animalSounds)) {
    const p = document.createElement("p");
    p.innerText = `${animal} says "${sound}"`;
    root.appendChild(p);
  }
}
