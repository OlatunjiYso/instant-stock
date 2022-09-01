import mongoose from 'mongoose';

export interface StockDocument extends mongoose.Document {
    symbol: string;
    price: string;
    createdAt: Date;
    updatedAt: Date;
  }

const Schema = mongoose.Schema;
const StockSchema = new Schema({
    symbol: { type: String, required: true, unique: true },
    price: { type: String, required: true },
}, { timestamps: true });


const Stock = mongoose.model<StockDocument>('stock', StockSchema);
export default Stock;