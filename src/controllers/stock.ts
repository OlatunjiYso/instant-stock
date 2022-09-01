import { Request, Response } from 'express';
import { fetchStock } from '../services/stock';


/**
 * @DESC This controller method is called when GET /stock route is visited
 * @param req Request
 * @param res Response
 * @returns JSON
 */
export const stockController = async(req:Request, res:Response) => {
    try{
    const { symbol }  = req.query;
    if(!symbol) return res.status(400).send('Kindly provide  a Stock symbol');
    const response = await fetchStock(symbol as string);
    return res.status(200).json({response});
    } 
    catch(err) {
        const errMessage = (err as Error).message;
        return res.status(500).json(errMessage);
    }
}
