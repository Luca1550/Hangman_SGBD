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
  const achievements = [
    { name: 'Première partie', description: 'Vous avez joué votre première partie.', icon_name: '🥉' },
    { name: '5 victoires', description: 'Vous avez remporté 5 parties.', icon_name: '⭐' },
    { name: 'Zéro pointé', description: 'Vous avez perdu une partie avec un score de 0.', icon_name: '💀' },
    { name: 'Partie parfaite', description: 'Vous avez gagné sans faire aucune erreur.', icon_name: '✨' },
    { name: 'Complétionniste', description: 'Vous avez débloqué tous les autres succès.', icon_name: '🏆' }
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { name: ach.name },
      update: { description: ach.description, icon_name: ach.icon_name },
      create: ach
    });
  }

  console.log('Base de données peuplée avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
