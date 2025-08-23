import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const competitions = await prisma.competition.findMany({
      include: {
        events: true,
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(competitions)
  } catch (error) {
    console.error('Error fetching competitions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      startDate,
      endDate,
      venue,
      address,
      status,
      entryFee,
      maxEntries,
      organizerId,
      clubId
    } = body

    const competition = await prisma.competition.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        venue,
        address,
        status: status || 'DRAFT',
        entryFee: entryFee ? parseFloat(entryFee) : 0,
        maxEntries,
        organizerId,
        clubId
      },
      include: {
        events: true,
        organizer: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(competition, { status: 201 })
  } catch (error) {
    console.error('Error creating competition:', error)
    return NextResponse.json(
      { error: 'Failed to create competition' },
      { status: 500 }
    )
  }
}