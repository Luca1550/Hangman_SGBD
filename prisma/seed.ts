import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

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
  // On supprime d'abord les anciens mots de test pour éviter les doublons si on relance le seed
  await prisma.word.deleteMany({})

  await prisma.word.create({
    data: { text: 'ELEPHANT', categoryId: animals.id, difficultyId: easy.id, hint: 'Un gros animal gris' }
  })
  
  await prisma.word.create({
    data: { text: 'BELGIQUE', categoryId: countries.id, difficultyId: easy.id, hint: 'Le pays de la frite' }
  })

  await prisma.word.create({
    data: { text: 'CROCODILE', categoryId: animals.id, difficultyId: hard.id, hint: 'Reptile avec de grandes dents' }
  })

  await prisma.word.create({
    data: { text: 'BRESIL', categoryId: countries.id, difficultyId: easy.id, hint: 'Pays du carnaval et de la samba' }
  })

  await prisma.word.create({
    data: { text: 'GIRAFE', categoryId: animals.id, difficultyId: easy.id, hint: 'Animal au très long cou' }
  })

  await prisma.word.create({
    data: { text: 'JAPON', categoryId: countries.id, difficultyId: hard.id, hint: 'Le pays du soleil levant' }
  })

  // 4. Succès
  await prisma.achievement.upsert({
    where: { name: 'Première Victoire' },
    update: {},
    create: { name: 'Première Victoire', description: 'Vous avez gagné votre première partie !' }
  })

  console.log('Base de données peuplée avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
