import crypto from 'crypto'; //TODO see if we can not import everything
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  solution: string;
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ solution: generateNumberForDate(new Date(getTodayDate())) });
}

function generateNumberForDate(date: Date): string {
  const dateString = date.toISOString();
  const hash = crypto.createHash('sha256').update(dateString).digest('hex');

  const hashAsNumber = parseInt(hash, 16);
  const mappedNumber = hashAsNumber % 21;

  return String(mappedNumber);
}

function getTodayDate(): string {
  const today = new Date();
  return today.toLocaleDateString('en-CA');
}
