class RecintosZoo {
	enclosures = [
		{
			number: 1,
			biome: ['savana'],
			totalSize: 10,
			existingAnimals: { macaco: 3 },
		},
		{
			number: 2,
			biome: ['floresta'],
			totalSize: 5,
			existingAnimals: {},
		},
		{
			number: 3,
			biome: ['savana', 'rio'],
			totalSize: 7,
			existingAnimals: { gazela: 1 },
		},
		{
			number: 4,
			biome: ['rio'],
			totalSize: 8,
			existingAnimals: {},
		},
		{
			number: 5,
			biome: ['savana'],
			totalSize: 9,
			existingAnimals: { leao: 1 },
		},
	];

	animals = {
		leao: { size: 3, biomes: ['savana'] },
		leopardo: { size: 2, biomes: ['savana'] },
		crocodilo: { size: 3, biomes: ['rio'] },
		macaco: { size: 1, biomes: ['savana', 'floresta'] },
		gazela: { size: 2, biomes: ['savana'] },
		hipopotamo: { size: 4, biomes: ['savana', 'rio'] },
	};

	recintosViaveis = [];
	erro = {};

	analisaRecintos(animal, quantidade) {
		animal = animal.toLowerCase();

		if (this.validarAnimal(animal)) {
			return this.setErro('Animal inválido');
		}

		if (this.validarQuantidade(quantidade)) {
			return this.setErro('Quantidade inválida');
		}

		const acceptableBiomes = this.animals[animal].biomes;
		const animalSize = this.animals[animal].size;
		const newTotalSize = animalSize * quantidade;
		const isCarnivore = this.verificarCarnivoro(animal);
		const isHippo = this.verificarHipopotamo(animal);
		const isMonkey = this.verificarMacaco(animal);

		this.enclosures.forEach((enclosure) => {
			if (
				this.isEnclosureViable(
					enclosure,
					acceptableBiomes,
					isHippo,
					isMonkey,
					isCarnivore,
					animal,
					quantidade
				)
			) {
				this.calcularEspacoOcupado(enclosure, animal, newTotalSize);
			}
		});

		return this.recintosViaveis.length
			? { recintosViaveis: this.recintosViaveis }
			: this.setErro('Não há recinto viável');
	}

	setErro(message) {
		this.erro = { erro: message };
		return this.erro;
	}

	validarAnimal(animal) {
		return !this.animals[animal];
	}

	validarQuantidade(quantidade) {
		return !Number.isInteger(quantidade) || quantidade <= 0;
	}

	verificarCarnivoro(animal) {
		return ['leao', 'leopardo', 'crocodilo'].includes(animal);
	}

	verificarHipopotamo(animal) {
		return animal === 'hipopotamo';
	}

	verificarMacaco(animal) {
		return animal === 'macaco';
	}

	isEnclosureViable(
		enclosure,
		acceptableBiomes,
		isHippo,
		isMonkey,
		isCarnivore,
		animal,
		quantity
	) {
		const { biome, existingAnimals } = enclosure;

		if (
			Object.keys(existingAnimals).some((specie) =>
				this.verificarCarnivoro(specie)
			) &&
			!isCarnivore
		) {
			return false;
		}

		if (
			!acceptableBiomes.some((acceptableBiome) =>
				biome.includes(acceptableBiome)
			) &&
			!(isHippo && biome.includes('rio'))
		) {
			return false;
		}

		if (
			isCarnivore &&
			Object.keys(existingAnimals).some((specie) => specie !== animal)
		) {
			return false;
		}

		if (
			isHippo &&
			Object.keys(existingAnimals).length > 0 &&
			biome !== 'savana e rio'
		) {
			return false;
		}

		if (isMonkey && Object.keys(existingAnimals).length === 0 && quantity < 2) {
			return false;
		}

		return true;
	}

	calcularEspacoOcupado(recinto, animal, newTotalSize) {
		const { number, existingAnimals, totalSize } = recinto;

		let occupiedSpace = Object.entries(existingAnimals).reduce(
			(total, [specie, existingQuantity]) => {
				return total + this.animals[specie].size * existingQuantity;
			},
			0
		);

		if (
			Object.keys(existingAnimals).length > 1 ||
			(Object.keys(existingAnimals).length === 1 && !existingAnimals[animal])
		) {
			occupiedSpace += 1;
		}

		occupiedSpace += newTotalSize;

		if (occupiedSpace <= totalSize) {
			const freeSpace = totalSize - occupiedSpace;

			this.recintosViaveis.push(
				`Recinto ${number} (espaço livre: ${freeSpace} total: ${totalSize})`
			);
		}
	}
}

export { RecintosZoo as RecintosZoo };
