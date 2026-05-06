import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Début du peuplement de la base de données...')

  // 1. Difficultés
  const easy = await prisma.difficulty.upsert({
    where: { level_name: 'Facile' },
    update: {},
    create: { level_name: 'Facile', max_errors: 10, score_multiplier: 1.0 },
  })

  const hard = await prisma.difficulty.upsert({
    where: { level_name: 'Difficile' },
    update: {},
    create: { level_name: 'Difficile', max_errors: 5, score_multiplier: 2.5 },
  })

  // 2. Catégories
  const animals = await prisma.category.upsert({
    where: { name: 'Animaux' },
    update: {},
    create: { name: 'Animaux', description: 'Mots sur le thème des animaux' },
  })

  const countries = await prisma.category.upsert({
    where: { name: 'Pays' },
    update: {},
    create: { name: 'Pays', description: 'Noms de pays du monde' },
  })

  // 3. Mots
  await prisma.word.create({
    data: { text: 'ELEPHANT', categoryId: animals.id, difficultyId: easy.id, hint: 'Un gros animal gris' }
  })
  
  await prisma.word.create({
    data: { text: 'BELGIQUE', categoryId: countries.id, difficultyId: easy.id, hint: 'Le pays de la frite' }
  })

  // 4. Succès
  await prisma.achievement.create({
    data: { name: 'Première Victoire', description: 'Vous avez gagné votre première partie !' }
  })

  console.log('Base de données peuplée avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
