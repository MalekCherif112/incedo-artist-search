import {Request, Response} from 'express';
import {ARTIST_NAME_REQUIRED, THIRD_PARTY_CALL_ERROR} from "../../common/error-code";

const artistService = require('../services/artist.service')


export function getArtist(req: Request, res: Response) {
    const {name, limit, page} = req.query;

    if (!name) {
        res.status(400).send(ARTIST_NAME_REQUIRED);
        return;
    }
    artistService.searchArtistByNameOrFallBack(name as string, limit as string, page as string)
        .then((data: any) => res.json(data))
        .catch(() => res.status(500).send(THIRD_PARTY_CALL_ERROR));
}

export async function generateArtistCsv(req: Request, res: Response) {

    const {name, limit, page} = req.query;
    const file_name = (req.query.file_name as string) || "artists.csv";

    if (!name) {
        res.status(400).send(ARTIST_NAME_REQUIRED);
        return;
    }

    const withExtensionFileName = file_name + (file_name.endsWith(".csv") ? "" : ".csv");
    res.setHeader('Content-disposition', 'attachment; filename=' + withExtensionFileName);
    res.setHeader('Content-type', 'text/csv');
    res.charset = 'UTF-8';
    artistService.generateCsvFile(name as string, limit as string, page as string)
        .then((csvBody: string) => {
            res.write(csvBody);
            res.end();
        });
}

export function generateJsonFallbackFile(req: Request, res: Response) {
    artistService.generateJsonFallbackFile()
        .then(() => res.status(201).send())
        .catch((err: string) => res.status(500).send(err))
}