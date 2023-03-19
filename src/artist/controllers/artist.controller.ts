import {Request, Response, NextFunction} from 'express';

const artistService = require('../services/artist.service')


export function getArtist(req: Request, res: Response, next: NextFunction) {
    const { name }= req.query;

    if (!name){
        res.status(400).send("Artist name is required.")
        return;
    }
    artistService.searchArtistByName(name as string)
        .then((data: any) => res.json(data))
        .catch((err: Error) => res.status(500).send("Third party service call error."))
}