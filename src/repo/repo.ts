import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
const SchemaTypes = mongoose.SchemaTypes;

// mongoose future-proofing
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

export default class Repo {
    private static globalRepo: Repo;
    private connection: mongoose.Connection = null;
    private model: mongoose.Model<mongoose.Document> = null;

    public connect() {
        if (this.connection == null) {
            const schema = new Schema({
                praiser: SchemaTypes.String,
                praisee: SchemaTypes.String,
                reason: SchemaTypes.String,
                date: SchemaTypes.Date,
            });

            schema.index({ praisee: 1 }, { unique: false });

            this.connection = mongoose.createConnection('mongodb://mongodb:27017/scrbot', {
                useNewUrlParser: true,
            });
            this.model = this.connection.model('SCRBotStore', schema, 'praises');
        }
    }

    public static database() {
        return this.globalRepo;
    }

    public mongo() {
        return this.model;
    }
}
