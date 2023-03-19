import { Request, Response, NextFunction } from 'express';

const artistService = require('../services/artist.service')


export function getArtist(req: Request, res: Response, next: NextFunction) {
    try {
        artistService.searchArtistByName(req.query.name as string)
            .then((data: any) => res.json(data));
    }
    catch (err) {
        res.status(500).send("Third party service call error.");
    }
}