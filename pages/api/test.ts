// Next.js API route for testing
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
  timestamp: string
  environment: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    message: 'Next.js API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
}