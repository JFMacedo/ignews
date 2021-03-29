import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const users = [
    { id: 1, name: 'Jean'},
    { id: 2, name: 'Jéssica'},
    { id: 3, name: 'Macedo'},
  ];

  return res.json(users);
};