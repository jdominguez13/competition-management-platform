import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const competitionId = searchParams.get('competitionId')
  const skaterId = searchParams.get('skaterId')

  try {
    const where: any = {}
    if (competitionId) where.event = { competitionId }
    if (skaterId) where.skaterId = skaterId

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        event: {
          include: {
            competition: {
              select: { id: true, name: true }
            }
          }
        },
        skater: {
          select: { id: true, name: true, email: true }
        },
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      eventId,
      skaterId,
      competitionId,
      notes
    } = body

    // Check if skater is already registered for this event
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId,
        skaterId
      }
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Skater is already registered for this event' },
        { status: 400 }
      )
    }

    // Check if event has available spots
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: { select: { registrations: true } }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.maxEntries && event._count.registrations >= event.maxEntries) {
      return NextResponse.json(
        { error: 'Event is full' },
        { status: 400 }
      )
    }

    const registration = await prisma.registration.create({
      data: {
        eventId,
        skaterId,
        competitionId,
        notes
      },
      include: {
        event: {
          include: {
            competition: {
              select: { id: true, name: true }
            }
          }
        },
        skater: {
          select: { id: true, name: true, email: true }
        },
        payment: true
      }
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error('Error creating registration:', error)
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    )
  }
}