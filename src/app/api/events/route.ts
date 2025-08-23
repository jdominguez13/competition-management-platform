import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const competitionId = searchParams.get('competitionId')

  try {
    const where = competitionId ? { competitionId } : {}
    
    const events = await prisma.event.findMany({
      where,
      include: {
        competition: {
          select: { id: true, name: true }
        },
        registrations: {
          include: {
            skater: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
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
      category,
      level,
      ageGroup,
      entryFee,
      maxEntries,
      requirements,
      competitionId,
      startTime,
      endTime
    } = body

    const event = await prisma.event.create({
      data: {
        name,
        description,
        category,
        level,
        ageGroup,
        entryFee: parseFloat(entryFee),
        maxEntries,
        requirements,
        competitionId,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null
      },
      include: {
        competition: {
          select: { id: true, name: true }
        },
        _count: {
          select: { registrations: true }
        }
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}