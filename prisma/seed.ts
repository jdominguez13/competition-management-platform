import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const organizer = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      role: 'ORGANIZER',
    },
  })

  const skater1 = await prisma.user.upsert({
    where: { email: 'emma@example.com' },
    update: {},
    create: {
      email: 'emma@example.com',
      name: 'Emma Wilson',
      role: 'SKATER',
    },
  })

  const skater2 = await prisma.user.upsert({
    where: { email: 'michael@example.com' },
    update: {},
    create: {
      email: 'michael@example.com',
      name: 'Michael Chen',
      role: 'SKATER',
    },
  })

  const coach = await prisma.user.upsert({
    where: { email: 'coach@example.com' },
    update: {},
    create: {
      email: 'coach@example.com',
      name: 'David Thompson',
      role: 'COACH',
    },
  })

  console.log('✅ Users created:', { organizer, skater1, skater2, coach })

  // Create demo competition
  const competition = await prisma.competition.upsert({
    where: { id: 'demo-competition-1' },
    update: {},
    create: {
      id: 'demo-competition-1',
      name: 'Spring Figure Skating Championship 2025',
      description: 'Join us for the premier figure skating competition of the spring season. Open to all levels from beginner to advanced.',
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-03-17'),
      venue: 'Olympic Ice Arena',
      address: '123 Championship Drive, Ice City, IC 12345',
      status: 'REGISTRATION_OPEN',
      organizerId: organizer.id,
    },
  })

  // Create demo events
  const event1 = await prisma.event.upsert({
    where: { id: 'demo-event-1' },
    update: {},
    create: {
      id: 'demo-event-1',
      name: 'Adult Bronze Freestyle',
      category: 'Freestyle',
      ageGroup: 'Adult Bronze (18+)',
      level: 'Bronze',
      entryFee: 75.00,
      maxEntries: 20,
      description: 'Freestyle program for adult bronze level skaters. Program length: 1 minute 30 seconds.',
      requirements: 'Must have passed Adult Bronze moves in the field test',
      competitionId: competition.id,
    },
  })

  const event2 = await prisma.event.upsert({
    where: { id: 'demo-event-2' },
    update: {},
    create: {
      id: 'demo-event-2',
      name: 'Juvenile Ladies Freestyle',
      category: 'Freestyle',
      ageGroup: 'Juvenile',
      level: 'Juvenile',
      entryFee: 85.00,
      maxEntries: 15,
      description: 'Freestyle program for juvenile level ladies. Program length: 2 minutes.',
      requirements: 'Must have passed Juvenile moves in the field test',
      competitionId: competition.id,
    },
  })

  const event3 = await prisma.event.upsert({
    where: { id: 'demo-event-3' },
    update: {},
    create: {
      id: 'demo-event-3',
      name: 'Pre-Alpha Moves in the Field',
      category: 'Moves',
      ageGroup: 'Pre-Alpha (4-5)',
      level: 'Pre-Alpha',
      entryFee: 45.00,
      maxEntries: 25,
      description: 'Moves in the field test for pre-alpha level skaters.',
      requirements: 'No prerequisites required',
      competitionId: competition.id,
    },
  })

  console.log('✅ Competition and events created:', { competition, event1, event2, event3 })

  // Create sample registrations
  const registration1 = await prisma.registration.create({
    data: {
      id: 'demo-reg-1',
      eventId: event1.id,
      skaterId: skater1.id,
      competitionId: competition.id,
      notes: 'First time competing at this level',
    },
  })

  const registration2 = await prisma.registration.create({
    data: {
      id: 'demo-reg-2',
      eventId: event2.id,
      skaterId: skater2.id,
      competitionId: competition.id,
      notes: 'Looking forward to the competition!',
    },
  })

  console.log('✅ Sample registrations created:', { registration1, registration2 })

  console.log('🎉 Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })