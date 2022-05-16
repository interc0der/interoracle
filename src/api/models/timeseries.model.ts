import  mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        ticker: String,
        price: Number,
        timestamp: Date,
        metadata: {
            exchange: String,
            asset: {
                currency:String,
                issuer:String,
            },
            base: {
                currency:String,
                issuer:String,
            }
        }
    },
    {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'metadata',
        granularity: 'seconds',
      },
    }
  );

/* schema.virtual('isVerified').get(function () {
    return !!(this.verified || this.passwordReset);
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
    }
}); */

export default mongoose.model('TimeSeries', schema);