import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            registrations: {
              include: {
                skater: {
                  select: { id: true, name: true, email: true }
                }
              }
            }
          }
        },
        organizer: {
          select: { id: true, name: true, email: true }
        },
        club: {
          select: { id: true, name: true }
        },
        _count: {
          select: {
            registrations: true,
            events: true
          }
        }
      }
    })

    if (!competition) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(competition)
  } catch (error) {
    console.error('Error fetching competition:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competition' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      maxEntries
    } = body

    const competition = await prisma.competition.update({
      where: { id },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        venue,
        address,
        status,
        entryFee: entryFee ? parseFloat(entryFee) : undefined,
        maxEntries
      },
      include: {
        events: true,
        organizer: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(competition)
  } catch (error) {
    console.error('Error updating competition:', error)
    return NextResponse.json(
      { error: 'Failed to update competition' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.competition.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Competition deleted successfully' })
  } catch (error) {
    console.error('Error deleting competition:', error)
    return NextResponse.json(
      { error: 'Failed to delete competition' },
      { status: 500 }
    )
  }
}