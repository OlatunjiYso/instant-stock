import axios from 'axios';
import dotenv from 'dotenv';
import Stock from "../models/stock";
import { IServiceResponse } from "../interface";

dotenv.config();
const vantageApiKey = process.env.VANTAGE_API_KEY;

type GetStockResponse = {
    'Global Quote' : {
    '01. symbol': string;
    '05. price': string;
    }
  };
type StockType = {
    symbol: string;
    price: string;
    updatedAt?: Date
  };


  /**
   * @desc this method chooses to return stock values from the db or fetch from the broker.
   * @param symbol a string
   * @returns service response.
   */
export const fetchStock = async (symbol: string): Promise<IServiceResponse> => {
  try {
    let stockIsOld = false;
    const existingStock = await Stock.findOne({ symbol }) as StockType;
    console.log('existingStock', existingStock);
    if (!existingStock) {
      const latestStock = await fetchStockFromBroker(symbol);
      await createStock(latestStock);
      return { ...latestStock, errorMessage: "" };
    }
    stockIsOld = checkIfStockIsOld(existingStock);
    if (stockIsOld) {
      const latestStock = await fetchStockFromBroker(symbol);
      updateStock(symbol, latestStock);
      return { ...latestStock, errorMessage: "" };
    }
    return { price:existingStock.price , symbol:existingStock.symbol, errorMessage: "" };
  } catch (err) {
    const errorMessage = (err as Error).message;
    return { symbol: "", price: "", errorMessage };
  }
};


/**
 * @desc this method fetched data from the broker.
 * @param symbol a string
 * @returns 
 */
const fetchStockFromBroker = async (symbol: string): Promise<StockType> => {
  const { data, status } = await axios.get<GetStockResponse>(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${vantageApiKey}`,
    {
      headers: { Accept: 'application/json' },
    },
  );
  const zoo = { symbol: data['Global Quote']['01. symbol'] , price: data['Global Quote']['05. price'] };
  return zoo;
};


/**
 * @desc this method updates a stock record persisted on DB
 * @param symbol a string
 * @param stock a stock object
 */
const updateStock = async (symbol: string, stock: StockType) => {
  await Stock.updateOne({ symbol }, { price: stock.price });
};


/**
 * @desc this method creates a new stock record on the DB
 * @param stock A stock object
 */
const createStock = async(stock:StockType ) => {
    const newStock = new Stock(stock);
    await newStock.save();
}


/**
 * @desc this method checks if a stock record is old or not.
 * @param stock @desc 
 * @returns 
 */
const checkIfStockIsOld = (stock: StockType): boolean => {
  const lastUpdated = stock.updatedAt;
  const stockAgeInSeconds = Date.now() / 1000 - lastUpdated!.getTime() / 1000;
  return stockAgeInSeconds > 5 * 60; //5minutes x 60 seconds
};
