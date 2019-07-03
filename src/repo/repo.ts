import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
const SchemaTypes = mongoose.SchemaTypes;

// mongoose future-proofing
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

export default class Repo {
    private static globalRepo: Repo = new Repo();
    private connection: mongoose.Connection = null;
    private model: mongoose.Model<mongoose.Document> = null;

    public async connect() {
        if (this.connection == null) {
            const schema = new Schema({
                praiser: SchemaTypes.String,
                praisee: SchemaTypes.String,
                reason: SchemaTypes.String,
                date: SchemaTypes.Date,
            });

            schema.index({ praisee: 1 }, { unique: false });

            this.connection = mongoose.createConnection('mongodb://localhost:27017/scrbot', {
                useNewUrlParser: true,
            });
            this.model = this.connection.model('SCRBotStore', schema, 'praises');
            this.model.on('index', (err: any) => {
                if (err) {
                    console.log(
                        `WARNING: MONGO INDEX FAILED! A MIGRATION IS NEEDED. ERROR: ${err}`
                    );
                }
            });

        }
    }

    public static database() {
        return this.globalRepo;
    }

    public mongo() {
        return this.model;
    }
}
